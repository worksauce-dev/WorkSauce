import { Footer } from "@/components/landing/footer/Footer";
import { Header } from "@/components/landing/header/Header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "워크소스",
  description: "",
};

export default function Home() {
  return (
    <div className="bg-white text-gray-600 work-sans leading-normal text-base tracking-normal">
      <Header />
      <main>
        <section className="relative bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-20 md:py-32">
          <div className="relative container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              당신의 비즈니스를 성장시키세요
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              혁신적인 솔루션으로 비즈니스의 잠재력을 최대화하세요
            </p>
            <a
              href="#"
              className="bg-white text-blue-600 font-bold py-3 px-8 rounded-full hover:bg-blue-100 transition duration-300"
            >
              무료로 시작하기
            </a>
          </div>
        </section>

        <section className="py-20 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">
              우리의 특징
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <i className="fas fa-rocket text-4xl text-blue-500 mb-4"></i>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                  빠른 성장
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  비즈니스 성장을 가속화하는 도구를 제공합니다.
                </p>
              </div>
              <div className="text-center">
                <i className="fas fa-chart-line text-4xl text-blue-500 mb-4"></i>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                  데이터 분석
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  정확한 데이터로 현명한 결정을 내리세요.
                </p>
              </div>
              <div className="text-center">
                <i className="fas fa-users text-4xl text-blue-500 mb-4"></i>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                  고객 관리
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  고객과의 관계를 더욱 강화하세요.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-100 dark:bg-gray-900">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">
              고객 후기
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  이 서비스를 사용한 후 우리 회사의 생산성이 30% 향상되었습니다.
                </p>
                <p className="font-semibold dark:text-white">- 김철수, CEO</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  고객 관리가 훨씬 쉬워졌어요. 정말 추천합니다!
                </p>
                <p className="font-semibold dark:text-white">
                  - 이영희, 마케팅 매니저
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  데이터 분석 기능이 정말 뛰어납니다. 덕분에 매출이 증가했어요.
                </p>
                <p className="font-semibold dark:text-white">
                  - 박지성, 데이터 분석가
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-blue-600 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">뉴스레터 구독하기</h2>
            <p className="mb-8">최신 업데이트와 특별 혜택을 받아보세요.</p>
            <form className="max-w-md mx-auto">
              <div className="flex">
                <input
                  type="email"
                  placeholder="이메일 주소"
                  className="flex-grow px-4 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900"
                />
                <button
                  type="submit"
                  className="bg-blue-800 hover:bg-blue-700 text-white px-6 py-2 rounded-r-lg transition duration-300"
                >
                  구독
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
