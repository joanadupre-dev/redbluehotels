"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export default function PublicoCarousel({ slides }) {
  const lista = slides.length > 0 ? slides : [{ foto: "", tag: "", titulo: "", texto: "" }];
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

  return (
    <section
      className="relative h-[440px] overflow-hidden bg-navy-950 select-none cursor-grab active:cursor-grabbing touch-pan-y"
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
            <img src={s.foto} alt="" className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-navy-800 to-navy-950" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-navy-950/45 to-navy-950/80" />
        </div>
      ))}

      <div className="relative z-10 h-full flex flex-col items-start justify-end max-w-3xl px-[8%] pb-14 text-white pointer-events-none">
        <span className="inline-block text-[11.5px] font-bold uppercase tracking-wide text-white bg-brick-500 px-3 py-1 rounded-full mb-3.5">
          {lista[atual].tag}
        </span>
        <h2 className="font-display text-2xl sm:text-[26px] font-600 text-white mb-3">
          {lista[atual].titulo}
        </h2>
        <p className="text-[15px] text-white/88 max-w-xl">{lista[atual].texto}</p>
      </div>

      {lista.length > 1 && (
        <div className="absolute bottom-6 right-[8%] z-20 flex gap-1">
          {lista.map((_, i) => (
            <button
              key={i}
              onClick={() => ir(i)}
              aria-label={`Slide ${i + 1}`}
              className="p-2.5 -m-1 flex items-center justify-center"
            >
              <span className={`block h-2 rounded-full transition-all ${i === atual ? "w-7 bg-white" : "w-2 bg-white/40"}`} />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
