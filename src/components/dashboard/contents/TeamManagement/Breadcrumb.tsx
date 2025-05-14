"use client";

import { UserTeam, Members } from "@/types/user";

interface BreadcrumbProps {
  selectedView: "teams" | "team" | "member";
  setSelectedView: (view: "teams" | "team" | "member") => void;
  selectedTeam: UserTeam | null;
  setSelectedTeam: (team: UserTeam | null) => void;
  selectedMember: Members | null;
  setSelectedMember: (member: Members | null) => void;
}
const Breadcrumb = ({
  selectedView,
  setSelectedView,
  selectedTeam,
  setSelectedTeam,
  selectedMember,
  setSelectedMember,
}: BreadcrumbProps) => {
  return (
    <nav className="flex mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <li>
          <button
            onClick={() => {
              setSelectedView("teams");
              setSelectedTeam(null);
              setSelectedMember(null);
            }}
            className={`text-sm font-medium ${
              selectedView === "teams"
                ? "text-orange-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            팀 관리
          </button>
        </li>
        {selectedTeam && (
          <>
            <li>
              <span className="text-gray-400">/</span>
            </li>
            <li>
              <button
                onClick={() => {
                  setSelectedView("team");
                  setSelectedMember(null);
                }}
                className={`text-sm font-medium ${
                  selectedView === "team"
                    ? "text-orange-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {selectedTeam.name}
              </button>
            </li>
          </>
        )}
        {selectedMember && (
          <>
            <li>
              <span className="text-gray-400">/</span>
            </li>
            <li>
              <span className="text-sm font-medium text-orange-600">
                {selectedMember.name}
              </span>
            </li>
          </>
        )}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
