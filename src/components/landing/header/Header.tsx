"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { logOut } from "@/services/authService";
import { useRouter } from "next/navigation";
import { getErrorMessage } from "@/utils/getErrorMessage";
import useAuth from "@/hooks/useAuth";
import { Logo } from "./logo";

type MenuItem = {
  href?: string;
  label: string;
  onClick?: () => Promise<void>;
};

export const Header = ({}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();

  const guestMenuItems: MenuItem[] = [
    { href: "test", label: "테스트하기" },
    { href: "email", label: "이메일 테스트" },
    { href: "doc", label: "도움말" },
    { href: "login", label: "로그인 / 회원가입" },
  ];

  const userMenuItems: MenuItem[] = [
    { href: "test", label: "테스트하기" },
    { href: "email", label: "이메일 테스트" },
    { href: "dashboard", label: "대시보드" },
    {
      label: "로그아웃",
      onClick: async () => {
        try {
          await logOut();
          router.push("/");
        } catch (error) {
          getErrorMessage(error);
        }
      },
    },
  ];

  const renderMenu = () => {
    const items = user ? userMenuItems : guestMenuItems;
    return items.map((item, index) => (
      <motion.a
        key={index}
        href={item.href}
        onClick={item.onClick ? item.onClick : undefined}
        className="block text-gray-800 hover:text-blue-600 py-2 px-4 rounded-md hover:bg-gray-100 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {item.label}
      </motion.a>
    ));
  };

  return (
    <header className="z-[99] bg-white w-full shadow fixed top-0">
      <nav className="mx-auto px-6 py-4 flex justify-between items-center">
        <Logo />
        <div className="hidden md:flex space-x-1">{renderMenu()}</div>
        <motion.button
          className="md:hidden text-gray-600 hover:text-blue-600 p-2 rounded-md"
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </motion.button>
      </nav>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white shadow-lg rounded-b-lg overflow-hidden"
          >
            <div className="px-4 py-2 space-y-1">{renderMenu()}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
