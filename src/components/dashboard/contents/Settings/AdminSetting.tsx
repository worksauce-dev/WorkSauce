"use client";
import { useEffect, useState } from "react";
import {
  MdPeople,
  MdSettings,
  MdEmail,
  MdWarning,
  MdCheckCircle,
  MdPending,
  MdError,
  MdSearch,
  MdInfo,
  MdEdit,
  MdDelete,
  MdAdd,
  MdUndo,
} from "react-icons/md";

const AdminSetting = () => {
  const [activeTab, setActiveTab] = useState<"users" | "logs">("users");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [invites, setInvites] = useState([
    {
      id: 1,
      email: "user1@example.com",
      status: "pending",
      date: "2024-03-20",
    },
    {
      id: 2,
      email: "user2@example.com",
      status: "accepted",
      date: "2024-03-19",
    },
    {
      id: 3,
      email: "user3@example.com",
      status: "expired",
      date: "2024-03-18",
    },
  ]);

  // 로그 관련 상태
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedDate, setSelectedDate] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [showRevertDialog, setShowRevertDialog] = useState(false);

  // 샘플 로그 데이터
  const logs = [
    {
      id: 1,
      timestamp: "2024-03-20 14:30:00",
      type: "create",
      user: "홍길동",
      action: "새로운 팀 생성",
      details: "개발팀 생성",
      status: "success",
      canRevert: true,
    },
    {
      id: 2,
      timestamp: "2024-03-20 13:45:00",
      type: "update",
      user: "김철수",
      action: "팀 설정 변경",
      details: "팀원 권한 수정",
      status: "success",
      canRevert: true,
    },
    {
      id: 3,
      timestamp: "2024-03-20 12:15:00",
      type: "delete",
      user: "이영희",
      action: "사용자 삭제",
      details: "팀원 제거",
      status: "error",
      canRevert: false,
    },
  ];

  const handleSettingChange = (action: string) => {
    setConfirmAction(action);
    setShowConfirmDialog(true);
  };

  const handleConfirm = () => {
    // 실제 설정 변경 로직 구현
    setShowConfirmDialog(false);
  };

  const handleInvite = () => {
    // 실제 초대 로직은 여기에 구현
    console.log("Inviting:", inviteEmail);
    setInviteEmail("");
  };

  const handleRevert = (log: any) => {
    setSelectedLog(log);
    setShowRevertDialog(true);
  };

  const handleRevertConfirm = () => {
    // 실제 revert 로직은 여기에 구현
    console.log("Reverting log:", selectedLog);
    setShowRevertDialog(false);
    setSelectedLog(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <MdPending className="text-yellow-500" />;
      case "accepted":
        return <MdCheckCircle className="text-green-500" />;
      case "expired":
        return <MdError className="text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "대기 중";
      case "accepted":
        return "수락됨";
      case "expired":
        return "만료됨";
      default:
        return "";
    }
  };

  const getLogTypeIcon = (type: string) => {
    switch (type) {
      case "create":
        return <MdAdd className="text-green-500" />;
      case "update":
        return <MdEdit className="text-blue-500" />;
      case "delete":
        return <MdDelete className="text-red-500" />;
      default:
        return <MdInfo className="text-gray-500" />;
    }
  };

  const getLogStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-green-500";
      case "error":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-full overflow-hidden">
      <div className="p-4 sm:p-6 h-full flex flex-col">
        {/* 헤더 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">관리자 설정</h1>
          <p className="text-sm text-gray-500">
            시스템 설정을 위한 관리자 페이지입니다.
          </p>
        </div>

        {/* 탭 네비게이션 */}
        <div className="flex space-x-4 mb-6 border-b border-gray-200">
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "users"
                ? "text-orange-600 border-b-2 border-orange-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("users")}
          >
            <MdPeople className="inline-block mr-2" />
            사용자 관리
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "logs"
                ? "text-orange-600 border-b-2 border-orange-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("logs")}
          >
            <MdSettings className="inline-block mr-2" />
            시스템 로그
          </button>
        </div>

        {/* 설정 컨텐츠 */}
        <div className="flex-1 overflow-auto">
          {activeTab === "users" && (
            <div className="space-y-6">
              {/* 이메일 초대 섹션 */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  이메일 초대
                </h2>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <input
                        type="email"
                        value={inviteEmail}
                        onChange={e => setInviteEmail(e.target.value)}
                        placeholder="초대할 이메일 주소를 입력하세요"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <button
                      onClick={handleInvite}
                      className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2"
                    >
                      <MdEmail className="w-5 h-5" />
                      초대하기
                    </button>
                  </div>

                  {/* 초대 목록 */}
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">
                      초대 목록
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              이메일
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              상태
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              초대일
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {invites.map(invite => (
                            <tr key={invite.id}>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                {invite.email}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                <div className="flex items-center gap-2">
                                  {getStatusIcon(invite.status)}
                                  {getStatusText(invite.status)}
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                {invite.date}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "logs" && (
            <div className="space-y-6">
              {/* 작업 로그 섹션 */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  작업 로그
                </h2>
                <div className="space-y-4">
                  {/* 필터 섹션 */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="flex-1">
                      <div className="relative">
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={e => setSearchQuery(e.target.value)}
                          placeholder="작업 내용 검색"
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <select
                        value={selectedType}
                        onChange={e => setSelectedType(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="all">모든 작업</option>
                        <option value="create">생성</option>
                        <option value="update">수정</option>
                        <option value="delete">삭제</option>
                      </select>
                      <select
                        value={selectedDate}
                        onChange={e => setSelectedDate(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="all">전체 기간</option>
                        <option value="today">오늘</option>
                        <option value="week">이번 주</option>
                        <option value="month">이번 달</option>
                      </select>
                    </div>
                  </div>

                  {/* 로그 테이블 */}
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            시간
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            작업
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            작업자
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            내용
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            상태
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            작업
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {logs.map(log => (
                          <tr key={log.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {log.timestamp}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                              <div className="flex items-center gap-2">
                                {getLogTypeIcon(log.type)}
                                {log.action}
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {log.user}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500">
                              {log.details}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                              <span className={getLogStatusColor(log.status)}>
                                {log.status === "success" ? "성공" : "실패"}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                              {log.canRevert && (
                                <button
                                  onClick={() => handleRevert(log)}
                                  className="flex items-center gap-1 text-orange-600 hover:text-orange-700"
                                >
                                  <MdUndo className="w-4 h-4" />
                                  되돌리기
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* 페이지네이션 */}
                  <div className="flex justify-between items-center mt-4">
                    <div className="text-sm text-gray-500">
                      총 {logs.length}개의 로그
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        이전
                      </button>
                      <button
                        className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage * 10 >= logs.length}
                      >
                        다음
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 확인 다이얼로그 */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center gap-2 mb-4">
              <MdWarning className="text-yellow-500 w-6 h-6" />
              <h3 className="text-lg font-semibold text-gray-800">
                설정 변경 확인
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              이 설정을 변경하시겠습니까? 이 작업은 시스템에 영향을 미칠 수
              있습니다.
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                onClick={() => setShowConfirmDialog(false)}
              >
                취소
              </button>
              <button
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                onClick={handleConfirm}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 작업 되돌리기 확인 다이얼로그 */}
      {showRevertDialog && selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center gap-2 mb-4">
              <MdWarning className="text-yellow-500 w-6 h-6" />
              <h3 className="text-lg font-semibold text-gray-800">
                작업 되돌리기 확인
              </h3>
            </div>
            <div className="mb-4">
              <p className="text-gray-600 mb-2">
                다음 작업을 되돌리시겠습니까?
              </p>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-gray-800">
                  {selectedLog.action}
                </p>
                <p className="text-sm text-gray-500">{selectedLog.details}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {selectedLog.timestamp} - {selectedLog.user}
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                onClick={() => {
                  setShowRevertDialog(false);
                  setSelectedLog(null);
                }}
              >
                취소
              </button>
              <button
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2"
                onClick={handleRevertConfirm}
              >
                <MdUndo className="w-4 h-4" />
                되돌리기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSetting;
