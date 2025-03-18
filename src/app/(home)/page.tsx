import { Hero } from "@/components/landing/hero/Hero";
import { HeroMobile } from "@/components/landing/hero/HeroMobile";
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
      <div className="sm:hidden flex flex-col ">
        <HeroMobile isLogin={isLogin} />
      </div>

      <div className="hidden sm:block">
        <Hero isLogin={isLogin} />
      </div>
    </>
  );
}
