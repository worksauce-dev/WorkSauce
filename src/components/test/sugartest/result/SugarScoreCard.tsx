"use client";

import React, { useState, useEffect } from "react";
import Tooltip from "@/components/common/Tooltip";

const CATEGORIES = {
  strain: {
    name: "Strain",
    subLabel: "업무 부담",
    color: "bg-yellow-400",
    descriptions: {
      low: "업무량이 적절히 관리되고 있으며, 스트레스가 낮은 수준입니다.",
      moderate:
        "업무 부담이 다소 증가하여 주의가 필요하며, 업무 배분 조정이 권장됩니다.",
      high: "업무량과 난이도로 인한 높은 부담감이 발생하여, 업무 조정이 필요합니다.",
      critical:
        "심각한 수준의 업무 과부하 상태로, 즉각적인 업무량 조절과 지원이 필요합니다.",
    },
  },
  uncertainty: {
    name: "Uncertainty",
    subLabel: "불확실성",
    color: "bg-blue-400",
    descriptions: {
      low: "업무 방향과 목표가 명확하며, 안정적인 업무 수행이 이루어지고 있습니다.",
      moderate:
        "보통 수준의 불확실성이 있으며, 정기적 업데이트와 피드백이 필요합니다.",
      high: "업무의 불확실성이 높아 불안감이 증가하고 있어, 명확한 지침 설정이 필요합니다.",
      critical:
        "극심한 불확실성으로 인한 업무 혼란이 발생하여, 즉각적인 방향성 제시가 필요합니다.",
    },
  },
  grievance: {
    name: "Grievance",
    subLabel: "대인관계 갈등",
    color: "bg-orange-400",
    descriptions: {
      low: "원활한 대인관계가 유지되고 있으며, 협업이 잘 이루어지고 있습니다.",
      moderate:
        "일부 대인관계에서 경미한 갈등이 있으나, 일상적인 수준에서 관리되고 있습니다.",
      high: "주의가 필요한 수준의 갈등이 있어, 중재 프로그램 검토가 필요합니다.",
      critical:
        "심각한 대인관계 갈등으로 인한 업무 차질이 발생하여, 전문적 개입이 필요합니다.",
    },
  },
  autonomy: {
    name: "Autonomy",
    subLabel: "업무 자율성",
    color: "bg-green-400",
    descriptions: {
      low: "적절한 수준의 업무 자율성이 보장되어, 창의적인 업무 수행이 가능합니다.",
      moderate:
        "업무 자율성이 다소 제한되어 있으나, 기본적인 의사결정은 가능한 상태입니다.",
      high: "업무 자율성 부족으로 인한 답답함이 크며, 의사결정 구조 개선이 필요합니다.",
      critical:
        "심각한 수준의 자율성 제한으로, 업무 효율성과 만족도가 크게 저하되었습니다.",
    },
  },
  recognition: {
    name: "Recognition",
    subLabel: "보상과 인정",
    color: "bg-purple-400",
    descriptions: {
      low: "노력과 성과에 대한 적절한 인정과 보상이 이루어지고 있습니다.",
      moderate:
        "보상과 인정이 다소 미흡하여, 공정한 평가체계 개선이 필요합니다.",
      high: "성과에 대한 인정이 부족하여 사기가 저하되고 있으며, 보상체계 점검이 시급합니다.",
      critical:
        "심각한 수준의 보상 불균형으로 인해 이직 위험이 높아, 즉각적인 개선이 필요합니다.",
    },
  },
} as const;

const SUGAR_ORDER = [
  "strain",
  "uncertainty",
  "grievance",
  "autonomy",
  "recognition",
] as const;

const getDescriptionByScore = (
  score: number,
  category: keyof typeof CATEGORIES
) => {
  if (!CATEGORIES[category].descriptions) return null;

  if (score <= 2.0) return CATEGORIES[category].descriptions?.low;
  if (score <= 3.0) return CATEGORIES[category].descriptions?.moderate;
  if (score <= 4.0) return CATEGORIES[category].descriptions?.high;
  return CATEGORIES[category].descriptions?.critical;
};

