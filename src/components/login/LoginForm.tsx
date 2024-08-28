"use client";

import { useState } from "react";

export const LoginForm = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log(email, password);
  };

  return (
    <div className="bg-white  py-8 px-4 shadow rounded-lg sm:px-10">
      <form className="space-y-8">
        <div>
          <label className="block text-sm font-medium leading-5 text-gray-700">
            이메일
          </label>
          <div className="mt-1 rounded-md shadow-sm">
            <input
              onChange={e => setEmail(e.target.value)}
              id="email"
              name="email"
              type="email"
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-400 focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
            ></input>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium leading-5 text-gray-700">
            패스워드
          </label>
          <div className="mt-1 rounded-md shadow-sm">
            <input
              onChange={e => setPassword(e.target.value)}
              id="password"
              name="password"
              type="password"
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-400 focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
            ></input>
          </div>
        </div>
        <div className="mt-6">
          <span className="block w-full rounded-md shadow-sm">
            <button
              onClick={e => handleSubmit(e)}
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 transition duration-150 ease-in-out   hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:ring  focus:ring-blue-400  active:bg-blue-700"
            >
              로그인
            </button>
          </span>
        </div>
        <div className="text-xs mt-3 text-right">
          <a className="font-medium text-gray-500 underline">계정 찾기</a>
        </div>
      </form>
    </div>
  );
};
