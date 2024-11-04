"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Lottie from "react-lottie-player";
import heroAnimation from "../../../../public/heroPick2.json";

const mockRecommendation = [
  {
    name: "김철수",
    role: "CEO",
    text: "이 서비스를 사용한 후 우리 회사의 생산성이 30% 향상되었습니다.",
  },
  {
    name: "이영희",
    role: "마케팅 매니저",
    text: "고객 관리가 훨씬 쉬워졌어요. 정말 추천합니다!",
  },
  {
    name: "박지성",
    role: "데이터 분석가",
    text: "데이터 분석 기능이 정말 뛰어납니다. 덕분에 매출이 증가했어요.",
  },
];

export const Hero = () => {
  return (
    <main className="overflow-hidden">
      <section className="relative text-dark py-48 flex flex-col md:flex-row mx-auto container items-center px-6 gap-8 h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 text-center md:text-left max-w-2xl"
        >
          <h1 className="text-lg md:text-3xl lg:text-5xl font-semibold text-orange-500 mb-4">
            채용에 필요한 특별한 소스
          </h1>
          <p className="font-medium text-base md:text-xl lg:text-2xl mb-10 text-gray-600">
            당신의 팀에 딱 맞는 인재를 찾는 비법
          </p>
          <motion.a
            href="/login"
            className="bg-orange-500 text-white font-bold py-3 px-8 rounded-full hover:bg-orange-600 transition duration-300 inline-block"
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
          className="flex-1 flex justify-center items-center"
        >
          <Lottie
            loop
            play
            style={{ width: "480px", maxWidth: 480, height: "auto" }}
            animationData={heroAnimation}
          />
        </motion.div>
      </section>

      {/* <section className="py-24  bg-orange-100 ">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-center text-dark mb-12">
            고객 후기
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {mockRecommendation.map((review, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <p className="text-sm md:text-base lg:text-lg text-primary-gray mb-6 italic">
                  {'"' + review.text + '"'}
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 font-bold text-heading1">
                    {review.name[0]}
                  </div>
                  <div className="ml-4">
                    <p className="text-base md:text-lg font-semibold">
                      {review.name}
                    </p>
                    <p className="text-sm md:text-base text-primary-gray">
                      {review.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}
    </main>
  );
};
