export default function InstalacoesGerais({ titulo, texto, itens, escuro = false }) {
  return (
    <section className={escuro ? "" : "mt-20 pt-16 border-t border-navy-900/10"}>
      <h2 className={`font-display text-2xl font-600 mb-3 ${escuro ? "text-white" : ""}`}>
        {titulo}
      </h2>
      <p className={`max-w-2xl mb-10 ${escuro ? "text-white/80" : "text-ink/70"}`}>
        {texto}
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {itens.map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-navy-900/10 p-5"
          >
            <div className="h-10 w-10 rounded-lg bg-brick-500/10 text-brick-500 flex items-center justify-center text-lg mb-3">
              {item.icone}
            </div>
            <h3 className="font-medium text-sm mb-2">{item.titulo}</h3>
            <p className="text-xs text-ink/65 leading-relaxed">{item.texto}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