const BarGraph: React.FC<{
  score: number;
  color: string;
}> = ({ score, color }) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setWidth((score / 5) * 100);
    }, 100);
    return () => clearTimeout(timer);
  }, [score]);

  return (
    <div className="w-24 h-1 bg-gray-100 rounded-full overflow-hidden">
      <div
        className={`h-full ${color} transition-all duration-1000 ease-out rounded-full`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
};

interface StressLevelBadgeProps {
  level: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
}

const StressLevelBadge: React.FC<StressLevelBadgeProps> = ({ level }) => {
  const config = {
    LOW: { bg: "bg-green-50", text: "text-green-600", label: "낮음" },
    MODERATE: { bg: "bg-yellow-50", text: "text-yellow-600", label: "보통" },
    HIGH: { bg: "bg-orange-50", text: "text-orange-600", label: "높음" },
    CRITICAL: { bg: "bg-red-50", text: "text-red-600", label: "위험" },
  };

  const style = config[level];

  return (
    <span
      className={`${style.bg} ${style.text} text-[10px] sm:text-xs font-medium px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full`}
    >
      {style.label}
    </span>
  );
};

const CircularProgress: React.FC<{ score: number }> = ({ score }) => {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 5) * 100;
  const [currentOffset, setCurrentOffset] = useState(circumference);
  const targetOffset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    // 마운트 직후 애니메이션 시작을 위한 약간의 지연
    const timer = setTimeout(() => {
      setCurrentOffset(targetOffset);
    }, 100);

    return () => clearTimeout(timer);
  }, [targetOffset]);

  const getColors = (score: number) => {
    if (score <= 2) {
      return {
        from: "#34d399", // green-400
        to: "#10b981", // green-500
      };
    }
    if (score <= 3) {
      return {
        from: "#fbbf24", // amber-400
        to: "#f59e0b", // amber-500
      };
    }
    if (score <= 4) {
      return {
        from: "#fb923c", // orange-400
        to: "#f97316", // orange-500
      };
    }
    return {
      from: "#f87171", // red-400
      to: "#ef4444", // red-500
    };
  };

  const colors = getColors(score);

  return (
    <div className="relative w-[160px] h-[160px]">
      <svg className="w-full h-full transform -rotate-90">
        {/* 그라데이션 정의 */}
        <defs>
          <linearGradient
            id={`progress-gradient-${score}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor={colors.from} />
            <stop offset="100%" stopColor={colors.to} />
          </linearGradient>
        </defs>

        {/* 배경 원 */}
        <circle
          className="text-gray-100"
          stroke="currentColor"
          strokeWidth="12"
          fill="none"
          cx="80"
          cy="80"
          r={radius}
        />

        {/* 프로그레스 원 */}
        <circle
          stroke={`url(#progress-gradient-${score})`}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={currentOffset}
          fill="none"
          cx="80"
          cy="80"
          r={radius}
          className="transition-all duration-1000 ease-out"
        />
      </svg>

      {/* 중앙 점수 표시 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-3xl font-bold"
          style={{
            background: `linear-gradient(to right, ${colors.from}, ${colors.to})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {score.toFixed(1)}
        </span>
        <span className="text-sm text-gray-500">/5.0</span>
      </div>
    </div>
  );
};

interface SugarScoreCardProps {
  score: number;
  stressLevel: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  categoryScores: Record<string, { total: number; average: number }>;
}

export default function SugarScoreCard({
  score,
  stressLevel,
  categoryScores,
}: SugarScoreCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm h-full flex flex-col">
      <div className="px-3 py-2 border-b border-gray-100 flex-shrink-0">
        <h3 className="text-sm font-semibold text-gray-900">
          스트레스 분석 결과
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-3 space-y-3">
          {/* 총점 섹션 */}
          <div className="flex justify-center -mt-1">
            <CircularProgress score={score} />
          </div>

          {/* 스트레스 레벨 섹션 */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-700">
                스트레스 레벨
              </span>
              <StressLevelBadge level={stressLevel} />
            </div>
            <p className="text-[11px] text-gray-600 px-2.5 py-1.5 bg-gray-50 rounded-lg border border-gray-100">
              {stressLevel === "LOW" &&
                "현재 스트레스 수준이 양호합니다. 현재 상태를 유지해주세요."}
              {stressLevel === "MODERATE" &&
                "적정 수준의 스트레스 상태입니다. 주기적인 관리가 필요합니다."}
              {stressLevel === "HIGH" &&
                "스트레스 수준이 높습니다. 적극적인 관리가 필요합니다."}
              {stressLevel === "CRITICAL" &&
                "위험 수준의 스트레스 상태입니다. 즉각적인 조치가 필요합니다."}
            </p>
          </div>

          {/* 상세 분석 섹션 */}
          <div>
            <span className="text-xs font-medium text-gray-700 block mb-1.5">
              스트레스 요소 분석
            </span>
            <div className="divide-y divide-gray-100 border border-gray-100 rounded-lg">
              {SUGAR_ORDER.map(key => {
                const description = getDescriptionByScore(
                  categoryScores[key].average,
                  key as keyof typeof CATEGORIES
                );

                return (
                  <Tooltip
                    key={key}
                    content={
                      description && (
                        <div className="max-w-[260px] p-2 text-[11px]">
                          {description}
                        </div>
                      )
                    }
                  >
                    <Tooltip.Button>
                      <div className="px-2.5 py-1.5 hover:bg-gray-50 transition-colors cursor-help">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex flex-col min-w-[100px]">
                            <span className="text-[11px] font-medium text-gray-900">
                              {CATEGORIES[key as keyof typeof CATEGORIES].name}
                            </span>
                            <span className="text-[10px] text-gray-500">
                              {
                                CATEGORIES[key as keyof typeof CATEGORIES]
                                  .subLabel
                              }
                            </span>
                          </div>
                          <span className="text-[11px] font-medium text-gray-900 ml-1">
                            {categoryScores[key].average.toFixed(1)}
                          </span>
                          <BarGraph
                            score={categoryScores[key].average}
                            color={
                              CATEGORIES[key as keyof typeof CATEGORIES].color
                            }
                          />
                        </div>
                      </div>
                    </Tooltip.Button>
                  </Tooltip>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
