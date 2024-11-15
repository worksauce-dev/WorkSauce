"use client";

import { motion } from "framer-motion";
import Lottie from "react-lottie-player";
import heroAnimation from "../../../../public/heroPick2.json";

export const Hero = () => {
  return (
    <main className="overflow-hidden">
      <section className="relative min-h-screen flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center md:text-left"
            >
              <h1 className="text-2xl sm:text-3xl lg:text-5xl font-semibold text-orange-500 mb-4">
                채용에 필요한 특별한 소스
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl mb-8 text-gray-600">
                당신의 팀에 딱 맞는 인재를 찾는 비법
              </p>
              <motion.a
                href="/login"
                className="inline-block bg-orange-500 text-white font-bold py-3 px-6 sm:px-8 rounded-full hover:bg-orange-600 transition duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                무료로 시작하기
              </motion.a>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex justify-center"
            >
              <Lottie
                loop
                play
                style={{
                  width: "100%",
                  maxWidth: "480px",
                  height: "auto",
                }}
                animationData={heroAnimation}
              />
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
};
