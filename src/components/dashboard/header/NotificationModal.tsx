// src/components/dashboard/newDashboard/NotificationModal.tsx
import React, { useRef, useEffect, useState } from "react";
import {
  MdNotifications,
  MdCheck,
  MdClose,
  MdMail,
  MdDone,
  MdBlock,
} from "react-icons/md";
import { UserBase } from "@/types/user";
import { formatDate } from "@/utils/dateUtils";
import { DashboardInterface } from "@/types/dashboard";

interface NotificationModalProps {
  dashboardData: DashboardInterface;
  isOpen: boolean;
  onClose: () => void;
  onAction: (action: "accept" | "reject") => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  dashboardData,
  isOpen,
  onClose,
  onAction,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [processingNotification, setProcessingNotification] = useState<
    number | null
  >(null);
  const [actionResult, setActionResult] = useState<{
    [key: number]: "accepted" | "rejected";
  }>({});

  // 모달 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest('button[aria-label="알림"]')
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // 모달 열림/닫힘 애니메이션 처리
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setTimeout(() => {
        setIsAnimating(true);
      }, 10);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleAction = async (index: number, action: "accept" | "reject") => {
    setProcessingNotification(index);
    try {
      await onAction(action);
      setActionResult(prev => ({
        ...prev,
        [index]: action === "accept" ? "accepted" : "rejected",
      }));
    } catch (error) {
      console.error("Action failed:", error);
    } finally {
      setProcessingNotification(null);
    }
  };

  if (!isVisible) return null;

  return (
    <div
      ref={modalRef}
      className={`fixed sm:absolute bottom-0 left-0 right-0 sm:right-0 sm:left-auto sm:bottom-auto sm:top-full sm:mt-2 w-full sm:w-80 md:w-96 lg:w-80 bg-white rounded-t-xl sm:rounded-xl shadow-xl z-50 overflow-hidden border border-gray-100 max-h-[80vh] sm:max-h-96 transition-all duration-300 ease-in-out transform ${
        isAnimating
          ? "translate-y-0 opacity-100"
          : "translate-y-full sm:translate-y-4 opacity-0"
      }`}
    >
      <div className="py-1">
        <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-sm font-semibold text-gray-800">알림</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <MdClose size={18} />
          </button>
        </div>

        {dashboardData.notifications.length === 0 ? (
          <div className="px-4 py-6 text-center">
            <div className="mb-2 text-gray-400">
              <MdNotifications size={32} />
            </div>
            <p className="text-sm text-gray-500">새로운 알림이 없습니다.</p>
          </div>
        ) : (
          <div className="max-h-[60vh] sm:max-h-80 overflow-y-auto scrollbar-none">
            {dashboardData.notifications.map((notification, index) => (
              <React.Fragment key={index}>
                <div
                  className={`px-4 py-3 min-h-[80px] transition-all duration-300 ${
                    notification.status === "pending"
                      ? "bg-orange-50"
                      : actionResult[index] === "accepted"
                      ? "bg-green-50"
                      : actionResult[index] === "rejected"
                      ? "bg-red-50"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start h-full">
                    <div
                      className={`mr-3 mt-1 rounded-full p-1.5 transition-colors duration-300 ${
                        actionResult[index] === "accepted"
                          ? "bg-green-100 text-green-600"
                          : actionResult[index] === "rejected"
                          ? "bg-red-100 text-red-600"
                          : notification.type === "invite"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {actionResult[index] === "accepted" ? (
                        <MdDone size={16} />
                      ) : actionResult[index] === "rejected" ? (
                        <MdBlock size={16} />
                      ) : notification.type === "invite" ? (
                        <MdMail size={16} />
                      ) : (
                        <MdCheck size={16} />
                      )}
                    </div>
                    <div className="flex-1 flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {notification.type === "invite"
                            ? `${notification.name}님이 초대를 요청했습니다`
                            : `${notification.name}님이 ${
                                notification.testType === "sugar"
                                  ? "슈가테스트"
                                  : "소스테스트"
                              }를 완료했습니다.`}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(notification.createdAt)}
                        </p>
                        {actionResult[index] && (
                          <p
                            className={`text-xs mt-1 ${
                              actionResult[index] === "accepted"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {actionResult[index] === "accepted"
                              ? "초대 요청을 수락했습니다"
                              : "초대 요청을 거절했습니다"}
                          </p>
                        )}
                      </div>

                      {notification.status === "pending" &&
                        notification.type === "invite" &&
                        !actionResult[index] && (
                          <div className="flex space-x-1 ml-3">
                            <button
                              onClick={() => handleAction(index, "accept")}
                              disabled={processingNotification === index}
                              className={`text-xs p-1.5 rounded-full shadow-sm transition-all duration-200 flex items-center justify-center transform hover:scale-105 ${
                                processingNotification === index
                                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                  : "bg-gradient-to-r from-green-400 to-green-500 text-white hover:from-green-500 hover:to-green-600"
                              }`}
                            >
                              {processingNotification === index ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <MdCheck size={14} />
                              )}
                            </button>
                            <button
                              onClick={() => handleAction(index, "reject")}
                              disabled={processingNotification === index}
                              className={`text-xs p-1.5 rounded-full shadow-sm transition-all duration-200 flex items-center justify-center transform hover:scale-105 ${
                                processingNotification === index
                                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                  : "bg-gradient-to-r from-red-400 to-red-500 text-white hover:from-red-500 hover:to-red-600"
                              }`}
                            >
                              {processingNotification === index ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <MdClose size={14} />
                              )}
                            </button>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
                {index < dashboardData.notifications.length - 1 && (
                  <div className="h-px bg-gray-200 mx-4"></div>
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {dashboardData.notifications.length > 0 && (
          <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
            <button
              className="text-xs text-orange-500 hover:text-orange-600 font-medium"
              onClick={onClose}
            >
              모두 닫기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationModal;
