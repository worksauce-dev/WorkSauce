import { motion } from "framer-motion";
import Lottie from "react-lottie-player";
import heroAnimation from "../../../../../public/animations/heroPick2.json";

export const HeroSection = () => {
  return (
    <section className="h-screen w-full flex items-center">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 pt-20 md:pt-0">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0 text-center md:text-left">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-6 md:mb-8"
            >
              인재 선발부터
              <br className="md:hidden" />
              <span className="hidden md:inline ">&nbsp;</span>
              조직 성장까지
              <br />
              <span className="text-orange-500 mt-2 md:mt-3 inline-block">
                HR 진단도구 솔루션
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-gray-600 mb-10 md:mb-12 leading-relaxed px-4 md:px-0"
            >
              객관적인 데이터 기반으로 인재를 선발하고
              <br />
              <span className="">조직의 성장을 이끌어 보세요.</span>
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <a
                href="#diagnosis"
                className="bg-orange-500 text-white font-bold py-3 px-6 md:px-8 rounded-full hover:bg-orange-600 transition duration-300 text-sm md:text-base inline-block"
              >
                무료로 시작하기
              </a>
            </motion.div>
          </div>
          <div className="md:w-1/2 w-full max-w-md mx-auto md:max-w-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="px-4 md:px-0"
            >
              <Lottie
                loop
                animationData={heroAnimation}
                play
                style={{ width: "100%", height: "auto", maxHeight: "60vh" }}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
