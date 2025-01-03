import {
  MdPeople,
  MdTrendingUp,
  MdAssignment,
  MdHourglassEmpty,
} from "react-icons/md";

export const AdminDashboardContainer = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-heading2 font-bold mb-8 text-primary-accent">
        관리자 대시보드
      </h1>

      {/* 통계 카드 섹션 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="총 사용자"
          value="1,234"
          icon={<MdPeople className="text-primary-accent" />}
        />
        <StatCard
          title="이번 달 신규가입"
          value="56"
          icon={<MdTrendingUp className="text-primary-accent" />}
        />
        <StatCard
          title="활성 프로젝트"
          value="89"
          icon={<MdAssignment className="text-primary-accent" />}
        />
        <StatCard
          title="대기중인 요청"
          value="12"
          icon={<MdHourglassEmpty className="text-primary-accent" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 최근 활동 섹션 */}
        <div className="card p-6">
          <h2 className="text-subheading font-semibold mb-4 text-primary-accent">
            최근 활동
          </h2>
          {/* ... existing ActivityItem components ... */}
        </div>

        {/* 빠른 작업 섹션 */}
        <div className="card p-6">
          <h2 className="text-subheading font-semibold mb-4 text-primary-accent">
            빠른 작업
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <QuickActionButton
              title="사용자 관리"
              icon={<MdPeople />}
              href="/admin/users"
            />
            {/* ... other QuickActionButton components ... */}
          </div>
        </div>
      </div>
    </div>
  );
};

// StatCard 컴포넌트 업데이트
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
    <div className="card card-hover p-6">
      <div className="text-2xl mb-2 text-primary-gray">{icon}</div>
      <div className="text-body1 text-primary-gray">{title}</div>
      <div className="text-heading1 font-bold text-dark">{value}</div>
    </div>
  );
}

// ActivityItem 컴포넌트 업데이트
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

// QuickActionButton 컴포넌트 업데이트
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
      className="flex items-center p-4 bg-secondary-accent/10 rounded-lg hover:bg-secondary-accent/20 transition-colors group"
    >
      <span className="text-xl mr-2 text-primary-gray group-hover:text-primary-accent transition-colors">
        {icon}
      </span>
      <span className="font-medium text-dark">{title}</span>
    </a>
  );
}
