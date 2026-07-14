import { NextResponse } from "next/server";
import { createSessionToken, SESSION_COOKIE } from "@/lib/auth";
import { verificarSenha } from "@/lib/senha";

export async function POST(request) {
  const { email, password } = await request.json();

  const validEmail = process.env.ADMIN_EMAIL;

  const emailOk = email === validEmail;
  const senhaOk = await verificarSenha(password);

  if (!emailOk || !senhaOk) {
    return NextResponse.json({ error: "E-mail ou senha incorretos." }, { status: 401 });
  }

  const token = await createSessionToken(email);
  const response = NextResponse.json({ ok: true });

  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 horas
  });

  return response;
}
