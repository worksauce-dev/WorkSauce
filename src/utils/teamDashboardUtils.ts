import { UserTeam, TestInfo, Members, TestStatus } from "@/types/user";
import { SugarTestResult } from "@/types/sugartest/sugarTestResult";
import { isSugarTestResult } from "@/utils/typeGuards";
import { formatDateToKorean } from "./dateUtils";
import { CATEGORY_KR_TRANSLATIONS } from "@/constants/sugartest";
import { ANALYSIS_DATA } from "@/constants/sugartest";

interface ProcessedTeamData {
  totalTests: number;
  averageScore: number;
  topCategory: string;
  improvementAreas: string[];
  memberCount: number;
  categoryAverages: Record<string, number>;
}

interface ProcessedTeamDetailData {
  teamAverage: number;
  teamStatus: string;
  memberDetails: Array<{
    id: string;
    name: string;
    email: string;
    averageScore: number;
    categoryScores: Record<string, number>;
  }>;
}

interface CalendarEvent {
  id: string;
  name: string;
  type: "start" | "end";
  date: string;
  teamId: string;
  teamName: string;
}

interface SugarTestHistoryData {
  date: string;
  categories: Record<string, number>;
  averageScore: number;
  status: TestStatus;
}

interface ProcessedSugarTestData {
  latestResult: {
    categories: Array<{
      name: string;
      score: number;
    }>;
    averageScore: number;
    status: TestStatus;
  };
  history: Array<{
    date: string;
    categories: Array<{
      name: string;
      score: number;
    }>;
    averageScore: number;
    status: TestStatus;
  }>;
  teamStatus: TestStatus;
}

const calculateCategoryScore = (scores: number[]): number => {
  if (scores.length === 0) return 0;
  const sum = scores.reduce((acc, curr) => acc + curr, 0);
  return Math.round((sum / scores.length) * 10) / 10;
};

const calculateAverageCategoryScore = (
  categories: SugarTestResult["categories"]
): number => {
  // categories: { strain: number[], ... }
  // We want to average the average of each category
  const categoryAverages = Object.values(categories).map(arr =>
    arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0
  );
  if (categoryAverages.length === 0) return 0;
  const sum = categoryAverages.reduce((acc, curr) => acc + curr, 0);
  return Math.round((sum / categoryAverages.length) * 10) / 10;
};

export const processTeamDashboardData = (
  teams: UserTeam[],
  tests: TestInfo[]
): ProcessedTeamData => {
  let totalTests = 0;
  let totalScore = 0;
  let memberCount = 0;
  const categoryScores: Record<string, number> = {};
  const categoryCounts: Record<string, number> = {};

  // 모든 팀의 멤버 정보를 분석
  teams.forEach(team => {
    team.members.forEach(member => {
      memberCount++;

      // 해당 멤버의 최신 테스트 결과 찾기
      const memberTests = tests
        .filter(test => test.applicants.some(app => app.id === member.id))
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

      if (memberTests.length > 0) {
        const latestTest = memberTests[0];
        const applicant = latestTest.applicants.find(
          app => app.id === member.id
        );

        if (applicant && applicant.testResult) {
          totalTests++;

          // 카테고리별 점수 계산
          const categoryScore = calculateCategoryScore(
            Object.values(applicant.testResult.categories).flat()
          );
          const averageScore = categoryScore;

          totalScore += averageScore;

          // 카테고리별 점수 누적
          Object.entries(applicant.testResult.categories).forEach(
            ([category, score]) => {
              categoryScores[category] =
                ((categoryScores[category] as any) || 0) + score;
              categoryCounts[category] = (categoryCounts[category] || 0) + 1;
            }
          );
        }
      }
    });
  });

  // 평균 점수 계산
  const averageScore =
    totalTests > 0 ? parseFloat((totalScore / totalTests).toFixed(1)) : 0;

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
    averageScore,
    topCategory,
    improvementAreas,
    memberCount,
    categoryAverages,
  };
};

