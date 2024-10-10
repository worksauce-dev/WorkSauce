import React from "react";
import { Logo } from "../../common/Logo";

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
  <a href={href} className="hover:text-primary-accent">
    {children}
  </a>
);

const CompanyInfo: React.FC = () => (
  <ul className="text-primary-gray text-caption space-y-2">
    {[
      "사하라 웍스",
      "대표: 나요한",
      "사업자번호: 000-000-00000",
      "통신판매업 신고번호: 000-000-00000",
      "주소: 000-000-00000",
      "-",
      "이메일: info@company.com",
      "전화번호: 02-1234-5678",
    ].map((item, index) => (
      <li key={index}>{item}</li>
    ))}
  </ul>
);

const LinkSection: React.FC = () => (
  <ul className="text-primary-gray text-caption md:text-body2 space-y-2 flex flex-col">
    {[
      { href: "/", text: "홈" },
      { href: "product", text: "제품" },
      { href: "partners", text: "파트너십" },
      { href: "doc", text: "도움말" },
    ].map(({ href, text }) => (
      <FooterLink key={href} href={href}>
        {text}
      </FooterLink>
    ))}
  </ul>
);

const LegalSection: React.FC = () => (
  <ul className="text-primary-gray text-caption md:text-body2 space-y-2 flex flex-col">
    {[
      { href: "/terms-and-conditions", text: "이용약관" },
      { href: "/privacy-policy", text: "개인정보 취급방침" },
      { href: "/refund-policy", text: "취소 및 환불정책" },
    ].map(({ href, text }) => (
      <FooterLink key={href} href={href}>
        {text}
      </FooterLink>
    ))}
  </ul>
);

export const Footer: React.FC = () => {
  return (
    <footer className="bg-secondary-blue">
      <div className="max-w-screen-xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="grid lg:grid-cols-2 gap-14 xl:col-span-2 sm:mb-0 mb-4">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div className="col-span-2 text-xs text-gray-500">
                <FooterSection title="WORK SAUCE">
                  <CompanyInfo />
                </FooterSection>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <FooterSection title="LINK">
                <LinkSection />
              </FooterSection>
              <FooterSection title="LEGAL">
                <LegalSection />
              </FooterSection>
            </div>
          </div>
          <Logo />
        </div>
        <div className="border-t border-border mt-8 pt-8 text-center text-primary-gray">
          <p>Copyright &copy; 2024 SAHARA All rights reserved</p>
        </div>
      </div>
    </footer>
  );
};
