import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSiteConteudo, getBannerSlides } from "@/lib/siteContent";
import BannerHero from "@/components/BannerHero";
import HotelCarousel from "@/components/HotelCarousel";
import ComoFuncionaCarousel from "@/components/ComoFuncionaCarousel";
import OrcamentoForm from "@/components/OrcamentoForm";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [destaquesRaw, conteudo, bannerSlides, todosHoteis] = await Promise.all([
    prisma.hotel.findMany({
      where: { publicado: true, destaque: true },
      orderBy: { criadoEm: "desc" },
      take: 6,
    }),
    getSiteConteudo(),
    getBannerSlides("home"),
    prisma.hotel.findMany({
      where: { publicado: true },
      select: { nome: true, slug: true },
      orderBy: { nome: "asc" },
    }),
  ]);

  const hoteis = destaquesRaw.map((h) => ({
    ...h,
    comodidades: JSON.parse(h.comodidades || "[]"),
    imagens: JSON.parse(h.imagens || "[]"),
  }));

  return (
    <>
      <BannerHero slides={bannerSlides} />

      {/* Hotéis em destaque (fundo branco) */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          <p className="font-display text-lg font-500 max-w-xl mb-4 [text-wrap:balance]">
            {conteudo.destaquesFrase}
          </p>
          <div className="flex items-center gap-2.5 flex-wrap mb-8">
            <span className="text-xs uppercase tracking-wide text-ink/50 font-semibold mr-1">
              Cobertura
            </span>
            {conteudo.cobertura.map((c) => (
              <span
                key={c}
                className="text-sm font-medium px-3.5 py-1.5 rounded-full bg-sand border border-navy-900/10"
              >
                {c}
              </span>
            ))}
          </div>
          {hoteis.length > 0 && <HotelCarousel hoteis={hoteis} />}
          <div className="mt-8">
            <Link
              href="/hoteis"
              className="inline-block rounded-full border border-navy-900/20 px-6 py-2.5 text-sm font-medium hover:border-brick-500 hover:text-brick-500 transition-colors"
            >
              Ver todos os hotéis
            </Link>
          </div>
        </div>
      </section>

      {/* Como funciona (fundo gradiente) */}
      <section className="py-16 bg-gradient-to-br from-navy-900 to-navy-950">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="font-display text-2xl font-600 mb-10 text-white">Como funciona</h2>
          <ComoFuncionaCarousel passos={conteudo.comoFunciona} escuro />
        </div>
      </section>

      {/* Formulário (fundo gradiente) */}
      <section
        id="orcamento"
        className="py-16 scroll-mt-24 bg-gradient-to-br from-navy-950 to-[#0f2447]"
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid sm:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="font-display text-2xl font-600 mb-3 text-white">
                {conteudo.orcamentoTitulo}
              </h2>
              <p className="text-white/80 mb-2">{conteudo.orcamentoTexto}</p>
              <p className="text-sm text-white/80">
                <strong>{conteudo.telefone}</strong> ·{" "}
                <a href={`mailto:${conteudo.email}`} className="underline hover:text-brick-400">
                  {conteudo.email}
                </a>
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6">
              <OrcamentoForm hoteis={todosHoteis} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
