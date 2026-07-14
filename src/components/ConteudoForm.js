"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

function SecaoTitulo({ children }) {
  return (
    <h2 className="font-display text-lg font-600 pt-2 pb-1 border-b border-navy-900/10 mb-1">
      {children}
    </h2>
  );
}

export default function ConteudoForm({ conteudo }) {
  const router = useRouter();
  const [cobertura, setCobertura] = useState(conteudo.cobertura);
  const [novaCidade, setNovaCidade] = useState("");
  const [comoFunciona, setComoFunciona] = useState(conteudo.comoFunciona);
  const [hoteisBannerFoto, setHoteisBannerFoto] = useState(conteudo.hoteisBannerFoto || "");
  const [enviandoFotoHoteis, setEnviandoFotoHoteis] = useState(false);
  const [instalacoes, setInstalacoes] = useState(conteudo.instalacoes);
  const [sobreContadores, setSobreContadores] = useState(conteudo.sobreContadores);
  const [sobrePilares, setSobrePilares] = useState(conteudo.sobrePilares);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [ok, setOk] = useState(false);

  function adicionarCidade() {
    if (!novaCidade.trim()) return;
    setCobertura([...cobertura, novaCidade.trim()]);
    setNovaCidade("");
  }
  function removerCidade(i) {
    setCobertura(cobertura.filter((_, idx) => idx !== i));
  }

  function atualizarPasso(i, campo, valor) {
    const copia = [...comoFunciona];
    copia[i] = { ...copia[i], [campo]: valor };
    setComoFunciona(copia);
  }

  function atualizarInstalacao(i, campo, valor) {
    const copia = [...instalacoes];
    copia[i] = { ...copia[i], [campo]: valor };
    setInstalacoes(copia);
  }
  function adicionarInstalacao() {
    setInstalacoes([...instalacoes, { icone: "✨", titulo: "", texto: "" }]);
  }
  function removerInstalacao(i) {
    setInstalacoes(instalacoes.filter((_, idx) => idx !== i));
  }

  function atualizarContador(i, campo, valor) {
    const copia = [...sobreContadores];
    copia[i] = { ...copia[i], [campo]: campo === "numero" ? Number(valor) || 0 : valor };
    setSobreContadores(copia);
  }

  function atualizarPilar(i, campo, valor) {
    const copia = [...sobrePilares];
    copia[i] = { ...copia[i], [campo]: valor };
    setSobrePilares(copia);
  }
  function adicionarPilar() {
    setSobrePilares([...sobrePilares, { titulo: "", texto: "" }]);
  }
  function removerPilar(i) {
    setSobrePilares(sobrePilares.filter((_, idx) => idx !== i));
  }

  async function handleUploadHoteisBanner(e) {
    const file = e.target.files[0];
    if (!file) return;
    setEnviandoFotoHoteis(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) setHoteisBannerFoto(data.url);
    } finally {
      setEnviandoFotoHoteis(false);
      e.target.value = "";
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSalvando(true);
    setErro("");
    setOk(false);

    const form = e.target;
    const payload = {
      heroEyebrow: conteudo.heroEyebrow || "",
      heroTitulo: conteudo.heroTitulo || "",
      heroTexto: conteudo.heroTexto || "",
      destaquesFrase: form.destaquesFrase.value,
      cobertura,
      comoFunciona,
      orcamentoTitulo: form.orcamentoTitulo.value,
      orcamentoTexto: form.orcamentoTexto.value,
      hoteisIntro: form.hoteisIntro.value,
      hoteisBannerFoto,
      hoteisBannerFrase: form.hoteisBannerFrase.value,
      instalacoesTitulo: form.instalacoesTitulo.value,
      instalacoesTexto: form.instalacoesTexto.value,
      instalacoes,
      hoteisCtaTitulo: form.hoteisCtaTitulo.value,
      hoteisCtaTexto: form.hoteisCtaTexto.value,
      sobreHeroEyebrow: form.sobreHeroEyebrow.value,
      sobreHeroTitulo: form.sobreHeroTitulo.value,
      sobreQuemSomosTitulo: form.sobreQuemSomosTitulo.value,
      sobreQuemSomosTexto: form.sobreQuemSomosTexto.value,
      sobreContadores,
      sobrePilaresTitulo: form.sobrePilaresTitulo.value,
      sobrePilares,
      sobreListaTitulo: form.sobreListaTitulo.value,
      sobreCtaTitulo: form.sobreCtaTitulo.value,
      sobreCtaTexto: form.sobreCtaTexto.value,
      telefone: form.telefone.value,
      email: form.email.value,
      footerTagline: form.footerTagline.value,
    };

    const res = await fetch("/api/conteudo", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSalvando(false);

    if (!res.ok) {
      setErro("Não foi possível salvar. Tente novamente.");
      return;
    }

    setOk(true);
    router.refresh();
    setTimeout(() => setOk(false), 2500);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {/* ===================== GERAL / HOME ===================== */}
      <div className="rounded-xl border border-navy-900/10 bg-white p-6 space-y-6">
        <SecaoTitulo>Geral e Home</SecaoTitulo>

        <label className="block text-sm">
          Frase acima do carrossel de hotéis em destaque (Home)
          <textarea
            name="destaquesFrase"
            rows={2}
            defaultValue={conteudo.destaquesFrase}
            className="mt-1 w-full rounded-lg border border-navy-900/20 px-3 py-2"
          />
        </label>

        <div>
          <p className="text-sm font-medium mb-2">Cidades de cobertura</p>
          <div className="flex gap-2 mb-3">
            <input
              value={novaCidade}
              onChange={(e) => setNovaCidade(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); adicionarCidade(); } }}
              placeholder="Ex: Búzios"
              className="flex-1 rounded-lg border border-navy-900/20 px-3 py-2 text-sm"
            />
            <button type="button" onClick={adicionarCidade} className="rounded-lg border border-navy-900/20 px-4 py-2 text-sm hover:bg-navy-900/5">
              Adicionar
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {cobertura.map((c, i) => (
              <span key={i} className="inline-flex items-center gap-2 rounded-full bg-navy-900/5 px-3 py-1 text-xs">
                {c}
                <button type="button" onClick={() => removerCidade(i)} className="text-brick-600">×</button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium mb-3">Como funciona (3 passos)</p>
          <div className="space-y-4">
            {comoFunciona.map((passo, i) => (
              <div key={i} className="border-b border-navy-900/10 pb-4 last:border-0 last:pb-0">
                <label className="block text-sm mb-2">
                  Passo {i + 1} — título
                  <input
                    value={passo.titulo}
                    onChange={(e) => atualizarPasso(i, "titulo", e.target.value)}
                    className="mt-1 w-full rounded-lg border border-navy-900/20 px-3 py-2"
                  />
                </label>
                <label className="block text-sm">
                  Texto
                  <textarea
                    rows={2}
                    value={passo.texto}
                    onChange={(e) => atualizarPasso(i, "texto", e.target.value)}
                    className="mt-1 w-full rounded-lg border border-navy-900/20 px-3 py-2"
                  />
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium mb-2">Formulário de tarifa corporativa (Home)</p>
          <label className="block text-sm mb-3">
            Título
            <input name="orcamentoTitulo" defaultValue={conteudo.orcamentoTitulo} className="mt-1 w-full rounded-lg border border-navy-900/20 px-3 py-2" />
          </label>
          <label className="block text-sm">
            Texto
            <textarea name="orcamentoTexto" rows={3} defaultValue={conteudo.orcamentoTexto} className="mt-1 w-full rounded-lg border border-navy-900/20 px-3 py-2" />
          </label>
        </div>
      </div>

      {/* ===================== PÁGINA HOTÉIS ===================== */}
      <div className="rounded-xl border border-navy-900/10 bg-white p-6 space-y-6">
        <SecaoTitulo>Página Hotéis</SecaoTitulo>

        <div>
          <p className="text-sm font-medium mb-1">Banner do topo</p>
          <p className="text-xs text-ink/50 mb-3">Foto e frase fixas (não gira, é uma imagem só).</p>
          <div className="flex items-start gap-4 mb-3">
            {hoteisBannerFoto ? (
              <img src={hoteisBannerFoto} alt="" className="h-20 w-32 object-cover rounded-lg border border-navy-900/10" />
            ) : (
              <div className="h-20 w-32 rounded-lg bg-navy-900/5 flex items-center justify-center text-xs text-ink/40">Sem foto</div>
            )}
            <label className="text-sm">
              <span className="inline-block rounded-lg border border-navy-900/20 px-3 py-1.5 text-xs cursor-pointer hover:bg-navy-900/5">
                {enviandoFotoHoteis ? "Enviando..." : "Trocar foto"}
              </span>
              <input type="file" accept="image/*" className="hidden" disabled={enviandoFotoHoteis} onChange={handleUploadHoteisBanner} />
            </label>
          </div>
          <label className="block text-sm">
            Frase do banner
            <textarea name="hoteisBannerFrase" rows={2} defaultValue={conteudo.hoteisBannerFrase} className="mt-1 w-full rounded-lg border border-navy-900/20 px-3 py-2" />
          </label>
        </div>

        <label className="block text-sm">
          Introdução (parágrafo logo abaixo do banner)
          <textarea name="hoteisIntro" rows={4} defaultValue={conteudo.hoteisIntro} className="mt-1 w-full rounded-lg border border-navy-900/20 px-3 py-2" />
        </label>

        <div>
          <p className="text-sm font-medium mb-2">Seção "Instalações dos hotéis parceiros"</p>
          <label className="block text-sm mb-2">
            Título da seção
            <input name="instalacoesTitulo" defaultValue={conteudo.instalacoesTitulo} className="mt-1 w-full rounded-lg border border-navy-900/20 px-3 py-2" />
          </label>
          <label className="block text-sm mb-3">
            Texto de apresentação
            <textarea name="instalacoesTexto" rows={2} defaultValue={conteudo.instalacoesTexto} className="mt-1 w-full rounded-lg border border-navy-900/20 px-3 py-2" />
          </label>
          <p className="text-xs text-ink/50 mb-2">Itens (ícone é um emoji, ex: 🍽️)</p>
          <div className="space-y-3">
            {instalacoes.map((item, i) => (
              <div key={i} className="flex gap-2 items-start border-b border-navy-900/10 pb-3 last:border-0">
                <input
                  value={item.icone}
                  onChange={(e) => atualizarInstalacao(i, "icone", e.target.value)}
                  className="w-14 rounded-lg border border-navy-900/20 px-2 py-2 text-center"
                />
                <div className="flex-1 space-y-1.5">
                  <input
                    value={item.titulo}
                    onChange={(e) => atualizarInstalacao(i, "titulo", e.target.value)}
                    placeholder="Título"
                    className="w-full rounded-lg border border-navy-900/20 px-3 py-1.5 text-sm"
                  />
                  <textarea
                    rows={2}
                    value={item.texto}
                    onChange={(e) => atualizarInstalacao(i, "texto", e.target.value)}
                    placeholder="Texto"
                    className="w-full rounded-lg border border-navy-900/20 px-3 py-1.5 text-sm"
                  />
                </div>
                <button type="button" onClick={() => removerInstalacao(i)} className="text-brick-600 text-sm px-1">×</button>
              </div>
            ))}
          </div>
          <button type="button" onClick={adicionarInstalacao} className="mt-2 text-xs text-brick-500 hover:underline">
            + Adicionar item
          </button>
        </div>

        <div>
          <p className="text-sm font-medium mb-2">CTA final ("Não encontrou o hotel ideal?")</p>
          <label className="block text-sm mb-2">
            Título
            <input name="hoteisCtaTitulo" defaultValue={conteudo.hoteisCtaTitulo} className="mt-1 w-full rounded-lg border border-navy-900/20 px-3 py-2" />
          </label>
          <label className="block text-sm">
            Texto
            <textarea name="hoteisCtaTexto" rows={2} defaultValue={conteudo.hoteisCtaTexto} className="mt-1 w-full rounded-lg border border-navy-900/20 px-3 py-2" />
          </label>
        </div>
      </div>

      {/* ===================== PÁGINA SOBRE NÓS ===================== */}
      <div className="rounded-xl border border-navy-900/10 bg-white p-6 space-y-6">
        <SecaoTitulo>Página Sobre nós</SecaoTitulo>

        <div>
          <p className="text-sm font-medium mb-2">Topo da página</p>
          <label className="block text-sm mb-2">
            Frase pequena (acima do título)
            <input name="sobreHeroEyebrow" defaultValue={conteudo.sobreHeroEyebrow} className="mt-1 w-full rounded-lg border border-navy-900/20 px-3 py-2" />
          </label>
          <label className="block text-sm">
            Título principal
            <textarea name="sobreHeroTitulo" rows={2} defaultValue={conteudo.sobreHeroTitulo} className="mt-1 w-full rounded-lg border border-navy-900/20 px-3 py-2" />
          </label>
        </div>

        <div>
          <p className="text-sm font-medium mb-2">Seção "Quem somos"</p>
          <label className="block text-sm mb-2">
            Título
            <input name="sobreQuemSomosTitulo" defaultValue={conteudo.sobreQuemSomosTitulo} className="mt-1 w-full rounded-lg border border-navy-900/20 px-3 py-2" />
          </label>
          <label className="block text-sm">
            Texto
            <textarea name="sobreQuemSomosTexto" rows={4} defaultValue={conteudo.sobreQuemSomosTexto} className="mt-1 w-full rounded-lg border border-navy-900/20 px-3 py-2" />
          </label>
        </div>

        <div>
          <p className="text-sm font-medium mb-2">Contadores (as 3 caixinhas com números)</p>
          <div className="space-y-3">
            {sobreContadores.map((c, i) => (
              <div key={i} className="flex gap-2 border-b border-navy-900/10 pb-3 last:border-0">
                <input
                  type="number"
                  value={c.numero}
                  onChange={(e) => atualizarContador(i, "numero", e.target.value)}
                  className="w-24 rounded-lg border border-navy-900/20 px-2 py-1.5 text-sm"
                />
                <input
                  value={c.titulo}
                  onChange={(e) => atualizarContador(i, "titulo", e.target.value)}
                  placeholder="Título"
                  className="flex-1 rounded-lg border border-navy-900/20 px-3 py-1.5 text-sm"
                />
                <input
                  value={c.sub}
                  onChange={(e) => atualizarContador(i, "sub", e.target.value)}
                  placeholder="Subtítulo"
                  className="flex-1 rounded-lg border border-navy-900/20 px-3 py-1.5 text-sm"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium mb-2">Seção "Por que confiar na RedBlue"</p>
          <label className="block text-sm mb-3">
            Título da seção
            <input name="sobrePilaresTitulo" defaultValue={conteudo.sobrePilaresTitulo} className="mt-1 w-full rounded-lg border border-navy-900/20 px-3 py-2" />
          </label>
          <div className="space-y-3">
            {sobrePilares.map((p, i) => (
              <div key={i} className="flex gap-2 items-start border-b border-navy-900/10 pb-3 last:border-0">
                <div className="flex-1 space-y-1.5">
                  <input
                    value={p.titulo}
                    onChange={(e) => atualizarPilar(i, "titulo", e.target.value)}
                    placeholder="Título"
                    className="w-full rounded-lg border border-navy-900/20 px-3 py-1.5 text-sm"
                  />
                  <textarea
                    rows={2}
                    value={p.texto}
                    onChange={(e) => atualizarPilar(i, "texto", e.target.value)}
                    placeholder="Texto"
                    className="w-full rounded-lg border border-navy-900/20 px-3 py-1.5 text-sm"
                  />
                </div>
                <button type="button" onClick={() => removerPilar(i)} className="text-brick-600 text-sm px-1">×</button>
              </div>
            ))}
          </div>
          <button type="button" onClick={adicionarPilar} className="mt-2 text-xs text-brick-500 hover:underline">
            + Adicionar pilar
          </button>
        </div>

        <label className="block text-sm">
          Título da lista "Hotéis que confiam na gente"
          <input name="sobreListaTitulo" defaultValue={conteudo.sobreListaTitulo} className="mt-1 w-full rounded-lg border border-navy-900/20 px-3 py-2" />
        </label>

        <div>
          <p className="text-sm font-medium mb-2">CTA final</p>
          <label className="block text-sm mb-2">
            Título
            <input name="sobreCtaTitulo" defaultValue={conteudo.sobreCtaTitulo} className="mt-1 w-full rounded-lg border border-navy-900/20 px-3 py-2" />
          </label>
          <label className="block text-sm">
            Texto
            <textarea name="sobreCtaTexto" rows={2} defaultValue={conteudo.sobreCtaTexto} className="mt-1 w-full rounded-lg border border-navy-900/20 px-3 py-2" />
          </label>
        </div>
      </div>

      {/* ===================== CONTATO / RODAPÉ ===================== */}
      <div className="rounded-xl border border-navy-900/10 bg-white p-6 space-y-4">
        <SecaoTitulo>Contato e rodapé</SecaoTitulo>
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block text-sm">
            Telefone / WhatsApp
            <input name="telefone" defaultValue={conteudo.telefone} className="mt-1 w-full rounded-lg border border-navy-900/20 px-3 py-2" />
          </label>
          <label className="block text-sm">
            E-mail
            <input name="email" defaultValue={conteudo.email} className="mt-1 w-full rounded-lg border border-navy-900/20 px-3 py-2" />
          </label>
        </div>
        <label className="block text-sm">
          Frase do rodapé
          <input name="footerTagline" defaultValue={conteudo.footerTagline} className="mt-1 w-full rounded-lg border border-navy-900/20 px-3 py-2" />
        </label>
      </div>

      {erro && <p className="text-sm text-brick-600">{erro}</p>}
      {ok && <p className="text-sm text-green-700">Conteúdo atualizado com sucesso!</p>}

      <button
        type="submit"
        disabled={salvando}
        className="sticky bottom-4 rounded-full bg-navy-900 text-sand px-6 py-2.5 text-sm font-medium hover:bg-brick-500 transition-colors disabled:opacity-60 shadow-lg"
      >
        {salvando ? "Salvando..." : "Salvar todas as alterações"}
      </button>
    </form>
  );
}
