"use client";

import { HeroSection } from "./sections/HeroSection";
import { DiagnosisSection } from "./sections/DiagnosisSection";
import { PartnershipSection } from "./sections/PartnershipSection";
import { Footer } from "./sections/Footer";

interface HeroMobileProps {
  isLogin: boolean;
}

export const HeroMobile = ({ isLogin }: HeroMobileProps) => {
  return (
    <>
      {/* 모바일용 일반 스크롤 레이아웃 */}

      <HeroSection />

      <DiagnosisSection isLogin={isLogin} />

      <PartnershipSection />

      <Footer />
    </>
  );
};
