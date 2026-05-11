import "./globals.css";
import { Providers } from "./Providers";

export const metadata = {
  title: "ODIN",
  description: "Open Document Infrastructure Network"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}