import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Header } from "@/components/landing/header/Header";
import { Footer } from "@/components/landing/footer/Footer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { firestore } from "@/api/firebase/initFirebase";
import { doc, getDoc } from "firebase/firestore";

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
  const session = await getServerSession(authOptions);

  if (session) {
    const userRef = doc(firestore, "users", session?.user.id);
    const data = await getDoc(userRef);

    console.log(data.data());
  }

  return (
    <html lang="ko">
      <body
        className={`relative ${pretendard.variable} font-pretendard text-[#1C1C1E] font-normal`}
      >
        <Header session={session} />
        {children}
        <Footer />
      </body>
    </html>
  );
}
