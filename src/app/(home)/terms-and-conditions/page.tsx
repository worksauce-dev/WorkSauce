/* eslint-disable react/no-unescaped-entities */
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "이용약관",
};

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-blue-600 p-6">
          <h1 className="text-3xl font-bold text-white">이용약관</h1>
          <p className="mt-2 text-blue-200">최종 업데이트: 2024년 10월 9일</p>
        </div>

        <div className="p-8">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              제 1 장 총칙
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium text-gray-700">
                  제 1 조 (목적)
                </h3>
                <p className="mt-2 text-gray-600">
                  본 이용약관은 주식회사 사하라웍스(이하 "회사")가 제공하는
                  서비스 이용과 관련한 회사와 이용자 간의 권리와 의무, 책임 및
                  서비스 이용 등 기본적인 사항을 규정함을 목적으로 합니다.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-gray-700">
                  제 2 조 (용어의 정의)
                </h3>
                <ul className="list-disc list-inside mt-2 text-gray-600 space-y-2">
                  <li>
                    '서비스'란 회사가 제공하는 워크소스(직무실행유형검사) 서비스
                    및 플랫폼에 부수하는 서비스 일체를 의미합니다.
                  </li>
                  <li>
                    '이용자'란 회사 서비스에 접속하여, 본 약관에 따라 회사가
                    제공하는 서비스를 이용하는 자를 말합니다.
                  </li>
                  {/* 나머지 용어 정의 */}
                </ul>
              </div>
              {/* 제 3 조부터 제 5 조까지 유사한 형식으로 구성 */}
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              제 2 장 서비스 이용
            </h2>
            <div className="space-y-4">
              {/* 제 10 조부터 제 15 조까지 구성 */}
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              제 3 장 기타
            </h2>
            <div className="space-y-4">
              {/* 제 16 조부터 제 20 조까지 구성 */}
            </div>
          </section>
        </div>

        <div className="bg-gray-100 p-6">
          <p className="text-sm text-gray-600">
            본 이용약관에 동의하시면 워크소스의 서비스를 이용하실 수 있습니다.
            자세한 내용은 개인정보 처리방침을 참조하세요.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
