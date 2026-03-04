import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { CartProvider } from "./carrinho/provedor";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ValeFood • Marketplace",
  description: "Marketplace estilo delivery no padrão Fintex Dark",
  themeColor: "#011b3c",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.className}>
      <body style={{ margin: 0 }}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}