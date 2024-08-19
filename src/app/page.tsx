import { Hero } from "@/components/landing/hero/Hero";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "워크소스",
  description: "",
};

export default function Home() {
  return <Hero />;
}
