"use client";

import { useState } from "react";
import image from "../../../../public/_레이어_1.png";
import Image from "next/image";

import { logOut } from "@/services/authService";
import { useRouter } from "next/navigation";
import { getErrorMessage } from "@/utils/getErrorMessage";

import useAuth from "@/hooks/useAuth";

export const Header = ({}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();

  const guestMenuItems = [
    { href: "test", label: "테스트하기" },
    { href: "email", label: "이메일 테스트" },
    { href: "doc", label: "도움말" },
    { href: "login", label: "로그인 / 회원가입" },
  ];

  const userMenuItems = [
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
    if (user) {
      return userMenuItems.map((item, index) => (
        <a
          key={index}
          href={item.href}
          onClick={item.onClick}
          className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md hover:scale-105 transition"
        >
          {item.label}
        </a>
      ));
    }

    return guestMenuItems.map((item, index) => (
      <a
        key={index}
        href={item.href}
        className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md hover:scale-105 transition"
      >
        {item.label}
      </a>
    ));
  };

  return (
    <header className="z-[99] bg-white w-full shadow fixed top-0">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <a
          href="/"
          className="flex gap-2 justify-center items-center hover:scale-105 transition"
        >
          <Image src={image} alt="logo" className="w-[48px]" />
          <span className="text-stroke text-4xl font-bold">worksauce</span>
        </a>
        <div className="hidden md:flex space-x-1">{renderMenu()}</div>
        <button
          className="md:hidden text-gray-600 hover:text-blue-600 "
          onClick={() => setIsOpen(!isOpen)}
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
        </button>
      </nav>
    </header>
  );
};
