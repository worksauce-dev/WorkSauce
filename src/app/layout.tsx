import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/landing/header/Header";
import { Footer } from "@/components/landing/footer/Footer";

const notoSans = Noto_Sans_KR({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "워크소스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${notoSans.className} bg-white text-primary-gray `}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
