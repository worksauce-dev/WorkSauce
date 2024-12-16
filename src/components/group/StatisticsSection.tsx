import {
  FaChartPie,
  FaUserGraduate,
  FaChartLine,
  FaRegClock,
} from "react-icons/fa";
import StatCard from "./StatCard";

interface StatisticsSectionProps {
  stats: {
    totalApplicants: number;
    completedTests: number;
    pendingTests: number;
    completionRate: number;
  };
}

export default function StatisticsSection({ stats }: StatisticsSectionProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="전체 지원자"
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
  );
}
