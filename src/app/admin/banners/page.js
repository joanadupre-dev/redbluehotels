import Link from "next/link";
import { getBannerSlides } from "@/lib/siteContent";
import BannerSlidesForm from "@/components/BannerSlidesForm";

export const dynamic = "force-dynamic";

export default async function BannersAdminPage() {
  const [slidesHome, slidesSobre] = await Promise.all([
    getBannerSlides("home"),
    getBannerSlides("sobre"),
  ]);

  return (
    <section className="mx-auto max-w-3xl px-6 py-12">
      <Link href="/admin" className="text-sm text-ink/60 hover:text-brick-500 mb-4 inline-block">
        ← Voltar pra lista
      </Link>
      <h1 className="font-display text-2xl font-700 mb-1">Banners do site</h1>
      <p className="text-sm text-ink/60 mb-8">
        Monte cada slide na mão — escolha a foto e escreva o texto. Não
        precisa ter nenhum hotel cadastrado, é livre.
      </p>

      <div className="space-y-12">
        <div>
          <h2 className="font-display text-xl font-600 mb-1">Banner da Home</h2>
          <p className="text-xs text-ink/50 mb-4">
            O carrossel grande do topo da página inicial. Cada slide tem uma
            foto, uma frase grande e uma legenda pequena no canto (ex: "Golden
            Towers Hotel, Macaé").
          </p>
          <BannerSlidesForm local="home" slidesIniciais={slidesHome} />
        </div>

        <div className="pt-8 border-t border-navy-900/10">
          <h2 className="font-display text-xl font-600 mb-1">Banner do Sobre nós</h2>
          <p className="text-xs text-ink/50 mb-4">
            O carrossel "Para empresas / Off-Shore / Eventos" na página Sobre
            nós. Cada slide tem uma foto, um selo (ex: "Off-Shore"), um título
            e um parágrafo curto.
          </p>
          <BannerSlidesForm local="sobre" slidesIniciais={slidesSobre} />
        </div>
      </div>
    </section>
  );
}
