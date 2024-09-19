"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/services/authService";
import { getErrorMessage } from "@/utils/getErrorMessage";

export const JoinForm = () => {
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSignup = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await signUp(email, password);
      setSuccess("Account created successfully!");
      router.push("/");
    } catch (error: any) {
      throw new Error(getErrorMessage(error));
    }
  };

  return (
    <div className="bg-white py-8 px-4 shadow rounded-lg sm:px-10 w-full">
      <form className="space-y-8">
        <div>
          <label className="block text-sm font-medium leading-5 text-gray-700">
            이름
          </label>
          <div className="mt-1 rounded-md shadow-sm">
            <input
              onChange={e => setName(e.target.value)}
              id="name"
              name="name"
              type="name"
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
              onChange={e => setEmail(e.target.value)}
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
            비밀번호
          </label>
          <div className="mt-1 rounded-md shadow-sm">
            <input
              onChange={e => setPassword(e.target.value)}
              id="password"
              name="password"
              type="password"
              required
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-400 focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
            ></input>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium leading-5 text-gray-700">
            비밀번호 확인
          </label>
          <div className="mt-1 rounded-md shadow-sm">
            <input
              onChange={e => setConfirmPassword(e.target.value)}
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-400 focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
            ></input>
          </div>
        </div>
        <div className="mt-6">
          <span className="block w-full rounded-md shadow-sm">
            <button
              onClick={e => handleSignup(e)}
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 transition duration-150 ease-in-out hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:ring  focus:ring-blue-400  active:bg-blue-700"
            >
              워크소스 가입하기
            </button>
          </span>
        </div>
        <div className="text-xs mt-3 text-right">
          <a className="font-medium text-gray-500 underline">계정 찾기</a>
        </div>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </div>
  );
};
