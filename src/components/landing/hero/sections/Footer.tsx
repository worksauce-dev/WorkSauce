import React from "react";
import { motion } from "framer-motion";
import { MdEmail, MdArrowForward } from "react-icons/md";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
} from "react-icons/fa";
import { Logo } from "../../../common/Logo";

type FooterLinkProps = {
  href: string;
  children: React.ReactNode;
  delay?: number;
};

const FooterLink: React.FC<FooterLinkProps> = ({
  href,
  children,
  delay = 0,
}) => (
  <motion.li
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.3, delay }}
  >
    <a
      href={href}
      className="text-gray-600 hover:text-orange-500 transition-colors duration-200 text-sm"
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  </motion.li>
);

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-white to-gray-50 min-h-screen w-full flex items-center  py-12 sm:py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-20">
        {/* 상단 섹션: 제목 및 CTA 버튼 */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-8 md:mb-0"
          >
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
              <span className="text-orange-500">WORKSAUCE</span>
            </h3>
            <p className="text-gray-600 max-w-md border-l-4 border-orange-500 pl-4">
              인재 선발부터 조직 성장까지, 데이터 기반 HR 솔루션
            </p>
          </motion.div>
          <div className="flex flex-col sm:flex-row gap-4">
            <motion.a
              href="/join"
              className="bg-gray-800 text-white px-6 py-3 rounded-lg font-medium text-center flex items-center justify-center gap-2 group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              무료 체험
              <MdArrowForward className="transition-transform group-hover:translate-x-1" />
            </motion.a>
            <motion.a
              href="mailto:worksauce.info@gmail.com"
              className="bg-orange-500 text-white px-6 py-3 rounded-lg font-medium text-center flex items-center justify-center gap-2 group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              도입 문의하기
              <MdArrowForward className="transition-transform group-hover:translate-x-1" />
            </motion.a>
          </div>
        </div>

        {/* 뉴스레터 구독 */}
        {/* <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100 max-w-2xl mx-auto">
            <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-500">
                <MdEmail />
              </span>
              뉴스레터 구독하기
            </h4>
            <p className="text-gray-600 mb-4">
              최신 HR 트렌드와 워크소스 업데이트 소식을 받아보세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="이메일 주소를 입력하세요"
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <button className="bg-orange-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center justify-center gap-2">
                구독하기
                <MdArrowForward />
              </button>
            </div>
          </div>
        </motion.div> */}

        {/* 푸터 링크 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h4 className="text-sm font-bold text-gray-800 mb-4 uppercase">
              서비스
            </h4>
            <ul className="space-y-2">
              <FooterLink
                href="https://worksauce.gitbook.io/infomation/test/sauce"
                delay={0.1}
              >
                직무실행유형 진단도구 : 소스테스트
              </FooterLink>
              <FooterLink
                href="https://worksauce.gitbook.io/infomation/test/sauce-1"
                delay={0.15}
              >
                직무스트레스 진단도구 : 슈가테스트
              </FooterLink>
              {/* <FooterLink href="/service/recruitment" delay={0.2}>
                채용 관리
              </FooterLink>
              <FooterLink href="/service/analytics" delay={0.25}>
                HR 분석
              </FooterLink> */}
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="text-sm font-bold text-gray-800 mb-4 uppercase">
              회사
            </h4>
            <ul className="space-y-2">
              <FooterLink
                href="https://worksauce.gitbook.io/infomation/about/worksauce/vam"
                delay={0.1}
              >
                비전과 미션
              </FooterLink>
              <FooterLink
                href="https://worksauce.gitbook.io/infomation/about/worksauce/people"
                delay={0.15}
              >
                팀 소개
              </FooterLink>
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="text-sm font-bold text-gray-800 mb-4 uppercase">
              리소스
            </h4>
            <ul className="space-y-2">
              <FooterLink
                href="https://worksauce.gitbook.io/infomation"
                delay={0.15}
              >
                도움말 센터
              </FooterLink>
              {/* <FooterLink href="/case-studies" delay={0.25}>
                고객 사례
              </FooterLink> */}
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4 className="text-sm font-bold text-gray-800 mb-4 uppercase">
              법적 정보
            </h4>
            <ul className="space-y-2">
              <FooterLink
                href="https://worksauce.gitbook.io/infomation/service/terms-and-conditions"
                delay={0.1}
              >
                이용약관
              </FooterLink>
              <FooterLink
                href="https://worksauce.gitbook.io/infomation/service/privacy-policy"
                delay={0.15}
              >
                개인정보 취급방침
              </FooterLink>
              {/* <FooterLink
                href="https://worksauce.gitbook.io/infomation/service/refund-policy"
                delay={0.2}
              >
                취소 및 환불정책
              </FooterLink> */}
            </ul>
          </motion.div>
        </div>

        {/* 하단 정보 */}
        <motion.div
          className="border-t border-gray-200 pt-8 mt-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-6">
            <div>
              <p className="text-sm text-gray-500">
                <span className="font-medium">워크소스</span> | 대표: 나요한 |
                사업자번호: 000-00-00000
              </p>
              <p className="text-sm text-gray-500">
                <a
                  href="mailto:worksauce.info@gmail.com"
                  className="hover:text-orange-500"
                >
                  worksauce.info@gmail.com
                </a>
              </p>
            </div>

            <div className="flex space-x-3">
              {/* <motion.a
                href="#"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-orange-100 hover:text-orange-500 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaFacebook size={16} />
              </motion.a> */}
              {/* <motion.a
                href="#"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-orange-100 hover:text-orange-500 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaInstagram size={16} />
              </motion.a> */}
              <motion.a
                href="#"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-orange-100 hover:text-orange-500 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaLinkedin size={16} />
              </motion.a>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-xs text-gray-400 mb-2 sm:mb-0">
              Copyright &copy; 2024 worksauce All rights reserved
            </p>
            <div className="flex flex-wrap justify-center sm:justify-end items-center gap-2 sm:gap-4">
              <a
                href="https://worksauce.gitbook.io/infomation/service/terms-and-conditions"
                className="text-xs text-gray-400 hover:text-orange-500"
                target="_blank"
                rel="noopener noreferrer"
              >
                이용약관
              </a>
              <span className="text-gray-300 hidden sm:inline">|</span>
              <a
                href="https://worksauce.gitbook.io/infomation/service/privacy-policy"
                className="text-xs text-gray-400 hover:text-orange-500"
                target="_blank"
                rel="noopener noreferrer"
              >
                개인정보 취급방침
              </a>
              <span className="text-gray-300 hidden sm:inline">|</span>
              {/* <a
                href="https://worksauce.gitbook.io/infomation/service/refund-policy"
                className="text-xs text-gray-400 hover:text-orange-500"
                target="_blank"
                rel="noopener noreferrer"
              >
                취소 및 환불정책
              </a> */}
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};
