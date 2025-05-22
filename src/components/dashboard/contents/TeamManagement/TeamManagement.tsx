"use client";

import React, { useState, useEffect } from "react";
import { Members, UserTeam, TestInfo } from "@/types/user";
import MemberDetail from "@/components/dashboard/contents/TeamManagement/MemberDetail";
import TeamDetail from "@/components/dashboard/contents/TeamManagement/TeamDetail";
import TeamsDetail from "@/components/dashboard/contents/TeamManagement/TeamsDetail";
import CustomDropdown from "@/components/common/CustomDropdown";
import { DashboardInterface } from "@/types/dashboard";
import { sendSugarTestEmail } from "@/utils/email/sugarTest";
import { Applicant, UserBase } from "@/types/user";

interface AddTeamMemberResponse {
  success: boolean;
  message: string;
  member?: Members;
}

interface TeamManagementProps {
  userBase: UserBase;
  createTeam: (dashboardId: string, team: UserTeam) => Promise<UserTeam>;
  fetchTeams: UserTeam[];
  addTeamMember: (
    dashboardId: string,
    teamId: string,
    newMember: Members
  ) => Promise<AddTeamMemberResponse>;
  createTestInfo: (
    dashboardId: string,
    teamId: string,
    testInfo: TestInfo
  ) => Promise<TestInfo>;
  updateTestRef: (
    dashboardId: string,
    teamId: string,
    testId: string,
    memberId: string[]
  ) => Promise<{ success: boolean; message: string }>;
  createTest: (
    dashboardId: string,
    teamId: string,
    testInfo: TestInfo
  ) => Promise<{ success: boolean; message: string }>;
  fetchTests: TestInfo[];
  dashboardData: DashboardInterface;
}

