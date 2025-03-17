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
    <footer className="bg-gradient-to-b from-white to-gray-50 min-h-screen w-full flex items-center py-8 sm:py-12 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-10 lg:py-16">
        {/* 상단 섹션: 제목 및 CTA 버튼 */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 sm:mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-6 md:mb-0"
          >
            <div className="flex items-center mb-3">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold">
                <span className="text-orange-500">WORKSAUCE</span>
              </h3>
            </div>
            <p className="text-gray-600 max-w-md border-l-4 border-orange-500 pl-4 text-sm sm:text-base">
              인재 선발부터 조직 성장까지, 데이터 기반 HR 솔루션
            </p>
          </motion.div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <motion.a
              href="/join"
              className="bg-gray-800 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium text-center flex items-center justify-center gap-2 group text-sm sm:text-base"
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
              className="bg-orange-500 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium text-center flex items-center justify-center gap-2 group text-sm sm:text-base"
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

        {/* 푸터 링크 그리드 */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-10 sm:mb-16">
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
          className="border-t border-gray-200 pt-6 sm:pt-8 mt-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 sm:mb-6 gap-4 sm:gap-6">
            <div className="flex flex-col items-start sm:items-center gap-2 sm:gap-4">
              <div>
                <p className="text-xs sm:text-sm text-gray-500">
                  <span className="font-medium">워크소스</span> | 대표: 나요한 |
                  사업자번호: 000-00-00000
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  <a
                    href="mailto:worksauce.info@gmail.com"
                    className="hover:text-orange-500"
                  >
                    worksauce.info@gmail.com
                  </a>
                </p>
              </div>
            </div>

            <div className="flex space-x-3 mt-3 sm:mt-0">
              <motion.a
                href="https://www.linkedin.com/company/%EC%9B%8C%ED%81%AC%EC%86%8C%EC%8A%A4/"
                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-orange-100 hover:text-orange-500 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaLinkedin size={14} className="sm:text-base" />
              </motion.a>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-[10px] sm:text-xs text-gray-400 mb-2 sm:mb-0">
              Copyright &copy; 2025 worksauce All rights reserved
            </p>
            <div className="flex flex-wrap justify-center sm:justify-end items-center gap-2 sm:gap-4">
              <a
                href="https://worksauce.gitbook.io/infomation/service/terms-and-conditions"
                className="text-[10px] sm:text-xs text-gray-400 hover:text-orange-500"
                target="_blank"
                rel="noopener noreferrer"
              >
                이용약관
              </a>
              <span className="text-gray-300 hidden sm:inline">|</span>
              <a
                href="https://worksauce.gitbook.io/infomation/service/privacy-policy"
                className="text-[10px] sm:text-xs text-gray-400 hover:text-orange-500"
                target="_blank"
                rel="noopener noreferrer"
              >
                개인정보 취급방침
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};
