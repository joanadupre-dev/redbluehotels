// Sessao de admin usando um token simples codificado em base64.
// Formato: base64("email|expiracao|assinatura"), onde a assinatura e um
// hash HMAC-SHA256 do "email|expiracao" com o JWT_SECRET.
// Usa Web Crypto API (async) para funcionar tanto no Edge Runtime do
// middleware quanto nas rotas de API normais.

export const SESSION_COOKIE = "rb_admin_session";
const DURACAO_MS = 8 * 60 * 60 * 1000; // 8 horas

async function assinar(dados, secret) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(dados));
  // converte para hex
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function createSessionToken(email) {
  const secret = process.env.JWT_SECRET || "fallback-secret";
  const expira = Date.now() + DURACAO_MS;
  const dados = `${email}|${expira}`;
  const assinatura = await assinar(dados, secret);
  const token = `${dados}|${assinatura}`;
  // base64 (funciona em Edge e Node)
  return btoa(unescape(encodeURIComponent(token)));
}

export async function verifySessionToken(token) {
  if (!token) return null;
  const secret = process.env.JWT_SECRET || "fallback-secret";

  try {
    const decoded = decodeURIComponent(escape(atob(token)));
    const partes = decoded.split("|");
    if (partes.length !== 3) return null;

    const [email, expiraStr, assinaturaRecebida] = partes;
    const expira = Number(expiraStr);
    if (!expira || expira < Date.now()) return null;

    const assinaturaEsperada = await assinar(`${email}|${expira}`, secret);
    if (assinaturaEsperada !== assinaturaRecebida) return null;

    return { email, role: "admin", exp: expira };
  } catch {
    return null;
  }
}
