/* eslint-disable react/no-unescaped-entities */
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보 수집 동의서",
};

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-blue-600 p-6">
          <h1 className="text-3xl font-bold text-white">
            개인정보 수집 동의서
          </h1>
          <p className="mt-2 text-blue-200">주식회사 사하라웍스</p>
        </div>

        <div className="p-8">
          <p className="text-gray-700 mb-6">
            주식회사 사하라웍스(이하 "사하라웍스"라 합니다)는
            「개인정보보호법」에 따라 사하라웍스 워크소스(직무실행유형검사)
            서비스, 직무실행유형 별 결과 서비스 (이하 "서비스") 이용자로부터
            아래의 목적으로 개인정보를 수집 및 이용하고 있으며, 이용자의
            개인정보를 안전하게 취급하는데 최선을 다하고 있습니다. 다음 내용을
            자세히 읽은 후 동의여부를 결정하여 주시기 바랍니다.
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              1. 수집하는 개인정보
            </h2>
            <p className="text-gray-700 mb-4">
              이용자가 사하라웍스가 제공하는 서비스를 이용하기 위해 본 개인정보
              수집 및 이용 동의서에 동의하는 경우, 사하라웍스는 서비스 이용을
              위해 필요한 최소한의 개인정보를 수집합니다.
            </p>
            <h3 className="text-xl font-medium text-gray-700 mt-4">
              필수 항목
            </h3>
            <ul className="list-disc list-inside text-gray-600 mt-2">
              <li>이메일</li>
              <li>이름</li>
              <li>연락처(추가 수집에서는 제외)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              2. 수집한 개인정보의 이용
            </h2>
            <p className="text-gray-700 mb-4">
              사하라웍스는 이용자관리, 서비스 제공, 서비스 개발 및 개선, 안전한
              이용환경 구축 등 아래의 목적으로만 개인정보를 이용합니다.
            </p>
            <ul className="list-decimal list-inside text-gray-600 space-y-2">
              <li>서비스 제공</li>
              <li>이용자관리</li>
              <li>서비스 개발 및 연구</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              3. 개인정보의 보관기간
            </h2>
            <p className="text-gray-700">
              원칙적으로 이용자가 서비스 이용 동의에 한 날로부터 10년까지
              개인정보를 보유 및 이용합니다. 단, 관계법령의 규정에 의하여 보존할
              필요가 있는 경우, 사하라웍스는 관계법령에서 정한 일정한 기간 동안
              이용자정보를 보관합니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              4. 개인정보 수집 및 이용 동의를 거부할 권리
            </h2>
            <p className="text-gray-700">
              이용자는 개인정보의 수집 및 이용 동의를 거부할 권리가 있습니다.
              이용동의 시 수집하는 최소한의 개인정보, 즉, [필수] 항목에 대한
              수집 및 이용 동의를 거부하실 경우, 사하라웍스가 제공하는 서비스
              이용이 어려울 수 있습니다.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
