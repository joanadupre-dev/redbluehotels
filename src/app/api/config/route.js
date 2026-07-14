import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const PADRAO = {
  id: 1,
  heroEyebrow: "Agenciamento de hospedagem corporativa",
  heroTitulo: "Hotéis para viagens e eventos empresariais, com tarifa negociada e traslado.",
  heroTexto: "Representamos uma seleção de hotéis para empresas que buscam acomodações para eventos corporativos e viagens empresariais.",
  cobertura: ["Barra da Tijuca", "Copacabana", "Centro", "Macaé", "Cabo Frio", "Campos", "Vitória"],
  comoFunciona: [
    { titulo: "Você envia a necessidade", texto: "Número de hóspedes, datas, cidade e se precisa de sala de evento ou traslado." },
    { titulo: "Montamos a proposta", texto: "Retornamos com opções de hotel, tarifa corporativa e condições de faturamento." },
    { titulo: "Sua equipe viaja tranquila", texto: "Suporte durante a estadia e nota fiscal centralizada no fechamento do mês." },
  ],
  orcamentoTitulo: "Solicitar tarifa corporativa",
  orcamentoTexto: "Conte um pouco sobre a necessidade da sua empresa e retornamos com uma proposta.",
  hoteisIntro: "Conheça os hotéis parceiros da RedBlue Hotels.",
  telefone: "(21) 99146-0788",
  email: "reservas@redbluehotels.com.br",
  footerTagline: "Agenciamento de hospedagem e traslado no mundo corporativo.",
};

// Le o conteudo do banco; se ainda nao existir, devolve o padrao (nao quebra o site antes do seed rodar)
export async function GET() {
  const registro = await prisma.siteConteudo.findUnique({ where: { id: 1 } });

  if (!registro) {
    return NextResponse.json(PADRAO);
  }

  return NextResponse.json({
    ...registro,
    cobertura: JSON.parse(registro.cobertura || "[]"),
    comoFunciona: JSON.parse(registro.comoFunciona || "[]"),
  });
}

// Salva o conteudo (protegido pelo middleware — so admin logado pode chamar)
export async function PUT(request) {
  const body = await request.json();

  const {
    heroEyebrow,
    heroTitulo,
    heroTexto,
    cobertura,
    comoFunciona,
    orcamentoTitulo,
    orcamentoTexto,
    hoteisIntro,
    telefone,
    email,
    footerTagline,
  } = body;

  const registro = await prisma.siteConteudo.upsert({
    where: { id: 1 },
    update: {
      heroEyebrow,
      heroTitulo,
      heroTexto,
      cobertura: JSON.stringify(cobertura || []),
      comoFunciona: JSON.stringify(comoFunciona || []),
      orcamentoTitulo,
      orcamentoTexto,
      hoteisIntro,
      telefone,
      email,
      footerTagline,
    },
    create: {
      id: 1,
      heroEyebrow,
      heroTitulo,
      heroTexto,
      cobertura: JSON.stringify(cobertura || []),
      comoFunciona: JSON.stringify(comoFunciona || []),
      orcamentoTitulo,
      orcamentoTexto,
      hoteisIntro,
      telefone,
      email,
      footerTagline,
    },
  });

  return NextResponse.json(registro);
}
