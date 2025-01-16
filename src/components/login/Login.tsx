"use client";

import { RiKakaoTalkFill } from "react-icons/ri";
import { signIn } from "next-auth/react";
import { Logo } from "../common/Logo";
import { useState } from "react";
import { MdOutlineRefresh } from "react-icons/md";
import { useRouter } from "next/navigation";

export const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleLogin = async (
    provider: "credentials" | "kakao",
    e?: React.FormEvent
  ) => {
    if (provider === "credentials") {
      e?.preventDefault();
      setLoading(true);
      setError("");

      try {
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          setError(result.error);
        } else if (result?.ok) {
          router.push("/dashboard");
        }
      } catch (error) {
        setError("로그인 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    } else {
      signIn("kakao", { callbackUrl: "/dashboard" });
    }
  };

  return (
    <main className="min-h-screen bg-[#F7F7F9] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center flex flex-col items-center gap-2 mb-8">
          <Logo />
          <p className="text-gray-500">워크소스에 오신 것을 환영합니다</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <form
            onSubmit={e => handleLogin("credentials", e)}
            className="space-y-6"
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                이메일
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                         focus:outline-none focus:ring-primary-accent focus:border-primary-accent"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                비밀번호
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                         focus:outline-none focus:ring-primary-accent focus:border-primary-accent"
                required
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md 
                       shadow-sm text-sm font-medium text-white bg-primary-accent 
                       hover:bg-primary-accent-hover focus:outline-none focus:ring-2 
                       focus:ring-offset-2 focus:ring-primary-accent disabled:opacity-70 
                       disabled:cursor-not-allowed gap-2"
            >
              {loading && <MdOutlineRefresh className="animate-spin h-5 w-5" />}
              {loading ? "로그인 중..." : "로그인"}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">또는</span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={() => handleLogin("kakao")}
              className="w-full flex items-center justify-center px-6 py-3 border border-gray-200 rounded-lg
                text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <RiKakaoTalkFill className="w-6 h-6 text-[#FFE300]" />
              <span className="ml-3 font-medium">카카오톡으로 계속하기</span>
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <span className="text-gray-500">계정이 없으신가요?</span>
          <button
            onClick={() => router.push("/join")}
            className="ml-2 text-primary-accent hover:text-primary-accent-hover font-medium"
          >
            회원가입 하러가기
          </button>
        </div>
      </div>
    </main>
  );
};
