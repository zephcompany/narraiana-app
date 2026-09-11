import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mapping Atelier · Narraiana Augusto",
  description: "Análise do olhar, estúdio de mapping e dossiê personalizado para suas clientes.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
