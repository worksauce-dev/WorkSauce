"use client";

import React from "react";
import { Applicant } from "@/types/group";
import { determineApplicantType } from "@/utils/applicantAnalysis";
import { SauceResultType } from "@/types/test";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MdArrowBack } from "react-icons/md";
import { format } from "date-fns";
import { typeDescriptions } from "@/constant/test";
import { getWorkflow } from "@/utils/getWorkflow";

// 새로운 컴포넌트 추가
const TopResultCard: React.FC<{
  sort: string;
  score: number;
  rank: number;
  total: number;
  isKeywordMatch: boolean;
}> = ({ sort, score, rank, total, isKeywordMatch }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: rank * 0.1 }}
    className="rounded-lg p-2.5 flex items-center justify-between bg-white"
  >
    <div className="flex items-center gap-2">
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center ${
          rank === 1
            ? "bg-orange-500 text-white"
            : "bg-orange-100 text-orange-500"
        }`}
      >
        <span className="text-sm font-semibold">{rank}</span>
      </div>
      <div>
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-gray-900">{sort}</h4>
          {isKeywordMatch && (
            <div className="flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-xs font-medium text-orange-500">
                키워드 매칭
              </span>
            </div>
          )}
        </div>
        <p className="text-sm text-gray-500">
          {((score / total) * 100).toFixed(1)}%
        </p>
      </div>
    </div>
  </motion.div>
);

interface ApplicantScoreCardProps {
  applicant: Applicant;
  keywords: string[];
  sauceResult: SauceResultType;
}

// 탭 타입 정의
type TabType = "characteristics" | "onboarding" | "interview" | "workflow";

// 공통 스타일 상수
const STYLES = {
  gradientBg: "bg-gradient-to-r from-orange-50 to-red-50",
  card: "rounded-xl shadow-lg p-4 bg-white",
} as const;

// Header 컴포넌트 분리
const Header: React.FC<{ applicant: Applicant }> = ({ applicant }) => (
  <div className="flex items-center justify-between rounded-xl p-6 shadow-sm border border-gray-100 bg-white min-h-[98px]">
    <h1 className="text-xl font-semibold md:text-2xl text-gray-900">
      {applicant.name}님의 소스테스트 결과
    </h1>

    <div className="flex items-center divide-gray-200 gap-4">
      <div className="pr-4">
        <span className="text-sm text-gray-500">그룹</span>
        <p className="text-sm font-medium text-gray-900">
          {applicant.groupName}
        </p>
      </div>
      <div className="px-4">
        <span className="text-sm text-gray-500">이메일</span>
        <p className="text-sm font-medium text-gray-900">{applicant.email}</p>
      </div>
      <div className="px-4">
        <span className="text-sm text-gray-500">완료일</span>
        <p className="text-sm font-medium text-gray-900">
          {applicant.completedAt
            ? format(new Date(applicant.completedAt), "yyyy년 MM월 dd일")
            : "-"}
        </p>
      </div>
      <Link
        href={`/group/${applicant.groupId}`}
        className="px-4 py-2 text-sm font-medium text-primary-accent flex items-center gap-1 hover:bg-orange-50 hover:rounded-lg transition"
      >
        <MdArrowBack className="text-lg" />
        그룹으로 돌아가기
      </Link>
    </div>
  </div>
);

// MainContent 컴포넌트 분리
const MainContent: React.FC<{
  applicantType: ReturnType<typeof determineApplicantType>;
  applicant: Applicant;
}> = ({ applicantType, applicant }) => (
  <div className="space-y-4">
    <div className={`${STYLES.gradientBg} rounded-lg p-4`}>
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <p className="text-xl font-bold text-primary-accent mt-1">
              {applicantType.primaryType}
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {applicantType.keywords.map((keyword, index) => (
              <span
                key={index}
                className="bg-orange-100 text-orange-500 px-2 py-0.5 rounded-full text-sm font-medium"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
            <span className="text-orange-500 text-lg">✦</span>
          </div>
          <p className="text-gray-700 text-sm leading-relaxed">
            {
              typeDescriptions[
                applicantType.primaryType as keyof typeof typeDescriptions
              ]
            }
          </p>
        </div>
      </div>
    </div>

    <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-lg p-4">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg text-slate-800">
            {applicantType.primaryType}
          </span>
          <span className="text-gray-400 text-base">/</span>
          <span className="text-base text-slate-500">
            {applicantType.secondaryType}
          </span>
        </div>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
            <span className="text-slate-600 text-lg">✦</span>
          </div>
          <p className="text-gray-700 text-sm leading-relaxed">
            {applicant.name}님은 {applicantType.description}
          </p>
        </div>
      </div>
    </div>
  </div>
);

// TabContent 컴포넌트 분리
const TabContent: React.FC<{
  activeTab: TabType;
  applicantType: ReturnType<typeof determineApplicantType>;
  applicant: Applicant;
}> = ({ activeTab, applicantType, applicant }) => (
  <AnimatePresence mode="wait">
    <motion.div
      key={activeTab}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300 scrollbar-track-transparent"
    >
      {activeTab === "characteristics" && (
        <div className="h-full p-0.5">
          <CharacteristicsCard
            title="개선점"
            points={[applicantType.weaknesses]}
            className="bg-gradient-to-r from-orange-50 to-pink-50"
          />
        </div>
      )}

      {activeTab === "interview" && (
        <div className="h-full p-0.5">
          <div className="space-y-3">
            {applicantType.interviewQuestions.map((question, index) => (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.2 }}
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">
                    Q{index + 1}
                  </span>
                  <p className="text-gray-700 text-base py-1">{question}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "onboarding" && (
        <div className="h-full p-0.5">
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-6">
            <h5 className="font-semibold text-xl mb-4 text-gray-900">
              추천 온보딩 프로세스
            </h5>
            <div className="text-gray-700 prose prose-orange">
              <p>{applicantType.onboardingSteps}</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "workflow" && (
        <div className="h-full p-0.5">
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-6">
            {getWorkflow(applicantType, applicant.name)}
          </div>
        </div>
      )}
    </motion.div>
  </AnimatePresence>
);

// TabNavigation 컴포넌트 추가
const TabNavigation: React.FC<{
  activeTab: TabType;
  setActiveTab: React.Dispatch<React.SetStateAction<TabType>>;
}> = ({ activeTab, setActiveTab }) => (
  <div className="border-b border-gray-200 mb-4">
    <div className="flex space-x-6">
      {["workflow", "characteristics", "onboarding", "interview"].map(tab => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab as TabType)}
          className={`pb-3 px-2 relative ${
            activeTab === tab
              ? "text-gray-900 font-semibold"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {activeTab === tab && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"
            />
          )}
          {tab === "characteristics" && "특성 분석"}
          {tab === "workflow" && "워크플로우"}
          {tab === "interview" && "면접 가이드"}
          {tab === "onboarding" && "온보딩 제안"}
        </button>
      ))}
    </div>
  </div>
);

