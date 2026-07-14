import { prisma } from "@/lib/prisma";

const PADRAO = {
  heroEyebrow: "Agenciamento de hospedagem corporativa",
  heroTitulo:
    "Hotéis para viagens e eventos empresariais, com tarifa negociada e traslado.",
  heroTexto:
    "Representamos uma seleção de hotéis para empresas que buscam acomodações para eventos corporativos e viagens empresariais.",
  destaquesFrase: "Selecionamos hotéis com localização privilegiada e facilidades para sua estadia corporativa.",
  cobertura: ["RJ/Barra da Tijuca", "RJ/Copacabana", "RJ/Centro da Cidade", "Macaé", "Porto do Açu / São João da Barra", "Vitória"],
  comoFunciona: [
    { titulo: "Você envia a necessidade", texto: "Número de hóspedes, datas, cidade e se precisa de sala de evento ou traslado." },
    { titulo: "Montamos a proposta", texto: "Retornamos com opções de hotel, tarifa corporativa e condições de faturamento." },
    { titulo: "Sua equipe viaja tranquila", texto: "Suporte durante a estadia e nota fiscal centralizada no fechamento do mês." },
  ],
  orcamentoTitulo: "Solicitar tarifa corporativa",
  orcamentoTexto:
    "Conte um pouco sobre a necessidade da sua empresa — hospedagem de equipe, evento corporativo ou traslado — e retornamos com uma proposta.",
  hoteisIntro:
    "Cada hotel abaixo foi selecionado a dedo para atender empresas que buscam hospedagem ou espaços para eventos corporativos em todo o país. Com parcerias que já duram mais de dez anos, garantimos conforto, praticidade e qualidade aos seus colaboradores.",
  hoteisBannerFoto: "",
  hoteisBannerFrase: "Hospedagem pensada para o público corporativo",
  instalacoesTitulo: "Instalações dos hotéis parceiros",
  instalacoesTexto:
    "Além da hospedagem, os hotéis parceiros da RedBlue Hotels oferecem estrutura pensada para viagens e eventos corporativos — da gastronomia às salas de conferência. A disponibilidade de cada item varia por hotel; confira o que cada um oferece na página de detalhes.",
  instalacoes: [
    { icone: "🍽️", titulo: "Restaurante", texto: "Gastronomia requintada em cada hotel parceiro, com menus personalizados para eventos corporativos e reuniões." },
    { icone: "☕", titulo: "Café da manhã diferenciado", texto: "Café da manhã em horário diferenciado para atender o público Off-Shore, garantindo boa alimentação antes do embarque." },
    { icone: "🏊", titulo: "Área de lazer com piscina", texto: "Momentos de relaxamento depois de um dia produtivo de reuniões ou evento." },
    { icone: "🏋️", titulo: "Área fitness", texto: "Academias bem equipadas para manter a rotina de exercícios mesmo em viagem a trabalho." },
    { icone: "🖥️", titulo: "Salas de conferência", texto: "Infraestrutura completa para eventos corporativos, com equipamentos audiovisuais e layout versátil." },
    { icone: "📶", titulo: "Wi-Fi rápido e TV a cabo", texto: "Conexão estável para apresentações corporativas e entretenimento." },
    { icone: "🛎️", titulo: "Serviço de quarto", texto: "Atendimento impecável a qualquer hora, sem burocracia." },
    { icone: "🔒", titulo: "Segurança para eventos", texto: "Estrutura pensada para receber grupos com tranquilidade." },
  ],
  hoteisCtaTitulo: "Não encontrou o hotel ideal?",
  hoteisCtaTexto: "Conte pra gente o que sua empresa precisa e retornamos com uma proposta de tarifa corporativa.",
  sobreHeroEyebrow: "Sobre a RedBlue Hotels",
  sobreHeroTitulo:
    "Soluções personalizadas para empresas que procuram acomodações para seus eventos e viagens de negócios.",
  sobreQuemSomosTitulo: "Quem somos",
  sobreQuemSomosTexto:
    "Representando uma cuidadosa seleção de hotéis de alta qualidade em todo o país, estamos comprometidos em oferecer a melhor experiência aos seus colaboradores durante suas estadias. Com anos de experiência no setor, compreendemos a importância de cada detalhe para o sucesso de um evento corporativo.",
  sobreContadores: [
    { numero: 10, titulo: "Anos de Experiência", sub: "Especializada em Offshore" },
    { numero: 240, titulo: "Eventos Realizados", sub: "Eventos Corporativos" },
    { numero: 500000, titulo: "Clientes Satisfeitos", sub: "Hospedagens Realizadas" },
  ],
  sobrePilaresTitulo: "Por que confiar na RedBlue",
  sobrePilares: [
    { titulo: "Suporte rápido", texto: "Estamos sempre prontos para ajudar e responder às suas necessidades com rapidez." },
    { titulo: "Atendimento personalizado", texto: "Suporte dedicado para garantir que suas preocupações sejam atendidas da melhor maneira." },
    { titulo: "Respostas em tempo hábil", texto: "Você recebe as respostas que precisa dentro do prazo necessário." },
    { titulo: "Compromisso com a satisfação", texto: "Nos empenhamos para que sua experiência seja satisfatória e tranquila." },
  ],
  sobreListaTitulo: "Hotéis que confiam na gente",
  sobreCtaTitulo: "Pronto para simplificar a hospedagem da sua equipe?",
  sobreCtaTexto: "Conheça os hotéis parceiros ou solicite uma tarifa corporativa agora mesmo.",
  telefone: "(21) 99146-0788",
  email: "reservas@redbluehotels.com.br",
  footerTagline: "Agenciamento de hospedagem e traslado no mundo corporativo.",
};

