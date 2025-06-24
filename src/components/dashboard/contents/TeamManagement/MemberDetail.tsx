"use client";

import { MdPerson, MdPeople, MdNote } from "react-icons/md";
import Breadcrumb from "./Breadcrumb";
import { UserTeam, Members, TestInfo } from "@/types/user";
import { useState } from "react";
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

  return (
    <div className="">
      <Breadcrumb
        selectedView={selectedView}
        setSelectedView={setSelectedView}
        selectedTeam={selectedTeam}
        setSelectedTeam={setSelectedTeam}
        selectedMember={selectedMember}
        setSelectedMember={setSelectedMember}
      />
      <div className="space-y-8">
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <header className="border-b border-gray-100 pb-6 mb-6">
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
                  <p className="text-base text-gray-500 mt-1">
                    {selectedMember?.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <CustomDropdown
                  fullWidth={false}
                  options={[
                    { id: "sugar", name: "슈가 테스트" },
                    { id: "sauce", name: "소스 테스트" },
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
                    sugarTestData?.testHistory.map(test => ({
                      id: test.id,
                      name: test.name,
                    })) || []
                  }
                  selectedOption={selectedTestId}
                  onSelect={option => setSelectedTestId(option as string)}
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
          </header>

          {selectedTest === "sugar" ? (
            <SugarTestResult
              sugarTestData={sugarTestData as SugarTestData}
              selectedMember={selectedMember}
            />
          ) : selectedTest === "sauce" ? (
            <SauceTestResult sauceTestData={sauceTestData as SauceTestData} />
          ) : (
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <div className="flex flex-col items-center space-y-4">
                <MdNote className="text-4xl text-gray-400" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    테스트 결과가 없습니다
                  </h3>
                  <p className="text-gray-500">
                    {selectedTest === "sugar" ? "슈가" : "소스"} 테스트 결과가
                    아직 없습니다.
                    <br />
                    테스트를 완료하면 결과를 확인할 수 있습니다.
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default MemberDetail;
