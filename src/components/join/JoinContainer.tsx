"use client";

import { useState } from "react";
import { MdInfo, MdCheckCircle, MdError, MdWarning } from "react-icons/md";
import {
  isValidEmail,
  isValidBusinessNumber,
  formatBusinessNumber,
} from "@/utils/validation";
import Lottie from "react-lottie-player";
import signupAnimation from "../../../public/signupAnimation.json";
import { EmailUser } from "@/types/user";
import { useRouter } from "next/navigation";
import { getSession, signIn } from "next-auth/react";
interface FileState {
  businessLicense: File | null;
  employmentCertificate: File | null;
}

interface JoinContainerProps {
  createUser: (userData: EmailUser) => Promise<void>;
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
  const [userType, setUserType] = useState<"individual" | "business">(
    "individual"
  );
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
    name: "",
    // 기업회원 필수 정보
    companyName: "",
    businessNumber: "",
    representativeName: "",
    businessType: "",
    companyAddress: "",
    // 담당자 정보
    position: "",
    department: "",
    workEmail: "",
    workPhone: "",
    // 선택 정보
    companyWebsite: "",
    companySize: "",
    establishedYear: "",
    serviceUsage: "",
    recruitmentField: "",
    annualRecruitmentPlan: "",
    serviceUtilizationPlan: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
    name: "",
    workEmail: "",
    workPhone: "",
    businessNumber: "",
  });
  const [files, setFiles] = useState<FileState>({
    businessLicense: null,
    employmentCertificate: null,
  });
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

  const handleBusinessNumberKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    const input = e.target as HTMLInputElement;
    const selectionStart = input.selectionStart;

    // 백스페이스 키 처리
    if (e.key === "Backspace" && selectionStart !== null) {
      const value = input.value;

      // 하이픈 바로 뒤에서 백스페이스를 누른 경우
      if (value[selectionStart - 1] === "-") {
        e.preventDefault();
        const newValue =
          value.slice(0, selectionStart - 2) + value.slice(selectionStart);
        setFormData(prev => ({ ...prev, businessNumber: newValue }));

        // 다음 render 후 커서 위치 설정
        setTimeout(() => {
          input.setSelectionRange(selectionStart - 2, selectionStart - 2);
        }, 0);
      }
    }
  };

  const handleBusinessNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const input = e.target;
    const selectionStart = input.selectionStart;
    const value = input.value;

    // 숫자만 추출
    const numbersOnly = value.replace(/[^\d]/g, "").slice(0, 10);
    const formattedValue = formatBusinessNumber(numbersOnly);

    setFormData(prev => ({ ...prev, businessNumber: formattedValue }));

    // 유효성 검사
    if (numbersOnly && !isValidBusinessNumber(formattedValue)) {
      setErrors(prev => ({
        ...prev,
        businessNumber: "올바른 사업자등록번호가 아닙니다",
      }));
    } else {
      setErrors(prev => ({ ...prev, businessNumber: "" }));
    }

    // 다음 render 후 적절한 커서 위치 설정
    if (selectionStart !== null) {
      setTimeout(() => {
        // 하이픈이 추가되는 위치를 고려하여 커서 위치 조정
        let newPosition = selectionStart;
        if (numbersOnly.length >= 3 && selectionStart > 3) newPosition++;
        if (numbersOnly.length >= 5 && selectionStart > 6) newPosition++;
        input.setSelectionRange(newPosition, newPosition);
      }, 0);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));

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
      if (userType === "individual") {
        const data: EmailUser = {
          email: formData.email,
          name: formData.name,
          password: formData.password,
          userType: userType,
          provider: "credentials",
          id: "",
          isFirstLogin: false,
          createdAt: new Date().toISOString(),
          status: "active",
          isAdmin: false,
          lastLoginAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          groups: [],
          plan: "free",
          agreeTerms: true,
          sugarMetaData: {
            averageScore: 0,
            categoryScores: {},
            lastGroupId: "",
            lastTestAt: "",
            testCount: 0,
          },
        };

        await createUser(data);

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
      }
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
          {/* Error Message */}
          {submitError && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
              <MdWarning className="flex-shrink-0 h-5 w-5 text-red-500 mt-0.5" />
              <p className="text-sm text-red-700">{submitError}</p>
            </div>
          )}

          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">회원가입</h2>
            </div>

            {/* 회원 유형 선택 탭 일시적 비활성화*/}
            {/* <div>
              <div className="flex bg-white shadow-sm border rounded-lg overflow-hidden">
                <button
                  onClick={() => setUserType("individual")}
                  className={`py-2 px-4 transition-colors ${
                    userType === "individual"
                      ? "bg-orange-500 text-white"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  개인회원
                </button>
                <button
                  onClick={() => setUserType("business")}
                  className={`py-2 px-4 transition-colors ${
                    userType === "business"
                      ? "bg-orange-500 text-white"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  기업회원
                </button>
              </div>
            </div> */}
          </div>

          <form onSubmit={handleSubmit} className="h-[calc(80vh-120px)]">
            {userType === "individual" ? (
              // 개인회원 폼
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
                {/* 왼쪽: 애니메이션 섹션 - 모바일에서는 숨김 */}
                <div className="hidden md:flex bg-transparent rounded-lg items-center justify-center h-full">
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

                {/* 오른쪽: 입력 폼 섹션 */}
                <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300 scrollbar-track-transparent">
                  <div className="flex flex-col justify-between h-full">
                    {/* 입력 폼 영역 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700"
                        >
                          이메일
                        </label>
                        <div className="relative">
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
                    <div className="md:col-span-2 space-y-4 mt-8">
                      <div className="bg-orange-50 rounded-lg p-4 flex items-start space-x-3 mb-6">
                        <MdInfo className="flex-shrink-0 h-5 w-5 text-orange-500 mt-0.5" />
                        <p className="text-sm text-orange-700">
                          회원가입 시 워크소스의 이용약관 및 개인정보처리방침에
                          동의하게 됩니다.
                        </p>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                          ${
                            isSubmitting
                              ? "bg-orange-400 cursor-not-allowed"
                              : "bg-orange-600 hover:bg-orange-700"
                          } 
                          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500`}
                      >
                        {isSubmitting ? (
                          <div className="flex items-center">
                            <svg
                              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            처리중...
                          </div>
                        ) : (
                          "회원가입"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // 기업회원 폼
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300 scrollbar-track-transparent">
                {/* 기업 정보 섹션 */}
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                    기업 정보
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        기업/기관명 (법인명/상호) *
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        required
                        value={formData.companyName}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        사업자등록번호 *
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          name="businessNumber"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          required
                          value={formData.businessNumber}
                          onChange={handleInputChange}
                          onKeyDown={handleBusinessNumberKeyDown}
                          className={`mt-1 block w-full px-3 py-2 border ${getInputBorderStyle(
                            formData.businessNumber,
                            errors.businessNumber
                          )} rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500`}
                          placeholder="숫자 10자리를 입력해주세요"
                        />
                        {renderStatusIcon(
                          formData.businessNumber,
                          errors.businessNumber
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        대표자명 *
                      </label>
                      <input
                        type="text"
                        name="representativeName"
                        required
                        value={formData.representativeName}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        업종/업태 *
                      </label>
                      <input
                        type="text"
                        name="businessType"
                        required
                        value={formData.businessType}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        회사주소 *
                      </label>
                      <input
                        type="text"
                        name="companyAddress"
                        required
                        value={formData.companyAddress}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        사업자등록증 *
                      </label>
                      <div className="mt-1 space-y-2">
                        <input
                          type="file"
                          name="businessLicense"
                          accept=".pdf"
                          required
                          onChange={handleInputChange}
                          className="hidden"
                          id="businessLicense"
                        />
                        <label
                          htmlFor="businessLicense"
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm text-gray-700 
                          bg-white hover:bg-gray-50 cursor-pointer focus-within:outline-none focus-within:ring-2 
                          focus-within:ring-orange-500 focus-within:border-orange-500 h-[38px]"
                        >
                          <div className="flex items-center justify-between h-full">
                            <span className="text-gray-500 flex-1 min-w-0 mr-2">
                              <span
                                className="block truncate"
                                title={
                                  files.businessLicense
                                    ? files.businessLicense.name
                                    : ""
                                }
                              >
                                {files.businessLicense
                                  ? files.businessLicense.name
                                  : "PDF 파일 (최대 5MB)"}
                              </span>
                            </span>
                            {files.businessLicense ? (
                              <MdCheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                            ) : (
                              <span className="text-orange-600 flex-shrink-0">
                                찾아보기
                              </span>
                            )}
                          </div>
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        재직증명서 *
                      </label>
                      <div className="mt-1 space-y-2">
                        <input
                          type="file"
                          name="employmentCertificate"
                          accept=".pdf"
                          required
                          onChange={handleInputChange}
                          className="hidden"
                          id="employmentCertificate"
                        />
                        <label
                          htmlFor="employmentCertificate"
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm text-gray-700 
                          bg-white hover:bg-gray-50 cursor-pointer focus-within:outline-none focus-within:ring-2 
                          focus-within:ring-orange-500 focus-within:border-orange-500 h-[38px]"
                        >
                          <div className="flex items-center justify-between h-full">
                            <span className="text-gray-500 flex-1 min-w-0 mr-2">
                              <span
                                className="block truncate"
                                title={
                                  files.employmentCertificate
                                    ? files.employmentCertificate.name
                                    : ""
                                }
                              >
                                {files.employmentCertificate
                                  ? files.employmentCertificate.name
                                  : "PDF 파일 (최대 5MB)"}
                              </span>
                            </span>
                            {files.employmentCertificate ? (
                              <MdCheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                            ) : (
                              <span className="text-orange-600 flex-shrink-0">
                                찾아보기
                              </span>
                            )}
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 담당자 정보 섹션 */}
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                    담당자 정보
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        이름 *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        직위/직책 *
                      </label>
                      <input
                        type="text"
                        name="position"
                        required
                        value={formData.position}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        부서 *
                      </label>
                      <input
                        type="text"
                        name="department"
                        required
                        value={formData.department}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        업무용 이메일 *
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          name="workEmail"
                          required
                          value={formData.workEmail}
                          onChange={handleInputChange}
                          className={`mt-1 block w-full px-3 py-2 border ${getInputBorderStyle(
                            formData.workEmail,
                            errors.workEmail
                          )} rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500`}
                          placeholder="회사 도메인 이메일 권장"
                        />
                        {renderStatusIcon(formData.workEmail, errors.workEmail)}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        업무용 연락처 *
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          name="workPhone"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          required
                          value={formData.workPhone}
                          onChange={handleInputChange}
                          className={`mt-1 block w-full px-3 py-2 border ${getInputBorderStyle(
                            formData.workPhone,
                            errors.workPhone
                          )} rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500`}
                          placeholder="01012345678"
                        />
                        {renderStatusIcon(formData.workPhone, errors.workPhone)}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        비밀번호 *
                      </label>
                      <input
                        type="password"
                        name="password"
                        required
                        value={formData.password}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                        placeholder="8자 이상 입력해주세요"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        비밀번호 확인 *
                      </label>
                      <div className="relative">
                        <input
                          type="password"
                          name="passwordConfirm"
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
                    </div>
                  </div>
                </div>

                {/* 선택 정보 섹션 */}
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                    선택 정보
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        회사 홈페이지 주소
                      </label>
                      <input
                        type="url"
                        name="companyWebsite"
                        value={formData.companyWebsite}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                        placeholder="https://"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        회사 규모 (직원 수)
                      </label>
                      <input
                        type="text"
                        name="companySize"
                        value={formData.companySize}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                        placeholder="예: 50명"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        설립연도
                      </label>
                      <input
                        type="text"
                        name="establishedYear"
                        value={formData.establishedYear}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                        placeholder="예: 2020"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        서비스 활용 정보
                      </label>
                      <input
                        type="text"
                        name="serviceUsage"
                        value={formData.serviceUsage}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        주요 채용 분야
                      </label>
                      <input
                        type="text"
                        name="recruitmentField"
                        value={formData.recruitmentField}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        연간 채용 계획 인원
                      </label>
                      <input
                        type="text"
                        name="annualRecruitmentPlan"
                        value={formData.annualRecruitmentPlan}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                        placeholder="예: 10명"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        희망하는 서비스 활용 방안
                      </label>
                      <input
                        type="text"
                        name="serviceUtilizationPlan"
                        value={formData.serviceUtilizationPlan}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                  </div>
                </div>

                {/* 새로운 섹션 */}
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                    약관 동의
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-orange-50 rounded-lg p-4 flex items-start space-x-3 mb-6">
                      <MdInfo className="flex-shrink-0 h-5 w-5 text-orange-500 mt-0.5" />
                      <p className="text-sm text-orange-700">
                        회원가입 시 워크소스의 이용약관 및 개인정보처리방침에
                        동의하게 됩니다.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                        ${
                          isSubmitting
                            ? "bg-orange-400 cursor-not-allowed"
                            : "bg-orange-600 hover:bg-orange-700"
                        } 
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500`}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          처리중...
                        </div>
                      ) : (
                        "회원가입"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
