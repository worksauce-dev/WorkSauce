"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { href: "product", label: "제품" },
    { href: "partners", label: "파트너십" },
    { href: "doc", label: "도움말" },
    { href: "login", label: "로그인 / 회원가입" },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 shadow-lg fixed w-full z-10 backdrop-blur-md"
    >
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <motion.a
          href="/"
          className="text-2xl font-extrabold text-blue-600 dark:text-blue-400"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          WorkSauce
        </motion.a>
        <div className="hidden md:flex space-x-1">
          {menuItems.map((item, index) => (
            <motion.a
              key={index}
              href={item.href}
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md transition duration-300"
              whileHover={{ scale: 1.05, color: "#2563EB" }}
              whileTap={{ scale: 0.95 }}
            >
              {item.label}
            </motion.a>
          ))}
        </div>
        <motion.button
          className="md:hidden text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
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
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-white dark:bg-gray-800 shadow-lg"
        >
          {menuItems.map((item, index) => (
            <motion.a
              key={index}
              href={item.href}
              className="block text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900 px-4 py-2 transition duration-300"
              whileHover={{ x: 5 }}
            >
              {item.label}
            </motion.a>
          ))}
        </motion.div>
      )}
    </motion.header>
  );
};
