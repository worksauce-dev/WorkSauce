import image from "../../../../public/_레이어_2.png";
import Image from "next/image";
import textlogo from "../../../../public/textlogo.png";

export const Logo = () => {
  return (
    <a
      href="/"
      className="flex gap-2 justify-center items-center hover:scale-105 transition"
    >
      <Image src={image} alt="logo" className="w-[24px] sm:w-[48px]" />
      <Image src={textlogo} alt="logo" className="w-[100px] sm:w-[200px]" />
    </a>
  );
};
