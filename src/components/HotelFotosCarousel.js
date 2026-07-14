"use client";

import { useState, useRef, useCallback } from "react";

export default function HotelFotosCarousel({ fotos, nome }) {
  const [atual, setAtual] = useState(0);
  const drag = useRef({ x: 0, ativo: false });

  const ir = useCallback(
    (i) => setAtual(((i % fotos.length) + fotos.length) % fotos.length),
    [fotos.length]
  );

  function onDown(e) {
    if (e.target.closest("button")) return;
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

  if (fotos.length === 0) return null;

  return (
    <div className="mb-10">
      <div
        className="relative h-[380px] sm:h-[460px] rounded-2xl overflow-hidden bg-navy-950 select-none cursor-grab active:cursor-grabbing touch-pan-y"
        onPointerDown={onDown}
        onPointerUp={onUp}
        onPointerLeave={() => (drag.current.ativo = false)}
      >
        {fotos.map((foto, i) => (
          <img
            key={i}
            src={foto}
            alt={`${nome} - foto ${i + 1}`}
            draggable={false}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
            style={{ opacity: i === atual ? 1 : 0 }}
          />
        ))}

        {fotos.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => ir(atual - 1)}
              aria-label="Foto anterior"
              className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/85 hover:bg-white flex items-center justify-center text-navy-900 transition-colors"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => ir(atual + 1)}
              aria-label="Próxima foto"
              className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/85 hover:bg-white flex items-center justify-center text-navy-900 transition-colors"
            >
              →
            </button>
            <span className="absolute bottom-3 right-3 bg-navy-950/70 text-white text-xs font-medium px-2.5 py-1 rounded-full">
              {atual + 1} / {fotos.length}
            </span>
          </>
        )}
      </div>

      {fotos.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {fotos.map((foto, i) => (
            <button
              key={i}
              type="button"
              onClick={() => ir(i)}
              className={`shrink-0 h-16 w-24 rounded-lg overflow-hidden border-2 transition-colors ${
                i === atual ? "border-brick-500" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <img src={foto} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
