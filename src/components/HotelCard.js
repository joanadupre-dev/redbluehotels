import Link from "next/link";
import Image from "next/image";

export default function HotelCard({ hotel }) {
  const capa = hotel.imagens?.[0] || null;

  return (
    <Link
      href={`/hoteis/${hotel.slug}`}
      className="group block overflow-hidden rounded-2xl border border-navy-900/10 bg-white hover:shadow-xl transition-shadow"
    >
      <div className="relative h-48 w-full overflow-hidden bg-navy-100">
        {capa ? (
          <Image
            src={capa}
            alt={hotel.nome}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-navy-800 to-navy-950 flex items-center justify-center">
            <span className="text-white/40 text-sm">Foto em breve</span>
          </div>
        )}
      </div>
      <div className="p-5">
        <p className="text-xs uppercase tracking-wide text-brick-500 font-medium mb-1">
          {hotel.cidade} · {hotel.categoria}
        </p>
        <h3 className="font-display text-lg font-600 mb-1">{hotel.nome}</h3>
        <p className="text-sm text-ink/70 mb-2">{"★".repeat(hotel.estrelas)}</p>
        {(hotel.aceitaEventos || hotel.temTraslado) && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {hotel.aceitaEventos && (
              <span className="text-[11px] font-medium bg-navy-900/5 text-ink/70 px-2 py-0.5 rounded-full">
                Sala de eventos
              </span>
            )}
            {hotel.temTraslado && (
              <span className="text-[11px] font-medium bg-navy-900/5 text-ink/70 px-2 py-0.5 rounded-full">
                Traslado disponível
              </span>
            )}
          </div>
        )}
        <p className="text-sm text-ink/70 line-clamp-2">{hotel.fraseDestaque || hotel.descricao}</p>
      </div>
    </Link>
  );
}
