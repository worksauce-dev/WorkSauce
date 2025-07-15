"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MdCheckCircle,
  MdInfo,
  MdBusiness,
  MdAccessTime,
  MdAutorenew,
  MdPerson,
  MdClose,
} from "react-icons/md";
import Link from "next/link";
import { UserBase } from "@/types/user";
import { Organization } from "@/types/dashboard";
import { isValidEmail, isValidPhoneNumber } from "@/utils/validation";

interface RegisterCompanyProps {
  userBase: UserBase;
  verifyingCompany: (
    data: Organization,
    dashboardId: string
  ) => Promise<{ success: boolean; message: string }>;
  uploadImageToStorage: (file: File, path: string) => Promise<string>;
  updateDashboardOrganization: (
    data: Organization,
    dashboardId: string
  ) => Promise<void>;
  isVerified: "approved" | "pending" | "rejected" | "notRequested";
}

const RegisterCompany = ({
  userBase,
  verifyingCompany,
  uploadImageToStorage,
  updateDashboardOrganization,
  isVerified,
}: RegisterCompanyProps) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    companyInfo: {
      businessNumber: "",
      representativeName: "",
      companyName: "",
      businessType: "",
      companyAddress: "",
    },
    // 담당자 정보
    managerInfo: {
      position: "",
      department: "",
      workEmail: "",
      workPhone: "",
    },
    // 선택 정보
    additionalInfo: {
      companyWebsite: "",
      companySize: "",
      establishedYear: "",
      serviceUsage: "",
      recruitmentField: "",
      annualRecruitmentPlan: "",
      serviceUtilizationPlan: "",
    },
  });
  const [files, setFiles] = useState<{
    businessLicense: File | null;
    employmentCertificate: File | null;
  }>({
    businessLicense: null,
    employmentCertificate: null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localVerified, setLocalVerified] = useState<
    "approved" | "pending" | "rejected" | "notRequested"
  >(isVerified);

  // 입력 필드 변경 핸들러
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
    section?: "companyInfo" | "managerInfo" | "additionalInfo"
  ) => {
    const { name, value } = e.target;

    if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [name]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }

    // 에러 메시지 초기화
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // 파일 업로드 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    const file = e.target.files?.[0] || null;

    if (file) {
      // 파일 크기 제한 (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          [name]: "파일 크기는 5MB를 초과할 수 없습니다.",
        }));
        return;
      }

      // 이미지 파일 형식 검증
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          [name]: "JPG, JPEG, PNG 이미지 파일만 업로드 가능합니다.",
        }));
        return;
      }
    }

    setFiles(prev => ({
      ...prev,
      [name]: file,
    }));
  };

  // 파일 삭제 핸들러
  const handleFileDelete = (name: string) => {
    setFiles(prev => ({
      ...prev,
      [name]: null,
    }));

    // 파일 입력 필드 초기화
    const fileInput = document.getElementById(name) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  // 전화번호 입력 핸들러
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    // 숫자만 추출
    const numbers = value.replace(/[^0-9]/g, "");

    // 상태 업데이트
    handleInputChange(
      {
        target: {
          name: "workPhone",
          value: numbers,
        },
      } as React.ChangeEvent<HTMLInputElement>,
      "managerInfo"
    );

    // 입력 필드에 숫자만 표시
    e.target.value = numbers;
  };

  // 전화번호 입력 필드의 키 다운 핸들러
  const handlePhoneNumberKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // 숫자, 백스페이스, 탭, 화살표 키만 허용
    if (
      !/^\d$/.test(e.key) &&
      e.key !== "Backspace" &&
      e.key !== "Delete" &&
      e.key !== "Tab" &&
      e.key !== "ArrowLeft" &&
      e.key !== "ArrowRight"
    ) {
      e.preventDefault();
    }
  };

  // 사업자등록번호 입력 핸들러
  const handleBusinessNumberKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    const { value } = e.currentTarget;

    // 숫자만 입력 가능
    if (
      !/^\d$/.test(e.key) &&
      e.key !== "Backspace" &&
      e.key !== "Delete" &&
      e.key !== "Tab" &&
      e.key !== "ArrowLeft" &&
      e.key !== "ArrowRight"
    ) {
      e.preventDefault();
    }

    // 자동 하이픈 추가
    if (/^\d$/.test(e.key) && value.length === 3) {
      e.currentTarget.value = value + "-";
    } else if (/^\d$/.test(e.key) && value.length === 6) {
      e.currentTarget.value = value + "-";
    }
  };

  // 입력 필드 스타일 가져오기
  const getInputBorderStyle = (value: string, error: string | undefined) => {
    if (error) return "border-red-300 focus:border-red-500 focus:ring-red-500";
    if (value && !error)
      return "border-green-300 focus:border-green-500 focus:ring-green-500";
    return "border-gray-300 focus:border-orange-500 focus:ring-orange-500";
  };

  // 상태 아이콘 렌더링
  const renderStatusIcon = (value: string, error: string | undefined) => {
    if (error) return null;
    if (value && !error) {
      return (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <MdCheckCircle className="h-5 w-5 text-green-500" />
        </div>
      );
    }
    return null;
  };

  // 폼 유효성 검사
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // 기업 정보 검증
    const validateCompanyInfo = () => {
      const {
        companyName,
        businessNumber,
        representativeName,
        businessType,
        companyAddress,
      } = formData.companyInfo;

      if (!companyName.trim()) {
        newErrors.companyName = "기업/기관명을 입력해주세요";
      }

      if (!businessNumber.trim()) {
        newErrors.businessNumber = "사업자등록번호를 입력해주세요";
      } else if (!/^\d{3}-\d{2}-\d{5}$/.test(businessNumber)) {
        newErrors.businessNumber =
          "올바른 형식의 사업자등록번호를 입력해주세요 (예: 123-45-67890)";
      }

      if (!representativeName.trim()) {
        newErrors.representativeName = "대표자명을 입력해주세요";
      }

      if (!businessType.trim()) {
        newErrors.businessType = "업종/업태를 입력해주세요";
      }

      if (!companyAddress.trim()) {
        newErrors.companyAddress = "회사 주소를 입력해주세요";
      }
    };

    // 담당자 정보 검증
    const validateManagerInfo = () => {
      const { workEmail, workPhone } = formData.managerInfo;

      if (!workEmail.trim()) {
        newErrors.workEmail = "담당자 이메일을 입력해주세요";
      } else if (!isValidEmail(workEmail)) {
        newErrors.workEmail = "올바른 이메일 형식을 입력해주세요";
      }

      if (!workPhone.trim()) {
        newErrors.workPhone = "담당자 전화번호를 입력해주세요";
      } else if (!isValidPhoneNumber(workPhone)) {
        newErrors.workPhone =
          "올바른 형식의 전화번호를 입력해주세요 (예: 01012345678)";
      }
    };

    validateCompanyInfo();
    validateManagerInfo();

    // 파일 검증
    if (!files.businessLicense) {
      newErrors.businessLicense = "사업자등록증을 업로드해주세요";
    }

    if (!files.employmentCertificate) {
      newErrors.employmentCertificate = "재직증명서를 업로드해주세요";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      //1. 이미지 파일 업로드
      const [businessLicenseUrl, employmentCertificateUrl] = await Promise.all([
        files.businessLicense
          ? uploadImageToStorage(
              files.businessLicense,
              `companies/${userBase.dashboardId}/business-license`
            )
          : null,
        files.employmentCertificate
          ? uploadImageToStorage(
              files.employmentCertificate,
              `companies/${userBase.dashboardId}/employment-certificate`
            )
          : null,
      ]);

      if (!businessLicenseUrl || !employmentCertificateUrl) {
        throw new Error("필수 이미지 파일 업로드에 실패했습니다.");
      }

      //2. 회사 정보 업데이트
      const verificationData: Organization = {
        companyInfo: {
          companyName: formData.companyInfo.companyName,
          businessNumber: formData.companyInfo.businessNumber,
          representativeName: formData.companyInfo.representativeName,
          businessType: formData.companyInfo.businessType,
          companyAddress: formData.companyInfo.companyAddress,
        },
        managerInfo: {
          position: formData.managerInfo.position,
          department: formData.managerInfo.department,
          workEmail: formData.managerInfo.workEmail,
          workPhone: formData.managerInfo.workPhone,
        },
        additionalInfo: {
          companyWebsite: formData.additionalInfo.companyWebsite,
          companySize: formData.additionalInfo.companySize,
          establishedYear: formData.additionalInfo.establishedYear,
          serviceUsage: formData.additionalInfo.serviceUsage,
          recruitmentField: formData.additionalInfo.recruitmentField,
          annualRecruitmentPlan: formData.additionalInfo.annualRecruitmentPlan,
          serviceUtilizationPlan:
            formData.additionalInfo.serviceUtilizationPlan,
        },
        files: {
          businessLicenseUrl,
          employmentCertificateUrl,
        },
        status: "pending",
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        dashboardId: userBase.dashboardId,
      };

      //3. 회사 인증 요청
      await updateDashboardOrganization(verificationData, userBase.dashboardId);

      //4. 관리자 큐에 등록
      const result = await verifyingCompany(
        verificationData,
        userBase.dashboardId
      );

      if (result.success) {
        // alert("회사 인증 요청이 성공적으로 제출되었습니다.");
        setLocalVerified("pending"); // 바로 인증 진행 중으로 전환
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("회사 인증 요청 중 오류 발생:", error);
      alert("회사 인증 요청 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 p-6 overflow-auto bg-gray-50 scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300 scrollbar-track-transparent">
      <div className="max-w-6xl mx-auto h-full flex flex-col justify-center items-center min-h-[60vh]">
        {localVerified === "pending" ? (
          <section className="w-full flex flex-col items-center text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 mb-4">
              <MdAccessTime className="w-8 h-8 text-orange-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              회사 인증이 진행 중입니다
            </h2>
            <div className="max-w-md w-full mx-auto space-y-4">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <MdInfo className="flex-shrink-0 h-5 w-5 text-orange-500 mt-0.5" />
                  <div className="text-left">
                    <p className="text-orange-700 font-medium mb-1">
                      인증 진행 상태
                    </p>
                    <p className="text-orange-600 text-sm">
                      현재 회사 인증이 진행 중입니다. 인증이 완료되면 알림을
                      통해 안내해 드립니다.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <MdAutorenew className="flex-shrink-0 h-5 w-5 text-blue-500 mt-0.5" />
                  <div className="text-left">
                    <p className="text-blue-700 font-medium mb-1">
                      인증 처리 시간
                    </p>
                    <p className="text-blue-600 text-sm">
                      일반적으로 2-3 영업일 내에 처리됩니다. 긴급한 문의사항이
                      있으시면 고객센터로 연락해 주세요.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => router.push(`/dashboard/${userBase.dashboardId}`)}
              className="mt-6 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              대시보드로 이동
            </button>
          </section>
        ) : localVerified === "approved" ? (
          <section className="w-full flex flex-col items-center text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <MdCheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              회사 인증이 완료되었습니다!
            </h2>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 inline-flex items-start max-w-md w-full">
              <MdInfo className="flex-shrink-0 h-5 w-5 text-green-500 mt-0.5 mr-2" />
              <div className="text-left">
                <p className="text-green-700 font-medium">회사 인증 완료</p>
                <p className="text-green-600 text-sm">
                  축하합니다! 회사 인증이 정상적으로 완료되었습니다. 이제 모든
                  서비스를 자유롭게 이용하실 수 있습니다.
                  <br />
                  <span className="block mt-2 text-green-700 font-semibold">
                    이제 이메일로 진단 검사를 보낼 때 공식적인 회사명이
                    노출됩니다.
                  </span>
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => router.push(`/dashboard/${userBase.dashboardId}`)}
              className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              대시보드로 이동
            </button>
          </section>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8 w-full">
            {errors.submit && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 flex items-start">
                <MdInfo className="flex-shrink-0 h-5 w-5 text-red-500 mt-0.5 mr-2" />
                <p>{errors.submit}</p>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
              {/* 기업 정보 섹션 */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="bg-orange-50 px-4 py-3 border-b border-orange-100">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <MdBusiness className="mr-2 text-orange-500" />
                    기업 정보
                    <span className="ml-2 text-sm text-orange-600">(필수)</span>
                  </h3>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      기업/기관명 (법인명/상호)
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      required
                      value={formData.companyInfo.companyName}
                      onChange={e => handleInputChange(e, "companyInfo")}
                      className={`block w-full px-3 py-2 border ${getInputBorderStyle(
                        formData.companyInfo.companyName,
                        errors.companyName
                      )} rounded-md shadow-sm focus:outline-none transition-colors duration-200`}
                      placeholder="예: (주)워크소스"
                      autoFocus
                    />
                    {errors.companyName && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <MdInfo className="mr-1" />
                        {errors.companyName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      사업자등록번호 *
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        name="businessNumber"
                        inputMode="numeric"
                        required
                        value={formData.companyInfo.businessNumber}
                        onChange={e => handleInputChange(e, "companyInfo")}
                        onKeyDown={handleBusinessNumberKeyDown}
                        className={`block w-full px-3 py-2 border ${getInputBorderStyle(
                          formData.companyInfo.businessNumber,
                          errors.businessNumber
                        )} rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500`}
                        placeholder="숫자 10자리를 입력해주세요"
                      />
                      {renderStatusIcon(
                        formData.companyInfo.businessNumber,
                        errors.businessNumber
                      )}
                    </div>
                    {errors.businessNumber && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.businessNumber}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      대표자명 *
                    </label>
                    <input
                      type="text"
                      name="representativeName"
                      required
                      value={formData.companyInfo.representativeName}
                      onChange={e => handleInputChange(e, "companyInfo")}
                      className={`block w-full px-3 py-2 border ${getInputBorderStyle(
                        formData.companyInfo.representativeName,
                        errors.representativeName
                      )} rounded-md shadow-sm focus:outline-none transition-colors duration-200`}
                      placeholder="대표자명을 입력해주세요"
                    />
                    {errors.representativeName && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <MdInfo className="mr-1" />
                        {errors.representativeName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      업종/업태 *
                    </label>
                    <input
                      type="text"
                      name="businessType"
                      required
                      value={formData.companyInfo.businessType}
                      onChange={e => handleInputChange(e, "companyInfo")}
                      className={`block w-full px-3 py-2 border ${getInputBorderStyle(
                        formData.companyInfo.businessType,
                        errors.businessType
                      )} rounded-md shadow-sm focus:outline-none transition-colors duration-200`}
                      placeholder="업종/업태를 입력해주세요"
                    />
                    {errors.businessType && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <MdInfo className="mr-1" />
                        {errors.businessType}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      회사주소 *
                    </label>
                    <input
                      type="text"
                      name="companyAddress"
                      required
                      value={formData.companyInfo.companyAddress}
                      onChange={e => handleInputChange(e, "companyInfo")}
                      className={`block w-full px-3 py-2 border ${getInputBorderStyle(
                        formData.companyInfo.companyAddress,
                        errors.companyAddress
                      )} rounded-md shadow-sm focus:outline-none transition-colors duration-200`}
                      placeholder="회사 주소를 입력해주세요"
                    />
                    {errors.companyAddress && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <MdInfo className="mr-1" />
                        {errors.companyAddress}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      사업자등록증 *
                    </label>
                    <div className="mt-1">
                      <input
                        type="file"
                        name="businessLicense"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="businessLicense"
                      />
                      <label
                        htmlFor="businessLicense"
                        className={`block w-full px-3 py-2 border ${getInputBorderStyle(
                          files.businessLicense ? "valid" : "",
                          errors.businessLicense
                        )} rounded-md shadow-sm text-sm text-gray-700 
                          bg-white hover:bg-gray-50 cursor-pointer h-[38px]`}
                        aria-required="true"
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
                                : "JPG, JPEG, PNG 이미지 파일 (최대 5MB)"}
                            </span>
                          </span>
                          {files.businessLicense ? (
                            <div className="flex items-center space-x-2">
                              <MdCheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                              <button
                                type="button"
                                onClick={e => {
                                  e.preventDefault();
                                  handleFileDelete("businessLicense");
                                }}
                                className="text-gray-400 hover:text-red-500 focus:outline-none"
                              >
                                <MdClose className="w-5 h-5" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-orange-600 flex-shrink-0">
                              찾아보기
                            </span>
                          )}
                        </div>
                      </label>
                      {errors.businessLicense && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.businessLicense}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      재직증명서 *
                    </label>
                    <div className="mt-1">
                      <input
                        type="file"
                        name="employmentCertificate"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="employmentCertificate"
                      />
                      <label
                        htmlFor="employmentCertificate"
                        className={`block w-full px-3 py-2 border ${getInputBorderStyle(
                          files.employmentCertificate ? "valid" : "",
                          errors.employmentCertificate
                        )} rounded-md shadow-sm text-sm text-gray-700 
                          bg-white hover:bg-gray-50 cursor-pointer h-[38px]`}
                        aria-required="true"
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
                                : "JPG, JPEG, PNG 이미지 파일 (최대 5MB)"}
                            </span>
                          </span>
                          {files.employmentCertificate ? (
                            <div className="flex items-center space-x-2">
                              <MdCheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                              <button
                                type="button"
                                onClick={e => {
                                  e.preventDefault();
                                  handleFileDelete("employmentCertificate");
                                }}
                                className="text-gray-400 hover:text-red-500 focus:outline-none"
                              >
                                <MdClose className="w-5 h-5" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-orange-600 flex-shrink-0">
                              찾아보기
                            </span>
                          )}
                        </div>
                      </label>
                      {errors.employmentCertificate && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.employmentCertificate}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 담당자 정보 섹션 */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="bg-orange-50 px-4 py-3 border-b border-orange-100">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <MdPerson className="mr-2 text-orange-500" />
                    담당자 정보
                    <span className="ml-2 text-sm text-orange-600">(필수)</span>
                  </h3>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      직책
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="position"
                      required
                      value={formData.managerInfo.position}
                      onChange={e => handleInputChange(e, "managerInfo")}
                      className={`block w-full px-3 py-2 border ${getInputBorderStyle(
                        formData.managerInfo.position,
                        errors.position
                      )} rounded-md shadow-sm focus:outline-none transition-colors duration-200`}
                      placeholder="예: 인사팀장"
                    />
                    {errors.position && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <MdInfo className="mr-1" />
                        {errors.position}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      부서
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="department"
                      required
                      value={formData.managerInfo.department}
                      onChange={e => handleInputChange(e, "managerInfo")}
                      className={`block w-full px-3 py-2 border ${getInputBorderStyle(
                        formData.managerInfo.department,
                        errors.department
                      )} rounded-md shadow-sm focus:outline-none transition-colors duration-200`}
                      placeholder="예: 인사팀"
                    />
                    {errors.department && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <MdInfo className="mr-1" />
                        {errors.department}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      이메일
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="email"
                      name="workEmail"
                      required
                      value={formData.managerInfo.workEmail}
                      onChange={e => handleInputChange(e, "managerInfo")}
                      className={`block w-full px-3 py-2 border ${getInputBorderStyle(
                        formData.managerInfo.workEmail,
                        errors.workEmail
                      )} rounded-md shadow-sm focus:outline-none transition-colors duration-200`}
                      placeholder="예: hr@worksauce.kr"
                    />
                    {errors.workEmail && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <MdInfo className="mr-1" />
                        {errors.workEmail}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      전화번호
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="tel"
                      name="workPhone"
                      required
                      value={formData.managerInfo.workPhone}
                      onChange={handlePhoneNumberChange}
                      onKeyDown={handlePhoneNumberKeyDown}
                      className={`block w-full px-3 py-2 border ${getInputBorderStyle(
                        formData.managerInfo.workPhone,
                        errors.workPhone
                      )} rounded-md shadow-sm focus:outline-none transition-colors duration-200`}
                      placeholder="예: 01012345678"
                      maxLength={11}
                    />
                    {errors.workPhone && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <MdInfo className="mr-1" />
                        {errors.workPhone}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* 선택 정보 섹션 */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="bg-orange-50 px-4 py-3 border-b border-orange-100">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <MdInfo className="mr-2 text-orange-500" />
                    선택 정보
                    <span className="ml-2 text-sm text-gray-500">(선택)</span>
                  </h3>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      회사 홈페이지 주소
                    </label>
                    <input
                      type="url"
                      name="companyWebsite"
                      defaultValue="https://"
                      onChange={e => handleInputChange(e, "additionalInfo")}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      회사 규모 (직원 수)
                    </label>
                    <input
                      type="text"
                      name="companySize"
                      value={formData.additionalInfo.companySize}
                      onChange={e => handleInputChange(e, "additionalInfo")}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                      placeholder="예: 50명"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      설립연도
                    </label>
                    <input
                      type="text"
                      name="establishedYear"
                      value={formData.additionalInfo.establishedYear}
                      onChange={e => handleInputChange(e, "additionalInfo")}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                      placeholder="예: 2020"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      서비스 활용 정보
                    </label>
                    <input
                      type="text"
                      name="serviceUsage"
                      value={formData.additionalInfo.serviceUsage}
                      onChange={e => handleInputChange(e, "additionalInfo")}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                      placeholder="서비스 활용 정보를 입력해주세요"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      주요 채용 분야
                    </label>
                    <input
                      type="text"
                      name="recruitmentField"
                      value={formData.additionalInfo.recruitmentField}
                      onChange={e => handleInputChange(e, "additionalInfo")}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                      placeholder="주요 채용 분야를 입력해주세요"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      연간 채용 계획 인원
                    </label>
                    <input
                      type="text"
                      name="annualRecruitmentPlan"
                      value={formData.additionalInfo.annualRecruitmentPlan}
                      onChange={e => handleInputChange(e, "additionalInfo")}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                      placeholder="예: 10명"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      희망하는 서비스 활용 방안
                    </label>
                    <textarea
                      name="serviceUtilizationPlan"
                      value={formData.additionalInfo.serviceUtilizationPlan}
                      onChange={e => handleInputChange(e, "additionalInfo")}
                      rows={3}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                      placeholder="희망하는 서비스 활용 방안을 입력해주세요"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 약관 동의 및 제출 섹션 */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-orange-50 px-4 py-3 border-b border-orange-100">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <MdInfo className="mr-2 text-orange-500" />
                  약관 동의
                </h3>
              </div>
              <div className="p-4 space-y-4">
                <div className="bg-orange-50 rounded-lg p-4 flex items-start space-x-3">
                  <MdInfo className="flex-shrink-0 h-5 w-5 text-orange-500 mt-0.5" />
                  <p className="text-sm text-orange-700">
                    회사 등록 시 워크소스의{" "}
                    <Link
                      href="/terms"
                      className="underline hover:text-orange-800 font-medium"
                    >
                      이용약관
                    </Link>{" "}
                    및{" "}
                    <Link
                      href="/privacy"
                      className="underline hover:text-orange-800 font-medium"
                    >
                      개인정보처리방침
                    </Link>
                    에 동의하게 됩니다.
                  </p>
                </div>

                <div className="bg-orange-50 rounded-lg p-4 flex items-start space-x-3">
                  <MdAccessTime className="flex-shrink-0 h-5 w-5 text-orange-500 mt-0.5" />
                  <p className="text-sm text-orange-700">
                    회사 인증은 제출 후 2-3 영업일이 소요됩니다. 인증이 완료되면
                    알림을 통해 안내해 드립니다.
                  </p>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleSubmit}
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                        ${
                          isSubmitting
                            ? "bg-orange-400 cursor-not-allowed"
                            : "bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                        } 
                        transition-colors duration-200`}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <MdAutorenew className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                        처리중...
                      </div>
                    ) : (
                      "회사 등록"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default RegisterCompany;
