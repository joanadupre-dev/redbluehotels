import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request, { params }) {
  const body = await request.json();
  const { foto, legenda, frase, tag, titulo, texto, ordem } = body;

  const dados = {};
  if (foto !== undefined) dados.foto = foto;
  if (legenda !== undefined) dados.legenda = legenda;
  if (frase !== undefined) dados.frase = frase;
  if (tag !== undefined) dados.tag = tag;
  if (titulo !== undefined) dados.titulo = titulo;
  if (texto !== undefined) dados.texto = texto;
  if (ordem !== undefined) dados.ordem = Number(ordem);

  const slide = await prisma.bannerSlide.update({
    where: { id: Number(params.id) },
    data: dados,
  });

  return NextResponse.json(slide);
}

export async function DELETE(_request, { params }) {
  await prisma.bannerSlide.delete({ where: { id: Number(params.id) } });
  return NextResponse.json({ ok: true });
}
