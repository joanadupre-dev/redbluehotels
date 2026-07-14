const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Fotos temporarias de banco de imagens (Unsplash) so para a revisao visual.
// A Simone troca cada uma pelas fotos reais no painel administrativo.
const FOTO = {
  lagune: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80",
  vogue: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&q=80",
  copa: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80",
  regency: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=1200&q=80",
  benidorm: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&q=80",
  granada: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200&q=80",
  golden: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&q=80",
  riosol: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&q=80",
  alameda: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&q=80",
  offshore: "https://images.unsplash.com/photo-1518623489648-a173ef7824f3?w=1600&q=80",
  eventos: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&q=80",
  empresas: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1600&q=80",
};

const FRASE_CURTA = "Frase em destaque do hotel — edite este texto no painel administrativo.";
const DESC_LONGA =
  "Descrição completa do hotel — edite este texto no painel administrativo para contar mais sobre a estrutura, os diferenciais e o que torna esse hotel uma boa opção para hospedagem corporativa.";

async function main() {
  const hoteis = [
    { slug: "lagune-barra-hotel", nome: "Lagune Barra Hotel", cidade: "RJ/Barra da Tijuca", estado: "RJ", estrelas: 4, categoria: "Cidade", endereco: "Barra da Tijuca, Rio de Janeiro - RJ", fraseDestaque: FRASE_CURTA, descricao: DESC_LONGA, comodidades: JSON.stringify(["Traslado", "Sala de eventos"]), imagens: JSON.stringify([FOTO.lagune]), aceitaEventos: true, temTraslado: true, destaque: true },
    { slug: "vogue-square-design-hotel", nome: "Vogue Square Design Hotel", cidade: "RJ/Barra da Tijuca", estado: "RJ", estrelas: 4, categoria: "Cidade", endereco: "Barra da Tijuca, Rio de Janeiro - RJ", fraseDestaque: FRASE_CURTA, descricao: DESC_LONGA, comodidades: JSON.stringify(["Academia", "Entretenimento"]), imagens: JSON.stringify([FOTO.vogue]), aceitaEventos: false, temTraslado: false, destaque: true },
    { slug: "americas-copacabana", nome: "Américas Copacabana", cidade: "RJ/Copacabana", estado: "RJ", estrelas: 4, categoria: "Praia", endereco: "Copacabana, Rio de Janeiro - RJ", fraseDestaque: FRASE_CURTA, descricao: DESC_LONGA, comodidades: JSON.stringify(["Traslado", "Academia"]), imagens: JSON.stringify([FOTO.copa]), aceitaEventos: false, temTraslado: true, destaque: true },
    { slug: "regency-park-hotel", nome: "Regency Park Hotel", cidade: "RJ/Copacabana", estado: "RJ", estrelas: 4, categoria: "Praia", endereco: "Leme, Rio de Janeiro - RJ", fraseDestaque: FRASE_CURTA, descricao: DESC_LONGA, comodidades: JSON.stringify(["Sala de eventos"]), imagens: JSON.stringify([FOTO.regency]), aceitaEventos: true, temTraslado: false, destaque: true },
    { slug: "americas-benidorm", nome: "Américas Benidorm", cidade: "RJ/Copacabana", estado: "RJ", estrelas: 3, categoria: "Praia", endereco: "Copacabana, Rio de Janeiro - RJ", fraseDestaque: FRASE_CURTA, descricao: DESC_LONGA, comodidades: JSON.stringify(["Traslado"]), imagens: JSON.stringify([FOTO.benidorm]), aceitaEventos: false, temTraslado: true, destaque: false },
    { slug: "americas-granada", nome: "Américas Granada", cidade: "RJ/Centro da Cidade", estado: "RJ", estrelas: 4, categoria: "Cidade", endereco: "Centro, Rio de Janeiro - RJ", fraseDestaque: FRASE_CURTA, descricao: DESC_LONGA, comodidades: JSON.stringify(["Sala de eventos"]), imagens: JSON.stringify([FOTO.granada]), aceitaEventos: true, temTraslado: false, destaque: false },
    { slug: "golden-towers", nome: "Golden Towers Hotel", cidade: "Macaé", estado: "RJ", estrelas: 4, categoria: "Praia", endereco: "Rua Vereador Juarez Halheiros Chaloub, 371 - Macaé", fraseDestaque: FRASE_CURTA, descricao: DESC_LONGA, comodidades: JSON.stringify(["Traslado", "Academia"]), imagens: JSON.stringify([FOTO.golden]), aceitaEventos: false, temTraslado: true, destaque: true },
    { slug: "pousada-rio-sol", nome: "Pousada Rio Sol", cidade: "Porto do Açu / São João da Barra", estado: "RJ", estrelas: 3, categoria: "Praia", endereco: "Atafona, São João da Barra - RJ", fraseDestaque: FRASE_CURTA, descricao: DESC_LONGA, comodidades: JSON.stringify(["Traslado"]), imagens: JSON.stringify([FOTO.riosol]), aceitaEventos: false, temTraslado: true, destaque: false },
    { slug: "alameda-vitoria", nome: "Alameda Vitória", cidade: "Vitória", estado: "ES", estrelas: 4, categoria: "Cidade", endereco: "Vitória - ES", fraseDestaque: FRASE_CURTA, descricao: DESC_LONGA, comodidades: JSON.stringify(["Entretenimento"]), imagens: JSON.stringify([FOTO.alameda]), aceitaEventos: false, temTraslado: false, destaque: false },
  ];

  // Nao remove hoteis fora dessa lista: a Simone pode ja ter cadastrado
  // outros pelo painel, e o seed nunca deve apagar nada que ela criou.

  for (const hotel of hoteis) {
    await prisma.hotel.upsert({
      where: { slug: hotel.slug },
      // Nunca sobrescreve um hotel que ja existe — tudo que a Simone editar
      // no painel (fotos, endereco, frase, descricao, comodidades, etc.)
      // fica intacto, mesmo rodando o seed de novo no futuro.
      update: {},
      create: hotel,
    });
  }

  await prisma.siteConteudo.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      heroEyebrow: "Agenciamento de hospedagem corporativa",
      heroTitulo: "Hotéis para viagens e eventos empresariais, com tarifa negociada e traslado.",
      heroTexto:
        "Representamos uma seleção de hotéis para empresas que buscam acomodações para eventos corporativos e viagens empresariais.",
      destaquesFrase: "Selecionamos hotéis com localização privilegiada e facilidades para sua estadia corporativa.",
      cobertura: JSON.stringify(["RJ/Barra da Tijuca", "RJ/Copacabana", "RJ/Centro da Cidade", "Macaé", "Porto do Açu / São João da Barra", "Vitória"]),
      comoFunciona: JSON.stringify([
        { titulo: "Você envia a necessidade", texto: "Número de hóspedes, datas, cidade e se precisa de sala de evento ou traslado." },
        { titulo: "Montamos a proposta", texto: "Retornamos com opções de hotel, tarifa corporativa e condições de faturamento." },
        { titulo: "Sua equipe viaja tranquila", texto: "Suporte durante a estadia e nota fiscal centralizada no fechamento do mês." },
      ]),
      orcamentoTitulo: "Solicitar tarifa corporativa",
      orcamentoTexto:
        "Conte um pouco sobre a necessidade da sua empresa — hospedagem de equipe, evento corporativo ou traslado — e retornamos com uma proposta.",
      hoteisIntro:
        "Cada hotel abaixo foi selecionado a dedo para atender empresas que buscam hospedagem ou espaços para eventos corporativos em todo o país. Com parcerias que já duram mais de dez anos, garantimos conforto, praticidade e qualidade aos seus colaboradores.",
      hoteisBannerFoto: FOTO.regency,
      hoteisBannerFrase: "Hospedagem pensada para o público corporativo",
      instalacoesTitulo: "Instalações dos hotéis parceiros",
      instalacoesTexto:
        "Além da hospedagem, os hotéis parceiros da RedBlue Hotels oferecem estrutura pensada para viagens e eventos corporativos — da gastronomia às salas de conferência. A disponibilidade de cada item varia por hotel; confira o que cada um oferece na página de detalhes.",
      instalacoes: JSON.stringify([
        { icone: "🍽️", titulo: "Restaurante", texto: "Gastronomia requintada em cada hotel parceiro, com menus personalizados para eventos corporativos e reuniões." },
        { icone: "☕", titulo: "Café da manhã diferenciado", texto: "Café da manhã em horário diferenciado para atender o público Off-Shore, garantindo boa alimentação antes do embarque." },
        { icone: "🏊", titulo: "Área de lazer com piscina", texto: "Momentos de relaxamento depois de um dia produtivo de reuniões ou evento." },
        { icone: "🏋️", titulo: "Área fitness", texto: "Academias bem equipadas para manter a rotina de exercícios mesmo em viagem a trabalho." },
        { icone: "🖥️", titulo: "Salas de conferência", texto: "Infraestrutura completa para eventos corporativos, com equipamentos audiovisuais e layout versátil." },
        { icone: "📶", titulo: "Wi-Fi rápido e TV a cabo", texto: "Conexão estável para apresentações corporativas e entretenimento." },
        { icone: "🛎️", titulo: "Serviço de quarto", texto: "Atendimento impecável a qualquer hora, sem burocracia." },
        { icone: "🔒", titulo: "Segurança para eventos", texto: "Estrutura pensada para receber grupos com tranquilidade." },
      ]),
      hoteisCtaTitulo: "Não encontrou o hotel ideal?",
      hoteisCtaTexto: "Conte pra gente o que sua empresa precisa e retornamos com uma proposta de tarifa corporativa.",
      sobreHeroEyebrow: "Sobre a RedBlue Hotels",
      sobreHeroTitulo:
        "Soluções personalizadas para empresas que procuram acomodações para seus eventos e viagens de negócios.",
      sobreQuemSomosTitulo: "Quem somos",
      sobreQuemSomosTexto:
        "Representando uma cuidadosa seleção de hotéis de alta qualidade em todo o país, estamos comprometidos em oferecer a melhor experiência aos seus colaboradores durante suas estadias. Com anos de experiência no setor, compreendemos a importância de cada detalhe para o sucesso de um evento corporativo.",
      sobreContadores: JSON.stringify([
        { numero: 10, titulo: "Anos de Experiência", sub: "Especializada em Offshore" },
        { numero: 240, titulo: "Eventos Realizados", sub: "Eventos Corporativos" },
        { numero: 500000, titulo: "Clientes Satisfeitos", sub: "Hospedagens Realizadas" },
      ]),
      sobrePilaresTitulo: "Por que confiar na RedBlue",
      sobrePilares: JSON.stringify([
        { titulo: "Suporte rápido", texto: "Estamos sempre prontos para ajudar e responder às suas necessidades com rapidez." },
        { titulo: "Atendimento personalizado", texto: "Suporte dedicado para garantir que suas preocupações sejam atendidas da melhor maneira." },
        { titulo: "Respostas em tempo hábil", texto: "Você recebe as respostas que precisa dentro do prazo necessário." },
        { titulo: "Compromisso com a satisfação", texto: "Nos empenhamos para que sua experiência seja satisfatória e tranquila." },
      ]),
      sobreListaTitulo: "Hotéis que confiam na gente",
      sobreCtaTitulo: "Pronto para simplificar a hospedagem da sua equipe?",
      sobreCtaTexto: "Conheça os hotéis parceiros ou solicite uma tarifa corporativa agora mesmo.",
      telefone: "(21) 99146-0788",
      email: "reservas@redbluehotels.com.br",
      footerTagline: "Agenciamento de hospedagem e traslado no mundo corporativo.",
    },
  });

  // Slides do banner da HOME - so criados se ainda nao existir nenhum,
  // para nao duplicar nem sobrescrever o que a Simone ja tiver montado.
  const jaTemHome = await prisma.bannerSlide.count({ where: { local: "home" } });
  if (jaTemHome === 0) {
    await prisma.bannerSlide.createMany({
      data: [
        {
          local: "home",
          ordem: 0,
          foto: FOTO.golden,
          legenda: "Golden Towers Hotel, Macaé",
          frase: "Hotéis próximos aos portos e aeroportos para viagens e eventos empresariais, com tarifa negociada e traslado.",
        },
        {
          local: "home",
          ordem: 1,
          foto: FOTO.lagune,
          legenda: "Lagune Barra Hotel, Barra da Tijuca",
          frase: "Na RedBlue Hotels, selecionamos, negociamos e organizamos a sua estadia, do check-in ao check-out.",
        },
        {
          local: "home",
          ordem: 2,
          foto: FOTO.copa,
          legenda: "Américas Copacabana, Copacabana",
          frase: "Somos especialistas no público Off-Shore, conte com nossa assessoria exclusiva para seu planejamento corporativo.",
        },
      ],
    });
  }

  // Slides do carrossel do SOBRE (Para empresas / Off-Shore / Eventos)
  const jaTemSobre = await prisma.bannerSlide.count({ where: { local: "sobre" } });
  if (jaTemSobre === 0) {
    await prisma.bannerSlide.createMany({
      data: [
        {
          local: "sobre",
          ordem: 0,
          foto: FOTO.empresas,
          tag: "Para empresas",
          titulo: "Hospedagem para viagens corporativas",
          texto: "Tarifa corporativa negociada, traslado e suporte para hospedagem de equipe — do orçamento ao check-out, com uma única nota fiscal no fim do mês.",
        },
        {
          local: "sobre",
          ordem: 1,
          foto: FOTO.offshore,
          tag: "Off-Shore",
          titulo: "Especialistas em tripulação offshore",
          texto: "Hotéis próximos aos portos e aeroportos, com café da manhã em horário diferenciado e estrutura pensada para o embarque e desembarque de tripulações.",
        },
        {
          local: "sobre",
          ordem: 2,
          foto: FOTO.eventos,
          tag: "Eventos e treinamentos",
          titulo: "Espaços para eventos corporativos",
          texto: "Salas de conferência e infraestrutura completa para treinamentos, reuniões e eventos empresariais, com apoio na organização de ponta a ponta.",
        },
      ],
    });
  }

  console.log("Seed concluido.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
