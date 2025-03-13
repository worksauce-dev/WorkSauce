import { motion } from "framer-motion";

export const PartnershipSection = () => {
  return (
    <section className="min-h-screen w-full flex items-center bg-gradient-to-b from-white to-orange-50 py-12 sm:py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-20">
        <div className="max-w-4xl mx-auto text-center mb-8 sm:mb-10 lg:mb-12">
          <motion.h2
            className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-gray-800"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-orange-500">첫 파트너</span>가 되어주세요
          </motion.h2>
          <motion.p
            className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            HR 업무 혁신의 시작점에서 함께할 파트너를 찾고 있습니다. 초기
            파트너에게는 특별한 혜택과 맞춤형 서비스를 제공해 드립니다.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <motion.div
            className="bg-white p-5 sm:p-6 lg:p-8 rounded-xl shadow-lg border border-orange-100 hover:border-orange-300 transition-all"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{
              y: -5,
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
          >
            <div className="text-orange-500 text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 flex items-center">
              <motion.span
                className="bg-orange-100 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mr-2 sm:mr-3"
                initial={{ scale: 0.8 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <span className="text-lg sm:text-xl">01</span>
              </motion.span>
              <span className="text-lg sm:text-xl">우선 접근권</span>
            </div>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              신규 기능과 업데이트를 가장 먼저 경험하고, 개발 방향에 직접 의견을
              제시할 수 있습니다. 여러분의 피드백이 제품을 함께 만들어갑니다.
            </p>
          </motion.div>

          <motion.div
            className="bg-white p-5 sm:p-6 lg:p-8 rounded-xl shadow-lg border border-orange-100 hover:border-orange-300 transition-all"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{
              y: -5,
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
          >
            <div className="text-orange-500 text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 flex items-center">
              <motion.span
                className="bg-orange-100 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mr-2 sm:mr-3"
                initial={{ scale: 0.8 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <span className="text-lg sm:text-xl">02</span>
              </motion.span>
              <span className="text-lg sm:text-xl">맞춤형 지원</span>
            </div>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              전담 컨설턴트가 배정되어 시스템 도입부터 활용까지 모든 과정을
              지원합니다. 귀사의 HR 프로세스에 최적화된 맞춤형 솔루션을
              제공합니다.
            </p>
          </motion.div>

          <motion.div
            className="bg-white p-5 sm:p-6 lg:p-8 rounded-xl shadow-lg border border-orange-100 hover:border-orange-300 transition-all"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{
              y: -5,
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
          >
            <div className="text-orange-500 text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 flex items-center">
              <motion.span
                className="bg-orange-100 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mr-2 sm:mr-3"
                initial={{ scale: 0.8 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                <span className="text-lg sm:text-xl">03</span>
              </motion.span>
              <span className="text-lg sm:text-xl">특별 혜택</span>
            </div>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              초기 파트너에게는 특별 할인 및 추가 기능을 무료로 제공합니다.
              장기적인 파트너십을 통해 함께 성장하는 기회를 놓치지 마세요.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
