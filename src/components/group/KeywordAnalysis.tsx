import { Group } from "@/types/group";

interface Stats {
  completedTests: number;
}

interface KeywordAnalysisProps {
  group: Group;
  stats: Stats;
}

export default function KeywordAnalysis({
  group,
  stats,
}: KeywordAnalysisProps) {
  const keywordMatchAnalysis = group.keywords
    .map(keyword => {
      const matchedApplicants = group.applicants.filter(applicant => {
        if (applicant.testStatus !== "completed" || !applicant.testResult) {
          return false;
        }
        const highestScoreResult = applicant.testResult.reduce(
          (prev, current) => (current.score > prev.score ? current : prev)
        );
        return highestScoreResult.sort.trim() === keyword.trim();
      });

      return {
        keyword,
        count: matchedApplicants.length,
        applicants: matchedApplicants,
        percentage:
          stats.completedTests > 0
            ? Math.round(
                (matchedApplicants.length / stats.completedTests) * 100
              )
            : 0,
      };
    })
    .sort((a, b) => b.count - a.count);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h2 className="text-lg font-semibold text-indigo-600 mb-3">
        키워드 매칭 분석
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {keywordMatchAnalysis.map(analysis => (
          <div
            key={analysis.keyword}
            className="border border-indigo-100 rounded-lg p-4 hover:bg-indigo-50 transition-colors"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-indigo-700">
                {analysis.keyword}
              </span>
              <span className="text-sm text-gray-500">
                {analysis.percentage}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full"
                style={{ width: `${analysis.percentage}%` }}
              />
            </div>
            <div className="mt-2 text-sm text-gray-600">
              매칭된 지원자: {analysis.count}명
            </div>
            <div className="mt-2">
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
