"use client";
import { User } from "@/types/user";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import Link from "next/link";
import {
  MdPeople,
  MdEmail,
  MdCalendarToday,
  MdDescription,
} from "react-icons/md";
import useWelcomeScreenStore from "../stores/useWelcomeScreenStore";
import WelcomeScreen from "./WelcomeScreen";

interface TeamDetailProps {
  user: User;
  teamId: string;
}

const TeamDetail = ({ user, teamId }: TeamDetailProps) => {
  const { userBase, userTeam } = user;
  const team = userTeam.find(team => team.id === teamId);
  const { isWelcomeScreen } = useWelcomeScreenStore();

  if (!team) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">팀 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }

  const calculateTeamAverage = () => {
    const totalMembers = team.members.length;
    if (totalMembers === 0) return 0;

    const totalScore = team.members.reduce((sum, member) => {
      if (member.sugarResult?.metadata?.averageScore) {
        return sum + member.sugarResult.metadata.averageScore;
      }
      return sum;
    }, 0);

    return Math.round((totalScore / totalMembers) * 10) / 10;
  };

  const teamAverage = calculateTeamAverage();

  return isWelcomeScreen ? (
    <WelcomeScreen user={user} />
  ) : (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-full overflow-hidden">
      <div className="p-4 sm:p-6 h-full flex flex-col">
        {/* 팀 기본 정보 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{team.name}</h1>
          <div className="flex items-center gap-2 text-gray-500 mb-4">
            <MdDescription className="w-5 h-5" />
            <p className="text-sm">{team.description}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <MdPeople className="w-5 h-5" />
              <span className="text-sm">팀원 {team.members.length}명</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <MdCalendarToday className="w-5 h-5" />
              <span className="text-sm">
                {format(new Date(team.createdAt), "yyyy년 MM월 dd일 생성", {
                  locale: ko,
                })}
              </span>
            </div>
          </div>
        </div>

        {/* 팀 종합 컨디션 */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            팀 종합 컨디션
          </h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                <span className="text-xl font-bold text-orange-600">
                  {teamAverage}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500">평균 점수</p>
                <p className="text-sm font-medium text-gray-700">
                  {teamAverage >= 80
                    ? "훌륭한 팀워크"
                    : teamAverage >= 60
                    ? "안정적인 팀워크"
                    : "개선이 필요한 팀워크"}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">마지막 업데이트</p>
              <p className="text-sm font-medium text-gray-700">
                {format(new Date(team.updatedAt), "yyyy년 MM월 dd일", {
                  locale: ko,
                })}
              </p>
            </div>
          </div>
        </div>

        {/* 팀원 목록 */}
        <div className="flex-1 overflow-auto">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            팀원 목록
          </h2>
          <div className="space-y-4">
            {team.members.map(member => (
              <Link
                key={member.id}
                href={`/devtest/${userBase.dashboardId}/team/${teamId}/members/${member.name}`}
                className="block bg-white border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <span className="text-lg font-medium text-gray-600">
                        {member.name[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{member.name}</p>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <MdEmail className="w-4 h-4" />
                        {member.email}
                      </p>
                    </div>
                  </div>
                  {member.sugarResult?.metadata?.averageScore && (
                    <div className="text-right">
                      <p className="text-sm text-gray-500">개인 점수</p>
                      <p className="text-lg font-bold text-orange-600">
                        {member.sugarResult.metadata.averageScore}
                      </p>
                    </div>
                  )}
                </div>
                {member.sugarResult?.categories && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {Object.entries<number[]>(
                      member.sugarResult.categories
                    ).map(([category, scores]) => (
                      <div
                        key={category}
                        className="bg-gray-50 rounded-lg p-2 text-center"
                      >
                        <p className="text-xs text-gray-500">{category}</p>
                        <p className="text-sm font-medium text-gray-800">
                          {Math.round(
                            scores.reduce((a: number, b: number) => a + b, 0) /
                              scores.length
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamDetail;
