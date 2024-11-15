"use client";

import React from "react";
import { Applicant } from "@/types/group";
import { determineApplicantType } from "@/utils/applicantAnalysis";
import { formatDate } from "@/utils/formatDate";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MdArrowBack } from "react-icons/md";
import { typeDescriptions } from "@/constant/test";

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
    className={`rounded-lg p-2.5 flex items-center justify-between ${
      isKeywordMatch ? "bg-orange-50" : "bg-white"
    }`}
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
}

const ApplicantScoreCard: React.FC<ApplicantScoreCardProps> = ({
  applicant,
  keywords,
}) => {
  const [activeTab, setActiveTab] = React.useState<string>("characteristics");
  const topResults = [...applicant.testResult]
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
  const applicantType = determineApplicantType(topResults);

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* 헤더 섹션 */}
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
            <p className="text-sm font-medium text-gray-900">
              {applicant.email}
            </p>
          </div>
          <div className="px-4">
            <span className="text-sm text-gray-500">완료일</span>
            <p className="text-sm font-medium text-gray-900">
              {applicant.completedAt ? formatDate(applicant.completedAt) : "-"}
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

      <div className="grid grid-cols-12 gap-4">
        {/* 좌측: 주요 테스트 결과 (3/12) */}
        <div className="col-span-3 bg-white rounded-xl shadow-lg p-4">
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
                total={4700}
                isKeywordMatch={keywords.includes(result.sort)}
              />
            ))}
          </div>
        </div>

        {/* 우측: 지원자 유형 (9/12) */}
        <div className="col-span-9 bg-white rounded-xl shadow-lg p-4">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                지원자 유형
              </h2>
              <p className="text-xl font-bold text-primary-accent mt-1">
                {applicantType.title}
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

          <div className="space-y-4">
            {/* 요약 설명 */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-500 text-lg">✦</span>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {applicant.name}님은{" "}
                  {typeDescriptions[applicantType.title.replace(/\s+/g, "")]}
                </p>
              </div>
            </div>

            {/* 상세 설명 */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 text-lg">✤</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {applicantType.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-xl shadow-lg p-4">
        <div className="border-b border-gray-200 mb-4">
          <div className="flex space-x-6">
            {["characteristics", "interview", "onboarding"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
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
                {tab === "interview" && "면접 가이드"}
                {tab === "onboarding" && "온보딩 제안"}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "characteristics" && (
              <div className="space-y-6">
                <CharacteristicsCard
                  title="개선점"
                  points={[applicantType.weaknesses]}
                  className="bg-gradient-to-r from-orange-50 to-pink-50"
                />
              </div>
            )}

            {activeTab === "interview" && (
              <div className="space-y-4">
                {applicantType.interviewQuestions.map((question, index) => (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    key={index}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start">
                      <span className="flex-shrink-0 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-semibold">
                        Q{index + 1}
                      </span>
                      <p className="ml-4 text-gray-700 text-sm">{question}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === "onboarding" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-8"
              >
                <h5 className="font-semibold text-xl mb-6 text-gray-900">
                  추천 온보딩 프로세스
                </h5>
                <div className="text-gray-700 prose prose-orange">
                  <p>{applicantType.onboardingSteps}</p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
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
