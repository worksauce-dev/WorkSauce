"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { SauceTestData } from "@/utils/teamDashboardUtils";
import { SauceTestWorkFlow } from "@/components/dashboard/contents/TeamManagement/SauceTestWorkFlow";
import { SauceType } from "@/types/saucetest/test";
import {
  MdBarChart,
  MdWorkOutline,
  MdStarOutline,
  MdWarningAmber,
  MdDirectionsWalk,
} from "react-icons/md";

interface SauceTestResultProps {
  sauceTestData: SauceTestData;
}

const SauceTestResult = ({ sauceTestData }: SauceTestResultProps) => {
  // 새 데이터 구조 추출
  const {
    typeDescription,
    characteristics,
    onboarding,
    completedAt,
    rawResult,
  } = sauceTestData;

  // personalityTypes를 rawResult에서 계산 (점수 내림차순)
  const personalityTypes =
    rawResult && rawResult.categories
      ? Object.entries(rawResult.categories)
          .map(([type, scores]) => {
            const arr = Array.isArray(scores) ? scores : [scores];
            const avg =
              arr.length > 0
                ? Math.round(
                    (arr.reduce((a, b) => a + b, 0) / arr.length) * 10
                  ) / 10
                : 0;
            return { type, score: avg };
          })
          .sort((a, b) => b.score - a.score)
      : [];

  return (
    <div className="space-y-8">
      <div className="space-y-8">
        {/* 종합 진단 결과 */}
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {typeDescription?.title || "워크소스 진단 결과"}
              </h2>
              <p className="text-sm text-gray-500 mt-1">{completedAt}</p>
              {typeDescription?.subtype && (
                <div className="mt-1 text-xs text-orange-700 bg-orange-100 inline-block px-2 py-0.5 rounded">
                  {typeDescription.subtype}
                </div>
              )}
            </div>
          </div>
          <div className="mt-4">
            {typeDescription?.finalOpinion?.content && (
              <p className="text-gray-700 text-base mb-2">
                {typeDescription.finalOpinion.content}
              </p>
            )}
            {typeDescription?.finalOpinion?.additionalNote && (
              <p className="text-gray-500 text-sm">
                {typeDescription.finalOpinion.additionalNote}
              </p>
            )}
            {typeDescription?.keywords &&
              typeDescription.keywords.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {typeDescription.keywords.map((kw: string) => (
                    <span
                      key={kw}
                      className="bg-orange-50 text-orange-700 px-2 py-0.5 rounded text-xs font-medium"
                    >
                      #{kw}
                    </span>
                  ))}
                </div>
              )}
          </div>
        </div>

        {/* 성향 유형별 상세 분석 */}
        <div className="border-t border-gray-100 pt-8">
          <div className="flex items-center gap-2 mb-6">
            <MdBarChart className="text-orange-500 text-xl" />
            <h3 className="text-lg font-semibold text-gray-900">
              성향 유형별 상세 분석
            </h3>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={personalityTypes}
                  layout="vertical"
                  margin={{
                    top: 10,
                    right: 32,
                    left: 0,
                    bottom: 10,
                  }}
                  barSize={24}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={true}
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    type="number"
                    domain={[0, 60]}
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={{ stroke: "#e2e8f0" }}
                    tickCount={5}
                  />
                  <YAxis
                    dataKey="type"
                    type="category"
                    tick={props => {
                      const { x, y, payload } = props as any;
                      return (
                        <g transform={`translate(${x},${y})`}>
                          <text
                            x={-8}
                            y={0}
                            dy={4}
                            textAnchor="end"
                            fill="#4b5563"
                            fontSize={13}
                          >
                            {payload.value}
                          </text>
                        </g>
                      );
                    }}
                    width={120}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: "#f8fafc" }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload as {
                          type: string;
                          score: number;
                        };
                        const score = data.score;
                        const typeName = data.type;

                        return (
                          <div className="bg-white px-4 py-3 border border-gray-100 rounded-lg shadow-md space-y-3 max-w-xs">
                            <div className="space-y-1">
                              <div className="text-sm font-medium text-gray-900">
                                {typeName}
                              </div>
                              <div className="text-2xl font-semibold text-orange-600">
                                {score}점
                              </div>
                            </div>
                            <div className="text-sm px-2 py-1.5 rounded bg-orange-50 text-orange-700">
                              {score >= 45
                                ? "매우 높은 성향을 보입니다."
                                : score >= 30
                                ? "높은 성향을 보입니다."
                                : score >= 15
                                ? "보통 수준의 성향을 보입니다."
                                : "낮은 성향을 보입니다."}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                    {personalityTypes.map(
                      ({ type, score }: { type: string; score: number }) => (
                        <Cell
                          key={type}
                          fill={
                            score >= 45
                              ? "#f97316"
                              : score >= 30
                              ? "#fbbf24"
                              : score >= 15
                              ? "#34d399"
                              : "#9ca3af"
                          }
                        />
                      )
                    )}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {personalityTypes[0]?.type && (
          <div className="border-t border-gray-100 pt-8">
            <SauceTestWorkFlow
              applicantType={personalityTypes[0].type as SauceType}
            />
          </div>
        )}

        {/* 추천 직무 */}
        {typeDescription?.recommendedJobs?.jobs &&
          typeDescription.recommendedJobs.jobs.length > 0 && (
            <div className="border-t border-gray-100 pt-8">
              <div className="flex items-center gap-2 mb-6">
                <MdWorkOutline className="text-orange-500 text-xl" />
                <h3 className="text-lg font-semibold text-gray-900">
                  추천 직무
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {typeDescription.recommendedJobs.jobs.map((job: any) => (
                  <div
                    key={job.name}
                    className="bg-white rounded-xl border border-gray-100 p-4"
                  >
                    <div className="font-semibold text-orange-900 mb-2">
                      {job.name}
                    </div>
                    <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1">
                      {job.details &&
                        job.details.map((d: string) => <li key={d}>{d}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* 특징 및 강점 + 주의할 점 및 개선 방안 (한 줄로) */}
        {(characteristics?.talentCharacteristics?.points?.length > 0 ||
          characteristics?.bestPerformance?.points?.length > 0 ||
          characteristics?.attentionPoints?.points?.length > 0) && (
          <div className="border-t border-gray-100 pt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 특징 및 강점 */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <MdStarOutline className="text-orange-500 text-xl" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    특징 및 강점
                  </h3>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                  {characteristics?.talentCharacteristics?.points && (
                    <div className="mb-4">
                      <div className="font-semibold text-orange-900 mb-2">
                        핵심 특성
                      </div>
                      <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1">
                        {characteristics.talentCharacteristics.points.map(
                          (p: string) => (
                            <li key={p}>{p}</li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                  {characteristics?.bestPerformance?.points && (
                    <div>
                      <div className="font-semibold text-blue-900 mb-2">
                        최고의 성과 환경
                      </div>
                      <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1">
                        {characteristics.bestPerformance.points.map(
                          (p: string) => (
                            <li key={p}>{p}</li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              {/* 주의할 점 및 개선 방안 */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <MdWarningAmber className="text-orange-500 text-xl" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    주의할 점 및 개선 방안
                  </h3>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                  {characteristics?.attentionPoints?.points?.length > 0 ? (
                    <ul className="space-y-3">
                      {characteristics.attentionPoints.points.map(
                        (p: any, idx: number) => (
                          <li key={idx} className="text-sm text-gray-700">
                            <span className="font-medium text-orange-700">
                              {p.issue}
                            </span>
                            {p.solution && (
                              <span className="ml-2 text-gray-500">
                                → {p.solution}
                              </span>
                            )}
                          </li>
                        )
                      )}
                    </ul>
                  ) : (
                    <div className="text-sm text-gray-400">
                      특별한 주의사항이 없습니다.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 온보딩 플랜 */}
        {onboarding?.stages?.length > 0 && (
          <div className="border-t border-gray-100 pt-8">
            <div className="flex items-center gap-2 mb-6">
              <MdDirectionsWalk className="text-orange-500 text-xl" />
              <h3 className="text-lg font-semibold text-gray-900">
                온보딩 플랜
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {onboarding.stages.map((stage: any, idx: number) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-gray-100 p-4"
                >
                  <div className="font-semibold text-orange-900 mb-1">
                    {stage.subtitle}
                  </div>
                  <div className="text-xs text-gray-500 mb-2">
                    {stage.period}
                  </div>
                  <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1">
                    {stage.tasks.map((t: string) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            {onboarding.finalOpinion?.points && (
              <div className="mt-6 bg-orange-50 rounded-lg p-4 text-sm text-orange-900">
                {onboarding.finalOpinion.points.map(
                  (p: string, idx: number) => (
                    <div key={idx} className="mb-1">
                      {p}
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SauceTestResult;
