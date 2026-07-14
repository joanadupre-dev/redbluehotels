"use client";

import { useRef, useState, useEffect, useCallback } from "react";

export default function ComoFuncionaCarousel({ passos, escuro = false }) {
  const trackRef = useRef(null);
  const [ativo, setAtivo] = useState(0);
  const [podeVoltar, setPodeVoltar] = useState(false);
  const [podeAvancar, setPodeAvancar] = useState(true);

  function scroll(direction) {
    const track = trackRef.current;
    if (!track) return;
    const cardWidth = track.firstChild?.offsetWidth || 300;
    track.scrollBy({ left: direction * (cardWidth + 20), behavior: "smooth" });
  }

  // Rola so o carrossel horizontalmente (nunca a pagina inteira) ate o card alvo
  const irPara = useCallback((i) => {
    const track = trackRef.current;
    if (!track) return;
    const alvo = ((i % passos.length) + passos.length) % passos.length;
    const card = track.children[alvo];
    if (card) {
      track.scrollTo({ left: card.offsetLeft, behavior: "smooth" });
    }
  }, [passos.length]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    function onScroll() {
      let closest = 0;
      let min = Infinity;
      Array.from(track.children).forEach((child, i) => {
        const diff = Math.abs(child.offsetLeft - track.scrollLeft);
        if (diff < min) {
          min = diff;
          closest = i;
        }
      });
      setAtivo(closest);
      setPodeVoltar(track.scrollLeft > 4);
      setPodeAvancar(track.scrollLeft < track.scrollWidth - track.clientWidth - 4);
    }
    onScroll();
    track.addEventListener("scroll", onScroll);
    return () => track.removeEventListener("scroll", onScroll);
  }, [passos.length]);

  // Rolagem automatica, igual aos outros carrosseis do site
  useEffect(() => {
    if (passos.length <= 1) return;
    const t = setInterval(() => irPara(ativo + 1), 4500);
    return () => clearInterval(t);
  }, [ativo, irPara, passos.length]);

  return (
    <div className="relative">
      {/* Degrade nas bordas, so aparece quando ha mais conteudo pra aquele lado */}
      <div
        className={`pointer-events-none absolute left-0 top-0 bottom-0 w-10 z-10 bg-gradient-to-r transition-opacity duration-300 ${
          escuro ? "from-navy-900" : "from-white"
        } to-transparent ${podeVoltar ? "opacity-100" : "opacity-0"}`}
      />
      <div
        className={`pointer-events-none absolute right-0 top-0 bottom-0 w-10 z-10 bg-gradient-to-l transition-opacity duration-300 ${
          escuro ? "from-navy-950" : "from-white"
        } to-transparent ${podeAvancar ? "opacity-100" : "opacity-0"}`}
      />
      <div
        ref={trackRef}
        className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {passos.map((passo, i) => (
          <div
            key={i}
            className="snap-start shrink-0 w-[85%] sm:w-[420px] bg-white rounded-2xl p-8"
          >
            <div className="font-display text-4xl text-brick-500 font-600 mb-3.5">
              {String(i + 1).padStart(2, "0")}
            </div>
            <h3 className="font-medium mb-2 text-base">{passo.titulo}</h3>
            <p className="text-sm text-ink/65">{passo.texto}</p>
          </div>
        ))}
      </div>

      {passos.length > 1 && (
        <div className="flex gap-2 justify-end mt-4">
          <button
            type="button"
            onClick={() => scroll(-1)}
            aria-label="Anterior"
            className={`h-9 w-9 rounded-full border flex items-center justify-center hover:border-brick-500 hover:text-brick-500 transition-colors ${escuro ? "border-white/35 text-white" : "border-navy-900/20"}`}
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label="Próximo"
            className={`h-9 w-9 rounded-full border flex items-center justify-center hover:border-brick-500 hover:text-brick-500 transition-colors ${escuro ? "border-white/35 text-white" : "border-navy-900/20"}`}
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
