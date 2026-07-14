import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import HotelForm from "@/components/HotelForm";

export default async function EditarHotelPage({ params }) {
  const hotelRaw = await prisma.hotel.findUnique({ where: { id: Number(params.id) } });
  if (!hotelRaw) notFound();

  const hotel = {
    ...hotelRaw,
    comodidades: JSON.parse(hotelRaw.comodidades || "[]"),
    imagens: JSON.parse(hotelRaw.imagens || "[]"),
  };

  return (
    <section className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-display text-2xl font-700 mb-8">Editar {hotel.nome}</h1>
      <HotelForm hotel={hotel} />
    </section>
  );
}