const ApplicantScoreCard: React.FC<ApplicantScoreCardProps> = ({
  applicant,
  keywords,
  sauceResult,
}) => {
  const [activeTab, setActiveTab] = React.useState<TabType>("characteristics");
  const topResults = [...applicant.testResult]
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
  const applicantType = determineApplicantType(topResults, sauceResult);

  return (
    <div className="flex flex-col h-full space-y-4">
      <Header applicant={applicant} />

      <div className="grid grid-cols-12 gap-4">
        <div className={`col-span-3 ${STYLES.card}`}>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            주요 테스트 결과
          </h2>
          <div className="space-y-2">
            {topResults.map((result, index) => (
              <TopResultCard
                key={index}
                sort={result.sort}
                score={result.score}
                rank={index + 1}
                total={4600}
                isKeywordMatch={keywords.includes(result.sort)}
              />
            ))}
          </div>
        </div>

        <div className={`col-span-9 ${STYLES.card}`}>
          <MainContent applicantType={applicantType} applicant={applicant} />
        </div>
      </div>

      <div className={`flex-1 ${STYLES.card} flex flex-col overflow-y-hidden`}>
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        <TabContent
          activeTab={activeTab}
          applicantType={applicantType}
          applicant={applicant}
        />
      </div>
    </div>
  );
};

// 특성 카드 컴포넌트
const CharacteristicsCard: React.FC<{
  title: string;
  points: string[]; // 문자열 배열 타입 유지
  className?: string;
}> = ({ title, points, className }) => (
  <div className={`rounded-lg p-6 ${className}`}>
    <h5 className="font-semibold text-lg mb-4">{title}</h5>
    <ul className="space-y-2">
      {points.map((point, index) => (
        <li key={index} className="flex items-start">
          <span className="flex-shrink-0 text-indigo-600 mr-2">•</span>
          <span className="text-gray-700">{point}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default ApplicantScoreCard;
