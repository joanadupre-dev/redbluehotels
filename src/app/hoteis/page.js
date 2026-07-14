import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSiteConteudo } from "@/lib/siteContent";
import HotelCard from "@/components/HotelCard";
import InstalacoesGerais from "@/components/InstalacoesGerais";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Hotéis parceiros",
  description:
    "Hotéis parceiros da RedBlue Hotels em Barra da Tijuca, Copacabana, Centro, Macaé, Porto do Açu e Vitória, com tarifa corporativa para empresas.",
};

export default async function HoteisPage({ searchParams }) {
  const cidade = searchParams?.cidade || "";
  const estrelas = searchParams?.estrelas || "";
  const categoria = searchParams?.categoria || "";

  const [hoteisRaw, conteudo] = await Promise.all([
    prisma.hotel.findMany({
      where: {
        publicado: true,
        ...(cidade ? { cidade: { contains: cidade } } : {}),
        ...(estrelas ? { estrelas: Number(estrelas) } : {}),
        ...(categoria ? { categoria } : {}),
      },
      orderBy: [{ destaque: "desc" }, { criadoEm: "desc" }],
    }),
    getSiteConteudo(),
  ]);

  const hoteis = hoteisRaw.map((h) => ({
    ...h,
    comodidades: JSON.parse(h.comodidades || "[]"),
    imagens: JSON.parse(h.imagens || "[]"),
  }));

  return (
    <>
      {/* Banner de topo (foto e frase controladas no painel > Conteúdo do site) */}
      <section className="relative h-[300px] overflow-hidden bg-navy-950">
        {conteudo.hoteisBannerFoto ? (
          <img src={conteudo.hoteisBannerFoto} alt="" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-navy-800 to-navy-950" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/50 via-navy-950/35 to-navy-950/70" />
        <div className="relative z-10 h-full flex items-center justify-center text-center px-6">
          <h1 className="font-display text-3xl sm:text-4xl font-700 text-white max-w-3xl [text-shadow:0_2px_20px_rgba(0,0,0,.25)] [text-wrap:balance]">
            {conteudo.hoteisBannerFrase}
          </h1>
        </div>
      </section>

      {/* Intro + grid (fundo branco) */}
      <section className="bg-white py-14">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-[15.5px] leading-[1.75] text-ink/75 max-w-3xl mb-5">
            {conteudo.hoteisIntro}
          </p>
          <Link
            href="#orcamento-hoteis"
            className="inline-block text-sm font-medium text-brick-500 hover:underline mb-8"
          >
            Já sabe o que precisa? Solicite uma tarifa corporativa ↓
          </Link>

          <form className="flex flex-wrap gap-4 mb-10" method="get">
            <select
              name="cidade"
              defaultValue={cidade}
              className="rounded-full border border-navy-900/20 px-4 py-2 text-sm bg-white"
            >
              <option value="">Todas as cidades</option>
              <option value="RJ/">Rio de Janeiro</option>
              <option value="São João da Barra">São João da Barra</option>
              <option value="Macaé">Macaé</option>
              <option value="Vitória">Vitória</option>
            </select>
            <select
              name="categoria"
              defaultValue={categoria}
              className="rounded-full border border-navy-900/20 px-4 py-2 text-sm bg-white"
            >
              <option value="">Todas as categorias</option>
              <option value="Praia">Praia</option>
              <option value="Serra">Serra</option>
              <option value="Cidade">Cidade</option>
              <option value="Campo">Campo</option>
            </select>
            <select
              name="estrelas"
              defaultValue={estrelas}
              className="rounded-full border border-navy-900/20 px-4 py-2 text-sm bg-white"
            >
              <option value="">Todas as estrelas</option>
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>{"★".repeat(n)}</option>
              ))}
            </select>
            <button
              type="submit"
              className="rounded-full bg-navy-900 text-sand px-6 py-2 text-sm font-medium hover:bg-brick-500 transition-colors"
            >
              Filtrar
            </button>
          </form>

          {hoteis.length === 0 ? (
            <p className="text-ink/60">
              Nenhum hotel encontrado com esses filtros. Tente ajustar a busca.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {hoteis.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Instalações (fundo gradiente) */}
      <section className="py-16 bg-gradient-to-br from-navy-900 to-navy-950">
        <div className="mx-auto max-w-6xl px-6">
          <InstalacoesGerais
            titulo={conteudo.instalacoesTitulo}
            texto={conteudo.instalacoesTexto}
            itens={conteudo.instalacoes}
            escuro
          />
        </div>
      </section>

      {/* CTA final (fundo gradiente) */}
      <section
        id="orcamento-hoteis"
        className="py-16 scroll-mt-24 text-center bg-gradient-to-br from-navy-950 to-[#0f2447]"
      >
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="font-display text-xl font-600 mb-3 text-white">{conteudo.hoteisCtaTitulo}</h2>
          <p className="text-white/80 max-w-lg mx-auto mb-6">
            {conteudo.hoteisCtaTexto}
          </p>
          <Link
            href="/#orcamento"
            className="inline-block rounded-full bg-white text-navy-900 px-7 py-3 font-medium hover:bg-brick-500 hover:text-white transition-colors"
          >
            Solicitar tarifa corporativa
          </Link>
        </div>
      </section>
    </>
  );
}
