"use client";

import React, { useState } from "react";
import {
  MdPersonOutline,
  MdStars,
  MdMood,
  MdGroups,
  MdAssessment,
  MdPsychology,
  MdEmojiEvents,
  MdBusinessCenter,
} from "react-icons/md";
import { useRouter } from "next/navigation";
import { User } from "@/types/user";
import { IoGridOutline, IoListOutline } from "react-icons/io5";
import { IoSearchOutline } from "react-icons/io5";

interface TestSelectorProps {
  user: User;
}

interface TestCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  duration: string;
  questions: number;
  path: string;
  isReady: boolean;
  category: "recruitment" | "onboarding" | "development";
}

const testCards: TestCard[] = [
  {
    id: "sauce",
    title: "소스 테스트",
    description:
      "소스테스트는 지원자의 업무 스타일과 성향을 파악할 수 있는 진단도구입니다.",
    icon: <MdPersonOutline size={24} />,
    duration: "30분",
    questions: 190,
    path: "/sending-test/sauce",
    isReady: true,
    category: "recruitment",
  },
  {
    id: "cream",
    title: "크림 테스트",
    description:
      "직무 만족도, 성장 욕구, 워라밸을 진단하여 조직 개선 전략을 제시하는 진단도구입니다.",
    icon: <MdStars size={24} />,
    duration: "30분",
    questions: 50,
    path: "/sending-test/cream",
    isReady: false,
    category: "onboarding",
  },
  {
    id: "sugar",
    title: "슈가 테스트",
    description:
      "직무 스트레스를 5가지 주요 차원에서 측정하여 직장에서의 심리적, 정서적 상태를 진단하는 진단도구입니다.",
    icon: <MdMood size={24} />,
    duration: "45분",
    questions: 40,
    path: "/sending-test/sugar",
    isReady: false,
    category: "development",
  },
  {
    id: "blended",
    title: "블렌디드 테스트",
    description:
      "7가지 유형(BLENDED)을 기반으로 구성원들의 특성을 분석하여 최적의 팀워크와 시너지를 창출하는 방안을 제시하는 진단도구입니다.",
    icon: <MdGroups size={24} />,
    duration: "90분",
    questions: 30,
    path: "/sending-test/blended",
    isReady: false,
    category: "onboarding",
  },
  {
    id: "paste",
    title: "페이스트 테스트",
    description:
      "개인의 성과, 적응력, 사회성, 끈기, 전문성을 종합 평가하여 조직 내 최적의 역할과 성장 방향을 제시하는 진단도구입니다.",
    icon: <MdAssessment size={24} />,
    duration: "90분",
    questions: 30,
    path: "/sending-test/paste",
    isReady: false,
    category: "recruitment",
  },
  {
    id: "culinary",
    title: "컬리너리 테스트",
    description:
      "컬리너리 테스트는 여행과 같은 비일상적 상황에서의 행동과 판단을 통해, 개인의 적응력, 문제 해결 능력, 커뮤니케이션 능력, 스트레스 관리 능력을 다각도로 평가하는 진단 도구입니다",
    icon: <MdPsychology size={24} />,
    duration: "90분",
    questions: 30,
    path: "/sending-test/culinary",
    isReady: false,
    category: "development",
  },
  {
    id: "honey",
    title: "허니 테스트",
    description:
      "개인의 선호하는 보상 유형을 5가지(성장, 화합, 균형, 성과, 보상)로 분류하여 맞춤형 동기부여 전략을 제시하는 진단도구입니다.",
    icon: <MdEmojiEvents size={24} />,
    duration: "90분",
    questions: 30,
    path: "/sending-test/honey",
    isReady: false,
    category: "onboarding",
  },
  {
    id: "salt",
    title: "솔트 테스트",
    description: "조직몰입도&스트레스 균형 진단테스트 : 솔트테스트",
    icon: <MdBusinessCenter size={24} />,
    duration: "90분",
    questions: 30,
    path: "/sending-test/salt",
    isReady: false,
    category: "development",
  },
];