export const processTeamDetailData = (
  team: UserTeam,
  tests: TestInfo[]
): ProcessedTeamDetailData => {
  const memberDetails = team.members.map(member => {
    // 해당 멤버의 최신 테스트 결과 찾기
    const memberTests = tests
      .filter(test => test.applicants.some(app => app.id === member.id))
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    let averageScore = 0;
    let categoryScores: Record<string, number> = {};

    if (memberTests.length > 0) {
      const latestTest = memberTests[0];
      const applicant = latestTest.applicants.find(app => app.id === member.id);

      if (
        applicant &&
        applicant.testResult &&
        isSugarTestResult(applicant.testResult)
      ) {
        categoryScores = applicant.testResult.categories as any;
        averageScore = calculateCategoryScore(Object.values(categoryScores));
      }
    }

    return {
      id: member.id,
      name: member.name,
      email: member.email,
      averageScore: parseFloat(averageScore.toFixed(1)),
      categoryScores,
    };
  });

  // 팀 평균 점수 계산
  const teamAverage =
    memberDetails.length > 0
      ? parseFloat(
          (
            memberDetails.reduce(
              (sum, member) => sum + member.averageScore,
              0
            ) / memberDetails.length
          ).toFixed(1)
        )
      : 0;

  // 팀 상태 결정
  const teamStatus =
    teamAverage >= 80
      ? "훌륭한 팀워크"
      : teamAverage >= 60
      ? "안정적인 팀워크"
      : "개선이 필요한 팀워크";

  return {
    teamAverage,
    teamStatus,
    memberDetails,
  };
};

export const processCalendarData = (
  tests: TestInfo[],
  teams: UserTeam[]
): Map<string, { starts: CalendarEvent[]; ends: CalendarEvent[] }> => {
  const eventsByDate = new Map<
    string,
    { starts: CalendarEvent[]; ends: CalendarEvent[] }
  >();

  // 팀 ID를 키로 하는 팀 이름 맵 생성
  const teamNameMap = new Map<string, string>();
  teams.forEach(team => {
    teamNameMap.set(team.teamId, team.name);
  });

  tests.forEach(test => {
    // 시작일 이벤트 추가
    const startDate = new Date(test.createdAt)
      .toLocaleString("sv", { timeZone: "Asia/Seoul" })
      .split(" ")[0];

    if (!eventsByDate.has(startDate)) {
      eventsByDate.set(startDate, { starts: [], ends: [] });
    }

    const teamName = teamNameMap.get(test.teamId) || "알 수 없는 팀";
    eventsByDate.get(startDate)!.starts.push({
      id: test.testId,
      name: `${teamName} ${test.type === "sugar" ? "슈가" : "소스"} 테스트`,
      type: "start",
      date: startDate,
      teamId: test.teamId,
      teamName: teamName,
    });

    // 마감일 이벤트 추가
    const endDate = new Date(test.deadline)
      .toLocaleString("sv", { timeZone: "Asia/Seoul" })
      .split(" ")[0];

    if (!eventsByDate.has(endDate)) {
      eventsByDate.set(endDate, { starts: [], ends: [] });
    }

    eventsByDate.get(endDate)!.ends.push({
      id: test.testId,
      name: `${teamName} ${test.type === "sugar" ? "슈가" : "소스"} 테스트`,
      type: "end",
      date: endDate,
      teamId: test.teamId,
      teamName: teamName,
    });
  });

  return eventsByDate;
};

const defaultCategories: SugarTestResult["categories"] = {
  strain: [],
  uncertainty: [],
  grievance: [],
  autonomy: [],
  recognition: [],
};

export const processSugarTestData = (
  team: UserTeam,
  tests: TestInfo[]
): ProcessedSugarTestData => {
  const sugarTests = tests
    .filter(test => test.teamId === team.teamId && test.type === "sugar")
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  const history: ProcessedSugarTestData["history"] = sugarTests.map(test => {
    const applicantsWithResults = test.applicants.filter(
      applicant =>
        applicant.testResult && isSugarTestResult(applicant.testResult)
    );

    const testResult = applicantsWithResults[0]?.testResult;
    const categories = isSugarTestResult(testResult)
      ? Object.entries(testResult.categories).map(([name, scores]) => ({
          name,
          score: calculateCategoryScore(scores),
        }))
      : Object.entries(defaultCategories).map(([name, scores]) => ({
          name,
          score: calculateCategoryScore(scores),
        }));

    const averageScore = isSugarTestResult(testResult)
      ? calculateAverageCategoryScore(testResult.categories)
      : calculateAverageCategoryScore(defaultCategories);

    return {
      date: test.createdAt,
      categories,
      averageScore,
      status: test.status,
    };
  });

  const latestTest = sugarTests[0];
  const latestResult = latestTest
    ? {
        categories: (() => {
          const testResult = latestTest.applicants[0]?.testResult;
          return isSugarTestResult(testResult)
            ? Object.entries(testResult.categories).map(([name, scores]) => ({
                name,
                score: calculateCategoryScore(scores),
              }))
            : Object.entries(defaultCategories).map(([name, scores]) => ({
                name,
                score: calculateCategoryScore(scores),
              }));
        })(),
        averageScore: (() => {
          const testResult = latestTest.applicants[0]?.testResult;
          return isSugarTestResult(testResult)
            ? calculateAverageCategoryScore(testResult.categories)
            : calculateAverageCategoryScore(defaultCategories);
        })(),
        status: latestTest.status,
      }
    : {
        categories: [],
        averageScore: 0,
        status: "pending" as TestStatus,
      };

  const completedTests = sugarTests.filter(test => test.status === "completed");
  const teamStatus =
    completedTests.length > 0 ? completedTests[0].status : "pending";

  return {
    latestResult,
    history,
    teamStatus,
  };
};

