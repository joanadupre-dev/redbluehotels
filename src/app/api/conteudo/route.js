import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSiteConteudo } from "@/lib/siteContent";

export async function GET() {
  const conteudo = await getSiteConteudo();
  return NextResponse.json(conteudo);
}

// PUT protegido pelo middleware (mesma regra do /api/hotels)
export async function PUT(request) {
  const body = await request.json();
  const {
    heroEyebrow,
    heroTitulo,
    heroTexto,
    destaquesFrase,
    cobertura,
    comoFunciona,
    orcamentoTitulo,
    orcamentoTexto,
    hoteisIntro,
    hoteisBannerFoto,
    hoteisBannerFrase,
    instalacoesTitulo,
    instalacoesTexto,
    instalacoes,
    hoteisCtaTitulo,
    hoteisCtaTexto,
    sobreHeroEyebrow,
    sobreHeroTitulo,
    sobreQuemSomosTitulo,
    sobreQuemSomosTexto,
    sobreContadores,
    sobrePilaresTitulo,
    sobrePilares,
    sobreListaTitulo,
    sobreCtaTitulo,
    sobreCtaTexto,
    telefone,
    email,
    footerTagline,
  } = body;

  const dados = {
    heroEyebrow,
    heroTitulo,
    heroTexto,
    destaquesFrase: destaquesFrase || "",
    cobertura: JSON.stringify(cobertura || []),
    comoFunciona: JSON.stringify(comoFunciona || []),
    orcamentoTitulo,
    orcamentoTexto,
    hoteisIntro,
    hoteisBannerFoto: hoteisBannerFoto || "",
    hoteisBannerFrase: hoteisBannerFrase || "",
    instalacoesTitulo: instalacoesTitulo || "",
    instalacoesTexto: instalacoesTexto || "",
    instalacoes: JSON.stringify(instalacoes || []),
    hoteisCtaTitulo: hoteisCtaTitulo || "",
    hoteisCtaTexto: hoteisCtaTexto || "",
    sobreHeroEyebrow: sobreHeroEyebrow || "",
    sobreHeroTitulo: sobreHeroTitulo || "",
    sobreQuemSomosTitulo: sobreQuemSomosTitulo || "",
    sobreQuemSomosTexto: sobreQuemSomosTexto || "",
    sobreContadores: JSON.stringify(sobreContadores || []),
    sobrePilaresTitulo: sobrePilaresTitulo || "",
    sobrePilares: JSON.stringify(sobrePilares || []),
    sobreListaTitulo: sobreListaTitulo || "",
    sobreCtaTitulo: sobreCtaTitulo || "",
    sobreCtaTexto: sobreCtaTexto || "",
    telefone,
    email,
    footerTagline,
  };

  const conteudo = await prisma.siteConteudo.upsert({
    where: { id: 1 },
    update: dados,
    create: { id: 1, ...dados },
  });

  return NextResponse.json(conteudo);
}
