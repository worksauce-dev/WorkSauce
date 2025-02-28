"use client";

import {
  FaUserGraduate,
  FaChartPie,
  FaRegClock,
  FaChartLine,
} from "react-icons/fa";
import StatCard from "../StatCard";

interface SugarStatisticsSectionProps {
  stats: {
    totalApplicants: number;
    completedTests: number;
    pendingTests: number;
    completionRate: number;
  };
  categoryAverages: {
    [key: string]: number;
  };
}

export default function SugarStatisticsSection({
  stats,
}: SugarStatisticsSectionProps) {
  return (
    <div className="space-y-6">
      {/* 기본 통계 */}
      <div className="grid grid-cols-4 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="전체 응시자"
          value={stats.totalApplicants}
          icon={<FaUserGraduate />}
          color="orange"
        />
        <StatCard
          title="완료"
          value={stats.completedTests}
          icon={<FaChartPie />}
          color="green"
        />
        <StatCard
          title="진행중"
          value={stats.pendingTests}
          icon={<FaRegClock />}
          color="yellow"
        />
        <StatCard
          title="완료율"
          value={`${stats.completionRate}%`}
          icon={<FaChartLine />}
          color="blue"
        />
      </div>

      {/* 카테고리별 평균 점수 */}
      {/* <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold mb-4">카테고리별 평균 점수</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATEGORIES.map(category => (
            <div key={category} className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">{category}</div>
              <div className="text-2xl font-bold text-gray-900">
                {categoryAverages[category] || 0}
              </div>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
}
