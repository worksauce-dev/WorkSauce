import { Hero } from "@/components/landing/hero/Hero";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "워크소스",
  description: "우리 팀에 딱 맞는 지원자 유형",
};

export default function Home() {
  return (
    <>
      <Hero />
    </>
  );
}
