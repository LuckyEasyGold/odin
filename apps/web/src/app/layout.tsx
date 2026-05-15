import "./globals.css";
import { Providers } from "./Providers";

export const metadata = {
  title: {
    default: "ODIN — Open Document Infrastructure Network",
    template: "%s | ODIN",
  },
  description: "Open Document Infrastructure Network — Gere documentos profissionais e jurídicos a partir de modelos reutilizáveis via API.",
  keywords: "documentos, documentos jurídicos, automação documental, templates, API, odin",
  openGraph: {
    title: "ODIN — Geração de Documentos Profissionais",
    description: "Plataforma open source para criar, validar e automatizar documentos profissionais via API.",
    type: "website",
    siteName: "ODIN",
  },
  twitter: {
    card: "summary_large_image",
    title: "ODIN — Geração de Documentos",
    description: "Automatize a geração de documentos profissionais com a API ODIN.",
  },
};

import Navbar from "@/components/Navbar";

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}