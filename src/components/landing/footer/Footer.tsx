import React from "react";
import { Logo } from "../../common/Logo";
import { MdEmail } from "react-icons/md";

type FooterSectionProps = {
  title: string;
  children: React.ReactNode;
};

const FooterSection: React.FC<FooterSectionProps> = ({ title, children }) => (
  <div>
    <h3 className="text-body2 font-bold mb-4">{title}</h3>
    {children}
  </div>
);

type FooterLinkProps = {
  href: string;
  children: React.ReactNode;
};

const FooterLink: React.FC<FooterLinkProps> = ({ href, children }) => (
  <a href={href} className="hover:text-gray-600">
    {children}
  </a>
);

const CompanyInfo: React.FC = () => (
  // <ul className="text-gray-500 text-caption space-y-2">
  //   {[
  //     "워크소스",
  //     "대표: 나요한",
  //     "사업자번호: 000-000-00000",
  //     "통신판매업 신고번호: 000-000-00000",
  //     "주소: 000-000-00000",
  //     "-",
  //     "이메일: info@worksauce.kr",
  //     "전화번호: 02-1234-5678",
  //   ].map((item, index) => (
  //     <li key={index}>{item}</li>
  //   ))}
  // </ul>

  <span className="flex items-center gap-2 text-gray-500 text-caption md:text-body2">
    <MdEmail className="text-lg" />
    worksauce.info@gmail.com
  </span>
);

const LinkSection: React.FC = () => (
  <ul className="text-gray-500 text-caption md:text-body2 space-y-2 flex flex-col">
    {[
      { href: "/", text: "홈" },
      // { href: "product", text: "제품" },
      // { href: "partners", text: "파트너십" },
      {
        href:
          process.env.NEXT_PUBLIC_DOCUMENTATION_URL ||
          "https://worksauce.gitbook.io/infomation",
        text: "도움말",
      },
    ].map(({ href, text }) => (
      <FooterLink key={href} href={href}>
        {text}
      </FooterLink>
    ))}
  </ul>
);

const LegalSection: React.FC = () => (
  // <ul className="text-gray-500 text-caption md:text-body2 space-y-2 flex flex-col">
  //   {[
  //     { href: "/terms-and-conditions", text: "이용약관" },
  //     { href: "/privacy-policy", text: "개인정보 취급방침" },
  //     { href: "/refund-policy", text: "취소 및 환불정책" },
  //   ].map(({ href, text }) => (
  //     <FooterLink key={href} href={href}>
  //       {text}
  //     </FooterLink>
  //   ))}
  // </ul>
  <ul className="text-gray-500 text-caption md:text-body2 space-y-2 flex flex-col">
    {[
      { text: "이용약관" },
      { text: "개인정보 취급방침" },
      { text: "취소 및 환불정책" },
    ].map(({ text }, index) => (
      <li key={index} className="cursor-not-allowed opacity-50">
        {text}
      </li>
    ))}
  </ul>
);

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 w-full">
      <div className="mx-auto py-8 px-4 sm:px-6 lg:py-12 lg:px-8 container">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          <div className="space-y-8 md:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <FooterSection title="WORK SAUCE">
                <CompanyInfo />
              </FooterSection>
              <div className="grid grid-cols-2 gap-8">
                <FooterSection title="LINK">
                  <LinkSection />
                </FooterSection>
                <FooterSection title="LEGAL">
                  <LegalSection />
                </FooterSection>
              </div>
            </div>
          </div>
          <div className="hidden xl:flex justify-end">
            <Logo />
          </div>
        </div>
        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-500">
          <p className="text-sm">
            Copyright &copy; 2024 worksauce All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
};
