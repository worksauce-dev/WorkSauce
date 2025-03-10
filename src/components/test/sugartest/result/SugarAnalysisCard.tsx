"use client";

import { motion } from "framer-motion";
import { ANALYSIS_DATA } from "@/constants/sugartest";
import { stressUtils } from "../utils/getStressLevel";

interface SugarAnalysisCardProps {
  score: number;
  name: string;
}

export function SugarAnalysisCard({ score, name }: SugarAnalysisCardProps) {
  const level = stressUtils.getLevel(score);
  const analysis = ANALYSIS_DATA[level](name, score.toFixed(1));

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm h-full flex flex-col">
      {/* 점수 및 현재 상태 섹션 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`relative overflow-hidden bg-gradient-to-br ${stressUtils.getColorClass(
          analysis.currentStatus.score
        )} rounded-xl m-3 p-3 sm:p-4 text-white flex-shrink-0`}
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="relative flex items-center gap-3">
          {/* 점수 표시 */}
          <div className="w-14 h-14 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {analysis.currentStatus.score}
              </div>
              <div className="text-[10px] text-white/80 mt-0.5">/5.0</div>
            </div>
          </div>

          {/* 설명 */}
          <div className="flex-1">
            <h3 className="text-base font-bold mb-0.5">현재 스트레스 상태</h3>
            <p className="text-xs text-white/90 leading-relaxed">
              {analysis.currentStatus.description}
            </p>
          </div>
        </div>
      </motion.div>

      {/* 분석 섹션들 */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="grid grid-cols-2 gap-3 p-3 pt-0 auto-rows-min">
          {/* 업무 관리 섹션 */}
          <section className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-1.5 mb-2">
              <span className="text-base">📊</span>
              {analysis.currentStatus.workManagement.title}
            </h4>
            {analysis.currentStatus.workManagement.items.map((item, idx) => (
              <p
                key={idx}
                className="bg-gray-50 rounded-lg p-2.5 text-xs text-gray-700 mb-1.5 last:mb-0"
              >
                {item}
              </p>
            ))}
          </section>

          {/* 조직 생활 섹션 */}
          <section className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-1.5 mb-2">
              <span className="text-base">🌱</span>
              조직 생활 분석
            </h4>
            {analysis.organizationalLife.current.items.map((item, idx) => (
              <p
                key={idx}
                className="bg-gray-50 rounded-lg p-2.5 text-xs text-gray-700 mb-1.5 last:mb-0"
              >
                {item}
              </p>
            ))}
          </section>

          {/* 제안 사항 섹션 */}
          <section className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-1.5 mb-2">
              <span className="text-base">💡</span>
              단기 개선 제안
            </h4>
            {analysis.suggestion.shortTerm.items.map((item, idx) => (
              <p
                key={idx}
                className="bg-gray-50 rounded-lg p-2.5 text-xs text-gray-700 mb-1.5 last:mb-0"
              >
                {item}
              </p>
            ))}
          </section>

          {/* 장기 제안 섹션 */}
          <section className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-1.5 mb-2">
              <span className="text-base">🎯</span>
              장기 개선 제안
            </h4>
            {analysis.suggestion.longTerm.items.map((item, idx) => (
              <p
                key={idx}
                className="bg-gray-50 rounded-lg p-2.5 text-xs text-gray-700 mb-1.5 last:mb-0"
              >
                {item}
              </p>
            ))}
          </section>

          {/* 종합 의견 섹션 */}
          <section className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 col-span-2">
            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-1.5 mb-2">
              <span className="text-base">📝</span>
              종합 의견
            </h4>
            <p className="text-xs text-gray-700 leading-relaxed">
              {analysis.overallOpinion.summary}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
