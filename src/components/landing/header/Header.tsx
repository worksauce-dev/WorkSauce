"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "../../common/Logo";
import { signOut } from "next-auth/react";
import { User } from "@/types/user";
import { MdMenu, MdClose } from "react-icons/md";

type MenuItem = {
  href?: string;
  label: string;
  onClick?: () => Promise<void>;
};

export const Header = ({ user }: { user: User | null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 메뉴 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const guestMenuItems: MenuItem[] = [
    {
      href:
        process.env.NEXT_PUBLIC_DOCUMENTATION_URL ||
        "https://worksauce.gitbook.io/infomation",
      label: "도움말",
    },
    { href: "login", label: "로그인 / 회원가입" },
  ];

  const userMenuItems: MenuItem[] = [
    {
      href:
        process.env.NEXT_PUBLIC_DOCUMENTATION_URL ||
        "https://worksauce.gitbook.io/infomation",
      label: "도움말",
    },
    { href: "/dashboard", label: "대시보드" },
    ...(user?.isAdmin ? [{ href: "admin", label: "관리자 페이지" }] : []),
    {
      label: "로그아웃",
      onClick: handleSignOut,
    },
  ];

  const renderMenu = (isMobile = false) => {
    const items = user ? userMenuItems : guestMenuItems;
    return items.map((item, index) => (
      <motion.a
        key={index}
        href={item.href}
        onClick={e => {
          if (item.onClick) {
            e.preventDefault();
            item.onClick();
          }
          setIsOpen(false);
        }}
        className={`block transition-colors ${
          isMobile
            ? "py-3 px-4 text-sm w-full text-left border-b border-orange-200 last:border-b-0 text-gray-800 hover:bg-orange-500 hover:text-white"
            : "py-2 px-4 rounded-md text-gray-800 hover:bg-orange-500 hover:text-white"
        }`}
        whileHover={{
          scale: 1.02,
          transition: { duration: 0.2 },
        }}
        whileTap={{ scale: 0.98 }}
        target={item.label === "도움말" ? "_blank" : undefined}
      >
        {item.label}
      </motion.a>
    ));
  };

  return (
    <header className="z-[99] bg-white w-full fixed top-0 shadow-sm py-3">
      <nav className="mx-auto px-6 flex justify-between items-center container">
        <Logo className="h-8 w-auto" />

        <div className="hidden md:flex space-x-1">{renderMenu()}</div>

        <div className="md:hidden relative" ref={menuRef}>
          <motion.button
            className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
              isOpen
                ? "bg-orange-500 text-white"
                : "text-gray-600 hover:text-orange-500 hover:bg-orange-50"
            }`}
            onClick={() => setIsOpen(!isOpen)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={isOpen ? "메뉴 닫기" : "메뉴 열기"}
          >
            {isOpen ? (
              <MdClose className="w-5 h-5" />
            ) : (
              <MdMenu className="w-6 h-6" />
            )}
          </motion.button>

          <AnimatePresence>
            {isOpen && (
              <>
                {/* 반투명 오버레이 */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/5 z-10"
                  onClick={() => setIsOpen(false)}
                  style={{ backdropFilter: "blur(1px)" }}
                />

                {/* 드롭다운 메뉴 */}
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-12 bg-white rounded-lg overflow-hidden w-52 z-20 shadow-[0_4px_20px_rgba(249,115,22,0.25)] border border-orange-200"
                  style={{ transformOrigin: "top right" }}
                >
                  <div className="py-1 relative">
                    {/* 상단 오렌지 액센트 바 */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-orange-500"></div>
                    {renderMenu(true)}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </nav>
    </header>
  );
};
