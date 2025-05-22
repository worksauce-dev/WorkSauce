"use client";

import { MdAdd } from "react-icons/md";
import Breadcrumb from "./Breadcrumb";
import { UserTeam, Members, TestInfo } from "@/types/user";
import TeamCard from "./TeamCard";
import NoTeams from "./NoTeams";
interface TeamsDetailProps {
  teams: UserTeam[];
  setIsCreateTeamModalOpen: (open: boolean) => void;
  setSelectedTeam: (team: UserTeam | null) => void;
  setSelectedView: (view: "teams" | "team" | "member") => void;
  selectedView: "teams" | "team" | "member";
  selectedTeam: UserTeam | null;
  selectedMember: Members | null;
  setSelectedMember: (member: Members | null) => void;
  fetchTests: TestInfo[];
}

const TeamsDetail = ({
  teams,
  setIsCreateTeamModalOpen,
  setSelectedTeam,
  setSelectedView,
  selectedView,
  selectedTeam,
  selectedMember,
  setSelectedMember,
  fetchTests,
}: TeamsDetailProps) => {
  const handleSelectTeam = (team: UserTeam) => {
    setSelectedTeam(team);
    setSelectedView("team");
  };

  const handleAddMember = (team: UserTeam) => {
    setSelectedTeam(team);
    setSelectedView("team");
  };

  return (
    <div>
      <header className="flex justify-between items-center">
        <Breadcrumb
          selectedView={selectedView}
          setSelectedView={setSelectedView}
          selectedTeam={selectedTeam}
          setSelectedTeam={setSelectedTeam}
          selectedMember={selectedMember}
          setSelectedMember={setSelectedMember}
        />
        <button
          onClick={() => setIsCreateTeamModalOpen(true)}
          className="flex items-center px-3 py-1.5 bg-orange-600 text-white rounded-md hover:bg-orange-700 text-sm"
        >
          <MdAdd className="mr-1 text-base" />팀 생성
        </button>
      </header>
      {teams.length === 0 ? (
        <NoTeams />
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {teams.map(team => (
            <div
              key={team.teamId}
              className="bg-white rounded-lg shadow-sm border hover:border-orange-300 transition-colors h-[600px] flex flex-col"
              onClick={() => handleSelectTeam(team)}
            >
              <TeamCard
                team={team}
                onAddMember={handleAddMember}
                fetchTests={fetchTests}
              />
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default TeamsDetail;
