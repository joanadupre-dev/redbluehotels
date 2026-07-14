import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/banners?local=home  (ou local=sobre)
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const local = searchParams.get("local");

  const slides = await prisma.bannerSlide.findMany({
    where: local ? { local } : {},
    orderBy: [{ local: "asc" }, { ordem: "asc" }],
  });

  return NextResponse.json(slides);
}

// POST /api/banners — cria um novo slide (protegido pelo middleware)
export async function POST(request) {
  const body = await request.json();
  const { local, foto, legenda, frase, tag, titulo, texto } = body;

  if (!local || (local !== "home" && local !== "sobre")) {
    return NextResponse.json({ error: "local inválido" }, { status: 400 });
  }

  const maiorOrdem = await prisma.bannerSlide.findFirst({
    where: { local },
    orderBy: { ordem: "desc" },
    select: { ordem: true },
  });

  const slide = await prisma.bannerSlide.create({
    data: {
      local,
      ordem: (maiorOrdem?.ordem ?? -1) + 1,
      foto: foto || "",
      legenda: legenda || "",
      frase: frase || "",
      tag: tag || "",
      titulo: titulo || "",
      texto: texto || "",
    },
  });

  return NextResponse.json(slide, { status: 201 });
}