const TeamManagement = ({
  userBase,
  createTeam,
  fetchTeams,
  addTeamMember,
  createTestInfo,
  updateTestRef,
  createTest,
  fetchTests,
  dashboardData,
}: TeamManagementProps) => {
  // 상태 관리
  const [teams, setTeams] = useState<UserTeam[]>(fetchTeams);
  const [selectedTeam, setSelectedTeam] = useState<UserTeam | null>(null);
  const [isCreateTeamModalOpen, setIsCreateTeamModalOpen] = useState(false);
  const [isCreateMemberModalOpen, setIsCreateMemberModalOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [newMember, setNewMember] = useState<Partial<Members>>({
    name: "",
    email: "",
  });

  const [selectedMember, setSelectedMember] = useState<Members | null>(null);
  const [selectedView, setSelectedView] = useState<"teams" | "team" | "member">(
    "teams"
  );
  const [isSendTestModalOpen, setIsSendTestModalOpen] = useState(false);
  const [selectedTestType, setSelectedTestType] = useState<"sugar" | "sauce">(
    "sugar"
  );

  const [selectedDeadline, setSelectedDeadline] = useState<string>(() => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:mm
  });
  const [isChangeTeamModalOpen, setIsChangeTeamModalOpen] = useState(false);
  const [newTeamId, setNewTeamId] = useState("");

  // 모달 외부 클릭 시 모달 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const modalContent = target.closest(".modal-content");
      const modalBackdrop = target.closest(".modal-backdrop");

      if (modalBackdrop && !modalContent) {
        if (isCreateTeamModalOpen) {
          setIsCreateTeamModalOpen(false);
          setNewTeamName("");
        }
        if (isCreateMemberModalOpen) {
          setIsCreateMemberModalOpen(false);
          setNewMember({ name: "", email: "" });
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCreateTeamModalOpen, isCreateMemberModalOpen]);

  // 팀 생성
  const handleCreateTeam = async () => {
    if (!newTeamName.trim()) return;

    const newTeam: UserTeam = {
      teamId: "",
      dashboardId: userBase.dashboardId,
      name: newTeamName,
      members: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: { name: userBase.name, id: userBase.id },
      testIds: [],
    };

    try {
      const createdTeam = await createTeam(userBase.dashboardId, newTeam);
      setTeams([...teams, createdTeam]);
    } catch (error) {
      console.error("팀 생성 중 오류 발생:", error);
    }

    setNewTeamName("");
    setIsCreateTeamModalOpen(false);
  };

  // 팀원 생성
  const handleCreateMember = async () => {
    if (!newMember.name || !newMember.email || !selectedTeam) {
      alert("이름과 이메일을 입력해주세요.");
      return;
    }

    try {
      const newMemberData: Members = {
        teamInfo: {
          teamId: selectedTeam.teamId,
          name: selectedTeam.name,
        },
        id: newMember.name + "-" + newMember.email,
        name: newMember.name,
        email: newMember.email,
        testIds: [],
      };

      const response = await addTeamMember(
        userBase.dashboardId,
        selectedTeam.teamId,
        newMemberData
      );

      if (response.success) {
        // 팀 목록 업데이트
        const updatedTeams = teams.map(team => {
          if (team.teamId === selectedTeam.teamId) {
            return {
              ...team,
              members: [...team.members, response.member!],
            };
          }
          return team;
        });
        setTeams(updatedTeams);

        // 입력 폼 초기화 및 모달 닫기
        setNewMember({ name: "", email: "" });
        setIsCreateMemberModalOpen(false);
        alert("팀원이 성공적으로 추가되었습니다.");
      } else {
        alert(response.message || "팀원 추가에 실패했습니다.");
      }
    } catch (error) {
      console.error("팀원 추가 중 오류 발생:", error);
      alert("팀원 추가 중 오류가 발생했습니다.");
    }
  };

  // 테스트 전송 핸들러
  const handleSendTest = async () => {
    if (!selectedTeam) return;

    function getAllMemberIds(teams: UserTeam[]): string[] {
      return teams.flatMap(team => team.members.map(member => member.id));
    }

    function createApplicantObject(teams: UserTeam[]): Applicant[] {
      return teams.flatMap(team =>
        team.members.map(member => ({
          name: member.name,
          email: member.email,
          id: member.id,
          testStatus: "pending",
          completedAt: "",
          testResult: null,
          team: { name: team.name, id: team.teamId },
        }))
      );
    }

    const memberIds = getAllMemberIds(teams);

    const testInfo: TestInfo = {
      testId: crypto.randomUUID(),
      type: selectedTestType,
      deadline: selectedDeadline,
      status: "pending",
      createdBy: { name: userBase.name, id: userBase.id },
      applicants: createApplicantObject(teams),
      teamId: selectedTeam.teamId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await createTestInfo(userBase.dashboardId, selectedTeam.teamId, testInfo);

    await updateTestRef(
      userBase.dashboardId,
      selectedTeam.teamId,
      testInfo.testId,
      memberIds
    );

    const testResponse = await createTest(
      userBase.dashboardId,
      selectedTeam.teamId,
      testInfo
    );

    if (dashboardData.isVerified === "verified") {
      for (const member of selectedTeam.members) {
        const success = await sendSugarTestEmail({
          to: member.email,
          applicantName: member.name,
          testId: testInfo.testId,
          userName: member.name,
          companyName: dashboardData.organization.companyInfo.companyName,
          deadline: selectedDeadline,
          isVerified: dashboardData.isVerified,
        });

        if (!success) {
          alert("이메일 전송 실패. 다시 시도해주세요.");
        }
      }
    } else {
      for (const member of selectedTeam.members) {
        const success = await sendSugarTestEmail({
          to: member.email,
          applicantName: member.name,
          testId: testInfo.testId,
          userName: member.name,
          companyName: dashboardData.organization.companyInfo.companyName,
          deadline: selectedDeadline,
          isVerified: dashboardData.isVerified,
        });

        if (!success) {
          alert("이메일 전송 실패. 다시 시도해주세요.");
        }
      }
    }

    if (testResponse.success) {
      setIsSendTestModalOpen(false);
      alert("테스트가 성공적으로 전송되었습니다.");
    } else {
      alert(testResponse.message || "테스트 전송에 실패했습니다.");
    }
  };

  const handleTeamChange = () => {
    if (!selectedMember || !newTeamId) return;

    // 이전 팀에서 멤버 제거
    const updatedTeams = teams.map(team => {
      if (team.teamId === selectedTeam?.teamId) {
        return {
          ...team,
          members: team.members.filter(m => m.id !== selectedMember.id),
        };
      }
      // 새로운 팀에 멤버 추가
      if (team.teamId === newTeamId) {
        return {
          ...team,
          members: [...team.members, { ...selectedMember, teamId: newTeamId }],
        };
      }
      return team;
    });

    setTeams(updatedTeams);
    setSelectedTeam(updatedTeams.find(t => t.teamId === newTeamId) || null);
    setIsChangeTeamModalOpen(false);
    setNewTeamId("");
  };

  // 메인 컨텐츠 컴포넌트
  const MainContent = () => {
    switch (selectedView) {
      case "teams":
        return (
          <TeamsDetail
            fetchTests={fetchTests}
            setSelectedView={setSelectedView}
            teams={teams}
            setIsCreateTeamModalOpen={setIsCreateTeamModalOpen}
            setSelectedTeam={setSelectedTeam}
            selectedView={selectedView}
            selectedTeam={selectedTeam}
            selectedMember={selectedMember}
            setSelectedMember={setSelectedMember}
          />
        );
      case "team":
        return (
          <TeamDetail
            fetchTests={fetchTests}
            selectedTeam={selectedTeam}
            setIsCreateMemberModalOpen={setIsCreateMemberModalOpen}
            setIsSendTestModalOpen={setIsSendTestModalOpen}
            setSelectedMember={setSelectedMember}
            setSelectedView={setSelectedView}
            selectedView={selectedView}
            setSelectedTeam={setSelectedTeam}
            selectedMember={selectedMember}
          />
        );

      case "member":
        return (
          <MemberDetail
            selectedMember={selectedMember as Members}
            selectedTeam={selectedTeam}
            setIsChangeTeamModalOpen={setIsChangeTeamModalOpen}
            selectedView={selectedView}
            setSelectedView={setSelectedView}
            setSelectedTeam={setSelectedTeam}
            setSelectedMember={setSelectedMember}
            fetchTests={fetchTests}
          />
        );
    }
  };

  return (
    <>
      <MainContent />

      {isSendTestModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <form
            className="bg-white rounded-lg p-6 w-96"
            onSubmit={e => e.preventDefault()}
          >
            <h2 className="text-xl font-semibold mb-4">테스트 전송</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                테스트 유형
              </label>
              <CustomDropdown
                options={[
                  { id: "sugar", name: "슈가 테스트" },
                  // { id: "sauce", name: "소스 테스트" },
                ]}
                selectedOption={selectedTestType}
                onSelect={option =>
                  setSelectedTestType(option as "sugar" | "sauce")
                }
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                마감기한
              </label>
              <div className="flex items-center space-x-3">
                <div className="flex-1">
                  <input
                    type="date"
                    value={selectedDeadline.split("T")[0]}
                    onChange={e =>
                      setSelectedDeadline(
                        e.target.value + "T" + selectedDeadline.split("T")[1]
                      )
                    }
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-3 py-2 text-sm border rounded-lg bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="time"
                    value={selectedDeadline.split("T")[1]}
                    onChange={e =>
                      setSelectedDeadline(
                        selectedDeadline.split("T")[0] + "T" + e.target.value
                      )
                    }
                    className="w-full px-3 py-2 text-sm border rounded-lg bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => {
                  setIsSendTestModalOpen(false);
                  const defaultDate = new Date();
                  defaultDate.setDate(defaultDate.getDate() + 7);
                  setSelectedDeadline(defaultDate.toISOString().slice(0, 16));
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                취소
              </button>
              <button
                type="submit"
                onClick={handleSendTest}
                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
              >
                전송
              </button>
            </div>
          </form>
        </div>
      )}

      {isCreateTeamModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center modal-backdrop">
          <form
            className="bg-white rounded-lg p-6 w-96 modal-content"
            onSubmit={e => e.preventDefault()}
          >
            <h2 className="text-xl font-semibold mb-4">팀 생성</h2>
            <input
              type="text"
              value={newTeamName}
              onChange={e => setNewTeamName(e.target.value)}
              placeholder="팀 이름"
              className="w-full p-2 border rounded-md mb-4"
            />

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => {
                  setIsCreateTeamModalOpen(false);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                취소
              </button>
              <button
                type="submit"
                onClick={handleCreateTeam}
                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
              >
                생성
              </button>
            </div>
          </form>
        </div>
      )}

      {isCreateMemberModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center modal-backdrop">
          <form
            className="bg-white rounded-lg p-6 w-96 modal-content"
            onSubmit={e => e.preventDefault()}
          >
            <h2 className="text-xl font-semibold mb-4">팀원 생성</h2>
            <input
              type="text"
              value={newMember.name}
              onChange={e =>
                setNewMember({ ...newMember, name: e.target.value })
              }
              placeholder="이름"
              className="w-full p-2 border rounded-md mb-4"
            />
            <input
              type="email"
              value={newMember.email}
              onChange={e =>
                setNewMember({ ...newMember, email: e.target.value })
              }
              placeholder="이메일"
              className="w-full p-2 border rounded-md mb-4"
            />

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => {
                  setIsCreateMemberModalOpen(false);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                취소
              </button>
              <button
                type="submit"
                onClick={handleCreateMember}
                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
              >
                생성
              </button>
            </div>
          </form>
        </div>
      )}

      {isChangeTeamModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 space-y-6">
            <header className="space-y-1">
              <h2 className="text-xl font-semibold text-gray-900">팀 변경</h2>
              <p className="text-sm text-gray-500">
                {selectedMember?.name}님을 다른 팀으로 이동합니다
              </p>
            </header>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  현재 팀
                </label>
                <div className="p-2 bg-gray-50 rounded-md text-gray-900">
                  {selectedTeam?.name}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  새로운 팀
                </label>
                <CustomDropdown
                  options={[
                    { id: "", name: "팀을 선택하세요" },
                    ...teams
                      .filter(team => team.teamId !== selectedTeam?.teamId)
                      .map(team => ({
                        id: team.teamId,
                        name: `${team.name} (${team.members.length}명)`,
                      })),
                  ]}
                  selectedOption={newTeamId}
                  onSelect={setNewTeamId}
                />
              </div>
            </div>

            <footer className="flex justify-end space-x-3 pt-4 border-t">
              <button
                onClick={() => {
                  setIsChangeTeamModalOpen(false);
                  setNewTeamId("");
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800"
              >
                취소
              </button>
              <button
                onClick={handleTeamChange}
                disabled={!newTeamId}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  newTeamId
                    ? "bg-orange-600 text-white hover:bg-orange-700"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                변경하기
              </button>
            </footer>
          </div>
        </div>
      )}
    </>
  );
};

export default TeamManagement;
