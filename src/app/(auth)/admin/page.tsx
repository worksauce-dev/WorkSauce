import { Metadata } from "next";
import {
  MdPeople,
  MdTrendingUp,
  MdWorkspaces,
  MdHourglassEmpty,
  MdFolder,
  MdSettings,
  MdBarChart,
} from "react-icons/md";
import { getAdminStats } from "@/api/firebase/getAdminStats";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

export const metadata: Metadata = {
  title: "관리자 대시보드",
  description: "워크소스 관리자 페이지",
};

export default async function AdminDashboard() {
  const stats = await getAdminStats();

  return (
    <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex flex-col h-screen gap-4 bg-[#F7F7F9]">
      <h1 className="text-3xl font-bold mb-8 text-[#F97316]">
        관리자 대시보드
      </h1>

      {/* 통계 카드 섹션 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="총 사용자"
          value={stats.totalUsers.toLocaleString()}
          icon={<MdPeople size={24} />}
        />
        <StatCard
          title="이번 달 신규가입"
          value={stats.newUsersThisMonth.toLocaleString()}
          icon={<MdTrendingUp size={24} />}
        />
        <StatCard
          title="유료 구독자"
          value={stats.paidSubscribers.toLocaleString()}
          icon={<MdWorkspaces size={24} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 최근 활동 섹션 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-[#F97316]">
            최근 테스트 업데이트
          </h2>
          <div className="space-y-4">
            <ActivityItem
              title="소스테스트 업데이트"
              description=""
              time={formatDistanceToNow(stats.recentTestUpdates, {
                addSuffix: true,
                locale: ko,
              })}
            />
            <ActivityItem
              title="소스테스트 결과 업데이트"
              description=""
              time={formatDistanceToNow(stats.recentResultUpdates, {
                addSuffix: true,
                locale: ko,
              })}
            />
          </div>
        </div>

        {/* 빠른 작업 섹션 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-[#F97316]">
            빠른 작업
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <QuickActionButton
              title="사용자 관리"
              icon={<MdPeople size={24} />}
              href="/admin/users"
            />
            <QuickActionButton
              title="프로젝트 관리"
              icon={<MdFolder size={24} />}
              href="/admin/projects"
            />
            <QuickActionButton
              title="설정"
              icon={<MdSettings size={24} />}
              href="/admin/settings"
            />
            <QuickActionButton
              title="보고서"
              icon={<MdBarChart size={24} />}
              href="/admin/reports"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
      <div className="text-gray-700 mb-2">{icon}</div>
      <div className="text-sm text-gray-600">{title}</div>
      <div className="text-2xl font-bold text-gray-700">{value}</div>
    </div>
  );
}

function ActivityItem({
  title,
  description,
  time,
}: {
  title: string;
  description: string;
  time: string;
}) {
  return (
    <div className="border-b pb-4 hover:bg-orange-50 transition-colors p-2 rounded">
      <div className="font-semibold text-gray-700">{title}</div>
      <div className="text-sm text-gray-600">{description}</div>
      <div className="text-xs text-gray-500 mt-1">{time}</div>
    </div>
  );
}

function QuickActionButton({
  title,
  icon,
  href,
}: {
  title: string;
  icon: React.ReactNode;
  href: string;
}) {
  return (
    <a
      href={href}
      className="flex items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors group"
    >
      <span className="text-gray-700 mr-2 group-hover:text-[#F97316] transition-colors">
        {icon}
      </span>
      <span className="font-medium text-gray-700">{title}</span>
    </a>
  );
}
