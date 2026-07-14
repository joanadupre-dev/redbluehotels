"use client";

import { useState } from "react";
import { comprimirImagem } from "@/lib/comprimirImagem";

export default function BannerSlidesForm({ local, slidesIniciais }) {
  const [slides, setSlides] = useState(slidesIniciais);
  const [enviando, setEnviando] = useState({});
  const [salvando, setSalvando] = useState({});
  const [ok, setOk] = useState({});
  const [erroFoto, setErroFoto] = useState({});

  function atualizarCampo(id, campo, valor) {
    setSlides((atual) => atual.map((s) => (s.id === id ? { ...s, [campo]: valor } : s)));
  }

  async function salvarSlide(id) {
    const slide = slides.find((s) => s.id === id);
    if (!slide) return;
    setSalvando((a) => ({ ...a, [id]: true }));
    await fetch(`/api/banners/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(slide),
    });
    setSalvando((a) => ({ ...a, [id]: false }));
    setOk((a) => ({ ...a, [id]: true }));
    setTimeout(() => setOk((a) => ({ ...a, [id]: false })), 2000);
  }

  async function uploadFoto(id, file) {
    setEnviando((a) => ({ ...a, [id]: true }));
    setErroFoto((a) => ({ ...a, [id]: "" }));
    try {
      const comprimida = await comprimirImagem(file);
      const formData = new FormData();
      formData.append("file", comprimida);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) {
        setErroFoto((a) => ({ ...a, [id]: "Falha ao enviar a imagem. Tente uma foto menor." }));
        return;
      }
      const data = await res.json();
      if (data.url) {
        atualizarCampo(id, "foto", data.url);
        const salvou = await fetch(`/api/banners/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ foto: data.url }),
        });
        if (!salvou.ok) {
          setErroFoto((a) => ({ ...a, [id]: "Foto enviada, mas não salvou. Tente de novo." }));
        }
      } else {
        setErroFoto((a) => ({ ...a, [id]: "Não foi possível enviar essa imagem." }));
      }
    } catch {
      setErroFoto((a) => ({ ...a, [id]: "Não foi possível enviar essa imagem." }));
    } finally {
      setEnviando((a) => ({ ...a, [id]: false }));
    }
  }

  async function adicionarSlide() {
    const res = await fetch("/api/banners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ local }),
    });
    const novo = await res.json();
    setSlides((atual) => [...atual, novo]);
  }

  async function removerSlide(id) {
    if (!confirm("Remover esse slide?")) return;
    await fetch(`/api/banners/${id}`, { method: "DELETE" });
    setSlides((atual) => atual.filter((s) => s.id !== id));
  }

  async function moverSlide(id, direcao) {
    const idx = slides.findIndex((s) => s.id === id);
    const vizinho = idx + direcao;
    if (vizinho < 0 || vizinho >= slides.length) return;

    const copia = [...slides];
    [copia[idx], copia[vizinho]] = [copia[vizinho], copia[idx]];
    setSlides(copia);

    await Promise.all([
      fetch(`/api/banners/${copia[idx].id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ordem: idx }),
      }),
      fetch(`/api/banners/${copia[vizinho].id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ordem: vizinho }),
      }),
    ]);
  }

  return (
    <div className="space-y-4">
      {slides.length === 0 && (
        <p className="text-sm text-ink/50 italic">
          Nenhum slide ainda — clique em "Adicionar slide" pra montar o primeiro.
        </p>
      )}

      {slides.map((slide, i) => (
        <div key={slide.id} className="rounded-xl border border-navy-900/10 bg-white p-5">
          <div className="flex items-start gap-4">
            <div className="shrink-0">
              {slide.foto ? (
                <img src={slide.foto} alt="" className="h-24 w-36 object-cover rounded-lg border border-navy-900/10" />
              ) : (
                <div className="h-24 w-36 rounded-lg bg-navy-900/5 flex items-center justify-center text-xs text-ink/40 text-center px-2">
                  Sem foto
                </div>
              )}
              <label className="block mt-1.5 text-center">
                <span className="text-xs text-brick-500 hover:underline cursor-pointer">
                  {enviando[slide.id] ? "Enviando..." : "Trocar foto"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={enviando[slide.id]}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) uploadFoto(slide.id, file);
                    e.target.value = "";
                  }}
                />
              </label>
              {erroFoto[slide.id] && (
                <p className="text-[10px] text-brick-600 text-center mt-1 max-w-[144px]">
                  {erroFoto[slide.id]}
                </p>
              )}
            </div>

            <div className="flex-1 space-y-2.5">
              {local === "home" ? (
                <>
                  <label className="block text-xs">
                    Legenda / pin (canto da foto)
                    <input
                      value={slide.legenda}
                      onChange={(e) => atualizarCampo(slide.id, "legenda", e.target.value)}
                      placeholder="Ex: Golden Towers Hotel, Macaé"
                      className="mt-1 w-full rounded-lg border border-navy-900/20 px-3 py-1.5 text-sm"
                    />
                  </label>
                  <label className="block text-xs">
                    Frase grande
                    <textarea
                      rows={2}
                      value={slide.frase}
                      onChange={(e) => atualizarCampo(slide.id, "frase", e.target.value)}
                      className="mt-1 w-full rounded-lg border border-navy-900/20 px-3 py-1.5 text-sm"
                    />
                  </label>
                </>
              ) : (
                <>
                  <label className="block text-xs">
                    Selo (categoria)
                    <input
                      value={slide.tag}
                      onChange={(e) => atualizarCampo(slide.id, "tag", e.target.value)}
                      placeholder="Ex: Off-Shore"
                      className="mt-1 w-full rounded-lg border border-navy-900/20 px-3 py-1.5 text-sm"
                    />
                  </label>
                  <label className="block text-xs">
                    Título
                    <input
                      value={slide.titulo}
                      onChange={(e) => atualizarCampo(slide.id, "titulo", e.target.value)}
                      className="mt-1 w-full rounded-lg border border-navy-900/20 px-3 py-1.5 text-sm"
                    />
                  </label>
                  <label className="block text-xs">
                    Texto
                    <textarea
                      rows={2}
                      value={slide.texto}
                      onChange={(e) => atualizarCampo(slide.id, "texto", e.target.value)}
                      className="mt-1 w-full rounded-lg border border-navy-900/20 px-3 py-1.5 text-sm"
                    />
                  </label>
                </>
              )}

              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => salvarSlide(slide.id)}
                  disabled={salvando[slide.id]}
                  className="rounded-full bg-navy-900 text-sand px-4 py-1.5 text-xs font-medium hover:bg-brick-500 transition-colors disabled:opacity-60"
                >
                  {salvando[slide.id] ? "Salvando..." : "Salvar"}
                </button>
                {ok[slide.id] && <span className="text-xs text-green-700">Salvo ✓</span>}

                <div className="flex-1" />

                <button
                  type="button"
                  onClick={() => moverSlide(slide.id, -1)}
                  disabled={i === 0}
                  aria-label="Mover pra cima"
                  className="h-7 w-7 rounded-full border border-navy-900/20 text-sm disabled:opacity-30 hover:border-brick-500"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moverSlide(slide.id, 1)}
                  disabled={i === slides.length - 1}
                  aria-label="Mover pra baixo"
                  className="h-7 w-7 rounded-full border border-navy-900/20 text-sm disabled:opacity-30 hover:border-brick-500"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => removerSlide(slide.id)}
                  className="text-xs text-brick-600 hover:underline ml-1"
                >
                  Remover
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={adicionarSlide}
        className="rounded-lg border border-dashed border-navy-900/25 px-4 py-2.5 text-sm text-ink/60 hover:border-brick-500 hover:text-brick-500 transition-colors w-full"
      >
        + Adicionar slide
      </button>
    </div>
  );
}
