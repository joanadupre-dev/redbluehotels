import { prisma } from "@/lib/prisma";

// Gera hash SHA-256 de uma senha (hex). Usa Web Crypto (funciona em Node e Edge).
export async function hashSenha(senha) {
  const encoder = new TextEncoder();
  const buffer = await crypto.subtle.digest("SHA-256", encoder.encode(senha));
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Verifica se a senha informada confere. Regra:
// - Se existe uma senha personalizada no banco (AdminConfig.senhaHash), usa ela.
// - Senao, cai na senha do .env (ADMIN_PASSWORD) — o padrao inicial.
export async function verificarSenha(senhaInformada) {
  let config = null;
  try {
    config = await prisma.adminConfig.findUnique({ where: { id: 1 } });
  } catch {
    config = null;
  }

  if (config?.senhaHash) {
    const hashInformada = await hashSenha(senhaInformada);
    return hashInformada === config.senhaHash;
  }

  // Fallback: senha do .env
  return senhaInformada === process.env.ADMIN_PASSWORD;
}
