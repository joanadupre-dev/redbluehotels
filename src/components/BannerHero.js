"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

// Recebe "slides" prontos: [{ foto, legenda, frase }, ...] montados pela
// Simone no painel (Conteúdo do site > Banner da home). Sem slides ainda
// cadastrados, mostra um fundo em degrade no lugar da foto.
export default function BannerHero({ slides }) {
  const lista = slides.length > 0 ? slides : [{ foto: "", legenda: "", frase: "" }];
  const [atual, setAtual] = useState(0);
  const drag = useRef({ x: 0, ativo: false });

  const ir = useCallback(
    (i) => setAtual(((i % lista.length) + lista.length) % lista.length),
    [lista.length]
  );

  useEffect(() => {
    if (lista.length <= 1) return;
    const t = setInterval(() => ir(atual + 1), 5000);
    return () => clearInterval(t);
  }, [atual, ir, lista.length]);

  function onDown(e) {
    if (e.target.closest("button, a")) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, ativo: true };
  }
  function onUp(e) {
    if (!drag.current.ativo) return;
    drag.current.ativo = false;
    const dx = e.clientX - drag.current.x;
    if (dx > 50) ir(atual - 1);
    else if (dx < -50) ir(atual + 1);
  }

  const slide = lista[atual];

  return (
    <section
      className="relative w-full h-[560px] sm:h-[620px] overflow-hidden bg-navy-950 select-none cursor-grab active:cursor-grabbing touch-pan-y"
      onPointerDown={onDown}
      onPointerUp={onUp}
      onPointerLeave={() => (drag.current.ativo = false)}
    >
      {lista.map((s, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-1000 pointer-events-none"
          style={{ opacity: i === atual ? 1 : 0 }}
        >
          {s.foto ? (
            <Image
              src={s.foto}
              alt={s.legenda || ""}
              fill
              priority={i === 0}
              draggable={false}
              className="object-cover"
              sizes="100vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-navy-800 to-navy-950" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-navy-950/55 via-navy-950/35 to-navy-950/75" />
        </div>
      ))}

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 text-white pointer-events-none">
        <h1 className="text-[26px] sm:text-4xl font-600 font-display leading-[1.25] max-w-5xl mb-8 [text-shadow:0_2px_20px_rgba(0,0,0,.25)] [text-wrap:balance]">
          {slide.frase}
        </h1>
        <div className="flex gap-3.5 flex-wrap justify-center pointer-events-auto">
          <Link
            href="/hoteis"
            className="bg-white text-navy-900 px-7 py-3.5 rounded-full font-600 text-[15px] hover:bg-brick-500 hover:text-white transition-colors"
          >
            Ver hotéis parceiros
          </Link>
          <Link
            href="/#orcamento"
            className="border border-white/70 text-white px-7 py-3.5 rounded-full font-600 text-[15px] hover:bg-white/15 hover:border-white transition-colors"
          >
            Solicitar tarifa corporativa
          </Link>
        </div>
      </div>

      {slide.legenda && (
        <div className="absolute left-7 top-7 z-20 flex items-center gap-2 text-xs text-white/85 italic bg-navy-950/35 backdrop-blur px-3.5 py-1.5 rounded-full pointer-events-none">
          <span className="not-italic opacity-90">📍</span>
          <span>{slide.legenda}</span>
        </div>
      )}

      {lista.length > 1 && (
        <>
          <button
            onClick={() => ir(atual - 1)}
            aria-label="Anterior"
            className="hidden sm:flex absolute left-7 top-1/2 -translate-y-1/2 z-20 h-11 w-11 rounded-full bg-white/15 backdrop-blur border border-white/30 text-white items-center justify-center hover:bg-white/30 transition-colors"
          >
            ←
          </button>
          <button
            onClick={() => ir(atual + 1)}
            aria-label="Próximo"
            className="hidden sm:flex absolute right-7 top-1/2 -translate-y-1/2 z-20 h-11 w-11 rounded-full bg-white/15 backdrop-blur border border-white/30 text-white items-center justify-center hover:bg-white/30 transition-colors"
          >
            →
          </button>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-1">
            {lista.map((_, i) => (
              <button
                key={i}
                onClick={() => ir(i)}
                aria-label={`Ir para o slide ${i + 1}`}
                className="p-2.5 -m-1 flex items-center justify-center"
              >
                <span className={`block h-2 rounded-full transition-all ${i === atual ? "w-7 bg-white" : "w-2 bg-white/40"}`} />
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
