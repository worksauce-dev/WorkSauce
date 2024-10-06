"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { MdDashboard, MdMail, MdSettings } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import { Logo } from "@/components/common/Logo";
import { User } from "@/types/user";

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
    id: "sendingMail",
    label: "테스트 시작하기",
    icon: MdMail,
    href: "/sending-test",
  },
  { id: "settings", label: "설정", icon: MdSettings, href: "/settings" },
];

const MenuItem: React.FC<{ item: MenuItem; isActive: boolean }> = ({
  item,
  isActive,
}) => (
  <Link href={item.href} passHref>
    <button
      className={`flex items-center gap-3 text-md font-semibold p-3 px-4 rounded-full transition-all duration-200 ${
        isActive
          ? "bg-blue-500 text-white"
          : "text-primary-gray hover:bg-secondary-blue hover:text-primary-blue"
      }`}
    >
      <item.icon size={20} />
      {item.label}
    </button>
  </Link>
);

const UserInfo: React.FC<{ user: User }> = ({ user }) => (
  <div className="flex justify-between items-center">
    <div className="flex flex-col gap-2 text-primary-gray">
      <h6 className="text-base">안녕하세요 {user.name}님!</h6>
      <h6 className="text-base">{user.email}</h6>
    </div>
    <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
      <IoMdSettings size={24} className="text-primary-gray" />
    </button>
  </div>
);

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="min-w-[300px] h-full hidden flex-col gap-6 px-9 py-6 bg-white lg:flex">
      <Logo />
      <UserInfo user={user} />
      <nav className="flex flex-col gap-4">
        {menuItems.map(item => (
          <MenuItem
            key={item.id}
            item={item}
            isActive={pathname === item.href}
          />
        ))}
      </nav>
    </aside>
  );
}
