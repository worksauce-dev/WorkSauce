"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  MdDashboard,
  MdGroup,
  MdEmail,
  MdCalendarToday,
  MdSettings,
  MdKeyboardArrowDown,
} from "react-icons/md";

interface SidebarContentProps {
  onNavigate: (path: string) => void;
}

// 공통으로 사용될 사이드바 컨텐츠 컴포넌트
const SidebarContent: React.FC<SidebarContentProps> = ({ onNavigate }) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const toggleSubMenu = (menuName: string) => {
    if (activeMenu === menuName) {
      setActiveMenu(null);
    } else {
      setActiveMenu(menuName);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 pt-8 space-y-4">
        {/* 대시보드 섹션 */}
        <div className="space-y-2">
          <span className="block px-4 py-2 text-sm text-gray-500 uppercase">
            메인
          </span>

          <button
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-orange-50 rounded-md w-full"
            onClick={() => onNavigate("")}
          >
            <MdDashboard className="mr-2" size={18} />
            <span>대시보드</span>
          </button>
        </div>

        <button
          className="flex items-center px-4 py-2 text-gray-700 hover:bg-orange-50 rounded-md w-full"
          onClick={() => onNavigate("/calendar")}
        >
          <MdCalendarToday className="mr-2" size={18} />
          <span>캘린더</span>
        </button>

        <div className="space-y-2">
          <button
            className="flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-orange-50 rounded-md w-full"
            onClick={() => toggleSubMenu("teams")}
          >
            <div className="flex items-center">
              <MdGroup className="mr-2" size={18} />
              <span>팀 관리</span>
            </div>
            <MdKeyboardArrowDown
              className={`transition-transform duration-200 ${
                activeMenu === "teams" ? "rotate-180" : ""
              }`}
              size={16}
            />
          </button>
          {activeMenu === "teams" && (
            <button
              className="pl-8 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-orange-50 px-2 rounded w-full text-left"
              onClick={() => onNavigate("/teamManageMent")}
            >
              팀 관리하기
            </button>
          )}
        </div>

        <div className="space-y-2">
          <button
            className="flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-orange-50 rounded-md w-full"
            onClick={() => toggleSubMenu("diagnostics")}
          >
            <div className="flex items-center">
              <MdEmail className="mr-2" size={18} />
              <span>진단</span>
            </div>
            <MdKeyboardArrowDown
              className={`transition-transform duration-200 ${
                activeMenu === "diagnostics" ? "rotate-180" : ""
              }`}
              size={16}
            />
          </button>
          {activeMenu === "diagnostics" && (
            <button
              className="pl-8 py-2  text-sm text-gray-600 hover:text-gray-900 hover:bg-orange-50 px-2 rounded w-full text-left"
              onClick={() => onNavigate("/testSelector")}
            >
              진단 시작하기
            </button>
          )}
        </div>

        <div className="space-y-2">
          <button
            className="flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-orange-50 rounded-md w-full"
            onClick={() => toggleSubMenu("adminSetting")}
          >
            <div className="flex items-center">
              <MdSettings className="mr-2" size={18} />
              <span>설정</span>
            </div>
            <MdKeyboardArrowDown
              className={`transition-transform duration-200 ${
                activeMenu === "adminSetting" ? "rotate-180" : ""
              }`}
              size={16}
            />
          </button>
          {activeMenu === "adminSetting" && (
            <div className="flex flex-col gap-2">
              <button
                className="pl-8 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-orange-50 px-2 rounded w-full text-left"
                onClick={() => onNavigate("/accountSetting")}
              >
                계정 설정
              </button>

              <button
                className="pl-8 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-orange-50 px-2 rounded w-full text-left"
                onClick={() => onNavigate("/adminSetting")}
              >
                관리자 설정
              </button>

              <button
                className="pl-8 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-orange-50 px-2 rounded w-full text-left"
                onClick={() => onNavigate("/registerCompany")}
              >
                회사 등록하기
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 푸터 */}
      <footer className="p-4 border-t text-xs text-gray-500">
        <div className="flex">
          <button className="block mb-1 hover:text-gray-700">이용약관</button>
          <span className="mx-2">|</span>
          <button className="block mb-1 hover:text-gray-700">
            개인정보처리방침
          </button>
        </div>
        <button className="block hover:text-gray-700">ⓒ 워크소스</button>
      </footer>
    </div>
  );
};

// 데스크톱 사이드바 컴포넌트
const DesktopSidebar: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
  const router = useRouter();
  const params = useParams();
  const dashboardId = params.dashboardId as string;

  const handleNavigation = (path: string) => {
    router.push(`/dashboard/${dashboardId}${path}`);
  };

  if (!isOpen) return null;

  return (
    <div className="hidden md:block w-64 bg-white shadow-md border-r border-gray-200">
      <SidebarContent onNavigate={handleNavigation} />
    </div>
  );
};

// 모바일 사이드바 컴포넌트
const MobileSidebar: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const params = useParams();
  const dashboardId = params.dashboardId as string;

  const handleNavigation = (path: string) => {
    router.push(`/dashboard/${dashboardId}${path}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* 오버레이 */}
      <div
        className="fixed inset-0 bg-gray-900 bg-opacity-50 z-40 md:hidden"
        onClick={onClose}
      />
      {/* 모바일 사이드바 */}
      <div
        className={`block md:hidden fixed inset-y-0 left-0 w-64 bg-white shadow-md z-50 
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <SidebarContent onNavigate={handleNavigation} />
      </div>
    </>
  );
};

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// 메인 사이드바 컴포넌트
const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  isOpen,
  onClose,
}) => {
  // 모바일은 props의 isOpen 상태 사용
  const isMobileOpen = isOpen;

  return (
    <>
      <DesktopSidebar isOpen={isOpen} />
      <MobileSidebar isOpen={isMobileOpen} onClose={onClose} />
    </>
  );
};

export default DashboardSidebar;
