import { MdAssessment, MdTrendingUp, MdPeople } from "react-icons/md";
import TeamCards from "./TeamCards";
import { UserBase } from "@/types/user";

interface TeamDashboardProps {
  userBase: UserBase;
}

const TeamDashboard = ({ userBase }: TeamDashboardProps) => {
  const calculateTeamDiagnosticsSummary = () => {
    let totalTests = 0;
    let totalScore = 0;
    let memberCount = 0;
    const categoryScores: Record<string, number> = {};
    const categoryCounts: Record<string, number> = {};

    // 모든 팀의 멤버 정보를 분석
    userBase.forEach(team => {
      team.members.forEach(member => {
        memberCount++;

        // sugarResult 분석
        if (member.sugarResult) {
          totalTests++;

          // metadata.averageScore 사용
          const score = member.sugarResult.metadata.averageScore;
          totalScore += score;

          // categories 속성 사용
          if (member.sugarResult.categories) {
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
        }
      });
    });

    // 평균 점수 계산
    const averageScore =
      totalTests > 0 ? (totalScore / totalTests).toFixed(1) : "0";

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

    // 개선이 필요한 영역 찾기 (가장 낮은 점수 카테고리)
    const improvementAreas = Object.entries(categoryAverages)
      .sort(([, a], [, b]) => a - b)
      .slice(0, 2)
      .map(([category]) => category);

    return {
      totalTests,
      averageScore: parseFloat(averageScore),
      topCategory,
      improvementAreas,
      memberCount,
      categoryAverages,
    };
  };

  const teamDiagnosticsSummary = calculateTeamDiagnosticsSummary();

  return (
    <div className="container mx-auto p-6">
      {/* 좌우 분할 레이아웃 */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* 좌측: 진단 결과 요약 */}
        <div className="lg:w-1/2 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">전체 결과 요약</h2>

          {/* 주요 지표 카드들 */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <MdAssessment className="text-blue-600 mr-2" />
                <h3 className="font-medium">총 진단 수</h3>
              </div>
              <p className="text-2xl font-bold">
                {teamDiagnosticsSummary.totalTests}
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <MdTrendingUp className="text-green-600 mr-2" />
                <h3 className="font-medium">평균 점수</h3>
              </div>
              <p className="text-2xl font-bold">
                {teamDiagnosticsSummary.averageScore}
              </p>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <MdPeople className="text-purple-600 mr-2" />
                <h3 className="font-medium">총 멤버 수</h3>
              </div>
              <p className="text-2xl font-bold">
                {teamDiagnosticsSummary.memberCount}
              </p>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <MdTrendingUp className="text-yellow-600 mr-2" />
                <h3 className="font-medium">강점 영역</h3>
              </div>
              <p className="text-lg font-bold">
                {teamDiagnosticsSummary.topCategory}
              </p>
            </div>
          </div>

          {/* 개선 영역 */}
          <div className="mb-4">
            <h3 className="font-medium mb-2">개선이 필요한 영역</h3>
            <div className="flex flex-wrap gap-2">
              {teamDiagnosticsSummary.improvementAreas.map((area, index) => (
                <span
                  key={index}
                  className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>

          {/* 카테고리별 점수 분포 */}
          <div className="mb-4">
            <h3 className="font-medium mb-2">카테고리별 점수 분포</h3>
            <div className="space-y-2">
              {Object.entries(teamDiagnosticsSummary.categoryAverages).map(
                ([category, score], index) => (
                  <div key={index} className="flex items-center">
                    <span className="w-24 text-sm">{category}</span>
                    <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${(score / 100) * 100}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-sm font-medium">
                      {score.toFixed(1)}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>

          {/* 간단한 차트 영역 (실제로는 차트 라이브러리 사용) */}
          <div className="mt-6 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">팀 역량 추이 차트</p>
          </div>
        </div>

        {/* 우측: 팀 카드 목록 */}
        <div className="lg:w-1/2">
          {userTeam && userTeam.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {userTeam.map(team => (
                <TeamCards key={team.id} user={user} team={team} />
              ))}
            </div>
          ) : (
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <p className="text-gray-500">
                아직 등록된 팀이 없습니다. 팀을 생성하여 구성원들의 역량을 함께
                발전시켜보세요.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamDashboard;
