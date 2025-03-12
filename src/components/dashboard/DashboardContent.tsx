import Link from "next/link";
import { useState, FormEvent } from "react";
import { Group } from "@/types/group";
import { format } from "date-fns";
import {
  MdSearch,
  MdAdd,
  MdInfo,
  MdCheckCircle,
  MdWarning,
  MdCheck,
  MdOutlineRefresh,
  MdBusinessCenter,
  MdClose,
} from "react-icons/md";
import { User } from "@/types/user";
import { signOut } from "next-auth/react";
import { StatusBadge } from "@/components/common/StatusBadge";

interface DashboardContentProps {
  activeTab: "대시보드" | "지원자 검색" | "설정";
  groupData: Group[];
  userData: User;
  optoutUser: (
    userId: string,
    accessToken: string,
    refreshToken: string,
    password?: string
  ) => Promise<{ success: boolean }>;
  accessToken: string;
  refreshToken: string;
  updateUserProfile: (
    userId: string,
    profileForm: any
  ) => Promise<{ success: boolean }>;
  updateUserType?: (
    userId: string,
    userType: string,
    businessData?: {
      businessNumber: string;
      representativeName: string;
      businessName: string;
    }
  ) => Promise<{ success: boolean }>;
}

export default function DashboardContent({
  activeTab,
  groupData,
  userData,
  optoutUser,
  accessToken,
  refreshToken,
  updateUserProfile,
}: DashboardContentProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTestGroup, setSelectedTestGroup] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [activeSettingTab, setActiveSettingTab] = useState("프로필");
  const [profileForm, setProfileForm] = useState({
    name: userData.name,
    email: userData.email,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showBusinessForm, setShowBusinessForm] = useState(false);
  const [businessForm, setBusinessForm] = useState({
    businessNumber: "",
    representativeName: "",
    businessName: "",
  });
  const [isBusinessSubmitting, setIsBusinessSubmitting] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const filteredApplicants = groupData
    .map(group => {
      const isExpired = new Date(group.deadline) < new Date();

      return group.applicants.map(applicant => ({
        ...applicant,
        // 만약 마감기한이 지났고 완료되지 않은 상태라면 'expired'로 설정
        testStatus:
          isExpired && applicant.testStatus !== "completed"
            ? "expired"
            : applicant.testStatus,
      }));
    })
    .flat()
    .filter(
      applicant =>
        (applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          applicant.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (selectedTestGroup === "" || applicant.groupId === selectedTestGroup) &&
        (selectedStatus === "" || applicant.testStatus === selectedStatus)
    );

  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await updateUserProfile(userData.id, {
        name: profileForm.name,
        email: profileForm.email,
        updatedAt: new Date().toISOString(),
      });

      setShowSuccess(true);
    } catch (error) {
      console.error("프로필 업데이트 중 오류가 발생했습니다:", error);
      alert(
        error instanceof Error
          ? error.message
          : "프로필 업데이트 중 오류가 발생했습니다."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAccount = async (password?: string) => {
    try {
      setIsDeleting(true);
      setDeleteError("");

      if (userData.provider === "credentials") {
        if (!password) {
          setDeleteError("비밀번호를 입력해주세요.");
          return;
        }
        // 비밀번호 확인 로직 추가 필요
        // 예: await verifyPassword(password);
      }

      await optoutUser(userData.id, accessToken, refreshToken, password);
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      setDeleteError("회원 탈퇴 중 오류가 발생했습니다.");
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  switch (activeTab) {
    case "대시보드":
      return (
        <div className="flex gap-4 sm:gap-8 flex-col lg:flex-row h-full">
          <div className="flex flex-col gap-4 md:gap-8 p-4 md:p-8 w-full lg:w-3/5 h-full bg-white rounded-xl shadow-sm border border-gray-100">
            <h1 className="text-lg md:text-2xl font-bold text-gray-700">
              최근 워크소스 현황
            </h1>
            {groupData.length === 0 ? (
              <div className="my-auto flex flex-col items-center justify-center py-12 text-center">
                <MdAdd className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  아직 생성된 워크소스가 없습니다
                </h3>
                <p className="text-sm text-gray-400 mb-6">
                  새로운 워크소스를 생성하여 지원자들을 관리해보세요
                </p>
                <Link
                  href="/sending-test"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-200 transition-all duration-200"
                >
                  워크소스 생성하기
                </Link>
              </div>
            ) : (
              <ul className="flex flex-col gap-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300 scrollbar-track-transparent">
                {groupData
                  .sort(
                    (a, b) =>
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime()
                  )
                  .map(group => {
                    const completedApplicants = group.applicants.filter(
                      applicant => applicant.completedAt !== null
                    );

                    return (
                      <Link
                        href={`/group/${group.testType}/${group.groupId}`}
                        key={group.groupId}
                        className="block group border border-gray-100 rounded-lg p-4 hover:border-gray-200 hover:bg-orange-50 transition-all duration-200 hover:shadow-sm"
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex flex-col gap-2">
                            <h1 className="text-sm md:text-lg font-semibold text-gray-700 group-hover:text-orange-600 transition-colors duration-200">
                              {group.name}
                            </h1>
                            <div className="flex items-center gap-2">
                              <span className="bg-blue-50 text-blue-600 text-xs md:text-sm font-medium px-2.5 py-0.5 rounded-full">
                                지원자 {group.applicants.length}명
                              </span>
                              <span className="text-xs md:text-sm text-gray-400">
                                마감일:{" "}
                                {format(
                                  new Date(group.deadline),
                                  "yy년 MM월 dd일"
                                )}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <div className="flex items-center">
                              <MdCheck className="w-4 h-4 text-emerald-500 mr-1" />
                              <span className="text-xs md:text-sm font-medium text-emerald-600">
                                완료한 지원자: {completedApplicants.length}
                              </span>
                            </div>
                            <div className="w-16 md:w-32 bg-[#dfe0df] rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-orange-400 to-orange-500 h-2 rounded-full transition-all duration-200"
                                style={{
                                  width: `${
                                    (completedApplicants.length /
                                      group.applicants.length) *
                                    100
                                  }%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
              </ul>
            )}
          </div>
          <div className="flex flex-col gap-4 md:gap-8 p-4 md:p-8 w-full lg:w-2/5 h-full bg-white rounded-xl shadow-sm border border-gray-100">
            <h1 className="text-lg md:text-2xl font-bold text-gray-700">
              공지사항
            </h1>
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg p-4 transition-all duration-200 hover:shadow-sm border border-blue-100">
                <div className="flex items-center gap-3 mb-2">
                  <MdInfo className="w-5 h-5 text-blue-500" />
                  <h6 className="text-sm md:text-lg font-semibold text-blue-700 group-hover:text-blue-800 transition-colors duration-200">
                    결제 안내
                  </h6>
                </div>
                <p className="text-xs md:text-sm text-blue-600">
                  현재 워크소스는 베타버전으로 운영하고 있습니다. 따라서 결제
                  시스템은 현재 준비중입니다.
                </p>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-white rounded-lg p-4 transition-all duration-200 hover:shadow-sm border border-emerald-100">
                <div className="flex items-center gap-3 mb-2">
                  <MdCheckCircle className="w-5 h-5 text-emerald-400" />
                  <h6 className="text-sm md:text-lg font-semibold text-emerald-700">
                    문의 사항 안내
                  </h6>
                </div>
                <p className="text-xs md:text-sm text-emerald-600">
                  worksauce.info@gmail.com로 버그 및 개선사항을 제안해주시면
                  더욱 좋은 서비스로 전할 수 있도록 노력하겠습니다.
                </p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-white rounded-lg p-4 transition-all duration-200 hover:shadow-sm border border-amber-100">
                <div className="flex items-center gap-3 mb-2">
                  <MdWarning className="w-5 h-5 text-amber-400" />
                  <h6 className="text-sm md:text-lg font-semibold text-amber-700">
                    중요 공지
                  </h6>
                </div>
                <p className="text-xs md:text-sm text-amber-600">
                  현재 워크소스는 베타버전으로 운영하고 있습니다. 원활한
                  업데이트를 위해 매달 마지막 날마다 데이터 초기화가 진행됩니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      );

    case "지원자 검색":
      return (
        <div className="flex flex-col gap-6 h-full p-6 md:p-8 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MdSearch className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="이름 또는 이메일로 검색"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10 w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div className="flex flex-col md:flex-row gap-4 md:w-auto">
              <select
                value={selectedTestGroup}
                onChange={e => setSelectedTestGroup(e.target.value)}
                className="px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 min-w-[200px]"
              >
                <option value="">모든 테스트 그룹</option>
                {groupData.map(group => (
                  <option key={group.groupId} value={group.groupId}>
                    {group.name}
                  </option>
                ))}
              </select>
              <select
                value={selectedStatus}
                onChange={e => setSelectedStatus(e.target.value)}
                className="px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">모든 상태</option>
                <option value="completed">완료</option>
                <option value="pending">진행 중</option>
                <option value="expired">만료</option>
              </select>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {filteredApplicants.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[20%]">
                        이름
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[30%]">
                        이메일
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[25%]">
                        테스트 그룹
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[15%]">
                        상태
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[10%]">
                        결과
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredApplicants.map(applicant => (
                      <tr
                        key={`${applicant.groupId}-${applicant.email}`}
                        className="hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {applicant.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {applicant.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <Link
                            href={`/group/${
                              groupData.find(
                                g => g.groupId === applicant.groupId
                              )?.testType
                            }/${applicant.groupId}`}
                            className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                          >
                            {applicant.groupName}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={applicant.testStatus} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {applicant.testStatus === "completed" && (
                            <Link
                              href={`/group/${
                                groupData.find(
                                  g => g.groupId === applicant.groupId
                                )?.testType
                              }/${applicant.groupId}/${applicant.name}`}
                              className="text-blue-600 hover:text-blue-900 transition-colors duration-200 font-medium"
                            >
                              상세보기
                            </Link>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[400px] text-center">
                <MdSearch className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  검색 결과가 없습니다
                </h3>
                <p className="text-sm text-gray-500">
                  다른 검색어나 필터를 시도해보세요
                </p>
              </div>
            )}
          </div>
        </div>
      );

    case "설정":
      return (
        <div className="flex flex-col md:flex-row gap-8 p-8 h-full bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="w-full md:w-1/4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">설정</h2>
            <ul className="space-y-2">
              {["프로필", "보안"].map(tab => (
                <li key={tab}>
                  <button
                    onClick={() => setActiveSettingTab(tab)}
                    className={`w-full text-left px-4 py-2 rounded-md ${
                      activeSettingTab === tab
                        ? "bg-orange-500 text-white"
                        : "text-gray-600 hover:bg-orange-50"
                    }`}
                  >
                    {tab}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="w-full md:w-3/4">
            {activeSettingTab === "프로필" && (
              <div>
                <h3 className="text-lg font-semibold mb-4">프로필 설정</h3>
                <form className="space-y-4" onSubmit={handleProfileSubmit}>
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      이름
                    </label>
                    <div className="cursor-not-allowed bg-gray-50 mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                      {userData.name}
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      이메일
                    </label>
                    <input
                      value={profileForm.email}
                      onChange={e =>
                        setProfileForm(prev => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      type="email"
                      id="email"
                      name="email"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  {/* <div>
                    <label
                      htmlFor="dashboardName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      회사명
                    </label>
                    <input
                      value={profileForm.dashboardName}
                      onChange={e =>
                        setProfileForm(prev => ({
                          ...prev,
                          dashboardName: e.target.value,
                        }))
                      }
                      type="text"
                      id="dashboardName"
                      name="dashboardName"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div> */}
                  <button
                    type="submit"
                    disabled={isSubmitting || showSuccess}
                    className={`w-full md:w-auto px-6 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2
                      ${
                        showSuccess
                          ? "bg-green-500"
                          : isSubmitting
                          ? "bg-orange-400 cursor-not-allowed"
                          : "bg-orange-600 hover:bg-orange-700"
                      } text-white`}
                  >
                    {showSuccess ? (
                      <>
                        <MdCheckCircle className="h-5 w-5" />
                        <span>저장 완료</span>
                      </>
                    ) : isSubmitting ? (
                      <>
                        <MdOutlineRefresh className="h-5 w-5 animate-spin" />
                        <span>저장 중...</span>
                      </>
                    ) : (
                      <span>변경사항 저장</span>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* {activeSettingTab === "계정 유형" && (
              <div>
                <h3 className="text-lg font-semibold mb-4">계정 유형 설정</h3>
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <MdBusinessCenter className="text-gray-600 w-5 h-5" />
                    <span className="font-medium text-gray-700">
                      현재 계정 유형:
                    </span>
                    <span className="text-orange-600 font-medium">
                      {userData.userType === "business" ? "비즈니스" : "일반"}
                    </span>
                  </div>
                  {userData.userType !== "business" && (
                    <p className="text-sm text-gray-600">
                      비즈니스 계정으로 전환하면 추가 기능을 사용할 수 있습니다.
                    </p>
                  )}
                </div>

                {userData.userType !== "business" && !showBusinessForm && (
                  <button
                    onClick={() => setShowBusinessForm(true)}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    비즈니스 계정으로 전환
                  </button>
                )}

                {showBusinessForm && (
                  <form
                    onSubmit={async e => {
                      e.preventDefault();
                      setIsBusinessSubmitting(true);
                      // try {
                      //   const result = await updateUserType(
                      //     userData.id,
                      //     "business",
                      //     businessForm
                      //   );
                      //   if (result.success) {
                      //     alert("비즈니스 계정으로 전환되었습니다.");
                      //     window.location.reload();
                      //   }
                      // } catch (error) {
                      //   console.error(error);
                      //   alert("계정 전환 중 오류가 발생했습니다.");
                      // } finally {
                      //   setIsBusinessSubmitting(false);
                      // }
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        사업자등록번호
                      </label>
                      <input
                        type="text"
                        value={businessForm.businessNumber}
                        onChange={e =>
                          setBusinessForm(prev => ({
                            ...prev,
                            businessNumber: e.target.value,
                          }))
                        }
                        required
                        placeholder="000-00-00000"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        대표자명
                      </label>
                      <input
                        type="text"
                        value={businessForm.representativeName}
                        onChange={e =>
                          setBusinessForm(prev => ({
                            ...prev,
                            representativeName: e.target.value,
                          }))
                        }
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        상호명
                      </label>
                      <input
                        type="text"
                        value={businessForm.businessName}
                        onChange={e =>
                          setBusinessForm(prev => ({
                            ...prev,
                            businessName: e.target.value,
                          }))
                        }
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={isBusinessSubmitting}
                        className={`px-4 py-2 rounded-lg text-white ${
                          isBusinessSubmitting
                            ? "bg-orange-400 cursor-not-allowed"
                            : "bg-orange-600 hover:bg-orange-700"
                        }`}
                      >
                        {isBusinessSubmitting ? "처리중..." : "전환 신청"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowBusinessForm(false)}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        취소
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )} */}

            {activeSettingTab === "보안" && (
              <div>
                <h3 className="text-lg font-semibold text-red-600 mb-4">
                  계정 삭제
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  계정을 삭제하면 모든 데이터가 영구적으로 제거되며 복구할 수
                  없습니다. 신중하게 결정해 주세요.
                </p>
                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        "정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
                      )
                    ) {
                      if (userData.provider === "credentials") {
                        setShowPasswordModal(true);
                      } else {
                        handleDeleteAccount();
                      }
                    }
                  }}
                  disabled={isDeleting}
                  className="px-4 py-2 border border-red-600 text-sm font-medium rounded-md text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
                >
                  {isDeleting ? "처리중..." : "계정 삭제"}
                </button>

                {/* 비밀번호 확인 모달 */}
                {showPasswordModal && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">비밀번호 확인</h3>
                        <button
                          onClick={() => setShowPasswordModal(false)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <MdClose className="w-6 h-6" />
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        계정 삭제를 진행하기 위해 비밀번호를 입력해주세요.
                      </p>
                      <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="비밀번호 입력"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                      {deleteError && (
                        <p className="text-sm text-red-600 mb-4">
                          {deleteError}
                        </p>
                      )}
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setShowPasswordModal(false)}
                          className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
                        >
                          취소
                        </button>
                        <button
                          onClick={() => handleDeleteAccount(password)}
                          disabled={isDeleting}
                          className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md disabled:bg-red-400"
                        >
                          {isDeleting ? "처리중..." : "확인"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            {/* 여기에 다른 설정 탭들의 내용을 추가할 수 있습니다 */}
          </div>
        </div>
      );

    // case "분석 및 통계":
    //   return (
    //     <div className="flex flex-col gap-8 bg-white p-8 rounded-lg shadow-md overflow-y-auto h-full">
    //       <div className="flex justify-between items-center">
    //         <h1 className="text-2xl font-bold text-gray-800">분석 및 통계</h1>
    //         <select
    //           value={timeRange}
    //           onChange={e => setTimeRange(e.target.value)}
    //           className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    //         >
    //           <option>1주일</option>
    //           <option>1개월</option>
    //           <option>3개월</option>
    //           <option>6개월</option>
    //           <option>1년</option>
    //         </select>
    //       </div>

    //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    //         <div className="bg-blue-50 p-6 rounded-lg">
    //           <h2 className="text-lg font-semibold text-blue-700 mb-2">
    //             총 테스트 수
    //           </h2>
    //           <p className="text-3xl font-bold text-blue-800">152</p>
    //         </div>
    //         <div className="bg-green-50 p-6 rounded-lg">
    //           <h2 className="text-lg font-semibold text-green-700 mb-2">
    //             평균 완료율
    //           </h2>
    //           <p className="text-3xl font-bold text-green-800">78.5%</p>
    //         </div>
    //         <div className="bg-yellow-50 p-6 rounded-lg">
    //           <h2 className="text-lg font-semibold text-yellow-700 mb-2">
    //             총 지원자 수
    //           </h2>
    //           <p className="text-3xl font-bold text-yellow-800">1,234</p>
    //         </div>
    //       </div>

    //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    //         <div className="bg-white p-6 rounded-lg border border-gray-200">
    //           <h2 className="text-xl font-semibold text-gray-800 mb-4">
    //             테스 유형별 분포
    //           </h2>
    //           <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
    //             {/* 여기에 실제 차트가 들어갑니다 */}
    //             <p className="text-gray-500">파이 차트</p>
    //           </div>
    //         </div>
    //         <div className="bg-white p-6 rounded-lg border border-gray-200">
    //           <h2 className="text-xl font-semibold text-gray-800 mb-4">
    //             월별 테스트 생성 추이
    //           </h2>
    //           <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
    //             {/* 여기에 실제 차트가 들어갑니다 */}
    //             <p className="text-gray-500">라인 차트</p>
    //           </div>
    //         </div>
    //       </div>

    //       <div className="bg-white p-6 rounded-lg border border-gray-200">
    //         <h2 className="text-xl font-semibold text-gray-800 mb-4">
    //           부서별 테스트 성과
    //         </h2>
    //         <div className="overflow-x-auto">
    //           <table className="min-w-full divide-y divide-gray-200">
    //             <thead className="bg-gray-50">
    //               <tr>
    //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    //                   부서
    //                 </th>
    //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    //                   테스트 수
    //                 </th>
    //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    //                   평균 완료율
    //                 </th>
    //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    //                   평균 점수
    //                 </th>
    //               </tr>
    //             </thead>
    //             <tbody className="bg-white divide-y divide-gray-200">
    //               <tr>
    //                 <td className="px-6 py-4 whitespace-nowrap">개발팀</td>
    //                 <td className="px-6 py-4 whitespace-nowrap">45</td>
    //                 <td className="px-6 py-4 whitespace-nowrap">82%</td>
    //                 <td className="px-6 py-4 whitespace-nowrap">76.5</td>
    //               </tr>
    //               <tr>
    //                 <td className="px-6 py-4 whitespace-nowrap">마케팅팀</td>
    //                 <td className="px-6 py-4 whitespace-nowrap">38</td>
    //                 <td className="px-6 py-4 whitespace-nowrap">79%</td>
    //                 <td className="px-6 py-4 whitespace-nowrap">72.3</td>
    //               </tr>
    //               {/* 더 많은 행을 추가할 수 있습니다 */}
    //             </tbody>
    //           </table>
    //         </div>
    //       </div>
    //     </div>
    //   );

    default:
      return <div>잘못된 탭입니다.</div>;
  }
}
