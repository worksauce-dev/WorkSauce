// src/components/dashboard/newDashboard/contents/TeamCards.tsx
import { UserTeam } from "@/types/user";
import {
  MdGroup,
  MdCalendarToday,
  MdPerson,
  MdTrendingUp,
  MdAssessment,
} from "react-icons/md";
import { useRouter } from "next/navigation";
import { formatDateToKorean } from "@/utils/dateUtils";
import { User } from "@/types/user";

interface TeamCardProps {
  user: User;
  team: UserTeam;
}

const TeamCards = ({ user, team }: TeamCardProps) => {
  const { userBase } = user;
  const router = useRouter();

  // 팀 상세 페이지로 이동하는 함수
  const handleTeamClick = () => {
    router.push(`/devtest/${userBase.dashboardId}/team/${team.id}`);
  };

  // 팀 멤버들의 평균 점수 계산
  const calculateTeamAverageScore = () => {
    if (!team.members || team.members.length === 0) return 0;

    let totalScore = 0;
    let scoreCount = 0;

    team.members.forEach(member => {
      // metadata.averageScore 사용
      if (member.sugarResult && member.sugarResult.metadata) {
        totalScore += member.sugarResult.metadata.averageScore;
        scoreCount++;
      }
    });

    return scoreCount > 0 ? (totalScore / scoreCount).toFixed(1) : 0;
  };

  // 팀의 강점 영역 찾기
  const findTeamStrength = () => {
    if (!team.members || team.members.length === 0) return "없음";

    const categoryScores: Record<string, number> = {};
    const categoryCounts: Record<string, number> = {};

    team.members.forEach(member => {
      // categories 속성 사용
      if (member.sugarResult && member.sugarResult.categories) {
        Object.entries(member.sugarResult.categories).forEach(
          ([category, scores]) => {
            // 각 카테고리의 평균 점수 계산
            const categoryAverage =
              scores.reduce((sum, val) => sum + val, 0) / scores.length;
            categoryScores[category] =
              (categoryScores[category] || 0) + categoryAverage;
            categoryCounts[category] = (categoryCounts[category] || 0) + 1;
          }
        );
      }
    });

    // 카테고리별 평균 점수 계산
    const categoryAverages: Record<string, number> = {};
    Object.keys(categoryScores).forEach(category => {
      categoryAverages[category] =
        categoryScores[category] / categoryCounts[category];
    });

    // 최고 점수 카테고리 찾기
    let topCategory = "없음";
    let topScore = 0;
    Object.entries(categoryAverages).forEach(([category, score]) => {
      if (score > topScore) {
        topScore = score;
        topCategory = category;
      }
    });

    return topCategory;
  };

  const teamAverageScore = calculateTeamAverageScore();
  const teamStrength = findTeamStrength();

  return (
    <div
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 p-3 cursor-pointer"
      onClick={handleTeamClick}
    >
      {/* 팀 헤더: 이름과 아이콘 */}
      <div className="flex items-center mb-2">
        <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full mr-2">
          <MdGroup className="text-blue-600 text-lg" />
        </div>
        <h3 className="text-base font-semibold text-gray-800 truncate">
          {team.name}
        </h3>
      </div>

      {/* 팀 설명 (한 줄로 제한) */}
      <p className="text-xs text-gray-600 mb-2 line-clamp-1">
        {team.description ||
          "팀의 특성과 강점을 기록하여 맞춤형 성장 전략을 수립하세요."}
      </p>

      {/* 팀 성과 지표 (한 줄로 표시) */}
      <div className="flex items-center gap-2 mb-2">
        <div className="flex items-center bg-blue-50 rounded px-2 py-1">
          <MdAssessment className="text-blue-600 text-xs mr-1" />
          <span className="text-xs font-medium">{teamAverageScore}</span>
        </div>

        <div className="flex items-center bg-green-50 rounded px-2 py-1">
          <MdTrendingUp className="text-green-600 text-xs mr-1" />
          <span className="text-xs font-medium">{teamStrength}</span>
        </div>
      </div>

      {/* 팀 정보 (한 줄로 표시) */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center">
          <MdCalendarToday className="mr-1" />
          <span>{formatDateToKorean(team.createdAt)}</span>
        </div>
        <div className="flex items-center">
          <MdPerson className="mr-1" />
          <span>{team.members.length}명</span>
        </div>
      </div>
    </div>
  );
};

export default TeamCards;
