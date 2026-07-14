"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { comprimirImagem } from "@/lib/comprimirImagem";

export default function HotelForm({ hotel }) {
  const router = useRouter();
  const isEdit = Boolean(hotel);

  const [nome, setNome] = useState(hotel?.nome || "");
  const [cidade, setCidade] = useState(hotel?.cidade || "");
  const [estado, setEstado] = useState(hotel?.estado || "");
  const [endereco, setEndereco] = useState(hotel?.endereco || "");
  const [fraseDestaque, setFraseDestaque] = useState(hotel?.fraseDestaque || "");
  const [descricao, setDescricao] = useState(hotel?.descricao || "");

  const [comodidades, setComodidades] = useState(hotel?.comodidades || []);
  const [novaComodidade, setNovaComodidade] = useState("");
  const [imagens, setImagens] = useState(hotel?.imagens || []);
  const [aceitaEventos, setAceitaEventos] = useState(hotel?.aceitaEventos || false);
  const [enviandoImagem, setEnviandoImagem] = useState(false);
  const [erroImagem, setErroImagem] = useState("");
  const [progressoUpload, setProgressoUpload] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  const [urlOrigem, setUrlOrigem] = useState("");
  const [buscando, setBuscando] = useState(false);
  const [avisoBusca, setAvisoBusca] = useState("");

  async function buscarDaUrl() {
    if (!urlOrigem.trim()) return;
    setBuscando(true);
    setAvisoBusca("");
    try {
      const res = await fetch("/api/extrair", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlOrigem.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        setAvisoBusca(data.error || "Não foi possível buscar essa página.");
        return;
      }

      if (data.nome) setNome(data.nome);
      if (data.cidade) setCidade(data.cidade);
      if (data.estado) setEstado(data.estado);
      if (data.endereco) setEndereco(data.endereco);
      if (data.descricao) {
        setDescricao(data.descricao);
        setFraseDestaque((atual) => atual || data.descricao.slice(0, 120));
      }
      if (data.comodidades?.length) {
        setComodidades((atual) => [...new Set([...atual, ...data.comodidades])]);
      }
      if (data.imagens?.length) {
        setImagens((atual) => [...new Set([...atual, ...data.imagens])]);
      }

      const nadaEncontrado = !data.nome && !data.descricao && !data.imagens?.length;
      setAvisoBusca(
        nadaEncontrado
          ? "Não encontrei muita coisa nessa página — preencha manualmente."
          : "Confira os campos preenchidos e ajuste o que precisar antes de salvar."
      );
    } catch {
      setAvisoBusca("Não foi possível buscar essa página. Confira a URL.");
    } finally {
      setBuscando(false);
    }
  }

  function adicionarComodidade() {
    if (!novaComodidade.trim()) return;
    setComodidades([...comodidades, novaComodidade.trim()]);
    setNovaComodidade("");
  }

  function removerComodidade(i) {
    setComodidades(comodidades.filter((_, idx) => idx !== i));
  }

  async function handleUpload(e) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setEnviandoImagem(true);
    setErroImagem("");
    setProgressoUpload({ feito: 0, total: files.length });

    const urlsEnviadas = [];
    for (const file of files) {
      try {
        const comprimida = await comprimirImagem(file);
        const formData = new FormData();
        formData.append("file", comprimida);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        if (res.ok) {
          const data = await res.json();
          if (data.url) urlsEnviadas.push(data.url);
        }
      } catch {
        // segue pras proximas fotos mesmo se uma falhar
      }
      setProgressoUpload((p) => ({ ...p, feito: p.feito + 1 }));
    }

    if (urlsEnviadas.length > 0) {
      setImagens((atual) => [...atual, ...urlsEnviadas]);
    }
    if (urlsEnviadas.length < files.length) {
      setErroImagem(
        `${files.length - urlsEnviadas.length} de ${files.length} foto(s) não foram enviadas. Tente de novo com elas.`
      );
    }

    setEnviandoImagem(false);
    setProgressoUpload(null);
    e.target.value = "";
  }

  function removerImagem(i) {
    setImagens(imagens.filter((_, idx) => idx !== i));
  }

  function usarComoCapa(i) {
    setImagens((atual) => {
      const copia = [...atual];
      const [escolhida] = copia.splice(i, 1);
      return [escolhida, ...copia];
    });
  }

  function moverImagem(i, direcao) {
    setImagens((atual) => {
      const alvo = i + direcao;
      if (alvo < 0 || alvo >= atual.length) return atual;
      const copia = [...atual];
      [copia[i], copia[alvo]] = [copia[alvo], copia[i]];
      return copia;
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSalvando(true);
    setErro("");

    const form = e.target;
    const payload = {
      nome,
      cidade,
      estado,
      estrelas: form.estrelas.value,
      categoria: form.categoria.value,
      endereco,
      fraseDestaque,
      descricao,
      comodidades,
      imagens,
      aceitaEventos: form.aceitaEventos.checked,
      capacidadeEventos: form.aceitaEventos.checked ? form.capacidadeEventos.value : null,
      temTraslado: form.temTraslado.checked,
      destaque: form.destaque.checked,
      publicado: form.publicado.checked,
    };

    const res = await fetch(isEdit ? `/api/hotels/${hotel.id}` : "/api/hotels", {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSalvando(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setErro(data.error || "Não foi possível salvar. Tente novamente.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {!isEdit && (
        <div className="rounded-lg border-2 border-navy-900 p-4 bg-navy-900/[0.03]">
          <p className="text-sm font-medium mb-1">Preencher automaticamente</p>
          <p className="text-xs text-ink/60 mb-3">
            Cole a URL do site do hotel — o sistema tenta puxar nome,
            descrição, endereço e foto principal. Confira tudo antes de
            salvar.
          </p>
          <div className="flex gap-2">
            <input
              value={urlOrigem}
              onChange={(e) => setUrlOrigem(e.target.value)}
              placeholder="https://www.hoteldoexemplo.com.br"
              className="flex-1 rounded-lg border border-navy-900/20 px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={buscarDaUrl}
              disabled={buscando}
              className="rounded-lg bg-navy-900 text-sand px-4 py-2 text-sm font-medium hover:bg-brick-500 transition-colors disabled:opacity-60 whitespace-nowrap"
            >
              {buscando ? "Buscando..." : "Buscar informações"}
            </button>
          </div>
          {avisoBusca && <p className="text-xs text-ink/60 mt-2">{avisoBusca}</p>}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block text-sm">
          Nome do hotel
          <input
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="mt-1 w-full rounded-lg border border-navy-900/20 px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          Categoria
          <select
            name="categoria"
            defaultValue={hotel?.categoria || "Cidade"}
            className="mt-1 w-full rounded-lg border border-navy-900/20 px-3 py-2"
          >
            <option value="Praia">Praia</option>
            <option value="Serra">Serra</option>
            <option value="Cidade">Cidade</option>
            <option value="Campo">Campo</option>
          </select>
        </label>
        <label className="block text-sm">
          Estrelas
          <select
            name="estrelas"
            defaultValue={hotel?.estrelas || 3}
            className="mt-1 w-full rounded-lg border border-navy-900/20 px-3 py-2"
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>{n} estrela{n > 1 && "s"}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          Cidade
          <input
            required
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            className="mt-1 w-full rounded-lg border border-navy-900/20 px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          Estado (UF)
          <input
            required
            maxLength={2}
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            className="mt-1 w-full rounded-lg border border-navy-900/20 px-3 py-2 uppercase"
          />
        </label>
      </div>

      <label className="block text-sm">
        Endereço
        <input
          required
          value={endereco}
          onChange={(e) => setEndereco(e.target.value)}
          className="mt-1 w-full rounded-lg border border-navy-900/20 px-3 py-2"
        />
      </label>

      <label className="block text-sm">
        Frase em destaque{" "}
        <span className="text-ink/45 font-normal">
          (aparece nos cards e nas listagens — curta, 1 linha)
        </span>
        <textarea
          required
          rows={2}
          value={fraseDestaque}
          onChange={(e) => setFraseDestaque(e.target.value)}
          className="mt-1 w-full rounded-lg border border-navy-900/20 px-3 py-2"
        />
      </label>

      <label className="block text-sm">
        Descrição completa{" "}
        <span className="text-ink/45 font-normal">
          (aparece na página só desse hotel — pode ser mais longa)
        </span>
        <textarea
          required
          rows={5}
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          className="mt-1 w-full rounded-lg border border-navy-900/20 px-3 py-2"
        />
      </label>

      <div>
        <p className="text-sm font-medium mb-2">Comodidades</p>
        <div className="flex gap-2 mb-3">
          <input
            value={novaComodidade}
            onChange={(e) => setNovaComodidade(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                adicionarComodidade();
              }
            }}
            placeholder="Ex: Wi-Fi gratis, Piscina..."
            className="flex-1 rounded-lg border border-navy-900/20 px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={adicionarComodidade}
            className="rounded-lg border border-navy-900/20 px-4 py-2 text-sm hover:bg-navy-900/5"
          >
            Adicionar
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {comodidades.map((c, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-2 rounded-full bg-navy-900/5 px-3 py-1 text-xs"
            >
              {c}
              <button type="button" onClick={() => removerComodidade(i)} className="text-brick-600">
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-navy-900/10 p-4 space-y-3 bg-navy-900/[0.02]">
        <p className="text-sm font-medium">Perfil corporativo</p>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="aceitaEventos"
            checked={aceitaEventos}
            onChange={(e) => setAceitaEventos(e.target.checked)}
          />
          Tem sala de eventos / reunião
        </label>
        {aceitaEventos && (
          <label className="block text-sm max-w-xs">
            Capacidade (nº de pessoas)
            <input
              type="number"
              name="capacidadeEventos"
              min="1"
              defaultValue={hotel?.capacidadeEventos || ""}
              className="mt-1 w-full rounded-lg border border-navy-900/20 px-3 py-2"
            />
          </label>
        )}
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="temTraslado" defaultChecked={hotel?.temTraslado} />
          Oferece traslado
        </label>
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Fotos</p>
        <p className="text-xs text-ink/50 mb-2">
          Pode selecionar várias fotos de uma vez (até 10 por hotel). A
          primeira da lista é a capa (aparece nos cards e no banner) — use as
          setas ou "Usar como capa" pra reorganizar.
        </p>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleUpload}
          disabled={enviandoImagem || imagens.length >= 10}
          className="text-sm"
        />
        {imagens.length >= 10 && (
          <p className="text-xs text-brick-600 mt-1">Limite de 10 fotos por hotel atingido.</p>
        )}
        {progressoUpload && (
          <p className="text-xs text-ink/50 mt-1">
            Enviando foto {progressoUpload.feito + 1} de {progressoUpload.total}...
          </p>
        )}
        {erroImagem && <p className="text-xs text-brick-600 mt-1">{erroImagem}</p>}
        <div className="flex flex-wrap gap-3 mt-3">
          {imagens.map((img, i) => (
            <div key={i} className="relative group">
              <img
                src={img}
                alt=""
                className={`h-20 w-28 object-cover rounded-lg border ${i === 0 ? "border-brick-500 border-2" : "border-navy-900/10"}`}
              />
              {i === 0 && (
                <span className="absolute bottom-1 left-1 bg-brick-500 text-white text-[10px] font-medium px-1.5 py-0.5 rounded">
                  Capa
                </span>
              )}
              <button
                type="button"
                onClick={() => removerImagem(i)}
                className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-brick-500 text-white text-xs"
              >
                ×
              </button>
              <div className="absolute -top-2 left-1 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => moverImagem(i, -1)}
                  disabled={i === 0}
                  aria-label="Mover pra esquerda"
                  className="h-5 w-5 rounded-full bg-navy-900 text-white text-[10px] disabled:opacity-30"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => moverImagem(i, 1)}
                  disabled={i === imagens.length - 1}
                  aria-label="Mover pra direita"
                  className="h-5 w-5 rounded-full bg-navy-900 text-white text-[10px] disabled:opacity-30"
                >
                  →
                </button>
              </div>
              {i !== 0 && (
                <button
                  type="button"
                  onClick={() => usarComoCapa(i)}
                  className="absolute inset-x-0 bottom-0 bg-navy-950/80 text-white text-[10px] py-1 opacity-0 group-hover:opacity-100 transition-opacity rounded-b-lg"
                >
                  Usar como capa
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="destaque" defaultChecked={hotel?.destaque} />
          Exibir no carrossel da home
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="publicado" defaultChecked={hotel ? hotel.publicado : true} />
          Publicado (visível no site)
        </label>
      </div>

      {erro && <p className="text-sm text-brick-600">{erro}</p>}

      <button
        type="submit"
        disabled={salvando}
        className="rounded-full bg-navy-900 text-sand px-6 py-2 text-sm font-medium hover:bg-brick-500 transition-colors disabled:opacity-60"
      >
        {salvando ? "Salvando..." : isEdit ? "Salvar alterações" : "Cadastrar hotel"}
      </button>
    </form>
  );
}