export const TestSelector: React.FC<TestSelectorProps> = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | "recruitment" | "onboarding" | "development"
  >("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const testsPerPage = 8;

  const handleCardClick = (card: TestCard) => {
    if (card.isReady) {
      router.push(card.path);
    }
  };

  const filteredTests = testCards.filter(
    card =>
      (selectedCategory === "all"
        ? true
        : card.category === selectedCategory) &&
      (searchTerm === ""
        ? true
        : card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          card.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const currentTests = filteredTests.slice(
    (currentPage - 1) * testsPerPage,
    currentPage * testsPerPage
  );

  const categories = [
    { id: "all", label: "전체" },
    { id: "recruitment", label: "채용 진단" },
    { id: "onboarding", label: "온보딩 진단" },
    { id: "development", label: "개발 진단" },
  ] as const;

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#F7F7F9] p-4 sm:p-6 lg:p-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 overflow-y-auto h-full scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {/* Search and View Toggle */}
        <div className="flex justify-between items-center mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="테스트 검색..."
              className="pl-10 pr-4 py-2 border rounded-lg"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded ${
                viewMode === "grid" ? "bg-gray-100" : ""
              }`}
            >
              <IoGridOutline />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded ${
                viewMode === "list" ? "bg-gray-100" : ""
              }`}
            >
              <IoListOutline />
            </button>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                ${
                  selectedCategory === category.id
                    ? "bg-[#FFF1E7] text-[#F97316] hover:bg-[#FFEDE3]"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }
              `}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Test Cards */}
        <div
          className={`
          ${
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
              : "flex flex-col gap-4"
          }
        `}
        >
          {currentTests.map(card => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card)}
              className={`
                bg-white rounded-lg p-4 shadow-sm
                transition-all duration-200 border border-gray-200 
                ${
                  card.isReady
                    ? "cursor-pointer hover:shadow-md hover:border-[#F97316]"
                    : "cursor-not-allowed opacity-75"
                }
                ${
                  viewMode === "grid"
                    ? "group relative flex flex-col min-h-[280px]"
                    : "flex flex-row items-center gap-4"
                }
              `}
            >
              {/* Grid View Content */}
              {viewMode === "grid" ? (
                <>
                  {!card.isReady && (
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        준비중
                      </span>
                    </div>
                  )}
                  <div className="flex-1">
                    <div
                      className={`w-14 h-14 rounded-full 
                      flex items-center justify-center mb-4 
                      ${
                        card.isReady
                          ? "bg-[#FFF1E7] group-hover:bg-[#FFEDE3]"
                          : "bg-gray-100"
                      }`}
                    >
                      <div
                        className={
                          card.isReady ? "text-[#F97316]" : "text-gray-400"
                        }
                      >
                        {card.icon}
                      </div>
                    </div>
                    <h3 className="text-base font-medium text-gray-900 mb-2">
                      {card.title}
                    </h3>
                    <p className="text-sm text-gray-500">{card.description}</p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mt-4">
                    <div className="flex items-center">
                      <span className="mr-1">⏱</span>
                      {card.duration}
                    </div>
                    <div className="flex items-center">
                      <span className="mr-1">📝</span>
                      {card.questions}문항
                    </div>
                  </div>
                </>
              ) : (
                /* List View Content */
                <>
                  <div
                    className={`w-14 h-14 rounded-full flex-shrink-0
                    flex items-center justify-center
                    ${
                      card.isReady
                        ? "bg-[#FFF1E7] group-hover:bg-[#FFEDE3]"
                        : "bg-gray-100"
                    }`}
                  >
                    <div
                      className={
                        card.isReady ? "text-[#F97316]" : "text-gray-400"
                      }
                    >
                      {card.icon}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-medium text-gray-900 mb-1">
                      {card.title}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {card.description}
                    </p>
                  </div>
                  <div className="flex-shrink-0 flex flex-col items-end gap-2">
                    {!card.isReady && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        준비중
                      </span>
                    )}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center">
                        <span className="mr-1">⏱</span>
                        {card.duration}
                      </div>
                      <div className="flex items-center">
                        <span className="mr-1">📝</span>
                        {card.questions}문항
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Pagination */}
        {filteredTests.length > testsPerPage && (
          <div className="flex justify-center mt-6 gap-2">
            {Array.from({
              length: Math.ceil(filteredTests.length / testsPerPage),
            }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`
                  px-3 py-1 rounded
                  ${
                    currentPage === i + 1
                      ? "bg-[#F97316] text-white"
                      : "bg-gray-100 text-gray-600"
                  }
                `}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
