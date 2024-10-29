import Link from "next/link";
import { useState } from "react";
import { Group } from "@/types/group";
import { format } from "date-fns";

interface DashboardContentProps {
  activeTab: "대시보드" | "지원자 검색" | "설정";
  groupData: Group[];
}

export default function DashboardContent({
  activeTab,
  groupData,
}: DashboardContentProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTestGroup, setSelectedTestGroup] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [activeSettingTab, setActiveSettingTab] = useState("프로필");
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
  });

  const filteredApplicants = groupData
    .map(group => group.applicants)
    .flat()
    .filter(
      applicant =>
        (applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          applicant.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (selectedTestGroup === "" || applicant.groupId === selectedTestGroup) &&
        (selectedStatus === "" || applicant.testStatus === selectedStatus)
    );

  switch (activeTab) {
    case "대시보드":
      return (
        <div className="flex gap-4 sm:gap-8 h-full flex-col lg:flex-row">
          <div className="flex flex-col gap-4 md:gap-8 bg-white p-4 md:p-8 rounded-lg w-full lg:w-3/5 shadow-md overflow-y-auto h-full">
            <h1 className="text-lg md:text-2xl font-bold text-gray-800">
              최근 워크소스 현황
            </h1>
            {groupData.length === 0 ? (
              <div className="my-auto flex flex-col items-center justify-center py-12 text-center">
                <svg
                  className="w-16 h-16 text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  ></path>
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  아직 생성된 워크소스가 없습니다
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  새로운 워크소스를 생성하여 지원자들을 관리해보세요
                </p>
                <Link
                  href="/sending-test"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  워크소스 생성하기
                </Link>
              </div>
            ) : (
              <ul className="flex flex-col gap-4">
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
                      <li
                        key={group.groupId}
                        className="border-b border-gray-200 pb-4 hover:bg-gray-50 transition rounded-lg p-4"
                      >
                        <div className="flex justify-between items-center">
                          <Link
                            href={`/group/${group.groupId}`}
                            className="flex flex-col gap-2"
                          >
                            <h1 className="text-sm md:text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors duration-300">
                              {group.name}
                            </h1>
                            <div className="flex items-center gap-2">
                              <span className="bg-blue-100 text-blue-800 text-xs md:text-sm font-medium p-1 md:px-2.5 md:py-0.5 rounded-full">
                                지원자 {group.applicants.length}명
                              </span>
                              <span className="text-xs md:text-sm text-gray-500">
                                마감일:{" "}
                                {format(new Date(group.deadline), "MM/dd/yyyy")}
                              </span>
                            </div>
                          </Link>
                          <div className="flex flex-col items-end gap-2">
                            <div className="flex items-center">
                              <svg
                                className="w-4 h-4 text-green-500 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M5 13l4 4L19 7"
                                ></path>
                              </svg>
                              <span className="text-xs md:text-sm font-medium text-green-600">
                                완료한 지원자: {completedApplicants.length}
                              </span>
                            </div>
                            <div className="w-16 md:w-32 bg-gray-200 rounded-full h-2.5">
                              <div
                                className="bg-blue-600 h-2.5 rounded-full"
                                style={
                                  completedApplicants.length === 0
                                    ? { width: "0%" }
                                    : {
                                        width: `${
                                          (completedApplicants.length /
                                            group.applicants.length) *
                                          100
                                        }%`,
                                      }
                                }
                              ></div>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
              </ul>
            )}
          </div>
          <div className="flex flex-col gap-4 md:gap-8 bg-white p-4 md:p-8 rounded-lg w-full lg:w-2/5 shadow-md overflow-y-auto h-full">
            <h1 className="text-lg md:text-2xl font-bold text-gray-800">
              공지사항
            </h1>
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4 transition-all duration-300 hover:shadow-md">
                <div className="flex items-center gap-3 mb-2">
                  <svg
                    className="w-5 h-5 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <h6 className="text-sm md:text-lg font-semibold text-blue-700">
                    시스템 업데이트 일정
                  </h6>
                </div>
                <p className="text-xs md:text-sm text-blue-600">
                  2024년 10월 01일 오전 2시부터 6시까지 시스템 점검이 있을
                  예정입니다
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 transition-all duration-300 hover:shadow-md">
                <div className="flex items-center gap-3 mb-2">
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <h6 className="text-sm md:text-lg font-semibold text-green-700">
                    신규 기능 출시
                  </h6>
                </div>
                <p className="text-xs md:text-sm text-green-600">
                  새로운 분석 도구가 추가되었습니다. 지금 바로 확인해보세요!
                </p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4 transition-all duration-300 hover:shadow-md">
                <div className="flex items-center gap-3 mb-2">
                  <svg
                    className="w-5 h-5 text-yellow-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    ></path>
                  </svg>
                  <h6 className="text-sm md:text-lg font-semibold text-yellow-700">
                    중요 공지
                  </h6>
                </div>
                <p className="text-xs md:text-sm text-yellow-600">
                  다음 주 화요일에 전체 회의가 예정되어 있습니다. 참석 바랍니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      );

    case "지원자 검색":
      return (
        <div className="flex flex-col gap-6 bg-white p-8 rounded-lg shadow-md overflow-y-auto h-full">
          <h1 className="text-2xl font-bold text-gray-800">지원자 검색</h1>

          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="이름 또는 이메일로 검색"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={selectedTestGroup}
              onChange={e => setSelectedTestGroup(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">모든 상태</option>
              <option value="completed">완료</option>
              <option value="pending">진행 중</option>
              <option value="expired">만료</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[20%]">
                    이름
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[30%]">
                    이메일
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[25%]">
                    테스트 그룹
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">
                    상태
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">
                    액션
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredApplicants.map(applicant => (
                  <tr key={`${applicant.groupId}-${applicant.email}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {applicant.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {applicant.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        href={`/group/${applicant.groupId}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        {applicant.groupName}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          applicant.testStatus === "completed"
                            ? "bg-green-100 text-green-800"
                            : applicant.testStatus === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {applicant.testStatus}
                      </span>
                    </td>
                    {applicant.testStatus === "completed" && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          href={`/group/${applicant.groupId}/${applicant.name}`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          상세보기
                        </Link>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );

    case "설정":
      return (
        <div className="flex flex-col md:flex-row gap-8 bg-white p-8 rounded-lg shadow-md overflow-y-auto h-full">
          <div className="w-full md:w-1/4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">설정</h2>
            <ul className="space-y-2">
              {["프로필", "알림", "보안", "테스트 설정", "통합", "청구"].map(
                tab => (
                  <li key={tab}>
                    <button
                      onClick={() => setActiveSettingTab(tab)}
                      className={`w-full text-left px-4 py-2 rounded-md ${
                        activeSettingTab === tab
                          ? "bg-blue-500 text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {tab}
                    </button>
                  </li>
                )
              )}
            </ul>
          </div>
          <div className="w-full md:w-3/4">
            {activeSettingTab === "프로필" && (
              <div>
                <h3 className="text-lg font-semibold mb-4">프로필 설정</h3>
                <form className="space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      이름
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      이메일
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="company"
                      className="block text-sm font-medium text-gray-700"
                    >
                      회사명
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full md:w-auto px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    변경사항 저장
                  </button>
                </form>
              </div>
            )}
            {activeSettingTab === "알림" && (
              <div>
                <h3 className="text-lg font-semibold mb-4">알림 설정</h3>
                <div className="space-y-4">
                  {Object.entries(notifications).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {key} 알림
                      </span>
                      <label className="flex items-center cursor-pointer">
                        <div className="relative">
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={value}
                            onChange={() =>
                              setNotifications(prev => ({
                                ...prev,
                                [key as keyof typeof prev]:
                                  !prev[key as keyof typeof prev],
                              }))
                            }
                          />
                          <div className="w-10 h-4 bg-gray-400 rounded-full shadow-inner"></div>
                          <div
                            className={`absolute w-6 h-6 bg-white rounded-full shadow -left-1 -top-1 transition ${
                              value
                                ? "transform translate-x-full bg-blue-500"
                                : ""
                            }`}
                          ></div>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeSettingTab === "보안" && (
              <div>
                <h3 className="text-lg font-semibold mb-4">보안 설정</h3>
                <form className="space-y-4">
                  <div>
                    <label
                      htmlFor="current-password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      현재 비밀번호
                    </label>
                    <input
                      type="password"
                      id="current-password"
                      name="current-password"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="new-password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      새 비밀번호
                    </label>
                    <input
                      type="password"
                      id="new-password"
                      name="new-password"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="confirm-password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      새 비밀번호 확인
                    </label>
                    <input
                      type="password"
                      id="confirm-password"
                      name="confirm-password"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full md:w-auto px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    비밀번호 변경
                  </button>
                </form>
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
    //             테스�� 유형별 분포
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
