import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Header } from "@/components/landing/header/Header";
import { Footer } from "@/components/landing/footer/Footer";

const pretendard = localFont({
  src: "../../public/fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
});

export const metadata: Metadata = {
  title: {
    template: "%s | 워크소스",
    default: "워크소스",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`relative ${pretendard.variable} font-pretendard text-[#1C1C1E] font-normal`}
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
