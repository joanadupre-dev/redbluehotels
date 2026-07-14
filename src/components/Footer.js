import { getSiteConteudo } from "@/lib/siteContent";

export default async function Footer() {
  const conteudo = await getSiteConteudo();

  return (
    <footer className="border-t border-navy-900/10 bg-navy-950 text-sand/70">
      <div className="mx-auto max-w-6xl px-6 py-12 flex flex-col sm:flex-row justify-between gap-6 text-sm">
        <div>
          <p className="font-display text-lg text-sand mb-1">RedBlue Hotels</p>
          <p>{conteudo.footerTagline}</p>
        </div>
        <div className="flex gap-8">
          <a href="/hoteis" className="hover:text-sand transition-colors">Hotéis</a>
          <a href="/sobre" className="hover:text-sand transition-colors">Sobre nós</a>
          <a href="/#orcamento" className="hover:text-sand transition-colors">Tarifa corporativa</a>
        </div>
        <div>
          <p>{conteudo.telefone}</p>
          <p>{conteudo.email}</p>
        </div>
        <p>&copy; {new Date().getFullYear()} RedBlue Hotels. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
