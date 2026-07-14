import Link from "next/link";
import { getSiteConteudo } from "@/lib/siteContent";
import ConteudoForm from "@/components/ConteudoForm";

export const dynamic = "force-dynamic";

export default async function ConteudoPage() {
  const conteudo = await getSiteConteudo();

  return (
    <section className="mx-auto max-w-3xl px-6 py-12">
      <Link href="/admin" className="text-sm text-ink/60 hover:text-brick-500 mb-4 inline-block">
        ← Voltar pra lista
      </Link>
      <h1 className="font-display text-2xl font-700 mb-1">Conteúdo do site</h1>
      <p className="text-sm text-ink/60 mb-8">
        Edite os textos que aparecem na Home e na página de Hotéis — sem
        precisar mexer em código.
      </p>
      <ConteudoForm conteudo={conteudo} />
    </section>
  );
}