export function getTeamTestStatus(team: UserTeam, tests: TestInfo[]) {
  // 팀의 테스트 진행상황을 가지고 오는 함수
  const allTestResults = tests.filter(test => test.teamId === team.teamId);

  const lastTenTestResults = allTestResults.slice(-10);

  return lastTenTestResults.map(test => {
    const now = new Date();
    const deadline = new Date(test.deadline);
    const startDate = new Date(test.createdAt);

    // 남은 일수 계산
    const remainingDays = Math.ceil(
      (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    // 참여율 계산
    const totalApplicants = test.applicants.length;
    const completedApplicants = test.applicants.filter(
      applicant => applicant.testStatus === "completed"
    ).length;
    const participationRate =
      totalApplicants > 0
        ? Math.round((completedApplicants / totalApplicants) * 100)
        : 0;

    return {
      testId: test.testId,
      type: test.type,
      status: test.status,
      remainingDays:
        test.status === "completed" ? 0 : Math.max(0, remainingDays),
      startDate: startDate.toISOString(),
      deadline: deadline.toISOString(),
      participationRate,
      totalApplicants,
      completedApplicants,
      createdBy: test.createdBy,
    };
  });
}

export interface TeamTestCardInfo {
  testId: string;
  type: "sugar" | "sauce";
  status: string;
  remainingDays: number;
  startDate: string;
  deadline: string;
  participationRate: number;
  totalApplicants: number;
  completedApplicants: number;
}

export function getTeamTestCardInfos(
  team: UserTeam,
  tests: TestInfo[]
): TeamTestCardInfo[] {
  return tests
    .filter(test => test.teamId === team.teamId)
    .slice(-10)
    .map(test => {
      const now = new Date();
      const deadline = new Date(test.deadline);
      const startDate = new Date(test.createdAt);
      const remainingDays =
        test.status === "completed"
          ? 0
          : Math.max(
              0,
              Math.ceil(
                (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
              )
            );
      const totalApplicants = test.applicants.length;
      const completedApplicants = test.applicants.filter(
        a => a.testStatus === "completed"
      ).length;
      const participationRate =
        totalApplicants > 0
          ? Math.round((completedApplicants / totalApplicants) * 100)
          : 0;
      return {
        testId: test.testId,
        type: test.type,
        status: test.status,
        remainingDays,
        startDate: formatDateToKorean(startDate.toISOString()),
        deadline: formatDateToKorean(deadline.toISOString()),
        participationRate,
        totalApplicants,
        completedApplicants,
      };
    });
}

export interface TeamTestResultSummary {
  categories: Array<{ name: string; score: number }>;
  averageScore: number;
  status: string;
}

export function getTeamLatestTestResult(
  team: UserTeam,
  tests: TestInfo[],
  type: "sugar" | "sauce"
): TeamTestResultSummary | null {
  // 1. 팀의 해당 타입 테스트만 필터
  const filtered = tests
    .filter(test => test.teamId === team.teamId && test.type === type)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  if (filtered.length === 0) return null;

  const latest = filtered[0];
  // 가장 최근 테스트의 모든 지원자 중 완료된 사람만
  const completedApplicants = latest.applicants.filter(
    a => a.testStatus === "completed" && a.testResult
  );

  if (completedApplicants.length === 0) return null;

  // 예시: 첫 번째 지원자의 결과 사용 (팀 평균 등으로 확장 가능)
  const result = completedApplicants[0].testResult;
  if (!result || !("categories" in result)) return null;

  // 카테고리별 평균 점수
  const categories = Object.entries(result.categories).map(([name, arr]) => ({
    name,
    score: Array.isArray(arr)
      ? Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 10) / 10
      : arr,
  }));

  // 전체 평균
  const averageScore =
    categories.length > 0
      ? Math.round(
          (categories.reduce((sum, c) => sum + c.score, 0) /
            categories.length) *
            10
        ) / 10
      : 0;

  return {
    categories,
    averageScore,
    status: latest.status,
  };
}

export interface TeamTestHistoryTrend {
  date: string;
  score: number;
}
export interface TeamTestHistoryTrendResult {
  trend: TeamTestHistoryTrend[];
  overallAverage: number;
  categoryAverages: Array<{ name: string; score: number }>;
}

export function getTeamTestHistoryTrend(
  team: UserTeam,
  tests: TestInfo[],
  type: "sugar" | "sauce"
): TeamTestHistoryTrendResult {
  const filtered = tests
    .filter(test => test.teamId === team.teamId && test.type === type)
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

  // 카테고리별 점수를 저장할 객체
  const categoryScores: { [key: string]: number[] } = {};

  const trend: TeamTestHistoryTrend[] = filtered.map(test => {
    // 모든 완료된 지원자의 평균 점수
    const completedApplicants = test.applicants.filter(
      a =>
        a.testStatus === "completed" &&
        a.testResult &&
        "categories" in a.testResult
    );
    if (completedApplicants.length === 0) {
      return { date: formatDateToKorean(test.createdAt), score: 0 };
    }

    // 각 카테고리별 점수 계산
    const categoryAverages: { [key: string]: number } = {};
    completedApplicants.forEach(applicant => {
      if (!applicant.testResult) return;
      Object.entries(applicant.testResult.categories).forEach(
        ([category, scores]) => {
          if (!categoryAverages[category]) {
            categoryAverages[category] = 0;
          }
          const categoryScore = Array.isArray(scores)
            ? scores.length > 0
              ? scores.reduce((sum, s) => sum + s, 0) / scores.length
              : 0
            : scores;
          categoryAverages[category] += categoryScore;
        }
      );
    });

    // 각 카테고리의 평균 계산 및 저장
    Object.entries(categoryAverages).forEach(([category, total]) => {
      const avg = total / completedApplicants.length;
      if (!categoryScores[category]) {
        categoryScores[category] = [];
      }
      categoryScores[category].push(avg);
    });

    // 모든 지원자의 평균 점수 구하기
    const applicantAverages = completedApplicants.map(applicant => {
      if (!applicant.testResult) return 0;
      const categories = Object.values(applicant.testResult.categories);
      const scores = Array.isArray(categories[0])
        ? (categories as number[][]).map(arr =>
            arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0
          )
        : (categories as any);
      return scores.length > 0
        ? Math.round(
            (scores.reduce((sum: any, s: any) => sum + s, 0) / scores.length) *
              10
          ) / 10
        : 0;
    });
    const testAverage =
      applicantAverages.length > 0
        ? Math.round(
            (applicantAverages.reduce((sum, s) => sum + s, 0) /
              applicantAverages.length) *
              10
          ) / 10
        : 0;
    return {
      date: formatDateToKorean(test.createdAt),
      score: testAverage,
    };
  });

  // 전체 평균
  const allScores = trend.map(t => t.score).filter(s => s > 0);
  const overallAverage =
    allScores.length > 0
      ? Math.round(
          (allScores.reduce((sum, s) => sum + s, 0) / allScores.length) * 10
        ) / 10
      : 0;

  // 카테고리별 전체 평균 계산
  const categoryAverages = Object.entries(categoryScores).map(
    ([category, scores]) => {
      const validScores = scores.filter(s => s > 0);
      const average =
        validScores.length > 0
          ? Math.round(
              (validScores.reduce((sum, s) => sum + s, 0) /
                validScores.length) *
                10
            ) / 10
          : 0;
      return {
        name:
          CATEGORY_KR_TRANSLATIONS[
            category as keyof typeof CATEGORY_KR_TRANSLATIONS
          ] || category,
        score: average,
      };
    }
  );

  return {
    trend,
    overallAverage,
    categoryAverages,
  };
}

export interface MemberLatestTestResult {
  categories: Array<{ name: string; score: number }>;
  averageScore: number;
  completedAt: string | null;
}

const CATEGORY_NAME_MAP: Record<string, string> = {
  strain: "업무강도",
  uncertainty: "불확실성",
  grievance: "대인관계",
  autonomy: "업무 자율성",
  recognition: "보상과 인정",
};

export function getMemberLatestTestResult(
  member: Members,
  tests: TestInfo[],
  type: "sugar" | "sauce"
): MemberLatestTestResult | null {
  // 1. 해당 타입의 테스트만 필터
  const testsOfType = tests
    .filter(test => test.type === type)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  // 2. 멤버가 참여한 최신 테스트 결과 찾기
  for (const test of testsOfType) {
    const applicant = test.applicants?.find(
      app =>
        app.id === member.id && app.testStatus === "completed" && app.testResult
    );
    if (applicant && applicant.testResult) {
      const result = applicant.testResult;
      const completedAt = applicant.completedAt || null;

      // 카테고리별 점수 계산
      const categories = Object.entries(result.categories).map(
        ([name, scores]) => {
          const arr = Array.isArray(scores) ? scores : [scores];
          const avg =
            arr.length > 0
              ? Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 10) /
                10
              : 0;
          return {
            name: CATEGORY_NAME_MAP[name] || name,
            score: avg,
          };
        }
      );

      // 전체 평균
      const averageScore =
        categories.length > 0
          ? Math.round(
              (categories.reduce((acc, { score }) => acc + score, 0) /
                categories.length) *
                10
            ) / 10
          : 0;

      return {
        categories,
        averageScore,
        completedAt: formatDateToKorean(completedAt),
      };
    }
  }
  return null;
}

export function getMemberLatestTestData(
  member: Members,
  tests: TestInfo[],
  type: "sugar" | "sauce",
  selectedTestId?: string
) {
  const matchedTests = tests.filter(test =>
    member.testIds.includes(test.testId)
  );

  const filteredTests = matchedTests.filter(test => test.type === type);

  // If selectedTestId is provided, use that test, otherwise use the latest one
  const targetTest = selectedTestId
    ? filteredTests.find(test => test.testId === selectedTestId)
    : filteredTests.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0];

  if (!targetTest) return null;

  const applicant = targetTest.applicants.find(
    app => app.id === member.id && app.testResult
  ) as any;

  if (!applicant) return null;

  const result = applicant.testResult as SugarTestResult;
  const completedAt = applicant.completedAt;

  // 카테고리별 점수
  const categories = Object.entries(result.categories).map(([name, scores]) => {
    const arr = Array.isArray(scores) ? scores : [scores];
    const avg =
      arr.length > 0
        ? Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 10) / 10
        : 0;
    return {
      name:
        CATEGORY_KR_TRANSLATIONS[
          name as keyof typeof CATEGORY_KR_TRANSLATIONS
        ] || name,
      score: avg,
      rawKey: name,
    };
  });

  // 전체 평균
  const averageScore =
    categories.length > 0
      ? Math.round(
          (categories.reduce((acc, { score }) => acc + score, 0) /
            categories.length) *
            10
        ) / 10
      : 0;

  // 현재 상태 설명
  let currentStatusDescription = "";
  if (typeof ANALYSIS_DATA !== "undefined") {
    const level =
      averageScore >= 4.1
        ? "CRITICAL"
        : averageScore >= 3.1
        ? "HIGH"
        : averageScore >= 2.1
        ? "MODERATE"
        : "LOW";
    currentStatusDescription = ANALYSIS_DATA[level](
      member.name,
      averageScore.toString()
    ).currentStatus.description;
  }

  // Get all test history for dropdown
  const testHistory = filteredTests
    .map(test => ({
      id: test.testId,
      name: formatDateToKorean(test.createdAt),
      createdAt: test.createdAt,
    }))
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  return {
    categories,
    averageScore,
    completedAt: formatDateToKorean(completedAt),
    rawResult: result,
    currentStatusDescription,
    testHistory,
    selectedTestId: targetTest.testId,
  };
}

// 카테고리 한글 변환
export function translateCategoryKeyToKR(key: string) {
  return (
    CATEGORY_KR_TRANSLATIONS[key as keyof typeof CATEGORY_KR_TRANSLATIONS] ||
    key
  );
}
