import "./globals.css";
import { Providers } from "./Providers";

export const metadata = {
  title: {
    default: "ODIN — Open Document Infrastructure Network",
    template: "%s | ODIN",
  },
  description: "Open Document Infrastructure Network — Gere documentos profissionais e jurídicos a partir de modelos reutilizáveis via API.",
  keywords: "documentos, documentos jurídicos, automação documental, templates, API, odin",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/icon-192x192.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ODIN",
  },
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
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, maximum-scale=1.0, user-scalable=no" />
        <meta name="theme-color" content="#0f172a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body>
        <Providers>
          <Navbar />
          <main className="page-enter">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
