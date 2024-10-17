"use client";

import { useState } from "react";
import { motion } from "framer-motion";

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
  const [email, setEmail] = useState("");

  return (
    <main className="overflow-hidden">
      <section className="relative text-dark py-24 md:py-40 bg-gradient-to-br from-blue-50 to-indigo-100 ">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative container mx-auto px-6 text-center"
        >
          <h1 className="text-heading2 md:text-hero flex justify-center items-center font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            채용에 필요한 특별한 소스
          </h1>
          <p className="font-medium text-lg md:text-heading1 mb-10 text-primary-gray max-w-2xl mx-auto">
            당신의 팀에 딱 맞는 인재를 찾는 비법
          </p>
          <motion.a
            href="/login"
            className="bg-primary-accent text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 transition duration-300 inline-block"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            무료로 시작하기
          </motion.a>
        </motion.div>
      </section>

      <section className="py-24 bg-white ">
        <div className="container mx-auto px-6">
          <h2 className="text-xl font-semibold text-center text-dark mb-12">
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
                <p className="text-primary-gray mb-6 italic">
                  {'"' + review.text + '"'}
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-primary-blue font-bold text-heading1">
                    {review.name[0]}
                  </div>
                  <div className="ml-4">
                    <p className="font-semibold">{review.name}</p>
                    <p className="text-body1 text-primary-gray">
                      {review.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-primary-blue dark:bg-blue-800 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-heading2 font-bold mb-6">뉴스레터 구독하기</h2>
          <p className="mb-10 max-w-2xl mx-auto">
            최신 업데이트와 특별 혜택을 받아보세요.
          </p>
          <form className="max-w-md mx-auto" onSubmit={e => e.preventDefault()}>
            <div className="flex flex-col sm:flex-row">
              <input
                type="email"
                placeholder="이메일 주소"
                className="flex-grow px-4 py-3 rounded-lg sm:rounded-r-none mb-4 sm:mb-0 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900"
                value={email}
                onChange={e => setEmail(e.target.value)}
                aria-label="이메일 주소"
              />
              <motion.button
                type="submit"
                className="bg-indigo-700 hover:bg-indigo-600 text-white px-6 py-3 rounded-lg sm:rounded-l-none transition duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                구독
              </motion.button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
};
