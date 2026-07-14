"use client";

import { useState } from "react";

export default function AdminLoginPage() {
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setCarregando(true);
    setErro("");

    const form = e.target;
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.email.value,
        password: form.password.value,
      }),
    });

    if (!res.ok) {
      setCarregando(false);
      setErro("E-mail ou senha incorretos.");
      return;
    }

    // Navegacao direta e confiavel apos o login
    window.location.href = "/admin";
  }

  return (
    <section className="mx-auto max-w-sm px-6 py-24">
      <h1 className="font-display text-2xl font-700 mb-6">Painel RedBlue</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="email"
          type="email"
          required
          placeholder="E-mail"
          className="w-full rounded-lg border border-navy-900/20 px-3 py-2 text-sm"
        />
        <input
          name="password"
          type="password"
          required
          placeholder="Senha"
          className="w-full rounded-lg border border-navy-900/20 px-3 py-2 text-sm"
        />
        {erro && <p className="text-sm text-brick-600">{erro}</p>}
        <button
          type="submit"
          disabled={carregando}
          className="w-full rounded-full bg-navy-900 text-sand px-5 py-2 text-sm font-medium hover:bg-brick-500 transition-colors disabled:opacity-60"
        >
          {carregando ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </section>
  );
}
