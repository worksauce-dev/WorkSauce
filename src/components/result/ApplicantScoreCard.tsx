"use client";

import React from "react";
import { Applicant } from "@/types/group";
import { getStatusColor } from "@/utils/getStatusColor";
import { determineApplicantType } from "@/utils/applicantAnalysis";
import { formatDate } from "@/utils/formatDate";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// 새로운 컴포넌트 추가
const TopResultCard: React.FC<{
  sort: string;
  score: number;
  rank: number;
  total: number;
}> = ({ sort, score, rank, total }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: rank * 0.1 }}
    className="bg-white border border-indigo-100 rounded-lg p-4 flex items-center justify-between hover:shadow-lg transition-shadow"
  >
    <div className="flex items-center space-x-3">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center ${
          rank === 1
            ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
            : "bg-gray-100 text-gray-600"
        }`}
      >
        <span className="text-base font-bold">{rank}</span>
      </div>
      <div>
        <h4 className="font-semibold text-gray-900 text-sm">{sort}</h4>
      </div>
    </div>
  </motion.div>
);

interface ApplicantScoreCardProps {
  applicant: Applicant;
}

const ApplicantScoreCard: React.FC<ApplicantScoreCardProps> = ({
  applicant,
}) => {
  const [activeTab, setActiveTab] = React.useState<string>("characteristics");
  const applicantType = determineApplicantType(applicant.testResult);

  // 점수 기준으로 정렬하여 상위 3개 추출
  const topResults = [...applicant.testResult]
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const totalScore = applicant.testResult.reduce(
    (sum, result) => sum + result.score,
    0
  );

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-8 h-full">
      <div className="flex flex-col lg:flex-row gap-8 h-full">
        {/* 좌측: 기본 정보 및 상위 테스트 결과 */}
        <div className="lg:w-2/5">
          <h2 className="text-3xl font-bold mb-6 text-indigo-700">
            {applicant.name}님의 소스테스트 결과
          </h2>

          <div className="grid grid-cols-1 gap-4 mb-8">
            <Link
              href={`/group/${applicant.groupId}`}
              className="bg-indigo-50 p-4 rounded-lg hover:bg-indigo-100"
            >
              <span className="font-semibold text-indigo-700">그룹:</span>
              <span className="ml-2">{applicant.groupName}</span>
            </Link>
            <div className="bg-indigo-50 p-4 rounded-lg">
              <span className="font-semibold text-indigo-700">이메일:</span>
              <span className="ml-2">{applicant.email}</span>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg">
              <span className="font-semibold text-indigo-700">완료일:</span>
              <span className="ml-2">
                {applicant.completedAt
                  ? formatDate(applicant.completedAt)
                  : "-"}
              </span>
            </div>
          </div>

          <h3 className="text-xl font-semibold mb-4 text-indigo-600">
            주요 테스트 결과
          </h3>
          <div className="space-y-4">
            {topResults.map((result, index) => (
              <TopResultCard
                key={index}
                sort={result.sort}
                score={result.score}
                rank={index + 1}
                total={totalScore}
              />
            ))}
          </div>
        </div>

        {/* 우측: 지원자 분석 */}
        <div className="lg:w-3/5 lg:border-l lg:pl-8">
          <h3 className="text-2xl font-semibold mb-6 text-indigo-600">
            지원자 분석
          </h3>

          <div className="bg-indigo-50 rounded-xl p-6 mb-8">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-indigo-600 font-semibold">
                    지원자 유형
                  </span>
                  <h4 className="text-2xl font-bold text-gray-900">
                    {applicantType.title}
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {applicantType.keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-gray-600">{applicantType.description}</p>
            </div>
          </div>

          {/* 탭 네비게이션 */}
          <div className="flex space-x-4 border-b mb-6">
            {["characteristics", "interview", "onboarding"].map(tab => (
              <motion.button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 px-6 relative ${
                  activeTab === tab
                    ? "text-indigo-600 font-semibold"
                    : "text-gray-500"
                }`}
              >
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
                  />
                )}
                {tab === "characteristics" && "특성 분석"}
                {tab === "interview" && "면접 가이드"}
                {tab === "onboarding" && "온보딩 제안"}
              </motion.button>
            ))}
          </div>

          {/* 탭 컨텐츠 */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
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
                        <span className="flex-shrink-0 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-semibold">
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
                  className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-8"
                >
                  <h5 className="font-semibold text-xl mb-6 text-indigo-700">
                    추천 온보딩 프로세스
                  </h5>
                  <div className="text-gray-700 prose prose-indigo">
                    <p>{applicantType.onboardingSteps}</p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
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
