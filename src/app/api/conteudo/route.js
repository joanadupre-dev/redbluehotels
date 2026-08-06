import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSiteConteudo } from "@/lib/siteContent";

// Forca essa rota a ser sempre dinamica. Sem isso, como o GET nao le nada
// da propria requisicao (nem searchParams, nem cookies), o Next.js
// otimiza a rota inteira como estatica no build — e uma rota estatica
// nao aceita PUT de verdade, o que fazia a Vercel nem criar uma funcao
// pra ela (por isso o 503 e o sumico na lista de Functions).
export const dynamic = "force-dynamic";

export async function GET() {
  const conteudo = await getSiteConteudo();
  return NextResponse.json(conteudo);
}

// PUT protegido pelo middleware (mesma regra do /api/hotels)
export async function PUT(request) {
  try {
    const body = await request.json();
    const {
      heroEyebrow,
      heroTitulo,
      heroTexto,
      destaquesFrase,
      cobertura,
      comoFunciona,
      orcamentoTitulo,
      orcamentoTexto,
      hoteisIntro,
      hoteisBannerFoto,
      hoteisBannerFrase,
      instalacoesTitulo,
      instalacoesTexto,
      instalacoes,
      hoteisCtaTitulo,
      hoteisCtaTexto,
      sobreHeroEyebrow,
      sobreHeroTitulo,
      sobreQuemSomosTitulo,
      sobreQuemSomosTexto,
      sobreContadores,
      sobrePilaresTitulo,
      sobrePilares,
      sobreListaTitulo,
      sobreCtaTitulo,
      sobreCtaTexto,
      telefone,
      email,
      footerTagline,
    } = body;

    const obrigatorios = {
      heroEyebrow,
      heroTitulo,
      heroTexto,
      orcamentoTitulo,
      orcamentoTexto,
      hoteisIntro,
      telefone,
      email,
      footerTagline,
    };
    const faltando = Object.entries(obrigatorios)
      .filter(([, v]) => v === undefined || v === null || v === "")
      .map(([k]) => k);
    if (faltando.length > 0) {
      return NextResponse.json(
        { error: `Campos obrigatórios vazios: ${faltando.join(", ")}` },
        { status: 400 }
      );
    }

    const dados = {
      heroEyebrow,
      heroTitulo,
      heroTexto,
      destaquesFrase: destaquesFrase || "",
      cobertura: JSON.stringify(cobertura || []),
      comoFunciona: JSON.stringify(comoFunciona || []),
      orcamentoTitulo,
      orcamentoTexto,
      hoteisIntro,
      hoteisBannerFoto: hoteisBannerFoto || "",
      hoteisBannerFrase: hoteisBannerFrase || "",
      instalacoesTitulo: instalacoesTitulo || "",
      instalacoesTexto: instalacoesTexto || "",
      instalacoes: JSON.stringify(instalacoes || []),
      hoteisCtaTitulo: hoteisCtaTitulo || "",
      hoteisCtaTexto: hoteisCtaTexto || "",
      sobreHeroEyebrow: sobreHeroEyebrow || "",
      sobreHeroTitulo: sobreHeroTitulo || "",
      sobreQuemSomosTitulo: sobreQuemSomosTitulo || "",
      sobreQuemSomosTexto: sobreQuemSomosTexto || "",
      sobreContadores: JSON.stringify(sobreContadores || []),
      sobrePilaresTitulo: sobrePilaresTitulo || "",
      sobrePilares: JSON.stringify(sobrePilares || []),
      sobreListaTitulo: sobreListaTitulo || "",
      sobreCtaTitulo: sobreCtaTitulo || "",
      sobreCtaTexto: sobreCtaTexto || "",
      telefone,
      email,
      footerTagline,
    };

    const conteudo = await prisma.siteConteudo.upsert({
      where: { id: 1 },
      update: dados,
      create: { id: 1, ...dados },
    });

    return NextResponse.json(conteudo);
  } catch (erro) {
    console.error("Erro ao salvar /api/conteudo:", erro);
    return NextResponse.json(
      { error: "Não foi possível salvar.", detalhe: String(erro?.message || erro) },
      { status: 500 }
    );
  }
}
