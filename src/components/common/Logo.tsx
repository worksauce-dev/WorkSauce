import imagelogo from "../../../public/_레이어_2.png";
import Image from "next/image";
import textlogo from "../../../public/textlogo.png";
import { Droplet } from "lucide-react";

export const Logo = () => {
  return (
    // <a
    //   href="/"
    //   className="flex gap-2 justify-center items-center hover:scale-105 transition"
    // >
    //   <Image src={imagelogo} alt="logo" className="w-[24px] sm:w-[48px]" />
    //   <Image src={textlogo} alt="logo" className="w-[100px] sm:w-[200px]" />
    // </a>
    <a
      href="/"
      className="flex justify-center items-center space-x-2 hover:scale-105 transition"
    >
      <Droplet size={40} className="text-orange-500" />
      <h1 className="text-4xl font-bold text-gray-900">
        Work<span className="font-serif italic text-orange-500">Sauce</span>
      </h1>
    </a>
  );
};
