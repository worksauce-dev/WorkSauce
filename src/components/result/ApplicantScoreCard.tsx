/* eslint-disable react/no-unescaped-entities */
"use client";

import React from "react";
import { Applicant } from "@/types/group";
import { determineApplicantType } from "@/utils/applicantAnalysis";
import { SauceResultType } from "@/types/saucetest/test";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MdArrowBack } from "react-icons/md";
import { format } from "date-fns";
import { getWorkflow } from "@/utils/getWorkflow";

// Types & Interfaces
interface ApplicantScoreCardProps {
  applicant: Applicant;
  sauceResult: SauceResultType;
}

type TabType =
  | "type"
  | "workflow"
  | "characteristics"
  | "onboarding"
  | "interview";

// Constants
const SECTION_EMOJIS = {
  TALENT: "✨",
  JOB: "💼",
  OPINION: "💪",
  ADDITIONAL: "🙋🏻‍♂️",
} as const;

const TAB_CONFIG = [
  { id: "type", label: "유형 설명", icon: "🎯" },
  { id: "workflow", label: "워크플로우", icon: "⚡️" },
  { id: "characteristics", label: "특성", icon: "✨" },
  { id: "onboarding", label: "온보딩", icon: "🎓" },
] as const;

// Main Component
const ApplicantScoreCard: React.FC<ApplicantScoreCardProps> = ({
  applicant,
  sauceResult,
}) => {
  const [activeTab, setActiveTab] = React.useState<TabType>("type");
  const topResults = [...applicant.testResult]
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
  const applicantType = determineApplicantType(topResults, sauceResult);
  const keywords = applicantType.typeDescription.keywords;

  return (
    <div className="flex flex-col h-full space-y-4">
      <Header
        applicant={applicant}
        applicantType={applicantType}
        topResults={topResults}
        keywords={keywords}
      />

      <nav className="bg-white rounded-lg py-3 px-4 border border-gray-100 shadow-sm">
        <div className="flex space-x-2">
          {TAB_CONFIG.map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as TabType)}
              className={`
                flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all
                ${
                  activeTab === id
                    ? "bg-orange-50 text-orange-600 font-medium shadow-sm"
                    : "text-gray-600 hover:bg-gray-50"
                }
              `}
            >
              <span className="text-lg">{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>
      </nav>

      <MainContent
        activeTab={activeTab}
        applicantType={applicantType}
        applicant={applicant}
        topResults={topResults}
        keywords={keywords}
      />
    </div>
  );
};

