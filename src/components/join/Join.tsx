import { FcGoogle } from "react-icons/fc";
import { JoinForm } from "./JoinForm";

export const Join = () => {
  return (
    <main className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-16 pt-20 sm:pt-32 flex flex-col lg:flex-row gap-8 justify-center">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl leading-9 font-semibold text-gray-900">
          회원가입
        </h2>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <JoinForm />
        </div>
        <div className="mt-10 text-center text-gray-700">
          이미 계정이 있으신가요?
          <a href="/login" className="hover:text-blue-600 transition ml-2">
            로그인하기 →
          </a>
        </div>
        <div className="mx-4 md:mx-0 flex flex-col items-center">
          <div className="my-10 flex w-full items-center">
            <div className="flex-1 border-t-2 border-gray-200"></div>
            <span className=" text-sm uppercase mx-5 font-medium text-gray-600">
              또는
            </span>
            <div className="flex-1 border-t-2 border-gray-200"></div>
          </div>
          <div className="w-full">
            <button className="w-full shadow rounded-lg bg-white max-w-xs mx-auto flex justify-center py-2 items-center px-8 border hangug border-transparent font-medium  text-gray-700 transition duration-150 ease-in-out hover:opacity-75 focus:outline-none focus:border-gray-700 focus:shadow-outline-gray">
              <FcGoogle className="mr-2" size={20} />
              <span className="text-subheading">구글 로그인</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};
