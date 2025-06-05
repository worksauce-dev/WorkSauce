"use client";

import { useState } from "react";
import { MdCheckCircle, MdError, MdWarning, MdRefresh } from "react-icons/md";
import { isValidEmail } from "@/utils/validation";
import signupAnimation from "../../../public/animations/signupAnimation.json";
import { UserBase } from "@/types/user";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSession, signIn } from "next-auth/react";
import dynamic from "next/dynamic";
import { sendEmailVerificationEmail } from "@/utils/email/emailVerification";

const Lottie = dynamic(() => import("react-lottie-player"), {
  ssr: false,
});

interface JoinContainerProps {
  createUser: (
    userData: UserBase,
    password: string
  ) => Promise<{
    success: boolean;
    userId: string;
  }>;
}

// 비밀번호 유효성 검사 함수 추가
const validatePassword = (password: string) => {
  const minLength = 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const combinationCount = [hasLetter, hasNumber, hasSpecial].filter(
    Boolean
  ).length;

  if (password.length < minLength) {
    return "비밀번호는 8자 이상이어야 합니다";
  }

  if (combinationCount < 2) {
    return "영문, 숫자, 특수문자 중 2가지 이상을 조합해주세요";
  }

  return "";
};

export const JoinContainer = ({ createUser }: JoinContainerProps) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
    name: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
    name: "",
  });
  const [termsAgreement, setTermsAgreement] = useState({
    termsOfService: false,
    privacyPolicy: false,
  });
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(
    null
  );
  const [verificationCode, setVerificationCode] = useState("");
  const [showVerificationInput, setShowVerificationInput] = useState(false);
  const [verificationTimer, setVerificationTimer] = useState(0);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [isExpired, setIsExpired] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();
  // 인풋 테두리 스타일을 위한 함수
  const getInputBorderStyle = (value: string, error: string) => {
    if (error) return "border-red-500 pr-10";
    if (value && !error) return "border-green-500 pr-10";
    return "border-gray-300";
  };

  // 상태 아이콘을 위한 함수
  const renderStatusIcon = (value: string, error: string) => {
    if (error) {
      return (
        <MdError
          className="absolute right-3 top-[calc(50%+2px)] transform -translate-y-1/2 text-red-500"
          size={20}
        />
      );
    }
    if (value && !error) {
      return (
        <MdCheckCircle
          className="absolute right-3 top-[calc(50%+2px)] transform -translate-y-1/2 text-green-600"
          size={20}
        />
      );
    }
    return null;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));

    // 이메일이 변경되면 인증 상태 초기화
    if (name === "email") {
      setIsEmailVerified(false);
      setShowVerificationInput(false);
      setVerificationTimer(0);
      setGeneratedCode(null);
      setVerificationCode("");
    }

    // Validate email
    if (name === "email" && value && !isValidEmail(value)) {
      setErrors(prev => ({
        ...prev,
        email: "올바른 이메일 형식이 아닙니다",
      }));
    }

    // Validate password
    if (name === "password") {
      const passwordError = validatePassword(value);
      if (passwordError) {
        setErrors(prev => ({
          ...prev,
          password: passwordError,
        }));
      }

      // Check password confirmation match
      if (formData.passwordConfirm && value !== formData.passwordConfirm) {
        setErrors(prev => ({
          ...prev,
          passwordConfirm: "비밀번호가 일치하지 않습니다",
        }));
      } else if (formData.passwordConfirm) {
        setErrors(prev => ({ ...prev, passwordConfirm: "" }));
      }
    }

    // Validate password confirmation
    if (name === "passwordConfirm" && value !== formData.password) {
      setErrors(prev => ({
        ...prev,
        passwordConfirm: "비밀번호가 일치하지 않습니다",
      }));
    }
  };

  const handleTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setTermsAgreement(prev => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleEmailVerification = async () => {
    if (!formData.email || !isValidEmail(formData.email)) {
      setErrors(prev => ({
        ...prev,
        email: "올바른 이메일 형식이 아닙니다",
      }));
      return;
    }

    setIsVerifying(true);
    setVerificationError(null);
    setIsExpired(false);

    try {
      // 6자리 랜덤 코드 생성
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedCode(code);

      await sendEmailVerificationEmail(code, formData.email);

      // 개발 환경에서만 콘솔에 코드 출력
      if (process.env.NODE_ENV === "development") {
        console.log("Verification code:", code);
      }

      // 인증 입력 필드 표시
      setShowVerificationInput(true);

      // 3분 타이머 시작
      setVerificationTimer(180);
      const timer = setInterval(() => {
        setVerificationTimer(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setGeneratedCode(null); // 타이머 만료시 코드 초기화
            setIsExpired(true); // 만료 상태 설정
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      setVerificationError("이메일 인증 요청 중 오류가 발생했습니다.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleVerificationCodeSubmit = () => {
    if (!generatedCode) {
      setVerificationError("인증 코드가 만료되었습니다. 다시 시도해주세요.");
      return;
    }

    if (verificationCode === generatedCode) {
      setIsEmailVerified(true);
      setShowVerificationInput(false);
      setVerificationTimer(0);
      setGeneratedCode(null);
    } else {
      setVerificationError("인증 코드가 일치하지 않습니다.");
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);

    // Validate all fields
    let hasErrors = false;
    const newErrors = { ...errors };

    if (!formData.email || !isValidEmail(formData.email)) {
      newErrors.email = "올바른 이메일을 입력해주세요";
      hasErrors = true;
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      newErrors.password = passwordError;
      hasErrors = true;
    }

    if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = "비밀번호가 일치하지 않습니다";
      hasErrors = true;
    }

    if (!formData.name) {
      newErrors.name = "이름을 입력해주세요";
      hasErrors = true;
    }

    if (hasErrors) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const data: UserBase = {
        id: "",
        email: formData.email,
        name: formData.name,
        userType: "individual",
        provider: "credentials",
        status: "active",
        isAdmin: false,
        plan: "free",
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        agreeTerms: true,
        dashboardId: "",
        members: [],
      };

      await createUser(data, formData.password);

      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error("로그인 처리 중 오류가 발생했습니다.");
      }

      await getSession();

      router.push("/dashboard");
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "회원가입 중 오류가 발생했습니다."
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F9] py-12 px-4 sm:px-6 lg:px-8 pt-28">
      <div className="mx-auto max-w-6xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {submitError && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
              <MdWarning className="flex-shrink-0 h-5 w-5 text-red-500 mt-0.5" />
              <p className="text-sm text-red-700">{submitError}</p>
            </div>
          )}

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">회원가입</h2>
          </div>

          <form onSubmit={handleSubmit} className="h-[calc(80vh-120px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
              {/* 애니메이션 섹션 */}
              <div className="hidden md:flex items-center justify-center h-full">
                <Lottie
                  loop
                  play
                  style={{
                    width: "100%",
                    maxWidth: "480px",
                    height: "auto",
                  }}
                  animationData={signupAnimation}
                />
              </div>

              {/* 폼 섹션 */}
              <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300 scrollbar-track-transparent">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 이메일 */}
                  <div className="md:col-span-2">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      이메일
                    </label>
                    <div className="relative flex space-x-2">
                      <div className="flex-1 relative">
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`mt-1 block w-full px-3 py-2 border ${getInputBorderStyle(
                            formData.email,
                            errors.email
                          )} rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500`}
                          placeholder="example@email.com"
                        />
                        {renderStatusIcon(formData.email, errors.email)}
                      </div>
                      <button
                        type="button"
                        onClick={handleEmailVerification}
                        disabled={
                          isVerifying ||
                          isEmailVerified ||
                          !formData.email ||
                          !isValidEmail(formData.email)
                        }
                        className={`mt-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                          ${
                            isVerifying ||
                            isEmailVerified ||
                            !formData.email ||
                            !isValidEmail(formData.email)
                              ? "bg-orange-400 cursor-not-allowed"
                              : "bg-orange-600 hover:bg-orange-700"
                          } 
                          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500`}
                      >
                        {isVerifying ? (
                          <div className="flex items-center">
                            <MdRefresh className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                            인증중...
                          </div>
                        ) : isEmailVerified ? (
                          <div className="flex items-center">
                            <MdCheckCircle className="mr-1" size={16} />
                            인증완료
                          </div>
                        ) : (
                          "인증하기"
                        )}
                      </button>
                    </div>
                    {verificationError && (
                      <p className="mt-1 text-sm text-red-500">
                        {verificationError}
                      </p>
                    )}
                    {isEmailVerified && (
                      <p className="mt-1 text-sm text-green-600">
                        이메일이 인증되었습니다.
                      </p>
                    )}
                    {showVerificationInput && !isEmailVerified && (
                      <div className="mt-2 flex space-x-2">
                        <input
                          type="text"
                          value={verificationCode}
                          onChange={e => setVerificationCode(e.target.value)}
                          placeholder="인증 코드 6자리"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                          maxLength={6}
                        />
                        <button
                          type="button"
                          onClick={handleVerificationCodeSubmit}
                          className="mt-1 whitespace-nowrap min-w-[60px] px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                        >
                          확인
                        </button>
                      </div>
                    )}
                    {verificationTimer > 0 && (
                      <p className="mt-1 text-sm text-orange-600">
                        인증 코드 유효 시간: {formatTime(verificationTimer)}
                      </p>
                    )}
                    {isExpired && (
                      <p className="mt-1 text-sm text-red-500">
                        인증 시간이 만료되었습니다. 다시 인증해주세요.
                      </p>
                    )}
                  </div>

                  {/* 비밀번호 */}
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      비밀번호
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full px-3 py-2 border ${getInputBorderStyle(
                        formData.password,
                        errors.password
                      )} rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500`}
                      placeholder="8자 이상"
                    />
                  </div>

                  {/* 비밀번호 확인 */}
                  <div>
                    <label
                      htmlFor="passwordConfirm"
                      className="block text-sm font-medium text-gray-700"
                    >
                      비밀번호 확인
                    </label>
                    <div className="relative">
                      <input
                        id="passwordConfirm"
                        name="passwordConfirm"
                        type="password"
                        required
                        value={formData.passwordConfirm}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full px-3 py-2 border ${getInputBorderStyle(
                          formData.passwordConfirm,
                          errors.passwordConfirm
                        )} rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500`}
                        placeholder="비밀번호를 다시 입력해주세요"
                      />
                      {renderStatusIcon(
                        formData.passwordConfirm,
                        errors.passwordConfirm
                      )}
                    </div>
                    {errors.passwordConfirm && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.passwordConfirm}
                      </p>
                    )}
                  </div>

                  {/* 이름 */}
                  <div className="md:col-span-2">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      이름
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                      placeholder="이름을 입력해주세요"
                    />
                  </div>
                </div>

                {/* 약관 동의 및 회원가입 버튼 */}
                <div className="mt-8 space-y-4">
                  <div className="space-y-4">
                    {/* 필수 약관 동의 */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium text-gray-900">
                        필수 약관 동의
                      </h3>
                      <div className="space-y-2">
                        <label className="flex items-start space-x-3">
                          <input
                            type="checkbox"
                            name="termsOfService"
                            checked={termsAgreement.termsOfService}
                            onChange={handleTermsChange}
                            className="mt-1 h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                          />
                          <span className="text-sm text-gray-700">
                            <Link
                              href={`${process.env.NEXT_PUBLIC_TERMS_AND_CONDITIONS_URL}`}
                              className="text-orange-600 hover:text-orange-700 underline"
                              target="_blank"
                            >
                              이용약관
                            </Link>
                            에 동의합니다 (필수)
                          </span>
                        </label>
                        <label className="flex items-start space-x-3">
                          <input
                            type="checkbox"
                            name="privacyPolicy"
                            checked={termsAgreement.privacyPolicy}
                            onChange={handleTermsChange}
                            className="mt-1 h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                          />
                          <span className="text-sm text-gray-700">
                            <Link
                              href={`${process.env.NEXT_PUBLIC_PRIVACY_POLICY_URL}`}
                              className="text-orange-600 hover:text-orange-700 underline"
                              target="_blank"
                            >
                              개인정보처리방침
                            </Link>
                            에 동의합니다 (필수)
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={
                      isSubmitting ||
                      !termsAgreement.termsOfService ||
                      !termsAgreement.privacyPolicy
                    }
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                      ${
                        isSubmitting ||
                        !termsAgreement.termsOfService ||
                        !termsAgreement.privacyPolicy
                          ? "bg-orange-400 cursor-not-allowed"
                          : "bg-orange-600 hover:bg-orange-700"
                      } 
                      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500`}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <MdRefresh className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                        처리중...
                      </div>
                    ) : (
                      "회원가입"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
