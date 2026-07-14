"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const [aberto, setAberto] = useState(false);

  return (
    <header className="border-b border-navy-900/10 bg-sand/95 backdrop-blur sticky top-0 z-40">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <Link href="/" aria-label="RedBlue Hotels - página inicial" onClick={() => setAberto(false)}>
          <Image
            src="/logo-full.png"
            alt="RedBlue Hotels"
            width={600}
            height={163}
            priority
            className="h-11 w-auto"
          />
        </Link>

        <nav className="hidden sm:flex items-center gap-8 text-sm font-medium">
          <Link href="/hoteis" className="hover:text-brick-500 transition-colors">
            Hotéis
          </Link>
          <Link href="/sobre" className="hover:text-brick-500 transition-colors">
            Sobre nós
          </Link>
          <Link
            href="/#orcamento"
            className="rounded-full bg-navy-900 text-sand px-5 py-2 hover:bg-brick-500 transition-colors"
          >
            Tarifa corporativa
          </Link>
        </nav>

        {/* Botão hamburguer, só aparece no celular */}
        <button
          type="button"
          onClick={() => setAberto(!aberto)}
          aria-label={aberto ? "Fechar menu" : "Abrir menu"}
          className="sm:hidden flex flex-col justify-center items-center gap-1.5 h-10 w-10"
        >
          <span className={`block h-0.5 w-6 bg-navy-900 transition-all ${aberto ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block h-0.5 w-6 bg-navy-900 transition-all ${aberto ? "opacity-0" : ""}`} />
          <span className={`block h-0.5 w-6 bg-navy-900 transition-all ${aberto ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Menu mobile, abre/fecha ao clicar no hamburguer */}
      {aberto && (
        <nav className="sm:hidden border-t border-navy-900/10 bg-sand px-6 py-5 flex flex-col gap-4 text-sm font-medium">
          <Link href="/hoteis" onClick={() => setAberto(false)} className="hover:text-brick-500 transition-colors">
            Hotéis
          </Link>
          <Link href="/sobre" onClick={() => setAberto(false)} className="hover:text-brick-500 transition-colors">
            Sobre nós
          </Link>
          <Link
            href="/#orcamento"
            onClick={() => setAberto(false)}
            className="rounded-full bg-navy-900 text-sand px-5 py-2.5 text-center hover:bg-brick-500 transition-colors"
          >
            Tarifa corporativa
          </Link>
        </nav>
      )}
    </header>
  );
}
