"use client";

import { STRESS_LEVELS, ANALYSIS_DATA } from "@/constants/sugartest";
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
import { SugarTestData } from "@/utils/teamDashboardUtils";
import { Members } from "@/types/user";

interface SugarTestResultProps {
  sugarTestData: SugarTestData;
  selectedMember: Members;
}

const SugarTestResult = ({
  sugarTestData,
  selectedMember,
}: SugarTestResultProps) => {
  return (
    <div className="space-y-8">
      <div className="space-y-8">
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                종합 진단 결과
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {sugarTestData.completedAt}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span
                className={`text-3xl font-bold ${
                  sugarTestData.averageScore >= 4.1
                    ? "text-red-600"
                    : sugarTestData.averageScore >= 3.1
                    ? "text-orange-600"
                    : sugarTestData.averageScore >= 2.1
                    ? "text-yellow-600"
                    : "text-green-600"
                }`}
              >
                {sugarTestData.averageScore}
              </span>
              <span className="text-base text-gray-600">/ 5점</span>
            </div>
          </div>
          <div className="mt-4">
            <div
              className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium ${
                sugarTestData.averageScore >= 4.1
                  ? "bg-red-100 text-red-700"
                  : sugarTestData.averageScore >= 3.1
                  ? "bg-orange-100 text-orange-700"
                  : sugarTestData.averageScore >= 2.1
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {
                STRESS_LEVELS.find(
                  level =>
                    sugarTestData.averageScore >= level.min &&
                    sugarTestData.averageScore <= level.max
                )?.label
              }
            </div>
            <p className="text-gray-600 mt-3">
              {sugarTestData.currentStatusDescription}
            </p>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            카테고리별 상세 분석
          </h3>
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={sugarTestData.categories}
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
                    domain={[0, 5]}
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={{ stroke: "#e2e8f0" }}
                    tickCount={5}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    tick={props => {
                      const { x, y, payload } = props;
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
                        const data = payload[0].payload;
                        const score = data.score;
                        const categoryName = data.name;

                        return (
                          <div className="bg-white px-4 py-3 border border-gray-100 rounded-lg shadow-md space-y-3 max-w-xs">
                            <div className="space-y-1">
                              <div className="text-sm font-medium text-gray-900">
                                {categoryName}
                              </div>
                              <div className="text-2xl font-semibold text-orange-600">
                                {score}점
                              </div>
                            </div>
                            <div
                              className={`text-sm px-2 py-1.5 rounded ${
                                score >= 4.1
                                  ? "bg-red-50 text-red-700"
                                  : score >= 3.1
                                  ? "bg-orange-50 text-orange-700"
                                  : score >= 2.1
                                  ? "bg-yellow-50 text-yellow-700"
                                  : "bg-green-50 text-green-700"
                              }`}
                            >
                              {score >= 4.1
                                ? "심각한 수준의 스트레스가 발생하고 있습니다."
                                : score >= 3.1
                                ? "높은 수준의 스트레스가 발생하고 있습니다."
                                : score >= 2.1
                                ? "보통 수준의 스트레스가 발생하고 있습니다."
                                : "낮은 수준의 스트레스가 발생하고 있습니다."}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                    {sugarTestData.categories.map(({ name, score }) => (
                      <Cell
                        key={name}
                        fill={
                          score >= 4.1
                            ? "#ef4444"
                            : score >= 3.1
                            ? "#f97316"
                            : score >= 2.1
                            ? "#facc15"
                            : "#22c55e"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            현재 상태 분석
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h4 className="text-base font-medium text-gray-900 mb-4">
                업무 관리
              </h4>
              <ul className="space-y-3">
                {ANALYSIS_DATA[
                  sugarTestData.averageScore >= 4.1
                    ? "CRITICAL"
                    : sugarTestData.averageScore >= 3.1
                    ? "HIGH"
                    : sugarTestData.averageScore >= 2.1
                    ? "MODERATE"
                    : "LOW"
                ](
                  selectedMember.name,
                  sugarTestData.averageScore.toString()
                ).currentStatus.workManagement.items.map((item, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5" />
                    <span className="text-sm text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h4 className="text-base font-medium text-gray-900 mb-4">
                조직 생활
              </h4>
              <ul className="space-y-3">
                {ANALYSIS_DATA[
                  sugarTestData.averageScore >= 4.1
                    ? "CRITICAL"
                    : sugarTestData.averageScore >= 3.1
                    ? "HIGH"
                    : sugarTestData.averageScore >= 2.1
                    ? "MODERATE"
                    : "LOW"
                ](
                  selectedMember.name,
                  sugarTestData.averageScore.toString()
                ).organizationalLife.current.items.map((item, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5" />
                    <span className="text-sm text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            개선 제안
          </h3>
          <div className="bg-orange-50 rounded-xl p-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-base font-medium text-orange-900 mb-3">
                  {
                    ANALYSIS_DATA[
                      sugarTestData.averageScore >= 4.1
                        ? "CRITICAL"
                        : sugarTestData.averageScore >= 3.1
                        ? "HIGH"
                        : sugarTestData.averageScore >= 2.1
                        ? "MODERATE"
                        : "LOW"
                    ](
                      selectedMember.name,
                      sugarTestData.averageScore.toString()
                    ).suggestion.shortTerm.title
                  }{" "}
                  (
                  {
                    ANALYSIS_DATA[
                      sugarTestData.averageScore >= 4.1
                        ? "CRITICAL"
                        : sugarTestData.averageScore >= 3.1
                        ? "HIGH"
                        : sugarTestData.averageScore >= 2.1
                        ? "MODERATE"
                        : "LOW"
                    ](
                      selectedMember.name,
                      sugarTestData.averageScore.toString()
                    ).suggestion.shortTerm.period
                  }
                  )
                </h4>
                <ul className="space-y-3">
                  {ANALYSIS_DATA[
                    sugarTestData.averageScore >= 4.1
                      ? "CRITICAL"
                      : sugarTestData.averageScore >= 3.1
                      ? "HIGH"
                      : sugarTestData.averageScore >= 2.1
                      ? "MODERATE"
                      : "LOW"
                  ](
                    selectedMember.name,
                    sugarTestData.averageScore.toString()
                  ).suggestion.shortTerm.items.map((item, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5" />
                      <span className="text-sm text-orange-800">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-base font-medium text-orange-900 mb-3">
                  {
                    ANALYSIS_DATA[
                      sugarTestData.averageScore >= 4.1
                        ? "CRITICAL"
                        : sugarTestData.averageScore >= 3.1
                        ? "HIGH"
                        : sugarTestData.averageScore >= 2.1
                        ? "MODERATE"
                        : "LOW"
                    ](
                      selectedMember.name,
                      sugarTestData.averageScore.toString()
                    ).suggestion.longTerm.title
                  }{" "}
                  (
                  {
                    ANALYSIS_DATA[
                      sugarTestData.averageScore >= 4.1
                        ? "CRITICAL"
                        : sugarTestData.averageScore >= 3.1
                        ? "HIGH"
                        : sugarTestData.averageScore >= 2.1
                        ? "MODERATE"
                        : "LOW"
                    ](
                      selectedMember.name,
                      sugarTestData.averageScore.toString()
                    ).suggestion.longTerm.period
                  }
                  )
                </h4>
                <ul className="space-y-3">
                  {ANALYSIS_DATA[
                    sugarTestData.averageScore >= 4.1
                      ? "CRITICAL"
                      : sugarTestData.averageScore >= 3.1
                      ? "HIGH"
                      : sugarTestData.averageScore >= 2.1
                      ? "MODERATE"
                      : "LOW"
                  ](
                    selectedMember.name,
                    sugarTestData.averageScore.toString()
                  ).suggestion.longTerm.items.map((item, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5" />
                      <span className="text-sm text-orange-800">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8">
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              종합 의견
            </h3>
            <p className="text-gray-600">
              {
                ANALYSIS_DATA[
                  sugarTestData.averageScore >= 4.1
                    ? "CRITICAL"
                    : sugarTestData.averageScore >= 3.1
                    ? "HIGH"
                    : sugarTestData.averageScore >= 2.1
                    ? "MODERATE"
                    : "LOW"
                ](selectedMember.name, sugarTestData.averageScore.toString())
                  .overallOpinion.summary
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SugarTestResult;
