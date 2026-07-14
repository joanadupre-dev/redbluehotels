import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

// Extracao gratuita de informacoes do hotel a partir da URL do site dele.
// Estrategia (nenhuma IA envolvida, so leitura de HTML):
// 1. Dados estruturados JSON-LD (schema.org Hotel/LodgingBusiness), quando o
//    site tiver — e o sinal mais confiavel, muitos sites de hotel/OTA usam
//    isso para aparecer melhor no Google.
// 2. Meta tags Open Graph (og:title, og:description, og:image), usadas por
//    quase todo site para preview em redes sociais.
// 3. <title> e <meta name="description"> como ultimo recurso.
// O resultado e sempre uma sugestao — a pessoa confere e ajusta antes de salvar.
export async function POST(request) {
  const { url } = await request.json();

  if (!url || !/^https?:\/\//i.test(url)) {
    return NextResponse.json(
      { error: "Cole uma URL válida, começando com http:// ou https://" },
      { status: 400 }
    );
  }

  let html;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; RedBlueHotelsBot/1.0)" },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) throw new Error("status " + res.status);
    html = await res.text();
  } catch {
    return NextResponse.json(
      { error: "Não consegui acessar essa URL. Confira o link e tente novamente." },
      { status: 400 }
    );
  }

  const $ = cheerio.load(html);
  const resultado = {
    nome: "",
    descricao: "",
    endereco: "",
    cidade: "",
    estado: "",
    imagens: [],
    comodidades: [],
  };

  function resolverUrlImagem(src) {
    try {
      return new URL(src, url).href;
    } catch {
      return null;
    }
  }

  // 1. JSON-LD
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const data = JSON.parse($(el).contents().text());
      const itens = Array.isArray(data) ? data : [data];
      for (const item of itens) {
        const tipo = String(item?.["@type"] || "").toLowerCase();
        if (!tipo.includes("hotel") && !tipo.includes("lodging") && !tipo.includes("resort")) continue;

        if (item.name && !resultado.nome) resultado.nome = item.name;
        if (item.description && !resultado.descricao) resultado.descricao = item.description;

        if (item.address && typeof item.address === "object") {
          resultado.endereco = resultado.endereco || item.address.streetAddress || "";
          resultado.cidade = resultado.cidade || item.address.addressLocality || "";
          resultado.estado = resultado.estado || item.address.addressRegion || "";
        }

        if (item.image) {
          const imgs = Array.isArray(item.image) ? item.image : [item.image];
          for (const img of imgs) {
            const src = typeof img === "string" ? img : img?.url;
            const resolved = src && resolverUrlImagem(src);
            if (resolved) resultado.imagens.push(resolved);
          }
        }

        if (item.amenityFeature) {
          const lista = Array.isArray(item.amenityFeature) ? item.amenityFeature : [item.amenityFeature];
          for (const a of lista) {
            if (a?.name) resultado.comodidades.push(a.name);
          }
        }
      }
    } catch {
      // JSON-LD mal formado, ignora e segue pro fallback
    }
  });

  // 2. Open Graph (fallback)
  if (!resultado.nome) {
    resultado.nome = $('meta[property="og:title"]').attr("content") || $("title").first().text().trim() || "";
  }
  if (!resultado.descricao) {
    resultado.descricao =
      $('meta[property="og:description"]').attr("content") ||
      $('meta[name="description"]').attr("content") ||
      "";
  }
  if (resultado.imagens.length === 0) {
    const ogImage = $('meta[property="og:image"]').attr("content");
    const resolved = ogImage && resolverUrlImagem(ogImage);
    if (resolved) resultado.imagens.push(resolved);
  }

  // Limpeza basica
  resultado.nome = resultado.nome.slice(0, 120).trim();
  resultado.descricao = resultado.descricao.slice(0, 1000).trim();
  resultado.comodidades = [...new Set(resultado.comodidades)].slice(0, 15);
  resultado.imagens = [...new Set(resultado.imagens)].slice(0, 5);

  return NextResponse.json(resultado);
}
