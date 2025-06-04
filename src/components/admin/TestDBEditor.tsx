// 클라이언트 컴포넌트로 분리
"use client";
import { useState } from "react";
import { CategoryData, SauceTest } from "@/types/saucetest/test";
import { MdSave, MdSync } from "react-icons/md";

interface TestDBEditorProps {
  initialData: SauceTest;
  updateTestDB: (testDB: SauceTest) => Promise<void>;
}

function TestDBEditor({ initialData, updateTestDB }: TestDBEditorProps) {
  const [activeSort, setActiveSort] = useState<string>("기준윤리형");
  const [editedData, setEditedData] = useState<SauceTest>(initialData);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const handleUpdate = async () => {
    // 저장 전 확인
    if (!window.confirm("변경사항을 저장하시겠습니까?")) {
      return;
    }

    try {
      setIsSaving(true);
      const currentTime = new Date().toISOString();

      // 현재 카테고리의 데이터를 가져옴
      const currentCategory = editedData[activeSort] as CategoryData;

      // 업데이트할 데이터 구성
      const updatedData = {
        ...editedData,
        updatedAt: currentTime,
        [activeSort]: {
          ...currentCategory,
          updatedAt: currentTime,
          // questions 배열에 isDeleted 값이 포함된 상태로 업데이트
          questions: currentCategory.questions.map(q => ({
            text: q.text,
            score: q.score,
            isDeleted: q.isDeleted || false,
          })),
        },
      };

      await updateTestDB(updatedData);
      setEditedData(updatedData);
      alert("성공적으로 저장되었습니다.");
    } catch (error) {
      console.error("저장 중 오류 발생:", error);
      alert("저장 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSaving(false);
    }
  };

  // 정렬된 sort 키 목록 (updatedAt, createdAt 제외)
  const sortKeys = Object.keys(editedData).filter(
    key => key !== "updatedAt" && key !== "createdAt"
  );

  const handleQuestionChange = (
    sortKey: string,
    questionIndex: number,
    field: "text" | "score",
    value: string | number
  ) => {
    const newData = { ...editedData };
    const sortData = newData[sortKey] as CategoryData;
    sortData.questions[questionIndex] = {
      ...sortData.questions[questionIndex],
      [field]: value,
    };
    setEditedData(newData);
  };

  const handleStringArrayChange = (
    sortKey: string,
    field: keyof CategoryData,
    index: number,
    value: string
  ) => {
    const newData = { ...editedData };
    const sortData = newData[sortKey] as CategoryData;
    (sortData[field] as string[])[index] = value;
    setEditedData(newData);
  };

  // start 필드를 위한 새로운 핸들러
  const handleStartChange = (sortKey: string, value: string) => {
    const newData = { ...editedData };
    const sortData = newData[sortKey] as CategoryData;
    sortData.start = value;
    setEditedData(newData);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 max-w-7xl m-auto">
      {/* 탭 네비게이션과 저장 버튼을 포함하는 헤더 */}
      <div className="flex justify-between items-center mb-4 pb-1 border-b border-gray-200 gap-2">
        {/* 탭 네비게이션 */}
        <div className="flex flex-wrap gap-2">
          {sortKeys.map(sortKey => (
            <button
              key={sortKey}
              className={`px-4 py-2 rounded-t-lg transition-all duration-200 font-medium text-sm
                ${
                  activeSort === sortKey
                    ? "bg-blue-50 text-blue-600 border-b-2 border-blue-500"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              onClick={() => setActiveSort(sortKey)}
            >
              {sortKey}
            </button>
          ))}
        </div>

        {/* 저장 버튼을 아이콘으로 변경 */}
        <button
          onClick={handleUpdate}
          disabled={isSaving}
          className="p-2 text-blue-500 rounded-lg hover:text-blue-600 transition-colors duration-200 text-sm font-medium"
          title={isSaving ? "저장 중..." : "저장하기"}
        >
          {isSaving ? (
            <MdSync className="animate-spin" size={20} />
          ) : (
            <MdSave size={20} />
          )}
        </button>
      </div>

      {activeSort && (
        <div className="space-y-6">
          {/* 메인 컨텐츠를 가로로 분할 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 왼쪽: 단어 수정 섹션 */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="overflow-y-auto max-h-[600px] pr-2 space-y-4 scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300 scrollbar-track-transparent">
                {/* start 섹션 */}
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <h3 className="text-md font-semibold text-gray-800 mb-3 capitalize">
                    Start
                  </h3>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                    value={(editedData[activeSort] as CategoryData).start}
                    onChange={e =>
                      handleStartChange(activeSort, e.target.value)
                    }
                  />
                </div>

                {/* 기존 배열 필드들 */}
                {["advance", "utility", "communicate", "expert"].map(
                  arrayField => (
                    <div
                      key={arrayField}
                      className="bg-white rounded-xl p-4 shadow-sm"
                    >
                      <h3 className="text-md font-semibold text-gray-800 mb-3 capitalize">
                        {arrayField}
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {(
                          (editedData[activeSort] as CategoryData)[
                            arrayField as keyof CategoryData
                          ] as string[]
                        ).map((item, index) => (
                          <input
                            key={index}
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                            value={item}
                            onChange={e =>
                              handleStringArrayChange(
                                activeSort,
                                arrayField as keyof CategoryData,
                                index,
                                e.target.value
                              )
                            }
                          />
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* 오른쪽: Questions 섹션 */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-md font-semibold text-gray-800">
                  Questions
                </h3>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    활성 문항:{" "}
                    {
                      (editedData[activeSort] as CategoryData).questions.filter(
                        q => !q.isDeleted
                      ).length
                    }
                    개
                  </span>
                </div>
              </div>
              <div className="overflow-y-auto max-h-[600px] pr-2 space-y-3 scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300 scrollbar-track-transparent">
                {(editedData[activeSort] as CategoryData).questions.map(
                  (question, qIndex) => (
                    <div
                      key={qIndex}
                      className={`p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 ${
                        question.isDeleted ? "opacity-50 bg-gray-50" : ""
                      }`}
                    >
                      <div className="flex gap-3">
                        {/* 체크박스 추가 */}
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            checked={question.isDeleted || false}
                            onChange={e => {
                              const newData = { ...editedData };
                              const sortData = newData[
                                activeSort
                              ] as CategoryData;

                              // 현재 삭제되지 않은 문항 수 계산
                              const currentActiveQuestions =
                                sortData.questions.filter(
                                  q => !q.isDeleted
                                ).length;

                              // 체크하려는 경우 (삭제하려는 경우)
                              if (e.target.checked) {
                                // 삭제 후 남은 문항이 10개 미만이 되는 경우
                                if (currentActiveQuestions <= 10) {
                                  alert(
                                    "각 유형당 최소 10개의 문항이 필요합니다."
                                  );
                                  return;
                                }
                              }

                              // 삭제 가능한 경우에만 상태 업데이트
                              sortData.questions[qIndex] = {
                                ...sortData.questions[qIndex],
                                isDeleted: e.target.checked,
                              };
                              setEditedData(newData);
                            }}
                          />
                        </div>
                        <div className="flex-grow space-y-2">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Q{qIndex + 1}
                            </label>
                            <textarea
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                              value={question.text}
                              onChange={e =>
                                handleQuestionChange(
                                  activeSort,
                                  qIndex,
                                  "text",
                                  e.target.value
                                )
                              }
                              rows={2}
                            />
                          </div>
                        </div>
                        <div className="w-20">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Score
                          </label>
                          <input
                            type="number"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                            value={question.score}
                            onChange={e =>
                              handleQuestionChange(
                                activeSort,
                                qIndex,
                                "score",
                                parseInt(e.target.value)
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TestDBEditor;
