"use client";

import { MdPerson, MdPeople, MdNote } from "react-icons/md";
import Breadcrumb from "./Breadcrumb";
import { UserTeam, Members, TestInfo } from "@/types/user";
import { useState, useEffect } from "react";
import CustomDropdown from "@/components/common/CustomDropdown";
import {
  getMemberLatestSauceTestData,
  getMemberLatestSugarTestData,
  SauceTestData,
  SugarTestData,
} from "@/utils/teamDashboardUtils";
import SugarTestResult from "./SugarTestResult";
import SauceTestResult from "./SauceTestResult";
import { SauceTestResultDescriptionType } from "@/types/saucetest/test";
import React from "react";

// PersonalResultHeader: 개인 결과 섹션 컴포넌트 분리
interface PersonalResultHeaderProps {
  selectedMember: Members;
  selectedTeam: UserTeam | null;
  selectedTest: "sugar" | "sauce";
  setSelectedTest: React.Dispatch<React.SetStateAction<"sugar" | "sauce">>;
  selectedTestId: string;
  setSelectedTestId: (id: string) => void;
  setIsChangeTeamModalOpen: (open: boolean) => void;
  sugarTestData: SugarTestData | null;
  sauceTestData: SauceTestData | null;
  handleTestIdChange: (id: string) => void;
}
const PersonalResultHeader = ({
  selectedMember,
  selectedTeam,
  selectedTest,
  setSelectedTest,
  selectedTestId,
  setSelectedTestId,
  setIsChangeTeamModalOpen,
  sugarTestData,
  sauceTestData,
  handleTestIdChange,
}: PersonalResultHeaderProps) => (
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-0">
    {/* 프로필 영역 */}
    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="p-3 bg-orange-50 rounded-xl flex-shrink-0 self-start sm:self-auto">
        <MdPerson className="text-3xl text-orange-500" />
      </div>
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <h1 className="text-2xl font-bold text-gray-900">
            {selectedMember?.name}
          </h1>
          <div className="flex items-center space-x-2 bg-orange-50 px-3 py-1.5 rounded-lg">
            <span className="text-orange-900 font-medium">
              {selectedTeam?.name}
            </span>
          </div>
        </div>
        <p className="text-base text-gray-500 mt-1">{selectedMember?.email}</p>
      </div>
    </div>
    <div className="flex items-center space-x-4">
      <CustomDropdown
        fullWidth={false}
        options={[
          { id: "sauce", name: "소스 테스트" },
          { id: "sugar", name: "슈가 테스트" },
        ]}
        selectedOption={selectedTest}
        onSelect={option => {
          setSelectedTest(option as "sugar" | "sauce");
          setSelectedTestId(""); // Reset selected test when changing test type
        }}
      />
      <CustomDropdown
        fullWidth={false}
        options={
          selectedTest === "sugar"
            ? sugarTestData?.testHistory?.map(test => ({
                id: test.id,
                name: test.name,
              })) || []
            : sauceTestData?.testHistory?.map(test => ({
                id: test.id,
                name: test.name,
              })) || []
        }
        selectedOption={selectedTestId}
        onSelect={option => handleTestIdChange(option as string)}
      />
      <button
        onClick={() => setIsChangeTeamModalOpen(true)}
        className="flex items-center space-x-2 px-4 py-2 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-lg transition-colors duration-200"
      >
        <MdPeople className="text-lg" />
        <span className="font-medium">팀 변경</span>
      </button>
    </div>
  </div>
);

interface MemberDetailProps {
  selectedMember: Members;
  selectedTeam: UserTeam | null;
  setIsChangeTeamModalOpen: (open: boolean) => void;
  selectedView: "teams" | "team" | "member";
  setSelectedView: (view: "teams" | "team" | "member") => void;
  setSelectedTeam: (team: UserTeam | null) => void;
  setSelectedMember: (member: Members | null) => void;
  fetchTests: TestInfo[];
  SauceTestResultDescriptionType: SauceTestResultDescriptionType;
}

