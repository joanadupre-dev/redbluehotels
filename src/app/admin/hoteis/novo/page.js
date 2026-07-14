import HotelForm from "@/components/HotelForm";

export default function NovoHotelPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-display text-2xl font-700 mb-8">Cadastrar novo hotel</h1>
      <HotelForm />
    </section>
  );
}
