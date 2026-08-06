import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSiteConteudo, getBannerSlides } from "@/lib/siteContent";
import BannerHero from "@/components/BannerHero";
import HotelCarousel from "@/components/HotelCarousel";
import ComoFuncionaCarousel from "@/components/ComoFuncionaCarousel";
import OrcamentoForm from "@/components/OrcamentoForm";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [destaquesRaw, conteudo, bannerSlides, todosHoteis] = await Promise.all([
    prisma.hotel.findMany({
      where: { publicado: true, destaque: true },
      orderBy: { criadoEm: "desc" },
      take: 6,
    }),
    getSiteConteudo(),
    getBannerSlides("home"),
    prisma.hotel.findMany({
      where: { publicado: true },
      select: { nome: true, slug: true },
      orderBy: { nome: "asc" },
    }),
  ]);

  const hoteis = destaquesRaw.map((h) => ({
    ...h,
    comodidades: JSON.parse(h.comodidades || "[]"),
    imagens: JSON.parse(h.imagens || "[]
