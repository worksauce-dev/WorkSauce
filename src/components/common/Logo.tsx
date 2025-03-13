import Image from "next/image";
import imagelogo from "../../../public/images/로고시안1.png";

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
