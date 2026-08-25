import type { Metadata } from "next";
import { Inter, Cinzel } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/shop/CartDrawer";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "YANTI TITANIUM | Преміальні прикраси для пірсингу з імплантаційного титану ASTM F-136",
  description: "Офіційний інтернет-магазин студійних титанових прикрас для пірсингу в Україні. Лабрети, клікери, топи з опалами та цирконами, банани та штанги. Гарантія стерильності.",
  keywords: ["титановий пірсинг", "титан ASTM F-136", "купити лабрет", "клікер для септума", "пірсинг україна", "YANTI TITANIUM"],
  openGraph: {
    title: "YANTI TITANIUM — Преміальні прикраси для пірсингу",
    description: "Імплантаційний титан ASTM F-136. Доставка Новою Поштою.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk" className={`${inter.variable} ${cinzel.variable}`}>
      <body className="bg-[#F8F9FA] text-slate-900 min-h-screen flex flex-col font-sans antialiased selection:bg-slate-900 selection:text-white">
        <Header />
        <main className="flex-1 bg-[#F8F9FA]">
          {children}
        </main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}