// Major Sub-components
const Header: React.FC<{
  applicant: Applicant;
  applicantType: ReturnType<typeof determineApplicantType>;
  topResults: Array<{ sort: string; score: number }>;
  keywords: string[];
}> = ({ applicant, applicantType, topResults, keywords }) => (
  <div className="flex flex-col gap-3 rounded-lg p-4 shadow-sm border border-gray-100 bg-white">
    {/* 상단: 기본 정보 */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold text-gray-900">
          {applicant.name}
          <span className="text-gray-400 ml-1">님의 결과</span>
        </h1>
        <div className="h-4 w-px bg-gray-200" />
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-gray-500">그룹</span>
            <span className="font-medium text-gray-900">
              {applicant.groupName}
            </span>
          </div>
          <div className="h-3 w-px bg-gray-200" />
          <div className="flex items-center gap-1.5">
            <span className="text-gray-500">완료일</span>
            <span className="font-medium text-gray-900">
              {applicant.completedAt
                ? format(new Date(applicant.completedAt), "yyyy.MM.dd")
                : "-"}
            </span>
          </div>
        </div>
      </div>

      <Link
        href={`/group/${applicant.groupId}`}
        className="text-xs font-medium text-primary-accent flex items-center gap-1 hover:bg-orange-50 rounded-md px-2 py-1.5 transition-colors"
      >
        <MdArrowBack className="text-sm" />
        그룹으로
      </Link>
    </div>

    {/* 하단: 타입 정보와 결과 카드 */}
    <div className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
      <div className="flex items-center gap-3">
        <div className="flex items-center text-sm gap-1">
          <span className="font-medium text-gray-900">
            {applicant.name}
            <span className="text-gray-400">님의 </span>
          </span>
          <div className="flex items-center gap-1">
            <span className="text-gray-400">워크소스는 </span>
            <span className="font-semibold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              {applicantType.primaryType}
            </span>
            <span className="relative px-2 flex items-center">
              <span className="w-px h-3 bg-gray-300 rotate-12" />
            </span>
            <span className="text-gray-600 font-medium">
              {applicantType.secondaryType}
            </span>
            <span className="text-gray-400">&nbsp;입니다.</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        {topResults.map((result, index) => (
          <CompactTopResultCard
            key={index}
            sort={result.sort}
            score={result.score}
            rank={index + 1}
            total={20005}
            isKeywordMatch={keywords.includes(result.sort)}
          />
        ))}
      </div>
    </div>
  </div>
);

const MainContent: React.FC<{
  activeTab: TabType;
  applicantType: ReturnType<typeof determineApplicantType>;
  applicant: Applicant;
  topResults: Array<{ sort: string; score: number }>;
  keywords: string[];
}> = ({ activeTab, applicantType, applicant, topResults, keywords }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex-1">
        {activeTab === "type" && (
          <div className="p-4 h-full">
            {/* grid-rows-2를 추가하고 auto-rows-fr로 동일한 높이 강제 */}
            <div className="grid grid-cols-2 grid-rows-2 auto-rows-fr gap-4 h-full">
              {/* 인재 유형 특징 카드 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg overflow-hidden flex flex-col h-full"
              >
                <div className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 border-b border-orange-100/50 bg-orange-50/95 backdrop-blur-sm">
                  <span className="text-lg">{SECTION_EMOJIS.TALENT}</span>
                  <h4 className="font-medium text-gray-900 text-sm">
                    인재 유형 특징
                  </h4>
                </div>
                <div className="flex-1 p-4 overflow-y-auto scrollbar-none hover:scrollbar-thin hover:scrollbar-thumb-orange-200">
                  <ul className="space-y-2">
                    {applicantType.typeDescription.talentCharacteristics.points.map(
                      (point, index) => (
                        <li
                          key={index}
                          className="text-sm text-gray-700 relative pl-3 before:content-[''] before:absolute before:w-1 before:h-1 before:bg-orange-400 before:rounded-full before:left-0 before:top-[0.6rem]"
                        >
                          {point}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </motion.div>

              {/* 추가 의견 카드 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg overflow-hidden flex flex-col h-full"
              >
                <div className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 border-b border-blue-100/50 bg-blue-50/95 backdrop-blur-sm">
                  <span className="text-lg">{SECTION_EMOJIS.ADDITIONAL}</span>
                  <h4 className="font-medium text-gray-900 text-sm">
                    추가 의견
                  </h4>
                </div>
                <div className="flex-1 p-4 overflow-y-auto scrollbar-none hover:scrollbar-thin hover:scrollbar-thumb-blue-200">
                  <div className="space-y-2">
                    <p className="text-gray-700 relative pl-3 before:content-[''] before:absolute before:w-1 before:h-1 before:bg-blue-400 before:rounded-full before:left-0 before:top-[0.6rem]">
                      {
                        applicantType.typeDescription.finalOpinion
                          .additionalNote
                      }
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* 실무 직무 카드 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg overflow-hidden flex flex-col h-full"
              >
                <div className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 border-b border-green-100/50 bg-green-50/95 backdrop-blur-sm">
                  <span className="text-lg">{SECTION_EMOJIS.JOB}</span>
                  <h4 className="font-medium text-gray-900 text-sm">
                    실무에 최적화된 직무
                  </h4>
                </div>
                <div className="flex-1 p-4 overflow-y-auto scrollbar-none hover:scrollbar-thin hover:scrollbar-thumb-green-200">
                  <div className="flex gap-4 h-full">
                    {applicantType.typeDescription.recommendedJobs.jobs.map(
                      (job, index) => (
                        <div
                          key={index}
                          className="flex-1 p-3 bg-white/50 rounded-lg border border-green-100/50 hover:shadow-sm transition-shadow overflow-y-auto hover:scrollbar-thin hover:scrollbar-thumb-green-200 scrollbar-none"
                        >
                          <h5 className="font-medium text-sm text-gray-800 mb-3 pb-2 border-b border-green-100/50">
                            {job.name}
                          </h5>
                          <ul className="space-y-2">
                            {job.details.map((detail, detailIndex) => (
                              <li
                                key={detailIndex}
                                className="text-xs text-gray-600 relative pl-3 before:content-[''] before:absolute before:w-1 before:h-1 before:bg-green-300 before:rounded-full before:left-0 before:top-[0.4rem]"
                              >
                                {detail}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </motion.div>

              {/* 최종 의견 카드 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-purple-50 to-fuchsia-50 rounded-lg overflow-hidden flex flex-col h-full"
              >
                <div className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 border-b border-purple-100/50 bg-purple-50/95 backdrop-blur-sm">
                  <span className="text-lg">{SECTION_EMOJIS.OPINION}</span>
                  <h4 className="font-medium text-gray-900 text-sm">
                    최종 추천 의견
                  </h4>
                </div>
                <div className="flex-1 p-6 overflow-y-auto scrollbar-none">
                  <div className="relative">
                    <span className="absolute -left-2 top-0 text-4xl text-purple-200 font-serif">
                      "
                    </span>
                    <div className="pl-6 pr-4">
                      <p className="text-base leading-relaxed tracking-wide text-gray-800 font-medium">
                        {applicantType.typeDescription.finalOpinion.content}
                      </p>
                    </div>
                    <span className="absolute -right-2 bottom-0 text-4xl text-purple-200 font-serif rotate-180">
                      "
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {activeTab === "characteristics" && (
          <CharacteristicsCard applicantType={applicantType} />
        )}

        {activeTab === "workflow" && (
          <div className="p-4 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {getWorkflow(applicantType)}
          </div>
        )}

        {activeTab === "onboarding" && (
          <div className="p-6 space-y-8 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {/* 단계별 프로세스 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {applicantType.onboarding.stages.map((stage, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-5 relative"
                >
                  {/* 단계 표시 배지 */}
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>

                  {/* 헤더 영역 */}
                  <div className="mb-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {stage.period}
                    </h3>
                    <div className="inline-block px-3 py-1 bg-orange-100 rounded-full">
                      <span className="text-orange-600 text-sm font-medium">
                        {stage.subtitle}
                      </span>
                    </div>
                  </div>

                  {/* 태스크 리스트 */}
                  <div className="space-y-3">
                    {stage.tasks.map((task, taskIndex) => (
                      <div
                        key={taskIndex}
                        className="flex items-start gap-3 bg-white/60 rounded-lg p-4"
                      >
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                          <span className="text-green-600 text-sm">✓</span>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {task}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* 단계 연결선 (마지막 아이템 제외) */}
                  {index < applicantType.onboarding.stages.length - 1 && (
                    <div className="hidden md:block absolute -right-6 top-1/2 transform -translate-y-1/2 w-6 h-px bg-gradient-to-r from-orange-200 to-transparent" />
                  )}
                </motion.div>
              ))}
            </div>

            {/* 종합 의견 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-5"
            >
              <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                <span className="text-2xl">🔥</span>
                종합의견
              </h3>
              <div className="space-y-3">
                {applicantType.onboarding.finalOpinion.points.map(
                  (point, index) => (
                    <p
                      key={index}
                      className="text-gray-700 bg-white/60 rounded-lg p-4"
                    >
                      {point}
                    </p>
                  )
                )}
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

const CharacteristicsCard: React.FC<{
  applicantType: ReturnType<typeof determineApplicantType>;
}> = ({ applicantType }) => (
  <div className="p-6 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300 scrollbar-track-transparent">
    <div className="space-y-6">
      {/* 상단 2열 섹션 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 최고의 성과 섹션 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-5"
        >
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
            <span className="text-2xl">✨</span>
            이럴 때 최고의 성과를 냅니다
          </h3>
          <div className="space-y-2">
            {applicantType.characteristics.bestPerformance.points.map(
              (point, index) => (
                <div key={index} className="bg-white/60 rounded-lg p-3">
                  <p className="text-gray-700">{point}</p>
                </div>
              )
            )}
          </div>
        </motion.div>

        {/* 주의점 섹션 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-5"
        >
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
            <span className="text-2xl">⚠️</span>
            이런 부분은 특별한 관심이 필요해요
          </h3>
          <div className="space-y-3">
            {applicantType.characteristics.attentionPoints.points.map(
              (point, index) => (
                <div key={index} className="bg-white/60 rounded-lg p-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-start gap-2">
                      <span className="flex-shrink-0 px-2 py-1 bg-orange-100 rounded-md text-xs font-medium text-orange-600">
                        이슈
                      </span>
                      <p className="text-gray-700">{point.issue}</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="flex-shrink-0 px-2 py-1 bg-green-100 rounded-md text-xs font-medium text-green-600">
                        해결방안
                      </span>
                      <p className="text-gray-700">{point.solution}</p>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </motion.div>
      </div>

      {/* 하단 종합의견 섹션 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-5"
      >
        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
          <span className="text-2xl">🔥</span>
          종합의견
        </h3>
        <div className="space-y-3">
          <p className="text-gray-700 bg-white/60 rounded-lg p-4">
            {applicantType.characteristics.finalOpinion.content}
          </p>
          {applicantType.characteristics.finalOpinion.additionalNote && (
            <p className="text-sm text-gray-600 bg-white/40 rounded-lg p-4">
              {applicantType.characteristics.finalOpinion.additionalNote}
            </p>
          )}
        </div>
      </motion.div>
    </div>
  </div>
);

// Minor Sub-components
const CompactTopResultCard: React.FC<{
  sort: string;
  score: number;
  rank: number;
  total: number;
  isKeywordMatch: boolean;
}> = ({ sort, score, rank, total, isKeywordMatch }) => {
  const percentage = ((score / total) * 100).toFixed(1);
  const colors =
    {
      1: "from-orange-500 to-red-500",
      2: "from-blue-500 to-indigo-500",
      3: "from-green-500 to-emerald-500",
    }[rank] || "from-gray-500 to-gray-600";

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: rank * 0.1 }}
      className={`
        relative rounded-md bg-gradient-to-r ${colors}
        px-2.5 py-1.5 flex items-center gap-2
        text-white min-w-[120px]
      `}
    >
      <div className="flex items-center gap-1.5">
        <span className="text-xs font-medium opacity-80">#{rank}</span>
        {isKeywordMatch && (
          <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
        )}
      </div>

      <div className="flex-1">
        <div className="text-xs font-medium truncate">{sort}</div>
        <div className="flex items-baseline gap-0.5">
          <span className="text-sm font-bold">{percentage}%</span>
          <span className="text-[10px] opacity-80">매칭</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ApplicantScoreCard;
