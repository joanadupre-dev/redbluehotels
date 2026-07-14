import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  const { nome, empresa, cnpj, email, telefone, hotelSlug, mensagem } = await request.json();

  if (!nome || !email || !telefone || !mensagem) {
    return NextResponse.json({ error: "Preencha todos os campos." }, { status: 400 });
  }

  const orcamento = await prisma.orcamento.create({
    data: {
      nome,
      empresa: empresa || null,
      cnpj: cnpj || null,
      email,
      telefone,
      hotelSlug: hotelSlug || null,
      mensagem,
    },
  });

  // TODO: opcional — integrar envio de e-mail/WhatsApp automático aqui
  // (ex: Resend, SendGrid, ou API do WhatsApp Business) para notificar a
  // equipe assim que um orçamento cair na tabela `Orcamento`.

  return NextResponse.json({ ok: true, id: orcamento.id }, { status: 201 });
}
