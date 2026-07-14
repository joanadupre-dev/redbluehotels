import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_request, { params }) {
  const hotel = await prisma.hotel.findUnique({ where: { id: Number(params.id) } });
  if (!hotel) return NextResponse.json({ error: "Hotel não encontrado" }, { status: 404 });

  return NextResponse.json({
    ...hotel,
    comodidades: JSON.parse(hotel.comodidades || "[]"),
    imagens: JSON.parse(hotel.imagens || "[]"),
  });
}

export async function PUT(request, { params }) {
  const body = await request.json();
  const {
    nome,
    cidade,
    estado,
    estrelas,
    categoria,
    endereco,
    fraseDestaque,
    descricao,
    comodidades,
    imagens,
    aceitaEventos,
    capacidadeEventos,
    temTraslado,
    destaque,
    publicado,
  } = body;

  const hotel = await prisma.hotel.update({
    where: { id: Number(params.id) },
    data: {
      nome,
      cidade,
      estado,
      estrelas: Number(estrelas) || 3,
      categoria: categoria || "Cidade",
      endereco,
      fraseDestaque,
      descricao,
      comodidades: JSON.stringify(comodidades || []),
      imagens: JSON.stringify(imagens || []),
      aceitaEventos: Boolean(aceitaEventos),
      capacidadeEventos: capacidadeEventos ? Number(capacidadeEventos) : null,
      temTraslado: Boolean(temTraslado),
      destaque: Boolean(destaque),
      publicado: Boolean(publicado),
    },
  });

  return NextResponse.json(hotel);
}

export async function DELETE(_request, { params }) {
  await prisma.hotel.delete({ where: { id: Number(params.id) } });
  return NextResponse.json({ ok: true });
}
