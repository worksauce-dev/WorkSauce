"use client";

import React, { useState, useEffect, useCallback } from "react";
import { User } from "@/types/user";
import {
  FiMail,
  FiSend,
  FiPlus,
  FiTrash2,
  FiTag,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiUpload,
  FiUser,
  FiCheck,
  FiChevronDown,
  FiX,
} from "react-icons/fi";
import * as XLSX from "xlsx";
import { applicantTypes } from "@/constant/test";

interface SendingTestProps {
  user: User;
}

interface Applicant {
  name: string;
  email: string;
}

const APPLICANTS_PER_PAGE = 5;

interface InputFieldProps {
  id: string;
  label: string;
  icon?: React.ReactNode;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  icon,
  type = "text",
  value,
  onChange,
  placeholder,
}) => {
  const baseInputClasses =
    "w-full border-0 border-b-2 border-gray-300 focus:border-indigo-500 transition-all duration-200 bg-transparent outline-none";

  if (id === "groupName" || id === "deadline") {
    return (
      <div className="relative pt-5">
        <label
          htmlFor={id}
          className="absolute top-0 left-0 text-xs text-gray-500"
        >
          {label}
        </label>
        <div className="flex items-center">
          {id === "groupName" ? (
            <FiTag className="mr-2 text-indigo-500" />
          ) : (
            <FiCalendar className="mr-2 text-indigo-500" />
          )}
          <input
            type={type}
            id={id}
            className={`${baseInputClasses} text-lg font-medium py-2`}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative pt-5">
      <label
        htmlFor={id}
        className="absolute top-0 left-0 text-xs text-gray-500"
      >
        {label}
      </label>
      <div className="flex items-center">
        {icon && <div className="mr-2 text-indigo-500">{icon}</div>}
        <input
          type={type}
          id={id}
          className={`${baseInputClasses} py-2`}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};

const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

const MAX_SELECTIONS = 3;

export const SendingTest = ({ user }: SendingTestProps) => {
  const [groupName, setGroupName] = useState<string>("");
  const [deadline, setDeadline] = useState<string>("");
  const [currentApplicant, setCurrentApplicant] = useState<Applicant>({
    name: "",
    email: "",
  });
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isDragging, setIsDragging] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);

  const totalPages = Math.max(
    1,
    Math.ceil(applicants.length / APPLICANTS_PER_PAGE)
  );

  useEffect(() => {
    if (applicants.length > APPLICANTS_PER_PAGE && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [applicants, currentPage, totalPages]);

  const handleAddApplicant = () => {
    if (currentApplicant.name && currentApplicant.email) {
      if (!emailRegex.test(currentApplicant.email)) {
        setEmailError("올바른 이메일 형식을 입력해주세요.");
        return;
      }

      setApplicants([...applicants, currentApplicant]);
      setCurrentApplicant({ name: "", email: "" });
      setEmailError(""); // 에러 메시지 초기화
      if (applicants.length >= APPLICANTS_PER_PAGE) {
        setCurrentPage(
          Math.ceil((applicants.length + 1) / APPLICANTS_PER_PAGE)
        );
      }
    }
  };

  const handleRemoveApplicant = (index: number) => {
    const newApplicants = applicants.filter((_, i) => i !== index);
    setApplicants(newApplicants);
    if (currentPage > Math.ceil(newApplicants.length / APPLICANTS_PER_PAGE)) {
      setCurrentPage(Math.max(1, currentPage - 1));
    }
  };

  const handleSendEmails = async () => {
    setIsSending(true);
    // TODO: Implement email sending logic here

    console.log(
      `Sending emails for group: ${groupName}, Deadline: ${[deadline]}`
    );
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulating API call
    setIsSending(false);
    setGroupName("");
    setDeadline("");
    setApplicants([]);
    setCurrentPage(1);
  };

  const handleFileUpload = useCallback((file: File) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);

        const newApplicants: Applicant[] = json
          .map((row: any) => ({
            name: row["이름"] || row["Name"] || "",
            email: row["이메일"] || row["Email"] || "",
          }))
          .filter(applicant => applicant.name && applicant.email);

        setApplicants(prevApplicants => [...prevApplicants, ...newApplicants]);
      };
      reader.readAsArrayBuffer(file);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && (file.name.endsWith(".xlsx") || file.name.endsWith(".xls"))) {
        handleFileUpload(file);
      }
    },
    [handleFileUpload]
  );

  const handleTypeSelection = (typeName: string) => {
    setSelectedTypes(prev => {
      if (prev.includes(typeName)) {
        // 이미 선택된 유형이면 제거
        return prev.filter(t => t !== typeName);
      } else if (prev.length < MAX_SELECTIONS) {
        // 선택된 유형이 3개 미만이면 추가
        return [...prev, typeName];
      }
      // 이미 3개가 선택된 경우 변경 없음
      return prev;
    });
  };

  const paginatedApplicants = applicants.slice(
    (currentPage - 1) * APPLICANTS_PER_PAGE,
    currentPage * APPLICANTS_PER_PAGE
  );

  return (
    <div className="w-full px-4 sm:px-6 lg:px-9 py-8 bg-gradient-to-br from-indigo-100 to-purple-100 min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden w-full max-w-6xl">
        <div className="flex flex-col lg:flex-row h-full">
          {/* 왼쪽 섹션: 그룹 정보 및 지원자 추가 */}
          <div className="lg:w-1/2 p-8 flex flex-col gap-8">
            <h2 className="text-xl font-bold text-indigo-800">지원자 관리</h2>
            <div className="grid grid-cols-2 gap-8">
              <InputField
                id="groupName"
                label="그룹 이름"
                value={groupName}
                onChange={e => setGroupName(e.target.value)}
                placeholder="예) 24년 08월 개발자 채용"
              />
              <InputField
                id="deadline"
                label="마감기한"
                type="date"
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-4">
              <InputField
                id="applicantName"
                label="지원자 이름"
                icon={<FiUser className="h-5 w-5" />}
                value={currentApplicant.name}
                onChange={e =>
                  setCurrentApplicant({
                    ...currentApplicant,
                    name: e.target.value,
                  })
                }
                placeholder="홍길동"
              />
              <InputField
                id="applicantEmail"
                label="지원자 이메일"
                icon={<FiMail className="h-5 w-5" />}
                type="email"
                value={currentApplicant.email}
                onChange={e =>
                  setCurrentApplicant({
                    ...currentApplicant,
                    email: e.target.value,
                  })
                }
                placeholder="example@email.com"
              />
              {emailError && (
                <p className="text-xs text-red-500">{emailError}</p>
              )}
              <button
                type="button"
                onClick={handleAddApplicant}
                className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <FiPlus className="mr-2 -ml-1 h-5 w-5" aria-hidden="true" />
                지원자 추가
              </button>
            </div>

            {/* 지원자 유형 선택 버튼 */}
            <button
              onClick={() => setIsTypeModalOpen(true)}
              className="w-full flex justify-between items-center px-4 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <span>
                {selectedTypes.length > 0
                  ? selectedTypes.join(", ")
                  : "지원자 유형 선택 (최대 3개)"}
              </span>
              <FiChevronDown className="ml-2" />
            </button>

            <div className="mt-auto">
              <h2 className="text-xl font-bold text-indigo-800 mb-4">
                엑셀 파일로 지원자 일괄 추가
              </h2>
              <div
                className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg ${
                  isDragging
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-300"
                } cursor-pointer transition-all duration-200 hover:border-indigo-400 hover:bg-indigo-50`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById("excel-upload")?.click()}
              >
                <div className="space-y-1 text-center">
                  <FiUpload
                    className={`mx-auto h-12 w-12 ${
                      isDragging ? "text-indigo-500" : "text-gray-400"
                    } transition-colors duration-200`}
                  />
                  <div className="flex text-sm text-gray-600 justify-center">
                    <span className="font-medium text-indigo-600 hover:text-indigo-500">
                      엑셀 파일 업로드
                    </span>
                  </div>
                  <input
                    id="excel-upload"
                    name="excel-upload"
                    type="file"
                    className="hidden"
                    accept=".xlsx, .xls"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file);
                    }}
                  />
                  <p className="text-xs text-gray-500">
                    XLSX, XLS 파일을 드래그하여 놓거나 클릭하여 업로드하세요
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 오른쪽 섹션: 추가된 지원자 목록 */}
          <div className="lg:w-1/2 bg-indigo-50 p-8 flex flex-col h-[calc(100vh-4rem)]">
            <h2 className="text-2xl font-bold text-indigo-800 mb-6">
              추가된 지원자 목록
            </h2>
            <div className="flex-grow overflow-hidden flex flex-col">
              <div className="space-y-4 overflow-y-auto flex-grow">
                {paginatedApplicants.map((applicant, index) => (
                  <div
                    key={index + (currentPage - 1) * APPLICANTS_PER_PAGE}
                    className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <div>
                      <p className="font-medium text-indigo-900">
                        {applicant.name}
                      </p>
                      <p className="text-sm text-indigo-600">
                        {applicant.email}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        handleRemoveApplicant(
                          index + (currentPage - 1) * APPLICANTS_PER_PAGE
                        )
                      }
                      className="text-red-500 hover:text-red-700 transition-colors duration-200 p-2 rounded-full hover:bg-red-100"
                    >
                      <FiTrash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            {applicants.length > APPLICANTS_PER_PAGE && (
              <div className="flex justify-between items-center my-4">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-md bg-indigo-100 text-indigo-600 disabled:opacity-50 transition-all duration-200 hover:bg-indigo-200"
                >
                  <FiChevronLeft />
                </button>
                <span className="text-indigo-800 font-medium">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-md bg-indigo-100 text-indigo-600 disabled:opacity-50 transition-all duration-200 hover:bg-indigo-200"
                >
                  <FiChevronRight />
                </button>
              </div>
            )}
            <button
              type="button"
              className={`w-full flex justify-center items-center px-6 py-3 border border-transparent text-lg font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ${
                isSending || !groupName || !deadline || applicants.length === 0
                  ? "opacity-50 cursor-not-allowed"
                  : "shadow-lg hover:shadow-xl"
              }`}
              onClick={handleSendEmails}
              disabled={
                isSending || !groupName || !deadline || applicants.length === 0
              }
            >
              {isSending ? (
                <>
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
                  전송 중...
                </>
              ) : (
                <>
                  <FiSend className="mr-2" />
                  이메일 전송하고 그룹 생성
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 지원자 유형 선택 모달 */}
      {isTypeModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">지원자 유형 선택 (최대 3개)</h3>
              <button
                onClick={() => setIsTypeModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              {applicantTypes.map(type => (
                <div
                  key={type.name}
                  className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedTypes.includes(type.name)
                      ? "bg-indigo-100 border-2 border-indigo-500"
                      : "bg-gray-50 hover:bg-gray-100"
                  } ${
                    selectedTypes.length >= MAX_SELECTIONS &&
                    !selectedTypes.includes(type.name)
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  onClick={() => handleTypeSelection(type.name)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{type.name}</span>
                    {selectedTypes.includes(type.name) && (
                      <FiCheck className="h-5 w-5 text-indigo-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {type.description}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsTypeModalOpen(false)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
