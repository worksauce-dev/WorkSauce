import { Hero } from "@/components/landing/hero/Hero";
import { Metadata } from "next";
import { getServerSession } from "next-auth";

export const metadata: Metadata = {
  title: "워크소스",
};

export default async function Home() {
  const session = await getServerSession();
  let isLogin = false;

  if (session) {
    isLogin = true;
  }

  return (
    <>
      <Hero isLogin={isLogin} />
    </>
  );
}
