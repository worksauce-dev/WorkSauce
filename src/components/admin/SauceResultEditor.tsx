"use client";
import { ResultFields, SauceResultType } from "@/types/test";
import { useState } from "react";
import { MdSave, MdSync } from "react-icons/md";

interface SauceResultEditorProps {
  initialData: SauceResultType;
  updateResult: (result: SauceResultType) => Promise<void>;
}

function SauceResultEditor({
  initialData,
  updateResult,
}: SauceResultEditorProps) {
  const mainTypes = Object.keys(initialData);
  const firstMainType = mainTypes[0] || "기준윤리형";
  const firstSubType =
    Object.keys(initialData[firstMainType] || {})[0] || "기준심미형";

  const [activeMainType, setActiveMainType] = useState<string>(firstMainType);
  const [activeSubType, setActiveSubType] = useState<string>(firstSubType);
  const [editedData, setEditedData] = useState<SauceResultType>(initialData);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const handleUpdate = async () => {
    if (!window.confirm("변경사항을 저장하시겠습니까?")) {
      return;
    }

    try {
      setIsSaving(true);
      const currentTime = new Date().toISOString();
      const mainTypeData = editedData[activeMainType];
      if (typeof mainTypeData === "string") return;

      const currentFields = mainTypeData[activeSubType] || {};
      const updatedData: SauceResultType = {
        ...editedData,
        updatedAt: currentTime,
        [activeMainType]: {
          ...mainTypeData,
          [activeSubType]: {
            ...currentFields,
            updatedAt: currentTime,
          } as ResultFields,
        },
      };

      await updateResult(updatedData);
      alert("성공적으로 저장되었습니다.");
    } catch (error) {
      console.error("저장 중 오류 발생:", error);
      alert("저장 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSaving(false);
    }
  };

  const getCurrentData = () => {
    const mainTypeData = editedData[activeMainType];
    if (!mainTypeData || typeof mainTypeData === "string") return null;

    const subTypeData = mainTypeData[activeSubType];
    if (!subTypeData) return null;

    return subTypeData;
  };

  const handleMainTypeChange = (newMainType: string) => {
    setActiveMainType(newMainType);
    const subTypes = Object.keys(editedData[newMainType] || {});
    setActiveSubType(subTypes[0] || firstSubType);
  };

  const currentData = getCurrentData();

  if (!currentData) {
    return <div>데이터를 불러오는 중...</div>;
  }

  function isArrayField(
    field: keyof ResultFields
  ): field is "keywords" | "interviewQuestions" {
    return field === "keywords" || field === "interviewQuestions";
  }

  const sortKeys = Object.keys(editedData).filter(
    key => key !== "updatedAt" && key !== "createdAt"
  );

  const handleFieldChange = (
    field: keyof ResultFields,
    value: string | string[],
    index?: number
  ) => {
    const newData = { ...editedData };
    const mainTypeData = newData[activeMainType];

    if (typeof mainTypeData === "string") return;

    if (isArrayField(field) && index !== undefined) {
      mainTypeData[activeSubType][field][index] = value as string;
    } else if (!isArrayField(field)) {
      mainTypeData[activeSubType][field] = value as string;
    }

    setEditedData(newData);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 max-w-7xl m-auto">
      {/* 탭 네비게이션과 저장 버튼을 포함하는 헤더 */}
      <div className="flex justify-between items-center mb-4 pb-1 border-b border-gray-200 gap-2">
        {/* 메인 타입 탭 */}
        <div className="flex flex-wrap gap-2">
          {sortKeys.map(type => (
            <button
              key={type}
              onClick={() => handleMainTypeChange(type)}
              className={`px-4 py-2 rounded-t-lg transition-all duration-200 font-medium text-sm
                ${
                  activeMainType === type
                    ? "bg-blue-50 text-blue-600 border-b-2 border-blue-500"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* 저장 버튼 */}
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

      {/* 서브 타입 탭 */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {Object.keys(editedData[activeMainType] || {}).map(type => (
            <button
              key={type}
              className={`px-3 py-1 rounded-lg transition-all duration-200 text-sm
                ${
                  activeSubType === type
                    ? "bg-gray-200 text-gray-800"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              onClick={() => setActiveSubType(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 왼쪽: 기본 정보 섹션 */}
        <div className="bg-gray-50 rounded-xl p-3">
          <div className="overflow-y-auto max-h-[540px] pr-2 space-y-3 scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {/* Title & Keywords */}
            <div className="bg-white rounded-xl p-3 shadow-sm">
              <h3 className="text-md font-semibold text-gray-800 mb-2">
                Title
              </h3>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                value={currentData.title}
                onChange={e => handleFieldChange("title", e.target.value)}
              />
            </div>

            <div className="bg-white rounded-xl p-3 shadow-sm">
              <h3 className="text-md font-semibold text-gray-800 mb-2">
                Keywords
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {currentData.keywords.map((keyword, index) => (
                  <input
                    key={index}
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                    value={keyword}
                    onChange={e => {
                      const newKeywords = [...currentData.keywords];
                      newKeywords[index] = e.target.value;
                      handleFieldChange("keywords", newKeywords);
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl p-3 shadow-sm">
              <h3 className="text-md font-semibold text-gray-800 mb-2">
                Description
              </h3>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                value={currentData.description}
                onChange={e => handleFieldChange("description", e.target.value)}
                rows={4}
              />
            </div>
          </div>
        </div>

        {/* 오른쪽: Interview Questions, Onboarding Steps, Weaknesses */}
        <div className="bg-gray-50 rounded-xl p-3">
          <div className="overflow-y-auto max-h-[540px] pr-2 space-y-3 scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {/* Interview Questions */}
            <div className="bg-white rounded-xl p-3 shadow-sm">
              <h3 className="text-md font-semibold text-gray-800 mb-2">
                Interview Questions
              </h3>
              {currentData.interviewQuestions.map((question, index) => (
                <div key={index} className="mb-2">
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                    value={question}
                    onChange={e => {
                      const newQuestions = [...currentData.interviewQuestions];
                      newQuestions[index] = e.target.value;
                      handleFieldChange("interviewQuestions", newQuestions);
                    }}
                    rows={2}
                  />
                </div>
              ))}
            </div>

            {/* Onboarding Steps */}
            <div className="bg-white rounded-xl p-3 shadow-sm">
              <h3 className="text-md font-semibold text-gray-800 mb-2">
                Onboarding Steps
              </h3>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                value={currentData.onboardingSteps}
                onChange={e =>
                  handleFieldChange("onboardingSteps", e.target.value)
                }
                rows={3}
              />
            </div>

            {/* Weaknesses */}
            <div className="bg-white rounded-xl p-3 shadow-sm">
              <h3 className="text-md font-semibold text-gray-800 mb-2">
                Weaknesses
              </h3>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                value={currentData.weaknesses}
                onChange={e => handleFieldChange("weaknesses", e.target.value)}
                rows={2}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SauceResultEditor;
