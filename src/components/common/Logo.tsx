import Image from "next/image";
import imagelogo from "../../../public/images/로고시안1.png";
import imagelogo2 from "../../../public/images/로고시안.png";
import mobileLogo from "../../../public/images/모바일로고.png";

interface LogoProps {
  className?: string;
}

export const Logo = ({ className }: LogoProps) => {
  return (
    <a
      href="/"
      className={`flex justify-center items-center space-x-2 hover:scale-105 transition ${
        className || ""
      }`}
    >
      <Image src={imagelogo} alt="logo" className="w-[150px] sm:w-[228px]" />
    </a>
  );
};

export const HeaderLogo = ({ className }: LogoProps) => {
  return (
    <a
      href="/"
      className={`flex justify-center items-center space-x-2 hover:scale-105 transition ${
        className || ""
      }`}
    >
      <Image
        src={imagelogo2}
        alt="logo"
        className={`w-[168px] h-8 hidden sm:block ${className}`}
      />
      <Image
        src={mobileLogo}
        alt="logo"
        className={`w-6 h-6 block sm:hidden ${className}`}
      />
    </a>
  );
};
