"use client";

import { useState } from "react";

export const JoinContainer = () => {
  const [userType, setUserType] = useState<"개인회원" | "기업회원">("개인회원");

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-16 pt-20 sm:pt-32 flex flex-col gap-8">
      <div className="flex border py-2 px-4 gap-8 rounded-lg border-border w-[20rem] shadow-lg">
        <button
          onClick={() => setUserType("개인회원")}
          className={`hover:scale-110 transition w-full ${
            userType === "개인회원"
              ? "text-primary-accent bg-slate-200 rounded-lg"
              : "text-black"
          }`}
        >
          개인회원
        </button>
        <button
          onClick={() => setUserType("기업회원")}
          className={`hover:scale-110 transition w-full ${
            userType === "기업회원"
              ? "text-primary-accent bg-slate-200 rounded-lg"
              : "text-black"
          }`}
        >
          기업회원
        </button>
      </div>
      <div className="bg-white flex-grow border flex flex-col p-8 rounded-lg shadow-lg">
        <div className="flex-grow">
          <form className="gap-4 flex flex-col">
            <div>
              <label className="block text-sm font-medium leading-5 text-gray-700">
                이메일
              </label>
              <div className="mt-1 rounded-md shadow-sm">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-400 focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                ></input>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium leading-5 text-gray-700">
                이메일
              </label>
              <div className="mt-1 rounded-md shadow-sm">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-400 focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                ></input>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="bg-white flex-grow border flex flex-col p-8 rounded-lg shadow-lg">
        <div className="flex-grow">
          <form className="gap-4 flex flex-col">
            <div>
              <label className="block text-sm font-medium leading-5 text-gray-700">
                이메일
              </label>
              <div className="mt-1 rounded-md shadow-sm">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-400 focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                ></input>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium leading-5 text-gray-700">
                이메일
              </label>
              <div className="mt-1 rounded-md shadow-sm">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-400 focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                ></input>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
