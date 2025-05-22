import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  MdMenu,
  MdNotifications,
  MdHome,
  MdSettings,
  MdLogout,
} from "react-icons/md";
import { UserBase } from "@/types/user";
import {
  DashboardInterface,
  CollaboratorNotification,
} from "@/types/dashboard";
import NotificationModal from "./NotificationModal";
import { HeaderLogo } from "@/components/common/Logo";
import { signOut } from "next-auth/react";

interface HeaderProps {
  dashboardData: DashboardInterface;
  userBase: UserBase;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isSidebarOpen: boolean) => void;
  acceptInviteRequest: (dashboardId: string) => Promise<{ success: boolean }>;
}

const DashboardHeader = ({
  userBase,
  isSidebarOpen,
  setIsSidebarOpen,
  dashboardData,
  acceptInviteRequest,
}: HeaderProps): JSX.Element => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [processedNotifications, setProcessedNotifications] = useState<
    Set<string>
  >(new Set());

  // pending 상태의 노티피케이션 개수 계산 (메모이제이션)
  const pendingNotificationsCount = useMemo(() => {
    return dashboardData.notifications.filter(
      notification =>
        notification.status === "pending" &&
        notification.type === "invite" &&
        !processedNotifications.has(
          (notification as CollaboratorNotification).userId
        )
    ).length;
  }, [dashboardData.notifications, processedNotifications]);

  const handleNotificationAction = async (action: "accept" | "reject") => {
    if (action === "accept") {
      const result = await acceptInviteRequest(dashboardData.dashboardId);
      if (result.success) {
        // 처리된 알림을 Set에 추가
        const pendingNotifications = dashboardData.notifications.filter(
          n => n.status === "pending" && n.type === "invite"
        );
        if (pendingNotifications.length > 0) {
          setProcessedNotifications(prev => {
            const newSet = new Set(prev);
            pendingNotifications.forEach(n =>
              newSet.add((n as CollaboratorNotification).userId)
            );
            return newSet;
          });
        }
        setIsNotificationOpen(false);
      }
    } else {
      // 거절 시에도 처리된 알림으로 표시
      const pendingNotifications = dashboardData.notifications.filter(
        n => n.status === "pending" && n.type === "invite"
      );
      if (pendingNotifications.length > 0) {
        setProcessedNotifications(prev => {
          const newSet = new Set(prev);
          pendingNotifications.forEach(n =>
            newSet.add((n as CollaboratorNotification).userId)
          );
          return newSet;
        });
      }
      setIsNotificationOpen(false);
    }
  };

  // 대시보드 데이터가 변경되면 처리된 알림 초기화
  useEffect(() => {
    setProcessedNotifications(new Set());
  }, [dashboardData.dashboardId]);

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleUserMenuClick = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex justify-between items-center py-2 px-4">
        <div className="flex items-center space-x-4">
          <button
            type="button"
            className="ml-4 text-gray-600 hover:text-gray-900 focus:outline-none"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label="좌측 메뉴 접기/펼치기"
          >
            <MdMenu size={24} />
          </button>
          <HeaderLogo />
        </div>

        {/* 서비스 영역 */}
        <div className="flex items-center space-x-4">
          <button
            type="button"
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium text-gray-700"
          >
            {dashboardData.isVerified === "verified"
              ? dashboardData.organization.companyInfo.companyName
              : userBase.name}
          </button>

          {/* 알람 아이콘 및 드롭다운 */}
          <div className="relative">
            <button
              type="button"
              className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
              aria-label="알림"
              title="알림"
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            >
              <MdNotifications size={20} />
              {pendingNotificationsCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-primary-accent rounded-full">
                  {pendingNotificationsCount}
                </span>
              )}
            </button>

            {/* 노티피케이션 모달 */}
            <NotificationModal
              dashboardData={dashboardData}
              isOpen={isNotificationOpen}
              onClose={() => setIsNotificationOpen(false)}
              onAction={handleNotificationAction}
            />
          </div>
          <div className="relative" ref={userMenuRef}>
            <button
              type="button"
              className="p-1 focus:outline-none"
              aria-label="사용자 정보"
              title="사용자 정보"
              onClick={handleUserMenuClick}
            >
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">
                  {userBase.name.charAt(0) || "U"}
                </span>
              </div>
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-800">
                    {userBase.name}
                  </p>
                  <p className="text-xs text-gray-500">{userBase.email}</p>
                </div>
                <a
                  href={`/dashboard/${userBase.dashboardId}/accountSetting`}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <MdSettings className="mr-2" size={16} />
                  계정 설정
                </a>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  <MdLogout className="mr-2" size={16} />
                  로그아웃
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
