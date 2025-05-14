"use client";

import React, { useState, useEffect } from "react";
import { User } from "@/types/user";
import {
  MdEmail,
  MdSend,
  MdAdd,
  MdDelete,
  MdLabel,
  MdCalendarMonth,
  MdChevronLeft,
  MdChevronRight,
  MdPerson,
  MdGroup,
  MdClose,
  MdSearch,
} from "react-icons/md";
import { Group } from "@/types/group";
import { sendSugarTestEmail } from "@/utils/email/sugarTest";
import { useRouter } from "next/navigation";
import { isValidEmail } from "@/utils/validation";

import { ContactGroup, Contact } from "@/types/contacts";
import useWelcomeScreenStore from "../stores/useWelcomeScreenStore";
import TeamDashboard from "./TeamDashboard";

interface SendingTestProps {
  user: User;
}

interface Applicant {
  name: string;
  email: string;
  fromGroup?: string;
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
            <MdLabel className="mr-2 text-[#F97316]" />
          ) : (
            <MdCalendarMonth className="mr-2 text-[#F97316]" />
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
        {icon && <div className="mr-2 text-[#F97316]">{icon}</div>}
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

export const SendingSugarTest = ({ user }: SendingTestProps) => {
  const { userBase, userTeam } = user;
  const { isWelcomeScreen } = useWelcomeScreenStore();
  const [groupName, setGroupName] = useState<string>("");
  const [deadline, setDeadline] = useState<string>("");
  const [currentApplicant, setCurrentApplicant] = useState<Applicant>({
    name: "",
    email: "",
  });
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [emailError, setEmailError] = useState("");
  const [deadlineError, setDeadlineError] = useState<string>("");
  const router = useRouter();
  const totalPages = Math.max(
    1,
    Math.ceil(applicants.length / APPLICANTS_PER_PAGE)
  );
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (applicants.length > APPLICANTS_PER_PAGE && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [applicants, currentPage, totalPages]);

  const handleAddApplicant = () => {
    if (currentApplicant.name && currentApplicant.email) {
      if (!isValidEmail(currentApplicant.email)) {
        setEmailError("올바른 이메일 형식을 입력해주세요.");
        return;
      }

      setApplicants([...applicants, currentApplicant]);
      setCurrentApplicant({ name: "", email: "" });
      setEmailError("");
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

  const handleDeadlineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = new Date(e.target.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (selectedDate < tomorrow) {
      setDeadlineError("마감기한은 내일 이후여야 합니다.");
    } else {
      setDeadlineError("");
    }
    setDeadline(e.target.value);
  };

  const handleAddFromAddressBook = async (teamId: string) => {
    try {
      const team = userTeam.find(t => t.id === teamId);
      if (!team) return;

      const newApplicants = team.members
        .filter(
          member =>
            member.email &&
            !applicants.some(existing => existing.email === member.email)
        )
        .map(member => ({
          name: member.name,
          email: member.email,
          fromGroup: team.name,
        }));

      setApplicants(prev => [...prev, ...newApplicants]);
    } catch (error) {
      console.error("Error fetching team members:", error);
    }
  };

  const handleSendEmails = async () => {
    const selectedDate = new Date(deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (selectedDate < tomorrow) {
      setDeadlineError("마감기한은 내일 이후여야 합니다.");
      return;
    }

    setIsSending(true);

    // const groupId = await createGroup(
    //   {
    //     name: groupName,
    //     deadline: new Date(deadline).toISOString(),
    //     applicants: applicants.map(applicant => ({
    //       name: applicant.name.trim(),
    //       email: applicant.email.trim().toLowerCase(),
    //       groupId: "",
    //       testStatus: "pending",
    //       completedAt: null,
    //       testResult: [],
    //       groupName: groupName,
    //     })),
    //     createdAt: new Date().toISOString(),
    //     updatedAt: new Date().toISOString(),
    //     createdBy: { id: user.id, name: user.name },
    //     updatedBy: { id: user.id, name: user.name },
    //     groupId: "",
    //     testType: "sugar",
    //   },
    //   user.id
    // );

    // if (user.userType === "business") {
    //   const businessUser = user as BusinessUser;
    //   for (const applicant of applicants) {
    //     const success = await sendSugarTestEmail({
    //       to: applicant.email,
    //       applicantName: applicant.name,
    //       groupId: groupId,
    //       userName: user.name,
    //       companyName: businessUser.companyInfo.companyName,
    //       deadline: deadline,
    //       userType: user.userType,
    //     });

    //     if (!success) {
    //       alert("이메일 전송 실패. 다시 시도해주세요.");
    //     }
    //   }
    // }

    // if (user.userType === "individual") {
    //   for (const applicant of applicants) {
    //     const success = await sendSugarTestEmail({
    //       to: applicant.email,
    //       applicantName: applicant.name,
    //       groupId: groupId,
    //       userName: user.name,
    //       companyName: "",
    //       deadline: deadline,
    //       userType: user.userType,
    //     });

    //     if (!success) {
    //       alert("이메일 전송 실패. 다시 시도해주세요.");
    //     }
    //   }
    // }

    setIsSending(false);
    setGroupName("");
    setDeadline("");
    setApplicants([]);
    setCurrentPage(1);

    // router.push(`/group/sugar/${groupId}`);
  };

  const paginatedApplicants = applicants.slice(
    (currentPage - 1) * APPLICANTS_PER_PAGE,
    currentPage * APPLICANTS_PER_PAGE
  );

  const isSubmitDisabled = () => {
    return (
      isSending ||
      !groupName ||
      !deadline ||
      applicants.length === 0 ||
      deadlineError !== ""
    );
  };

  // 검색된 그룹 필터링
  const filteredGroups = userTeam.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const removeApplicantsByGroup = (groupName: string) => {
    const newApplicants = applicants.filter(
      applicant => applicant.fromGroup !== groupName
    );
    setApplicants(newApplicants);

    // 페이지네이션 조정
    const newTotalPages = Math.ceil(newApplicants.length / APPLICANTS_PER_PAGE);
    if (currentPage > newTotalPages) {
      setCurrentPage(Math.max(1, newTotalPages));
    }
  };

  const hasApplicantsFromGroup = (groupName: string) => {
    return applicants.some(applicant => applicant.fromGroup === groupName);
  };

  return isWelcomeScreen ? (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden w-full max-w-6xl h-full mx-auto">
      <div className="flex flex-col lg:flex-row h-full">
        {/* 왼쪽 섹션: 그룹 정보 및 지원자 추가 */}
        <div className="lg:w-1/2 p-4 sm:p-6 flex flex-col gap-6 h-full">
          <div className="grid grid-cols-2 gap-6">
            <InputField
              id="groupName"
              label="그룹 이름"
              value={groupName}
              onChange={e => setGroupName(e.target.value)}
              placeholder="예) 08월 개발팀 슈가테스트"
            />
            <div className="flex flex-col">
              <InputField
                id="deadline"
                label="마감기한"
                type="date"
                value={deadline}
                onChange={handleDeadlineChange}
              />
              {deadlineError && (
                <p className="text-xs text-red-500 mt-1">{deadlineError}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <InputField
              id="applicantName"
              label="응시자 이름"
              icon={<MdPerson className="h-5 w-5" />}
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
              label="응시자 이메일"
              icon={<MdEmail className="h-5 w-5" />}
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
            {emailError && <p className="text-xs text-red-500">{emailError}</p>}
            <button
              type="button"
              onClick={handleAddApplicant}
              className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#F97316] hover:bg-[#EA580C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F97316] transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <MdAdd className="mr-2 -ml-1 h-5 w-5" aria-hidden="true" />
              응시자 추가
            </button>
          </div>

          {/* 팀 리스트 섹션 */}
          <div className="flex flex-col gap-6 flex-1 min-h-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center flex-shrink-0">
                <MdGroup className="mr-2 text-[#F97316]" />
                팀에서 추가
              </h3>

              {/* 검색 입력창 */}
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MdSearch className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="팀 이름으로 검색"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent transition-all duration-200 placeholder-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* 팀 리스트 */}
            <div className="flex-1 flex flex-col min-h-0">
              <div className="rounded-lg p-4 bg-white border border-gray-200 shadow-sm h-full flex flex-col">
                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300 scrollbar-track-transparent">
                  <div className="space-y-3">
                    {filteredGroups.length > 0 ? (
                      filteredGroups.map(team => (
                        <div
                          key={team.id}
                          className="group bg-white rounded-lg border border-gray-200 hover:border-[#F97316] hover:shadow-md transition-all duration-200"
                        >
                          <div className="p-4 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-[#FFF1E7] flex items-center justify-center group-hover:bg-[#FFEDE3] transition-colors duration-200">
                                <MdGroup className="h-5 w-5 text-[#F97316]" />
                              </div>
                              <div className="flex flex-col">
                                <span className="font-medium text-gray-900">
                                  {team.name}
                                </span>
                                <span className="text-sm text-gray-500">
                                  {team.members.length}명의 멤버
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {hasApplicantsFromGroup(team.name) ? (
                                <button
                                  onClick={() =>
                                    removeApplicantsByGroup(team.name)
                                  }
                                  className="flex items-center gap-1 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-md transition-all duration-200"
                                >
                                  <MdClose className="h-5 w-5" />
                                  <span className="text-sm font-medium">
                                    제거
                                  </span>
                                </button>
                              ) : (
                                <button
                                  onClick={() =>
                                    handleAddFromAddressBook(team.id)
                                  }
                                  className="flex items-center gap-1 px-3 py-1.5 text-[#F97316] hover:bg-orange-50 rounded-md transition-all duration-200"
                                >
                                  <MdAdd className="h-5 w-5" />
                                  <span className="text-sm font-medium">
                                    추가
                                  </span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                        <MdSearch className="h-8 w-8 mb-2" />
                        <span>검색 결과가 없습니다</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 오른쪽 섹션: 추가된 지원자 목록 */}
        <div className="lg:w-1/2 bg-white p-4 sm:p-6 flex flex-col h-full border-l border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="mr-2">추가된 응시자 목록</span>
            <span className="text-sm font-normal text-gray-500">
              ({applicants.length}명)
            </span>
          </h2>

          {/* 추가된 그룹 태그 섹션 */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {Array.from(
                new Set(
                  applicants
                    .map(a => a.fromGroup)
                    .filter((group): group is string => Boolean(group))
                )
              ).map(groupName => (
                <div
                  key={groupName}
                  className="group flex items-center gap-1 px-3 py-1.5 bg-orange-50 text-orange-700 rounded-full border border-orange-200 hover:bg-orange-100 transition-colors duration-200"
                >
                  <MdLabel className="h-4 w-4" />
                  <span className="text-sm font-medium">{groupName}</span>
                  <button
                    onClick={() => removeApplicantsByGroup(groupName)}
                    className="ml-1 p-0.5 rounded-full hover:bg-orange-200 transition-colors duration-200"
                  >
                    <MdClose className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-grow overflow-y-auto space-y-3">
            {paginatedApplicants.map((applicant, index) => (
              <div
                key={index + (currentPage - 1) * APPLICANTS_PER_PAGE}
                className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100"
              >
                <div>
                  <p className="font-medium text-gray-800">{applicant.name}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-600">{applicant.email}</p>
                    {applicant.fromGroup && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                        <MdLabel className="mr-1 h-3 w-3" />
                        {applicant.fromGroup}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() =>
                    handleRemoveApplicant(
                      index + (currentPage - 1) * APPLICANTS_PER_PAGE
                    )
                  }
                  className="text-gray-400 hover:text-red-500 transition-colors duration-200 p-2 rounded-full hover:bg-red-50"
                >
                  <MdDelete className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>

          {applicants.length > APPLICANTS_PER_PAGE && (
            <div className="flex justify-between items-center mt-4 px-4 py-3 bg-gray-50 rounded-lg">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-md bg-white text-[#F97316] border border-[#F97316] disabled:opacity-50 disabled:border-gray-200 disabled:text-gray-400 transition-all duration-200 hover:bg-[#FFF1E7]"
              >
                <MdChevronLeft className="h-5 w-5" />
              </button>
              <span className="font-medium text-gray-700">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-md bg-white text-[#F97316] border border-[#F97316] disabled:opacity-50 disabled:border-gray-200 disabled:text-gray-400 transition-all duration-200 hover:bg-[#FFF1E7]"
              >
                <MdChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}

          <button
            type="button"
            className={`w-full flex justify-center items-center px-6 py-3 mt-4 border border-transparent text-lg font-medium rounded-lg text-white bg-[#F97316] hover:bg-[#EA580C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F97316] transition-all duration-200 ${
              isSubmitDisabled()
                ? "opacity-50 cursor-not-allowed"
                : "shadow-lg hover:shadow-xl"
            }`}
            onClick={handleSendEmails}
            disabled={isSubmitDisabled()}
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
                <MdSend className="mr-2 text-white" />
                이메일 전송하고 그룹 생성
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  ) : (
    <TeamDashboard user={user} />
  );
};
