import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}