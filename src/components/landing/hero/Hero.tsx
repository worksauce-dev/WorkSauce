"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { HeroSection } from "./sections/HeroSection";
import { DiagnosisSection } from "./sections/DiagnosisSection";
import { PartnershipSection } from "./sections/PartnershipSection";
import { Footer } from "./sections/Footer";
import { SectionIndicator } from "./SectionIndicator";

interface HeroProps {
  isLogin: boolean;
}

export const Hero = ({ isLogin }: HeroProps) => {
  // 현재 활성화된 섹션 인덱스 상태
  const [activeSection, setActiveSection] = useState<number>(0);

  // 섹션 수
  const sectionCount = 4;

  // 컨테이너 참조
  const containerRef = useRef<HTMLDivElement>(null);

  // 섹션 높이 (vh 단위)
  const sectionHeight = 100;

  // 모바일 여부 확인
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // 스크롤 잠금 상태
  const [isScrollLocked, setIsScrollLocked] = useState<boolean>(false);

  // 마지막 스크롤 시간
  const lastScrollTimeRef = useRef<number>(0);

  // 스크롤 쿨다운 시간 (밀리초)
  const scrollCooldown = 1000; // 1초

  // 화면 크기 감지
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // 초기 체크
    checkMobile();

    // 리사이즈 이벤트 리스너
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // 섹션 전환 함수
  const goToSection = useCallback(
    (index: number) => {
      if (index < 0 || index >= sectionCount) return;
      if (isScrollLocked) return;

      setIsScrollLocked(true);
      setActiveSection(index);

      if (containerRef.current) {
        containerRef.current.style.transform = `translateY(-${
          index * sectionHeight
        }vh)`;
      }

      setTimeout(() => {
        setIsScrollLocked(false);
      }, scrollCooldown);
    },
    [isScrollLocked, sectionCount, sectionHeight, scrollCooldown]
  );

  // 휠 이벤트 처리
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      // 스크롤 잠금 상태면 무시
      if (isScrollLocked) return;

      // 현재 시간
      const now = Date.now();

      // 마지막 스크롤 후 쿨다운 시간이 지나지 않았으면 무시
      if (now - lastScrollTimeRef.current < scrollCooldown) return;

      // 마지막 스크롤 시간 업데이트
      lastScrollTimeRef.current = now;

      // 스크롤 방향에 따라 다음/이전 섹션으로 이동
      if (e.deltaY > 0) {
        // 아래로 스크롤
        goToSection(Math.min(activeSection + 1, sectionCount - 1));
      } else {
        // 위로 스크롤
        goToSection(Math.max(activeSection - 1, 0));
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel);
      }
    };
  }, [activeSection, isScrollLocked, goToSection]);

  // 터치 이벤트 처리
  useEffect(() => {
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      // 스크롤 잠금 상태면 무시
      if (isScrollLocked) return;

      // 현재 시간
      const now = Date.now();

      // 마지막 스크롤 후 쿨다운 시간이 지나지 않았으면 무시
      if (now - lastScrollTimeRef.current < scrollCooldown) return;

      // 마지막 스크롤 시간 업데이트
      lastScrollTimeRef.current = now;

      const touchEndY = e.changedTouches[0].clientY;
      const diff = touchStartY - touchEndY;

      // 위로 스와이프 (diff > 0)
      if (diff > 50) {
        goToSection(Math.min(activeSection + 1, sectionCount - 1));
      }
      // 아래로 스와이프 (diff < 0)
      else if (diff < -50) {
        goToSection(Math.max(activeSection - 1, 0));
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("touchstart", handleTouchStart);
      container.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      if (container) {
        container.removeEventListener("touchstart", handleTouchStart);
        container.removeEventListener("touchend", handleTouchEnd);
      }
    };
  }, [activeSection, isScrollLocked, goToSection]);

  // 키보드 이벤트 처리
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        goToSection(Math.min(activeSection + 1, sectionCount - 1));
      } else if (e.key === "ArrowUp") {
        goToSection(Math.max(activeSection - 1, 0));
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeSection, goToSection]);

  return (
    <div className="relative overflow-hidden h-screen">
      <div
        ref={containerRef}
        className="w-full transition-transform duration-1000 ease-in-out"
        style={{
          height: `${sectionCount * 100}vh`,
          transform: `translateY(-${activeSection * sectionHeight}vh)`,
        }}
      >
        {/* 첫 번째 섹션 - 히어로 섹션 */}
        <HeroSection />

        {/* 두 번째 섹션 - 자가진단 섹션 */}
        <DiagnosisSection isLogin={isLogin} />

        {/* 세 번째 섹션 - 기능 소개 섹션 */}
        <PartnershipSection />

        {/* 네 번째 섹션 - CTA 섹션과 푸터 */}
        <Footer />
      </div>

      {/* 섹션 인디케이터 */}
      <SectionIndicator
        activeSection={activeSection}
        sectionCount={sectionCount}
        goToSection={goToSection}
        isMobile={isMobile}
      />
    </div>
  );
};
