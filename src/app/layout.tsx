import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const pretendard = localFont({
  src: "../../public/fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
});

export const metadata: Metadata = {
  title: {
    template: "%s | 워크소스",
    default: "워크소스",
  },
  description: "인재 선발부터 조직 성장까지 HR 진단도구 솔루션",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <meta
          name="naver-site-verification"
          content="9af28a4c3ff8920f6f1ed0a4ef357358e2e748c9"
        />
      </head>
      <body
        className={`relative ${pretendard.variable} font-pretendard text-[#1C1C1E] font-normal`}
      >
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
