import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import OrcamentoForm from "@/components/OrcamentoForm";
import HotelFotosCarousel from "@/components/HotelFotosCarousel";

export async function generateMetadata({ params }) {
  const hotel = await prisma.hotel.findUnique({ where: { slug: params.slug } });
  if (!hotel) return {};
  return {
    title: hotel.nome,
    description: hotel.descricao.slice(0, 155),
  };
}

export default async function HotelDetailPage({ params }) {
  const hotelRaw = await prisma.hotel.findUnique({ where: { slug: params.slug } });
  if (!hotelRaw || !hotelRaw.publicado) notFound();

  const hotel = {
    ...hotelRaw,
    comodidades: JSON.parse(hotelRaw.comodidades || "[]"),
    imagens: JSON.parse(hotelRaw.imagens || "[]"),
  };

  return (
    <article className="mx-auto max-w-6xl px-6 py-16">
      <p className="text-brick-500 font-medium uppercase text-sm tracking-wide mb-2">
        {hotel.cidade} · {hotel.estado}
      </p>
      <h1 className="font-display text-3xl sm:text-4xl font-700 mb-2">{hotel.nome}</h1>
      <p className="text-ink/70 mb-4">{"★".repeat(hotel.estrelas)} · {hotel.endereco}</p>

      {(hotel.aceitaEventos || hotel.temTraslado) && (
        <div className="flex flex-wrap gap-2 mb-8">
          {hotel.aceitaEventos && (
            <span className="text-xs font-medium bg-navy-900 text-sand px-3 py-1 rounded-full">
              Sala de eventos{hotel.capacidadeEventos ? ` · até ${hotel.capacidadeEventos} pessoas` : ""}
            </span>
          )}
          {hotel.temTraslado && (
            <span className="text-xs font-medium bg-navy-900 text-sand px-3 py-1 rounded-full">
              Traslado disponível
            </span>
          )}
        </div>
      )}

      <HotelFotosCarousel fotos={hotel.imagens} nome={hotel.nome} />

      <div className="grid sm:grid-cols-3 gap-10">
        <div className="sm:col-span-2">
          <h2 className="font-display text-xl font-600 mb-3">Sobre o hotel</h2>
          <p className="text-ink/80 leading-relaxed mb-8 whitespace-pre-line">
            {hotel.descricao}
          </p>

          {hotel.comodidades.length > 0 && (
            <>
              <h2 className="font-display text-xl font-600 mb-3">Comodidades</h2>
              <ul className="grid grid-cols-2 gap-2 text-sm text-ink/80">
                {hotel.comodidades.map((c, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-brick-500">✓</span> {c}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-navy-900/10 bg-white overflow-hidden">
            <div className="h-40 w-full bg-navy-100">
              <iframe
                title={`Mapa - ${hotel.nome}`}
                src={`https://www.google.com/maps?q=${encodeURIComponent(`${hotel.endereco}, ${hotel.cidade}`)}&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
              />
            </div>
            <div className="p-5">
              <h2 className="font-display text-base font-600 mb-1.5">Endereço</h2>
              <p className="text-sm text-ink/75 mb-3">{hotel.endereco}</p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${hotel.endereco}, ${hotel.cidade}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-sm font-medium text-brick-500 hover:underline"
              >
                Ver no Google Maps ↗
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-navy-900/10 bg-white p-6 sticky top-24">
            <h2 className="font-display text-lg font-600 mb-3">Pedir orçamento</h2>
            <OrcamentoForm hotelSlug={hotel.slug} hotelNome={hotel.nome} />
          </div>
        </div>
      </div>
    </article>
  );
}
