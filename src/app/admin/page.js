import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { LogoutButton, DeleteHotelButton } from "@/components/AdminActions";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const hoteis = await prisma.hotel.findMany({ orderBy: { criadoEm: "desc" } });

  return (
    <section className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl font-700">Hotéis cadastrados</h1>
        <div className="flex items-center gap-6">
          <Link
            href="/admin/hoteis/novo"
            className="rounded-full bg-navy-900 text-sand px-5 py-2 text-sm font-medium hover:bg-brick-500 transition-colors"
          >
            + Novo hotel
          </Link>
          <Link href="/admin/conteudo" className="text-sm text-ink/60 hover:text-brick-500">
            Conteúdo do site
          </Link>
          <Link href="/admin/banners" className="text-sm text-ink/60 hover:text-brick-500">
            Banners
          </Link>
          <Link href="/admin/senha" className="text-sm text-ink/60 hover:text-brick-500">
            Trocar senha
          </Link>
          <LogoutButton />
        </div>
      </div>

      {hoteis.length === 0 ? (
        <p className="text-ink/60">
          Nenhum hotel cadastrado ainda. Clique em "Novo hotel" para começar.
        </p>
      ) : (
        <div className="space-y-2.5">
          {hoteis.map((hotel) => {
            const imagens = JSON.parse(hotel.imagens || "[]");
            return (
              <div
                key={hotel.id}
                className="flex items-center gap-4 rounded-xl border border-navy-900/10 bg-white p-3.5"
              >
                {imagens[0] ? (
                  <img src={imagens[0]} alt="" className="h-14 w-14 rounded-lg object-cover shrink-0" />
                ) : (
                  <div className="h-14 w-14 rounded-lg bg-navy-900/5 shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold truncate">{hotel.nome}</h3>
                  <p className="text-xs text-ink/55">
                    {hotel.cidade} · {hotel.categoria} · {"★".repeat(hotel.estrelas)}
                  </p>
                </div>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${
                    hotel.publicado ? "bg-green-100 text-green-700" : "bg-navy-900/5 text-ink/50"
                  }`}
                >
                  {hotel.publicado ? "Publicado" : "Rascunho"}
                </span>
                <div className="flex gap-3 text-xs">
                  <Link href={`/admin/hoteis/${hotel.id}/editar`} className="font-semibold text-navy-900 hover:underline">
                    Editar
                  </Link>
                  <DeleteHotelButton id={hotel.id} nome={hotel.nome} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
