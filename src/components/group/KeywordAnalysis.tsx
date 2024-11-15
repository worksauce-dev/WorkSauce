import { Group } from "@/types/group";
import { useMemo } from "react";

interface Stats {
  completedTests: number;
}

interface KeywordAnalysisProps {
  group: Group;
  stats: Stats;
  onKeywordSelect: (keyword: string) => void;
  selectedKeyword: string | null;
}

export default function KeywordAnalysis({
  group,
  stats,
  onKeywordSelect,
  selectedKeyword,
}: KeywordAnalysisProps) {
  const keywordMatchAnalysis = useMemo(() => {
    return group.keywords
      .map(keyword => {
        const matchedApplicants = group.applicants.filter(applicant => {
          if (applicant.testStatus !== "completed" || !applicant.testResult) {
            return false;
          }
          const sortedResults = applicant.testResult.sort(
            (a, b) => b.score - a.score
          );

          const topTwoResults = sortedResults.slice(0, 2);
          return topTwoResults.some(
            result => result.sort.trim() === keyword.trim()
          );
        });

        const mainMatches = group.applicants.filter(applicant => {
          if (applicant.testStatus !== "completed" || !applicant.testResult) {
            return false;
          }
          const highestResult = applicant.testResult.sort(
            (a, b) => b.score - a.score
          )[0];
          return highestResult.sort.trim() === keyword.trim();
        });

        const subMatches = matchedApplicants.filter(
          applicant => !mainMatches.includes(applicant)
        );

        return {
          keyword,
          count: matchedApplicants.length,
          applicants: matchedApplicants,
          mainCount: mainMatches.length,
          subCount: subMatches.length,
          mainPercentage:
            stats.completedTests > 0
              ? Math.round((mainMatches.length / stats.completedTests) * 100)
              : 0,
          subPercentage:
            stats.completedTests > 0
              ? Math.round((subMatches.length / stats.completedTests) * 100)
              : 0,
        };
      })
      .sort((a, b) => b.count - a.count);
  }, [group.keywords, group.applicants, stats.completedTests]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 h-full">
      <h2 className="text-lg font-semibold text-gray-900 mb-3">
        키워드 매칭 분석
      </h2>
      <div className="flex flex-col gap-3 max-w-xl">
        {keywordMatchAnalysis.map(analysis => (
          <button
            onClick={() => onKeywordSelect(analysis.keyword)}
            key={analysis.keyword}
            className={`w-full border border-orange-100 rounded-lg p-4 hover:bg-orange-50 transition-colors ${
              selectedKeyword === analysis.keyword ? "bg-orange-50" : "bg-white"
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-gray-900">
                {analysis.keyword}
              </span>
              <span className="text-sm text-gray-500">
                {analysis.mainPercentage + analysis.subPercentage}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-orange-500 h-2 float-left"
                style={{ width: `${analysis.mainPercentage}%` }}
              />
              <div
                className="bg-orange-300 h-2 float-left"
                style={{ width: `${analysis.subPercentage}%` }}
              />
            </div>
            <div className="mt-2 text-sm">
              <span className="text-orange-500">
                메인: {analysis.mainCount}명
              </span>
              <span className="mx-2 text-gray-300">|</span>
              <span className="text-orange-400">
                서브: {analysis.subCount}명
              </span>
            </div>
            {/* <div className="mt-2">
              {analysis.applicants.slice(0, 3).map((applicant, idx) => (
                <span
                  key={idx}
                  className="inline-block bg-indigo-100 text-indigo-700 rounded-full px-2 py-1 text-xs mr-2 mb-1"
                >
                  {applicant.name}
                </span>
              ))}
              {analysis.applicants.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{analysis.applicants.length - 3}명
                </span>
              )}
            </div> */}
          </button>
        ))}
      </div>
    </div>
  );
}
