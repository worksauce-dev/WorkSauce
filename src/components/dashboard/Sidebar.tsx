"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  MdDashboard,
  MdMail,
  MdHelp,
  MdLogout,
  MdCalendarMonth,
  MdContacts,
} from "react-icons/md";
import { Logo } from "@/components/common/Logo";
import { User } from "@/types/user";
import { signOut } from "next-auth/react";

interface SidebarProps {
  user: User;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
}

const menuItems: MenuItem[] = [
  {
    id: "dashboard",
    label: "대시보드",
    icon: MdDashboard,
    href: "/dashboard",
  },
  {
    id: "calendar",
    label: "캘린더  ",
    icon: MdCalendarMonth,
    href: "/dashboard/calendar",
  },
  {
    id: "contacts",
    label: "주소록",
    icon: MdContacts,
    href: "/dashboard/contacts",
  },
  {
    id: "sendingMail",
    label: "진단도구 발송하기",
    icon: MdMail,
    href: "/sending-test",
  },
];

const MenuItem: React.FC<{ item: MenuItem; isActive: boolean }> = ({
  item,
  isActive,
}) => (
  <Link
    href={item.href}
    passHref
    className={`flex items-center gap-3 text-md font-semibold p-3 px-4 rounded-full transition-all duration-200 ${
      isActive
        ? "bg-primary-accent hover:bg-primary-accent-hover text-white shadow-md shadow-orange-100"
        : "text-primary-gray hover:bg-orange-50 hover:text-orange-500"
    }`}
  >
    <item.icon size={20} />
    {item.label}
  </Link>
);

const UserInfo: React.FC<{ user: User }> = ({ user }) => (
  <div className="flex justify-between items-center w-full px-4">
    <div className="flex flex-col gap-2 text-primary-gray">
      <h6 className="text-base">안녕하세요 {user.name}님!</h6>
      <h6 className="text-base">{user.email}</h6>
    </div>
    <button
      onClick={() => signOut()}
      className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
      title="로그아웃"
    >
      <MdLogout size={24} className="text-primary-gray hover:text-red-500" />
    </button>
  </div>
);

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="min-w-[300px] h-full hidden flex-col gap-8 px-9 py-6 bg-white lg:flex drop-shadow">
      <Logo />
      <UserInfo user={user} />
      <nav className="flex flex-col gap-8 border-t border-gray-200 pt-8">
        {menuItems.map(item => (
          <MenuItem
            key={item.id}
            item={item}
            isActive={pathname === item.href}
          />
        ))}
      </nav>
      <Link
        href={
          process.env.NEXT_PUBLIC_DOCUMENTATION_URL ||
          "https://worksauce.gitbook.io/infomation"
        }
        className="mt-auto flex items-center gap-2 text-sm text-primary-gray hover:text-primary-blue cursor-pointer"
      >
        <MdHelp />
        <span>도움말</span>
      </Link>
    </aside>
  );
}
