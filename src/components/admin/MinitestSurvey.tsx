"use client";

import { SurveyData } from "@/types/surveyData";
import {
  MdBarChart,
  MdGroups,
  MdFileDownload,
  MdFilterList,
} from "react-icons/md";
import { useState, useMemo } from "react";
import * as XLSX from "xlsx";

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow flex items-center gap-4">
      <div className="text-gray-400">{icon}</div>
      <div>
        <div className="text-sm text-gray-600">{label}</div>
        <div className="text-2xl font-bold">{value}</div>
      </div>
    </div>
  );
}

export const MinitestSurvey = ({ survey }: { survey: SurveyData[] }) => {
  const [ageFilter, setAgeFilter] = useState("all");
  const [scoreFilter, setScoreFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // 필터링된 데이터
  const filteredSurvey = useMemo(() => {
    return survey.filter(item => {
      // 연령대 필터
      if (ageFilter !== "all" && item.ageRange !== ageFilter.replace("s", "대"))
        return false;
      // 자기반영성 점수 필터
      const q1 =
        typeof item.q1 === "number" ? item.q1 : parseInt(item.q1 || "0", 10);
      if (scoreFilter === "high" && !(q1 >= 4)) return false;
      if (scoreFilter === "medium" && q1 !== 3) return false;
      if (scoreFilter === "low" && q1 <= 2) return false;
      // 검색 필터
      if (
        searchTerm &&
        !(
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
        return false;
      return true;
    });
  }, [survey, ageFilter, scoreFilter, searchTerm]);

  // 간단한 통계 계산
  const totalResponses = filteredSurvey.length;
  const averageQ1 =
    filteredSurvey.length > 0
      ? Math.round(
          (filteredSurvey.reduce(
            (sum, item) => sum + parseInt(String(item.q1 || "0"), 10),
            0
          ) /
            totalResponses) *
            10
        ) / 10
      : 0;
  const averageQ2 =
    filteredSurvey.length > 0
      ? Math.round(
          (filteredSurvey.reduce(
            (sum, item) => sum + parseInt(String(item.q2 || "0"), 10),
            0
          ) /
            totalResponses) *
            10
        ) / 10
      : 0;
  const averageQ3 =
    filteredSurvey.length > 0
      ? Math.round(
          (filteredSurvey.reduce(
            (sum, item) => sum + parseInt(String(item.q3 || "0"), 10),
            0
          ) /
            totalResponses) *
            10
        ) / 10
      : 0;

  // 엑셀 내보내기
  const handleExportExcel = () => {
    const exportData = filteredSurvey.map(item => ({
      이름: item.name,
      이메일: item.email,
      연령대: item.ageRange,
      자기반영성: item.q1,
      조직활용: item.q2,
      팀워크기여: item.q3,
      의견: item.feedback,
      제출일: item.createdAt
        ? new Date(item.createdAt).toLocaleDateString("ko-KR")
        : "-",
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "설문조사");
    XLSX.writeFile(workbook, "minitest-survey.xlsx");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* 상단 타이틀/설명 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#F97316] mb-1">
          설문조사 응답 현황
        </h1>
        <p className="text-gray-500">
          워크소스 미니테스트 설문조사 응답을 한눈에 확인할 수 있습니다.
        </p>
      </div>

      {/* 요약 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<MdGroups size={24} className="text-gray-400" />}
          label="총 응답자"
          value={`${totalResponses}명`}
        />
        <StatCard
          icon={<MdBarChart size={24} className="text-gray-400" />}
          label="자기반영성 평균"
          value={`${averageQ1}/5`}
        />
        <StatCard
          icon={<MdBarChart size={24} className="text-gray-400" />}
          label="조직 활용 평균"
          value={`${averageQ2}/5`}
        />
        <StatCard
          icon={<MdBarChart size={24} className="text-gray-400" />}
          label="팀워크 기여 평균"
          value={`${averageQ3}/5`}
        />
      </div>

      {/* 필터 및 검색 */}
      <div className="bg-white p-6 rounded-lg shadow mb-8 flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <MdFilterList className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-700 font-semibold">필터</span>
        </div>
        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
          <select
            className="w-full p-2 border border-gray-200 rounded-md bg-white text-gray-700 text-sm"
            value={ageFilter}
            onChange={e => setAgeFilter(e.target.value)}
          >
            <option value="all">연령대: 전체</option>
            <option value="20s">20대</option>
            <option value="30s">30대</option>
            <option value="40s">40대</option>
            <option value="50s">50대 이상</option>
          </select>
          <select
            className="w-full p-2 border border-gray-200 rounded-md bg-white text-gray-700 text-sm"
            value={scoreFilter}
            onChange={e => setScoreFilter(e.target.value)}
          >
            <option value="all">자기반영성 점수: 전체</option>
            <option value="high">높음 (4-5)</option>
            <option value="medium">보통 (3)</option>
            <option value="low">낮음 (1-2)</option>
          </select>
          <input
            type="text"
            placeholder="이름 또는 이메일로 검색"
            className="w-full p-2 border border-gray-200 rounded-md text-gray-700 text-sm placeholder:text-gray-400"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          className="flex items-center gap-2 bg-[#F97316] text-white px-4 py-2 rounded-lg text-sm font-medium shadow-none hover:bg-orange-600 transition-colors"
          onClick={handleExportExcel}
          type="button"
        >
          <MdFileDownload className="h-4 w-4" />
          엑셀로 내보내기
        </button>
      </div>

      {/* 테이블 */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="sticky top-0 bg-orange-50 z-10">
              <tr>
                <th className="p-3 text-left font-semibold text-gray-700">
                  이름
                </th>
                <th className="p-3 text-left font-semibold text-gray-700">
                  이메일
                </th>
                <th className="p-3 text-left font-semibold text-gray-700">
                  연령대
                </th>
                <th className="p-3 text-center font-semibold text-gray-700">
                  자기반영성
                </th>
                <th className="p-3 text-center font-semibold text-gray-700">
                  조직 활용
                </th>
                <th className="p-3 text-center font-semibold text-gray-700">
                  팀워크 기여
                </th>
                <th className="p-3 text-left font-semibold text-gray-700">
                  의견
                </th>
                <th className="p-3 text-left font-semibold text-gray-700">
                  제출일
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredSurvey.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-gray-400">
                    응답 데이터가 없습니다.
                  </td>
                </tr>
              ) : (
                filteredSurvey.map((r, idx) => (
                  <tr
                    key={idx}
                    className="border-b hover:bg-orange-50 transition-colors"
                  >
                    <td className="p-3 text-sm font-medium text-gray-800 whitespace-nowrap">
                      {r.name}
                    </td>
                    <td className="p-3 text-sm text-gray-600 whitespace-nowrap">
                      {r.email}
                    </td>
                    <td className="p-3">
                      <span className="inline-block px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-700">
                        {r.ageRange}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-gray-100 text-gray-700">
                        {r.q1}/5
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-gray-100 text-gray-700">
                        {r.q2}/5
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-gray-100 text-gray-700">
                        {r.q3}/5
                      </span>
                    </td>
                    <td className="p-3 max-w-xs">
                      <div className="line-clamp-2 text-sm text-gray-700">
                        {r.feedback || "-"}
                      </div>
                    </td>
                    <td className="p-3 text-sm text-gray-600 whitespace-nowrap">
                      {r.createdAt
                        ? new Date(r.createdAt).toLocaleDateString("ko-KR")
                        : "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {filteredSurvey.length > 0 && (
          <div className="flex items-center justify-between pt-4 mt-2 border-t border-gray-100">
            <div className="text-sm text-gray-500 font-medium">
              총 {filteredSurvey.length}개의 응답
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 text-sm border border-gray-200 rounded-lg bg-white hover:bg-gray-100 text-gray-600 font-medium transition-colors">
                이전
              </button>
              <button className="px-3 py-1 text-sm border border-gray-200 rounded-lg bg-gray-100 text-gray-800 font-medium">
                1
              </button>
              <button className="px-3 py-1 text-sm border border-gray-200 rounded-lg bg-white hover:bg-gray-100 text-gray-600 font-medium transition-colors">
                다음
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
