import Image from "next/image";
import imagelogo from "../../../public/로고시안1.png";

export const Logo = () => {
  return (
    <a
      href="/"
      className="flex justify-center items-center space-x-2 hover:scale-105 transition"
    >
      {/* <Droplet size={40} className="text-orange-500" />
      <h1 className="text-4xl font-bold text-orange-500">WorkSauce</h1>
       */}

      <Image src={imagelogo} alt="logo" className="w-[24px] sm:w-[228px]" />
    </a>
  );
};