function parseJsonOuPadrao(valor, padrao) {
  if (!valor) return padrao;
  try {
    const parsed = JSON.parse(valor);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : padrao;
  } catch {
    return padrao;
  }
}

// Busca o conteudo editavel do site. Se a tabela ainda nao tiver sido
// criada/populada (ex: banco recem-configurado), cai nos valores padrao
// para o site nunca quebrar por falta de conteudo.
export async function getSiteConteudo() {
  try {
    const registro = await prisma.siteConteudo.findUnique({ where: { id: 1 } });
    if (!registro) return PADRAO;
    return {
      ...registro,
      destaquesFrase: registro.destaquesFrase || PADRAO.destaquesFrase,
      hoteisBannerFoto: registro.hoteisBannerFoto || "",
      hoteisBannerFrase: registro.hoteisBannerFrase || PADRAO.hoteisBannerFrase,
      cobertura: JSON.parse(registro.cobertura || "[]"),
      comoFunciona: JSON.parse(registro.comoFunciona || "[]"),
      instalacoesTitulo: registro.instalacoesTitulo || PADRAO.instalacoesTitulo,
      instalacoesTexto: registro.instalacoesTexto || PADRAO.instalacoesTexto,
      instalacoes: parseJsonOuPadrao(registro.instalacoes, PADRAO.instalacoes),
      hoteisCtaTitulo: registro.hoteisCtaTitulo || PADRAO.hoteisCtaTitulo,
      hoteisCtaTexto: registro.hoteisCtaTexto || PADRAO.hoteisCtaTexto,
      sobreHeroEyebrow: registro.sobreHeroEyebrow || PADRAO.sobreHeroEyebrow,
      sobreHeroTitulo: registro.sobreHeroTitulo || PADRAO.sobreHeroTitulo,
      sobreQuemSomosTitulo: registro.sobreQuemSomosTitulo || PADRAO.sobreQuemSomosTitulo,
      sobreQuemSomosTexto: registro.sobreQuemSomosTexto || PADRAO.sobreQuemSomosTexto,
      sobreContadores: parseJsonOuPadrao(registro.sobreContadores, PADRAO.sobreContadores),
      sobrePilaresTitulo: registro.sobrePilaresTitulo || PADRAO.sobrePilaresTitulo,
      sobrePilares: parseJsonOuPadrao(registro.sobrePilares, PADRAO.sobrePilares),
      sobreListaTitulo: registro.sobreListaTitulo || PADRAO.sobreListaTitulo,
      sobreCtaTitulo: registro.sobreCtaTitulo || PADRAO.sobreCtaTitulo,
      sobreCtaTexto: registro.sobreCtaTexto || PADRAO.sobreCtaTexto,
    };
  } catch {
    return PADRAO;
  }
}

// Busca os slides de banner de um "local" especifico ("home" ou "sobre"),
// em ordem. Se nao houver nenhum ainda, retorna lista vazia (as paginas
// tratam esse caso mostrando um fundo em degrade no lugar da foto).
export async function getBannerSlides(local) {
  try {
    return await prisma.bannerSlide.findMany({
      where: { local },
      orderBy: { ordem: "asc" },
    });
  } catch {
    return [];
  }
}

export const SITE_CONTEUDO_PADRAO = PADRAO;
