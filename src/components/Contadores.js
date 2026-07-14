"use client";

import { useState, useEffect, useRef } from "react";

function Contador({ alvo, prefixo }) {
  const [valor, setValor] = useState(0);
  const ref = useRef(null);
  const jaAnimou = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !jaAnimou.current) {
          jaAnimou.current = true;
          const duracao = 1600;
          const passo = 25;
          const incremento = alvo / (duracao / passo);
          let atual = 0;
          const timer = setInterval(() => {
            atual += incremento;
            if (atual >= alvo) {
              setValor(alvo);
              clearInterval(timer);
            } else {
              setValor(Math.floor(atual));
            }
          }, passo);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [alvo]);

  return (
    <span ref={ref}>
      {prefixo}
      {valor.toLocaleString("pt-BR")}
    </span>
  );
}

export default function Contadores({ itens }) {
  return (
    <div className="grid sm:grid-cols-3 gap-5 mt-11">
      {itens.map((item, i) => (
        <div
          key={i}
          className="rounded-2xl p-8 text-center bg-gradient-to-br from-navy-900 to-navy-950"
        >
          <div className="font-display text-4xl font-700 text-white inline-block pb-2 border-b-[3px] border-brick-500 mb-3">
            <Contador alvo={item.numero} prefixo="+" />
          </div>
          <div className="text-sm font-bold text-white mb-1">{item.titulo}</div>
          <div className="text-xs text-white/65">{item.sub}</div>
        </div>
      ))}
    </div>
  );
}
