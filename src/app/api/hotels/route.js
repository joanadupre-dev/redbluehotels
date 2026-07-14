import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import slugify from "slugify";

// GET /api/hotels?cidade=&estrelas=&categoria=&publicado=1
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const cidade = searchParams.get("cidade");
  const estrelas = searchParams.get("estrelas");
  const categoria = searchParams.get("categoria");
  const somentePublicados = searchParams.get("publicado") !== "0";

  const hoteis = await prisma.hotel.findMany({
    where: {
      ...(somentePublicados ? { publicado: true } : {}),
      ...(cidade ? { cidade: { contains: cidade } } : {}),
      ...(estrelas ? { estrelas: Number(estrelas) } : {}),
      ...(categoria ? { categoria } : {}),
    },
    orderBy: [{ destaque: "desc" }, { criadoEm: "desc" }],
  });

  const parsed = hoteis.map((h) => ({
    ...h,
    comodidades: JSON.parse(h.comodidades || "[]"),
    imagens: JSON.parse(h.imagens || "[]"),
  }));

  return NextResponse.json(parsed);
}

// POST /api/hotels — cria um novo hotel (protegido pelo middleware)
export async function POST(request) {
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

  if (!nome || !cidade || !estado || !endereco || !descricao || !fraseDestaque) {
    return NextResponse.json(
      { error: "Preencha nome, cidade, estado, endereço, frase em destaque e descrição." },
      { status: 400 }
    );
  }

  let slug = slugify(nome, { lower: true, strict: true });
  const existente = await prisma.hotel.findUnique({ where: { slug } });
  if (existente) {
    slug = `${slug}-${Date.now().toString().slice(-5)}`;
  }

  const hotel = await prisma.hotel.create({
    data: {
      slug,
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
      publicado: publicado === undefined ? true : Boolean(publicado),
    },
  });

  return NextResponse.json(hotel, { status: 201 });
}
