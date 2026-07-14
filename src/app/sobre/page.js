import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSiteConteudo, getBannerSlides } from "@/lib/siteContent";
import Contadores from "@/components/Contadores";
import PublicoCarousel from "@/components/PublicoCarousel";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Sobre nós",
  description:
    "A RedBlue Hotels é especializada em hospedagem corporativa, eventos e público offshore, representando hotéis de primeira linha em todo o país.",
};

export default async function SobrePage() {
  const [hoteisRaw, publicoSlides, conteudo] = await Promise.all([
    prisma.hotel.findMany({
      where: { publicado: true },
      orderBy: { criadoEm: "desc" },
    }),
    getBannerSlides("sobre"),
    getSiteConteudo(),
  ]);

  return (
    <>
      {/* Hero (gradiente) */}
      <section className="py-20 bg-gradient-to-br from-navy-900 to-navy-950">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-white/85 font-medium text-xs uppercase tracking-wide mb-3.5">
            {conteudo.sobreHeroEyebrow}
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-700 text-white max-w-3xl leading-tight [text-wrap:balance]">
            {conteudo.sobreHeroTitulo}
          </h1>
        </div>
      </section>

      {/* Quem somos + contadores (fundo branco) */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="font-display text-2xl font-600 mb-5">{conteudo.sobreQuemSomosTitulo}</h2>
          <p className="text-[15.5px] leading-[1.75] text-ink/75 max-w-3xl">
            {conteudo.sobreQuemSomosTexto}
          </p>
          <Contadores itens={conteudo.sobreContadores} />
        </div>
      </section>

      {/* Carrossel banner: Para empresas / Off-Shore / Eventos */}
      <PublicoCarousel slides={publicoSlides} />

      {/* Pilares (fundo branco) */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="font-display text-2xl font-600 mb-8">{conteudo.sobrePilaresTitulo}</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {conteudo.sobrePilares.map((p, i) => (
              <div key={i} className="pl-4 border-l-[3px] border-brick-500">
                <h3 className="font-medium mb-1.5">{p.titulo}</h3>
                <p className="text-sm text-ink/65">{p.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lista de hotéis (gradiente) */}
      <section className="py-16 bg-gradient-to-br from-navy-900 to-navy-950">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="font-display text-2xl font-600 mb-7 text-white">
            {conteudo.sobreListaTitulo}
          </h2>
          <div className="sm:columns-2 gap-8">
            {hoteisRaw.map((h) => (
              <div
                key={h.id}
                className="text-sm text-white py-2.5 border-b border-white/20 break-inside-avoid"
              >
                {h.nome} — {h.cidade}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA (gradiente) */}
      <section className="py-16 text-center bg-gradient-to-br from-navy-950 to-[#0f2447]">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="font-display text-xl font-600 mb-3 text-white">
            {conteudo.sobreCtaTitulo}
          </h2>
          <p className="text-white/80 max-w-lg mx-auto mb-6">{conteudo.sobreCtaTexto}</p>
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
