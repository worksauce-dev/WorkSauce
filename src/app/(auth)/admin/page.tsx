import { Metadata } from "next";
import {
  MdPeople,
  MdTrendingUp,
  MdWorkspaces,
  MdSettings,
  MdBarChart,
} from "react-icons/md";
import { getAdminStats } from "@/api/firebase/getAdminStats";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { getVerifyingQueue } from "@/api/firebase/admin/getVerifyingQueue";
import { Organization } from "@/types/dashboard";
import Image from "next/image";

export const metadata: Metadata = {
  title: "관리자 대시보드",
  description: "워크소스 관리자 페이지",
};

export default async function AdminDashboard() {
  const stats = await getAdminStats();
  const verifyingQueue = await getVerifyingQueue();

  const pendingQueue = verifyingQueue.filter(
    (item: Organization) => item.status === "pending"
  );

  return (
    <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex flex-col h-screen gap-4 ">
      {/* 통계 카드 섹션 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="총 사용자"
          value={stats.totalUsers.toLocaleString()}
          icon={<MdPeople size={24} />}
        />
        <StatCard
          title="최근 30일 이내 신규가입"
          value={stats.last30DaysNewUsers.toString()}
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
              title="설문조사"
              icon={<MdPeople size={24} />}
              href="/admin/minitest-survey"
            />
            <QuickActionButton
              title="보고서"
              icon={<MdBarChart size={24} />}
              href="/admin/reports"
            />
            <QuickActionButton
              title="설정"
              icon={<MdSettings size={24} />}
              href="/admin/settings"
            />
          </div>
        </div>
      </div>

      {/* 인증 대기 목록 */}
      <div className="bg-white p-4 rounded-lg shadow mt-6 h-full overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300 scrollbar-track-transparent">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#F97316]">
            회사 인증 대기 목록
          </h2>
          <span className="px-2 py-0.5 bg-orange-50 text-orange-600 rounded-full text-xs font-medium">
            {pendingQueue.length}건 대기중
          </span>
        </div>
        {pendingQueue.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-1 text-sm">
              대기 중인 요청이 없습니다
            </div>
            <div className="text-xs text-gray-500">
              새로운 인증 요청이 들어오면 여기에 표시됩니다
            </div>
          </div>
        ) : (
          <ul className="space-y-2">
            {pendingQueue.map((item: Organization) => (
              <li
                key={item.companyInfo.businessNumber}
                className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  {/* 왼쪽: 회사 정보 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="font-bold text-gray-800 text-base">
                        {item.companyInfo.companyName}
                      </div>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                        대기중
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center text-xs text-gray-600">
                        <span className="w-16 text-gray-500">사업자번호</span>
                        <span className="font-mono bg-gray-50 px-1.5 py-0.5 rounded">
                          {item.companyInfo.businessNumber}
                        </span>
                      </div>
                      {item.managerInfo.workEmail && (
                        <div className="flex items-center text-xs text-gray-600">
                          <span className="w-16 text-gray-500">담당자</span>
                          <span className="font-medium">
                            {item.managerInfo.workEmail}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 오른쪽: 첨부 이미지 썸네일 */}
                  <div className="flex gap-2">
                    {/* 사업자등록증 */}
                    {item.files?.businessLicenseUrl && (
                      <div className="flex flex-col items-center">
                        <div className="relative group">
                          <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-gray-100 group-hover:border-orange-200 transition-colors">
                            <Image
                              src={item.files.businessLicenseUrl}
                              alt="사업자등록증"
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 rounded-lg" />
                        </div>
                        <span className="text-[10px] text-gray-500 mt-1">
                          사업자등록증
                        </span>
                        <a
                          href={item.files.businessLicenseUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-blue-600 hover:text-blue-700 hover:underline mt-0.5"
                        >
                          새창에서 보기
                        </a>
                      </div>
                    )}
                    {/* 재직증명서 */}
                    {item.files?.employmentCertificateUrl && (
                      <div className="flex flex-col items-center">
                        <div className="relative group">
                          <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-gray-100 group-hover:border-orange-200 transition-colors">
                            <Image
                              src={item.files.employmentCertificateUrl}
                              alt="재직증명서"
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 rounded-lg" />
                        </div>
                        <span className="text-[10px] text-gray-500 mt-1">
                          재직증명서
                        </span>
                        <a
                          href={item.files.employmentCertificateUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-blue-600 hover:text-blue-700 hover:underline mt-0.5"
                        >
                          새창에서 보기
                        </a>
                      </div>
                    )}
                  </div>

                  {/* 인증 수락 버튼 */}
                  <div className="flex items-center">
                    <button className="px-3 py-1.5 bg-[#F97316] text-white rounded-lg hover:bg-orange-600 transition-colors font-medium text-sm">
                      인증 수락
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
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
