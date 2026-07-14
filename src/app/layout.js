import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata = {
  title: {
    default: "RedBlue Hotels | Hospedagem e traslado para eventos corporativos",
    template: "%s | RedBlue Hotels",
  },
  description:
    "Agência de agenciamento de hospedagem e traslado no mundo corporativo. Hotéis parceiros em Barra da Tijuca, Copacabana, Centro, Macaé, Cabo Frio, Campos e Vitória, com tarifa negociada para empresas.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
