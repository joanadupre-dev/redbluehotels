"use client";

import { useState } from "react";

// hotelSlug + hotelNome: usado na página de um hotel específico — mostra
// travado, deixando claro que o pedido é sobre aquele hotel.
// hoteis: lista {nome, slug} usada nas páginas genéricas (Home) — vira um
// dropdown com "Ainda não decidi" como opção padrão.
export default function OrcamentoForm({ hotelSlug, hotelNome, hoteis }) {
  const [status, setStatus] = useState("idle"); // idle | enviando | ok | erro
  const [erro, setErro] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("enviando");
    setErro("");

    const form = e.target;
    const dados = {
      nome: form.nome.value,
      empresa: form.empresa.value,
      cnpj: form.cnpj.value,
      email: form.email.value,
      telefone: form.telefone.value,
      mensagem: form.mensagem.value,
      hotelSlug: hotelSlug || form.hotel?.value || null,
    };

    try {
      const res = await fetch("/api/orcamento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });
      if (!res.ok) throw new Error("Falha ao enviar");
      setStatus("ok");
      form.reset();
    } catch {
      setStatus("erro");
      setErro("Não foi possível enviar. Tente novamente em instantes.");
    }
  }

  if (status === "ok") {
    return (
      <p className="text-sm text-ink/80">
        Recebemos sua solicitação! Nossa equipe entra em contato com a
        proposta corporativa em breve.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {hotelSlug && hotelNome ? (
        <div className="rounded-lg bg-brick-500/8 border border-brick-500/25 px-3 py-2.5 text-sm">
          <span className="text-ink/60">Solicitando tarifa para:</span>{" "}
          <strong className="text-ink">{hotelNome}</strong>
        </div>
      ) : (
        hoteis && (
          <select
            name="hotel"
            defaultValue=""
            className="w-full rounded-lg border border-navy-900/20 px-3 py-2 text-sm bg-white"
          >
            <option value="">Ainda não decidi</option>
            {hoteis.map((h) => (
              <option key={h.slug} value={h.slug}>
                {h.nome}
              </option>
            ))}
          </select>
        )
      )}
      <input
        name="empresa"
        required
        placeholder="Nome da empresa"
        className="w-full rounded-lg border border-navy-900/20 px-3 py-2 text-sm"
      />
      <input
        name="cnpj"
        placeholder="CNPJ (opcional)"
        className="w-full rounded-lg border border-navy-900/20 px-3 py-2 text-sm"
      />
      <input
        name="nome"
        required
        placeholder="Seu nome (responsável pela solicitação)"
        className="w-full rounded-lg border border-navy-900/20 px-3 py-2 text-sm"
      />
      <input
        name="email"
        type="email"
        required
        placeholder="E-mail corporativo"
        className="w-full rounded-lg border border-navy-900/20 px-3 py-2 text-sm"
      />
      <input
        name="telefone"
        required
        placeholder="Telefone / WhatsApp"
        className="w-full rounded-lg border border-navy-900/20 px-3 py-2 text-sm"
      />
      <textarea
        name="mensagem"
        required
        rows={3}
        placeholder="Número de hóspedes, datas, se precisa de sala de evento ou traslado..."
        className="w-full rounded-lg border border-navy-900/20 px-3 py-2 text-sm"
      />
      {erro && <p className="text-sm text-brick-600">{erro}</p>}
      <button
        type="submit"
        disabled={status === "enviando"}
        className="w-full rounded-full bg-navy-900 text-sand px-5 py-2 text-sm font-medium hover:bg-brick-500 transition-colors disabled:opacity-60"
      >
        {status === "enviando" ? "Enviando..." : "Solicitar tarifa corporativa"}
      </button>
    </form>
  );
}
