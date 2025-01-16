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
              <h1 className="flex flex-col gap-2 sm:gap-3 lg:gap-4">
                <span className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold whitespace-nowrap">
                  <span className="bg-gradient-to-r from-orange-500 to-orange-400 bg-clip-text text-transparent">
                    인재 선발
                  </span>
                  부터{" "}
                  <span className="relative">
                    <span className="bg-gradient-to-r from-orange-500 to-orange-400 bg-clip-text text-transparent">
                      조직 성장
                    </span>
                    <span className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-[2px] sm:h-1 bg-gradient-to-r from-orange-500 to-orange-400 rounded-full"></span>
                  </span>
                  까지
                </span>
              </h1>
              <p className="text-base sm:text-xl md:text-2xl lg:text-3xl mt-4 sm:mt-6 lg:mt-8 mb-8 sm:mb-10 text-gray-600 font-medium tracking-tight">
                <span className="text-gray-800">중소기업</span>을 위한{" "}
                <span className="relative inline-block whitespace-nowrap after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[2px] after:bg-gradient-to-r after:from-orange-500 after:to-orange-400">
                  맞춤형 HR 솔루션
                </span>
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
