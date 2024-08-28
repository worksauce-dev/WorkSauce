import { Footer } from "@/components/landing/footer/Footer";
import { Header } from "@/components/landing/header/Header";
import { Hero } from "@/components/landing/hero/Hero";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "워크소스",
  description: "",
};

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <Footer />
    </>
  );
}
