"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type TestResultItem = {
  score: number;
  sort: string;
};

type UserResult = {
  id: string;
  groupId: string;
  email: string;
  testResult: TestResultItem[];
  completedAt: string;
  name: string;
};

export default function AdminReports({ results }: { results: UserResult[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isLoading, setIsLoading] = useState(true);

  const calculateItemsPerPage = () => {
    const ROW_HEIGHT = 73;
    const tableContainer = document.querySelector(".overflow-y-auto");
    if (tableContainer) {
      const availableHeight = tableContainer.clientHeight;
      const possibleRows = Math.floor(availableHeight / ROW_HEIGHT);
      return Math.max(3, Math.min(20, possibleRows));
    }
    return 5;
  };

  useEffect(() => {
    const handleResize = () => {
      setIsLoading(true);
      const newItemsPerPage = calculateItemsPerPage();
      setItemsPerPage(newItemsPerPage);
      setCurrentPage(1);
      setTimeout(() => {
        setIsLoading(false);
      }, 100);
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filteredResults = results.filter(
    user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
  const paginatedResults = filteredResults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6 max-w-7xl mx-auto w-full ">
      <h1 className="text-3xl font-bold mb-8 text-[#F97316]">
        테스트 결과 리포트
      </h1>

      {/* 검색 및 결과 카운트 섹션 */}
      <div className="bg-white p-6 rounded-lg shadow mb-8 flex flex-col h-[calc(100vh-12rem)]">
        {/* 검색 섹션 - 상단에 고정 */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <input
            type="text"
            placeholder="이름 또는 이메일로 검색..."
            className="p-2 border rounded-lg w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-orange-200"
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <div className="text-sm text-gray-600">
            총 {filteredResults.length}개의 결과
          </div>
        </div>

        {/* 테이블 섹션 - 스크롤 가능한 영역 */}
        <div className="flex-1 overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F97316]" />
            </div>
          ) : (
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
                    완료일
                  </th>
                  <th className="p-3 text-left font-semibold text-gray-700">
                    메인 유형
                  </th>
                  <th className="p-3 text-left font-semibold text-gray-700">
                    서브 유형
                  </th>
                  <th className="p-3 text-center font-semibold text-gray-700">
                    상세보기
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedResults.map((user: UserResult) => {
                  const topResults = [...user.testResult]
                    .sort((a, b) => b.score - a.score)
                    .slice(0, 2);

                  return (
                    <tr
                      key={user.id}
                      className="border-b hover:bg-orange-50 transition-colors"
                    >
                      <td className="p-3">{user.name}</td>
                      <td className="p-3">{user.email}</td>
                      <td className="p-3">
                        {new Date(user.completedAt).toLocaleDateString("ko-KR")}
                      </td>
                      <td className="p-3">
                        <div className="font-medium text-[#F97316]">
                          {topResults[0]?.sort}
                        </div>
                        <div className="text-sm text-gray-600">
                          {((topResults[0]?.score / 4600) * 100).toFixed(1)}%
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="font-medium text-[#F97316]">
                          {topResults[1]?.sort}
                        </div>
                        <div className="text-sm text-gray-600">
                          {((topResults[1]?.score / 4600) * 100).toFixed(1)}%
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <Link
                          href={`/admin/reports/${user.id}`}
                          className="text-[#F97316] hover:text-orange-700 underline"
                        >
                          상세보기
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* 페이지네이션 - 하단에 고정 */}
        {!isLoading && (
          <div className="flex justify-center gap-2 mt-6 pt-4 border-t">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded-lg hover:bg-orange-50 disabled:opacity-50 transition-colors"
            >
              이전
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 border rounded-lg transition-colors
                  ${
                    currentPage === page
                      ? "bg-[#F97316] text-white hover:bg-orange-600"
                      : "hover:bg-orange-50"
                  }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage(prev => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded-lg hover:bg-orange-50 disabled:opacity-50 transition-colors"
            >
              다음
            </button>
          </div>
        )}
      </div>

      {!isLoading && filteredResults.length === 0 && (
        <div className="text-center py-8 text-gray-500 bg-white rounded-lg shadow">
          검색 결과가 없습니다.
        </div>
      )}
    </div>
  );
}
