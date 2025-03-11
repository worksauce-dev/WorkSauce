"use client";

import { motion } from "framer-motion";
import Lottie from "react-lottie-player";
import heroAnimation from "../../../../public/animations/heroPick2.json";

interface HeroProps {
  isLogin: boolean;
}

export const Hero = ({ isLogin }: HeroProps) => {
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
                <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold">
                  <span className="bg-gradient-to-r from-orange-500 to-orange-400 bg-clip-text text-transparent">
                    인재 선발
                  </span>
                  부터{" "}
                  <span className="relative">
                    <span className="bg-gradient-to-r from-orange-500 to-orange-400 bg-clip-text text-transparent">
                      조직 성장
                    </span>
                  </span>
                  까지
                </span>
                <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold">
                  <span className="relative">
                    <span className="bg-gradient-to-r from-orange-500 to-orange-400 bg-clip-text text-transparent">
                      HR 진단도구 솔루션
                    </span>
                  </span>
                </p>
              </h1>
              <motion.a
                href={isLogin ? "/dashboard" : "/login"}
                className="mt-4 inline-block bg-orange-500 text-white font-bold py-3 px-6 sm:px-8 rounded-full hover:bg-orange-600 transition duration-300"
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
