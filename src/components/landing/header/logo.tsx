import image from "../../../../public/_레이어_1.png";
import Image from "next/image";

export const Logo = () => {
  return (
    <a
      href="/"
      className="flex gap-2 justify-center items-center hover:scale-105 transition"
    >
      <Image src={image} alt="logo" className="w-[24px] sm:w-[48px]" />
      <span className="text-stroke text-2xl sm:text-4xl font-bold">
        worksauce
      </span>
    </a>
  );
};