const MemberDetail = ({
  selectedMember,
  selectedTeam,
  setIsChangeTeamModalOpen,
  selectedView,
  setSelectedView,
  setSelectedTeam,
  setSelectedMember,
  fetchTests,
  SauceTestResultDescriptionType,
}: MemberDetailProps) => {
  const [selectedTest, setSelectedTest] = useState<"sugar" | "sauce">("sauce");

  // Get initial test data to set the latest test ID
  const initialTestData = getMemberLatestSugarTestData(
    selectedMember,
    fetchTests,
    selectedTest
  );
  const [selectedTestId, setSelectedTestId] = useState<string>(
    initialTestData?.selectedTestId || ""
  );
  const [isUserSelected, setIsUserSelected] = useState(false);

  const sugarTestData = getMemberLatestSugarTestData(
    selectedMember,
    fetchTests,
    selectedTest,
    selectedTestId
  );

  const sauceTestData = getMemberLatestSauceTestData(
    selectedMember,
    fetchTests,
    SauceTestResultDescriptionType,
    selectedTestId
  );

  // 사용자가 직접 날짜를 선택할 때
  const handleTestIdChange = (option: string) => {
    setSelectedTestId(option);
    setIsUserSelected(true);
  };

  // 최신 테스트 id 자동 세팅 useEffect
  useEffect(() => {
    if (!isUserSelected) {
      if (
        selectedTest === "sugar" &&
        sugarTestData &&
        Array.isArray(sugarTestData.testHistory) &&
        sugarTestData.testHistory.length > 0
      ) {
        setSelectedTestId(sugarTestData.testHistory[0].id);
      } else if (
        selectedTest === "sauce" &&
        sauceTestData &&
        Array.isArray(sauceTestData.testHistory) &&
        sauceTestData.testHistory.length > 0
      ) {
        setSelectedTestId(sauceTestData.testHistory[0].id);
      } else {
        setSelectedTestId("");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTest]);

  useEffect(() => {
    setIsUserSelected(false);
  }, [selectedTest]);

  // 결과 영역 함수 분리
  function renderTestResult(
    selectedTest: "sugar" | "sauce",
    sugarTestData: SugarTestData | null,
    sauceTestData: SauceTestData | null,
    selectedMember: Members
  ) {
    if (selectedTest === "sugar") {
      if (!sugarTestData) {
        return (
          <div className="py-8 text-center text-gray-500">
            아직 슈가 테스트 결과가 없습니다.
          </div>
        );
      }
      return (
        <SugarTestResult
          sugarTestData={sugarTestData}
          selectedMember={selectedMember}
        />
      );
    }
    if (selectedTest === "sauce") {
      if (!sauceTestData) {
        return (
          <div className="py-8 text-center text-gray-500">
            아직 소스 테스트 결과가 없습니다.
          </div>
        );
      }
      return <SauceTestResult sauceTestData={sauceTestData} />;
    }
    return null;
  }

  return (
    <div>
      <Breadcrumb
        selectedView={selectedView}
        setSelectedView={setSelectedView}
        selectedTeam={selectedTeam}
        setSelectedTeam={setSelectedTeam}
        selectedMember={selectedMember}
        setSelectedMember={setSelectedMember}
      />

      {sugarTestData || sauceTestData ? (
        <div className="space-y-8">
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <header className="border-b border-gray-100 pb-6 mb-6">
              <PersonalResultHeader
                selectedMember={selectedMember as Members}
                selectedTeam={selectedTeam}
                selectedTest={selectedTest}
                setSelectedTest={setSelectedTest}
                selectedTestId={selectedTestId}
                setSelectedTestId={setSelectedTestId}
                setIsChangeTeamModalOpen={setIsChangeTeamModalOpen}
                sugarTestData={sugarTestData}
                sauceTestData={sauceTestData}
                handleTestIdChange={handleTestIdChange}
              />
            </header>
            {renderTestResult(
              selectedTest as "sugar" | "sauce",
              sugarTestData,
              sauceTestData,
              selectedMember as Members
            )}
          </section>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-xl p-8 text-center">
          <div className="flex flex-col items-center space-y-4">
            <MdNote className="text-4xl text-gray-400" />
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                테스트 결과가 없습니다
              </h3>
              <p className="text-gray-500">
                테스트 결과가 아직 없습니다
                <br />
                테스트를 완료하면 결과를 확인할 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberDetail;
