import { UserBase } from "@/types/user";
import Link from "next/link";
import {
  MdBusiness,
  MdGroup,
  MdEmail,
  MdAdminPanelSettings,
  MdCalendarToday,
} from "react-icons/md";

interface WelcomeScreenProps {
  userBase: UserBase;
}

const WelcomeScreen = ({ userBase }: WelcomeScreenProps) => {
  return (
    <div className="container mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {userBase.name}님, 환영합니다!
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 회사 등록하기 카드 */}
        <Link
          href={`/dashboard/${userBase.dashboardId}/registerCompany`}
          className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-4 md:p-6 cursor-pointer block"
        >
          <div className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-blue-100 rounded-full mb-3 md:mb-4 mx-auto">
            <MdBusiness className="text-blue-600 text-2xl md:text-3xl" />
          </div>
          <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-center mb-2">
            회사 등록하기
          </h2>
          <p className="text-sm md:text-base text-gray-600 text-center">
            회사 인증 후, 메일 발송 시 회사명이 표시되어{" "}
            <br className="hidden md:block" />
            전문성과 신뢰도를 높일 수 있어요
          </p>
        </Link>

        {/* 팀 또는 조직관리하기 카드 */}
        <Link
          href={`/dashboard/${userBase.dashboardId}/teamManageMent`}
          className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-4 md:p-6 cursor-pointer block"
        >
          <div className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-green-100 rounded-full mb-3 md:mb-4 mx-auto">
            <MdGroup className="text-green-600 text-2xl md:text-3xl" />
          </div>
          <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-center mb-2">
            팀 관리하기
          </h2>
          <p className="text-sm md:text-base text-gray-600 text-center">
            구성원의 강점을 발견하고 <br className="hidden md:block" /> 팀
            시너지를 극대화하는 협업 환경을 조성하세요
          </p>
        </Link>

        {/* 나에게 테스트 메일 보내기 카드 */}
        <Link
          href={`/dashboard/${userBase.dashboardId}/testSelector`}
          className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-4 md:p-6 cursor-pointer block"
        >
          <div className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-purple-100 rounded-full mb-3 md:mb-4 mx-auto">
            <MdEmail className="text-purple-600 text-2xl md:text-3xl" />
          </div>
          <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-center mb-2">
            진단 시작하기
          </h2>
          <p className="text-sm md:text-base text-gray-600 text-center">
            다양한 진단도구를 활용하여 데이터를 수집하고{" "}
            <br className="hidden md:block" /> 의사결정에 필요한 객관적
            인사이트를 확보하세요
          </p>
        </Link>

        {/* 관리자 기능 카드 */}
        <Link
          href={`/dashboard/${userBase.dashboardId}/adminSetting`}
          className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-4 md:p-6 cursor-pointer"
        >
          <div className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-red-100 rounded-full mb-3 md:mb-4 mx-auto">
            <MdAdminPanelSettings className="text-red-600 text-2xl md:text-3xl" />
          </div>
          <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-center mb-2">
            관리자 설정
          </h2>
          <p className="text-sm md:text-base text-gray-600 text-center">
            대시보드 설정과 관리 기능을 통해 <br className="hidden md:block" />{" "}
            팀 협업 환경을 최적화하세요
          </p>
        </Link>

        {/* 캘린더 카드 */}
        <Link
          href={`/dashboard/${userBase.dashboardId}/calendar`}
          className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-4 md:p-6 cursor-pointer block"
        >
          <div className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-yellow-100 rounded-full mb-3 md:mb-4 mx-auto">
            <MdCalendarToday className="text-yellow-600 text-2xl md:text-3xl" />
          </div>
          <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-center mb-2">
            성장 일정 관리하기
          </h2>
          <p className="text-sm md:text-base text-gray-600 text-center">
            진단 일정을 체계적으로 관리하고 <br className="hidden md:block" />{" "}
            지속적인 피드백을 제공하세요
          </p>
        </Link>
      </div>
    </div>
  );
};
export default WelcomeScreen;
