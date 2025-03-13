import React from "react";

interface SectionIndicatorProps {
  activeSection: number;
  sectionCount: number;
  goToSection: (index: number) => void;
  isMobile: boolean;
}

export const SectionIndicator: React.FC<SectionIndicatorProps> = ({
  activeSection,
  sectionCount,
  goToSection,
  isMobile,
}) => {
  return (
    <div
      className={`fixed z-50 ${
        isMobile
          ? "bottom-6 left-1/2 transform -translate-x-1/2"
          : "right-6 top-1/2 transform -translate-y-1/2"
      }`}
    >
      <div
        className={`flex ${
          isMobile ? "flex-row space-x-4" : "flex-col space-y-4"
        }`}
      >
        {Array.from({ length: sectionCount }).map((_, index) => (
          <button
            key={index}
            onClick={() => goToSection(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              activeSection === index
                ? "bg-orange-500 scale-125"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`스크롤 섹션 ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
