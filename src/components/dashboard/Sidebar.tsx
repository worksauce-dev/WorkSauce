"use client";

import { useState } from "react";
import { MdDashboard, MdCalendarToday, MdSettings } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import { Logo } from "@/components/common/Logo";
import { User } from "@/types/user";
interface SidebarProps {
  user: User;
}

// 이 컴포넌트는 페이지 컴포넌트 내부나 별도의 파일로 분리할 수 있습니다.
export default function Sidebar({ user }: SidebarProps) {
  const [activePage, setActivePage] = useState("dashboard");

  const menuItems = [
    { id: "dashboard", label: "대시보드", icon: MdDashboard },
    { id: "calendar", label: "캘린더", icon: MdCalendarToday },
    { id: "settings", label: "설정", icon: MdSettings },
  ];

  return (
    <aside className="min-w-[300px] h-full hidden flex-col gap-6 px-9 py-6 bg-white lg:flex">
      <div className="flex items-center">
        <Logo />
      </div>
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-2 text-primary-gray">
          <h6 className="text-base">안녕하세요 {user.name}님!</h6>
          <h6 className="text-base">@</h6>
        </div>
        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
          <IoMdSettings size={24} className="text-primary-gray" />
        </button>
      </div>
      <nav className="flex flex-col gap-4">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`flex items-center gap-3 text-md font-semibold p-3 px-4 rounded-full transition-all duration-200 ${
              activePage === item.id
                ? "bg-blue-500 text-white"
                : "text-primary-gray hover:bg-secondary-blue hover:text-primary-blue"
            }`}
          >
            <item.icon size={20} />
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
