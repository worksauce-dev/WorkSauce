"use client";

import { useState } from "react";
import {
  MdDashboard,
  MdAdd,
  MdEmail,
  MdCheckCircle,
  MdError,
  MdClose,
} from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { UserBase } from "@/types/user";
import { useRouter } from "next/navigation";

interface NoDashboardContentProps {
  userBase: UserBase;
  createDashboard: (
    userId: string,
    userName: string,
    userEmail: string
  ) => Promise<string>;
  requestDashboardInvite: (
    senderEmail: string,
    recipientEmail: string,
    userId: string,
    userName: string
  ) => Promise<{
    success: boolean;
    message?: string;
  }>;
  checkRecipientName: (email: string) => Promise<{
    success: boolean;
    name?: string;
    message?: string;
  }>;
}

const NoDashboardContent = ({
  userBase,
  createDashboard,
  requestDashboardInvite,
  checkRecipientName,
}: NoDashboardContentProps) => {
  const router = useRouter();
  const [adminEmail, setAdminEmail] = useState("");
  const [isRequesting, setIsRequesting] = useState(false);
  const [isCheckingName, setIsCheckingName] = useState(false);
  const [requestStatus, setRequestStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [requestMessage, setRequestMessage] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [adminName, setAdminName] = useState("");
  const [nameCheckError, setNameCheckError] = useState("");

  const handleInviteRequest = async () => {
    try {
      setIsRequesting(true);
      setRequestStatus("loading");
      setRequestMessage("초대 요청 중...");

      const result = await requestDashboardInvite(
        userBase.email,
        adminEmail,
        userBase.id,
        userBase.name
      );

      if (result.success) {
        setRequestStatus("success");
        setRequestMessage(
          "초대 요청이 성공적으로 전송되었습니다. 승인 후 대시보드에 참여할 수 있습니다."
        );
        setAdminEmail("");
        setAdminName("");
      } else {
        setRequestStatus("error");
        setRequestMessage(
          result.message || "초대 요청 중 오류가 발생했습니다."
        );
      }
    } catch (error) {
      setRequestStatus("error");
      setRequestMessage("초대 요청 중 오류가 발생했습니다.");
    } finally {
      setIsRequesting(false);
      setShowConfirmation(false);
    }
  };

  const handleCreateDashboard = async () => {
    const dashboardId = await createDashboard(
      userBase.id,
      userBase.name,
      userBase.email
    );

    router.push(`/dashboard/${dashboardId}`);
  };

  const handleRequestClick = async () => {
    try {
      setIsCheckingName(true);
      setNameCheckError("");

      const response = await checkRecipientName(adminEmail);

      if (response.success && response.name) {
        setAdminName(response.name);
        setShowConfirmation(true);
      } else {
        setNameCheckError(
          response.message || "유저 정보를 확인할 수 없습니다."
        );
      }
    } catch (error) {
      setNameCheckError("유저 정보 확인 중 오류가 발생했습니다.");
    } finally {
      setIsCheckingName(false);
    }
  };

  const getButtonContent = () => {
    if (isCheckingName) {
      return (
        <span className="flex items-center">
          <svg
            className="animate-spin -ml-1 mr-2 h-5 w-5 text-orange-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          확인 중...
        </span>
      );
    }

    switch (requestStatus) {
      case "loading":
        return (
          <span className="flex items-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-5 w-5 text-orange-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            처리 중...
          </span>
        );
      case "success":
        return (
          <span className="flex items-center">
            <MdCheckCircle className="mr-2" size={20} />
            전송 완료
          </span>
        );
      case "error":
        return (
          <span className="flex items-center">
            <MdError className="mr-2" size={20} />
            재시도
          </span>
        );
      default:
        return "초대 요청";
    }
  };

  const getButtonStyles = () => {
    const baseStyles =
      "h-14 px-6 border-2 rounded-xl font-medium transition-all duration-300 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:-translate-y-0.5 whitespace-nowrap flex items-center justify-center min-w-[120px]";

    switch (requestStatus) {
      case "success":
        return `${baseStyles} bg-green-50 text-green-600 border-green-500 hover:bg-green-100`;
      case "error":
        return `${baseStyles} bg-red-50 text-red-600 border-red-500 hover:bg-red-100`;
      default:
        return `${baseStyles} bg-white text-orange-500 border-orange-500 hover:bg-orange-50 disabled:opacity-50`;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] py-12 px-4 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-64 h-64 mb-8 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center shadow-lg"
      >
        <MdDashboard size={120} className="text-orange-500" />
        <div className="absolute inset-0 rounded-full border-4 border-orange-200 border-dashed animate-spin-slow" />
      </motion.div>

      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-4xl font-bold text-gray-800 mb-4"
      >
        아직 속한 대시보드가 없습니다
      </motion.h2>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-gray-600 mb-12 max-w-md text-lg leading-relaxed"
      >
        새로운 대시보드를 만들어 팀원들과 협업을 시작하세요. <br />
        또는 관리자에게 초대를 요청할 수 있습니다.
      </motion.p>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl mx-auto px-4"
      >
        <button
          onClick={handleCreateDashboard}
          className="h-14 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          <MdAdd
            className="mr-2 group-hover:rotate-90 transition-transform duration-300"
            size={24}
          />
          새 대시보드 만들기
        </button>

        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <MdEmail
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="email"
                value={adminEmail}
                onChange={e => setAdminEmail(e.target.value)}
                placeholder="관리자 이메일"
                className="w-full h-14 pl-10 pr-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
              />
            </div>
            <button
              onClick={handleRequestClick}
              disabled={
                isRequesting ||
                !adminEmail ||
                requestStatus === "success" ||
                isCheckingName
              }
              className={getButtonStyles()}
            >
              {getButtonContent()}
            </button>
          </div>
          {nameCheckError && (
            <motion.p
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-red-500 text-sm text-left"
            >
              {nameCheckError}
            </motion.p>
          )}
        </div>
      </motion.div>

      {requestMessage && (
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`mt-6 text-sm font-medium ${
            requestStatus === "success"
              ? "text-green-600"
              : requestStatus === "error"
              ? "text-red-600"
              : "text-gray-600"
          }`}
        >
          {requestMessage}
        </motion.p>
      )}

      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">
                  초대 요청 확인
                </h3>
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <MdClose size={24} />
                </button>
              </div>

              <p className="text-gray-600 mb-6">
                <strong>{adminName}</strong>님의 대시보드에 초대 요청을
                보내드릴까요?
              </p>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1 h-12 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleInviteRequest}
                  className="flex-1 h-12 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors"
                >
                  확인
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NoDashboardContent;
