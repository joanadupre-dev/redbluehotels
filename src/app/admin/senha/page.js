"use client";

import { useState } from "react";
import Link from "next/link";

export default function TrocarSenhaPage() {
  const [status, setStatus] = useState("idle");
  const [erro, setErro] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("enviando");
    setErro("");

    const form = e.target;
    const novaSenha = form.novaSenha.value;
    const confirmar = form.confirmar.value;

    if (novaSenha !== confirmar) {
      setErro("A nova senha e a confirmação não são iguais.");
      setStatus("idle");
      return;
    }

    const res = await fetch("/api/auth/senha", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        senhaAtual: form.senhaAtual.value,
        novaSenha,
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setErro(data.error || "Não foi possível trocar a senha.");
      setStatus("idle");
      return;
    }

    setStatus("ok");
    form.reset();
  }

  return (
    <section className="mx-auto max-w-md px-6 py-12">
      <Link href="/admin" className="text-sm text-ink/60 hover:text-brick-500 mb-4 inline-block">
        ← Voltar pra lista
      </Link>
      <h1 className="font-display text-2xl font-700 mb-1">Trocar senha</h1>
      <p className="text-sm text-ink/60 mb-8">
        Escolha uma senha nova para acessar o painel. A troca vale a partir
        do próximo login.
      </p>

      {status === "ok" ? (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
          Senha alterada com sucesso! Da próxima vez que entrar no painel,
          use a nova senha.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm">
            Senha atual
            <input
              name="senhaAtual"
              type="password"
              required
              className="mt-1 w-full rounded-lg border border-navy-900/20 px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            Nova senha (mínimo 6 caracteres)
            <input
              name="novaSenha"
              type="password"
              required
              minLength={6}
              className="mt-1 w-full rounded-lg border border-navy-900/20 px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            Confirmar nova senha
            <input
              name="confirmar"
              type="password"
              required
              minLength={6}
              className="mt-1 w-full rounded-lg border border-navy-900/20 px-3 py-2"
            />
          </label>
          {erro && <p className="text-sm text-brick-600">{erro}</p>}
          <button
            type="submit"
            disabled={status === "enviando"}
            className="rounded-full bg-navy-900 text-sand px-6 py-2 text-sm font-medium hover:bg-brick-500 transition-colors disabled:opacity-60"
          >
            {status === "enviando" ? "Salvando..." : "Salvar nova senha"}
          </button>
        </form>
      )}
    </section>
  );
}
