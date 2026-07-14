import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashSenha, verificarSenha } from "@/lib/senha";

// PUT /api/auth/senha — troca a senha do admin (protegido pelo middleware)
export async function PUT(request) {
  const { senhaAtual, novaSenha } = await request.json();

  if (!novaSenha || novaSenha.length < 6) {
    return NextResponse.json(
      { error: "A nova senha precisa ter pelo menos 6 caracteres." },
      { status: 400 }
    );
  }

  const atualOk = await verificarSenha(senhaAtual);
  if (!atualOk) {
    return NextResponse.json({ error: "A senha atual está incorreta." }, { status: 400 });
  }

  const senhaHash = await hashSenha(novaSenha);

  await prisma.adminConfig.upsert({
    where: { id: 1 },
    update: { senhaHash },
    create: { id: 1, senhaHash },
  });

  return NextResponse.json({ ok: true });
}
