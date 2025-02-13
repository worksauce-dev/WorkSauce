/* eslint-disable react/no-unescaped-entities */
"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdSave } from "react-icons/md";
import { TestData } from "@/types/sauceTestResult";
import { SauceResultType, SauceType } from "@/types/test";
import { useState } from "react";

interface SauceResultEditorProps {
  initialData: SauceResultType;
  updateResult: (result: SauceResultType) => Promise<void>;
}

type TabType = "type" | "characteristics" | "onboarding";

type SectionType = "typeDescription" | "characteristics" | "onboarding";

const SECTION_EMOJIS = {
  TALENT: "✨",
  JOB: "💼",
  OPINION: "💪",
  ADDITIONAL: "🙋🏻‍♂️",
} as const;

const TAB_CONFIG = [
  { id: "type", label: "유형 설명", icon: "🎯" },
  { id: "characteristics", label: "특성", icon: "✨" },
  { id: "onboarding", label: "온보딩", icon: "🎓" },
] as const;

const SauceResultEditor: React.FC<SauceResultEditorProps> = ({
  initialData,
  updateResult,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("type");
  const [editedData, setEditedData] = useState<SauceResultType>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [activeMainType, setActiveMainType] = useState<SauceType>("기준윤리형");
  const [activeSubType, setActiveSubType] = useState<SauceType>("기준심미형");

  const handleSave = async () => {
    if (!window.confirm("변경사항을 저장하시겠습니까?")) return;

    try {
      setIsSaving(true);
      await updateResult(editedData);
      alert("성공적으로 저장되었습니다.");
    } catch (error) {
      console.error("저장 중 오류 발생:", error);
      alert("저장 중 오류가 발생했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleMainTypeChange = (newMainType: SauceType) => {
    setActiveMainType(newMainType);
    const subTypes = Object.keys(editedData[newMainType] || {});
    setActiveSubType(subTypes[0] as SauceType);
  };

  const handleFieldChange = (
    section: SectionType,
    field: string,
    value: string | string[],
    index?: number
  ) => {
    setEditedData(prev => {
      const newData = { ...prev };
      const mainTypeData = newData[activeMainType];

      if (typeof mainTypeData === "string") return prev;

      const testData = { ...mainTypeData[activeSubType] };
      const fieldPath = field.split(".");
      let current: any = testData[section];

      // 마지막 필드 전까지 순회
      for (let i = 0; i < fieldPath.length - 1; i++) {
        current = current[fieldPath[i]];
      }

      // 마지막 필드에 값 할당
      const lastField = fieldPath[fieldPath.length - 1];
      if (index !== undefined && Array.isArray(current[lastField])) {
        current[lastField][index] = value;
      } else {
        current[lastField] = value;
      }

      mainTypeData[activeSubType] = testData;
      return newData;
    });
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Type Selection Header */}
      <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            {(
              Object.keys(editedData).filter(
                type => type !== "createdAt" && type !== "updatedAt"
              ) as SauceType[]
            ).map(type => (
              <button
                key={type}
                onClick={() => handleMainTypeChange(type)}
                className={`
                    px-4 py-2 rounded-lg transition-all text-sm
                    ${
                      activeMainType === type
                        ? "bg-orange-50 text-orange-600 font-medium shadow-sm"
                        : "text-gray-600 hover:bg-gray-50"
                    }
                  `}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {(Object.keys(editedData[activeMainType] || {}) as SauceType[]).map(
              type => (
                <button
                  key={type}
                  onClick={() => setActiveSubType(type)}
                  className={`
                px-3 py-1.5 rounded-lg transition-all text-sm
                ${
                  activeSubType === type
                    ? "bg-gray-200 text-gray-800"
                    : "text-gray-600 hover:bg-gray-100"
                }
              `}
                >
                  {type}
                </button>
              )
            )}
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <MdSave />
            {isSaving ? "저장 중..." : "저장"}
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <nav className="bg-white rounded-lg py-3 px-4 border border-gray-100 shadow-sm">
        <div className="flex space-x-2">
          {TAB_CONFIG.map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as TabType)}
              className={`
                flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all
                ${
                  activeTab === id
                    ? "bg-orange-50 text-orange-600 font-medium shadow-sm"
                    : "text-gray-600 hover:bg-gray-50"
                }
              `}
            >
              <span className="text-lg">{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        <motion.div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex-1">
          {activeTab === "type" &&
            typeof editedData[activeMainType] !== "string" && (
              <TypeEditor
                data={editedData[activeMainType][activeSubType]}
                onChange={handleFieldChange}
              />
            )}
          {activeTab === "characteristics" &&
            typeof editedData[activeMainType] !== "string" && (
              <CharacteristicsEditor
                data={editedData[activeMainType][activeSubType]}
                onChange={handleFieldChange}
              />
            )}
          {activeTab === "onboarding" &&
            typeof editedData[activeMainType] !== "string" && (
              <OnboardingEditor
                data={editedData[activeMainType][activeSubType]}
                onChange={handleFieldChange}
              />
            )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

interface EditorProps {
  data: TestData;
  onChange: (
    section: SectionType,
    field: string,
    value: string | string[],
    index?: number
  ) => void;
}

const TypeEditor: React.FC<EditorProps> = ({ data, onChange }) => (
  <div className="p-4 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300 scrollbar-track-transparent">
    <div className="grid grid-cols-2 grid-rows-2 auto-rows-fr gap-4 h-full">
      {/* 인재 유형 특징 카드 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg overflow-hidden flex flex-col h-full"
      >
        <div className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 border-b border-orange-100/50 bg-orange-50/95 backdrop-blur-sm">
          <span className="text-lg">{SECTION_EMOJIS.TALENT}</span>
          <h4 className="font-medium text-gray-900 text-sm">인재 유형 특징</h4>
        </div>
        <div className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {data.typeDescription.talentCharacteristics.points.map(
            (point: string, index: number) => (
              <textarea
                key={index}
                value={point}
                onChange={e =>
                  onChange(
                    "typeDescription",
                    "talentCharacteristics.points",
                    e.target.value,
                    index
                  )
                }
                className="w-full mb-2 p-2 border rounded-lg text-gray-700"
                rows={2}
              />
            )
          )}
        </div>
      </motion.div>

      {/* 추가 의견 카드 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg overflow-hidden flex flex-col h-full"
      >
        <div className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 border-b border-blue-100/50 bg-blue-50/95 backdrop-blur-sm">
          <span className="text-lg">{SECTION_EMOJIS.ADDITIONAL}</span>
          <h4 className="font-medium text-gray-900 text-sm">추가 의견</h4>
        </div>
        <div className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300 scrollbar-track-transparent">
          <textarea
            value={data.typeDescription.finalOpinion.additionalNote}
            onChange={e =>
              onChange(
                "typeDescription",
                "finalOpinion.additionalNote",
                e.target.value
              )
            }
            className="w-full h-full p-3 border rounded-lg text-gray-700"
          />
        </div>
      </motion.div>

      {/* 실무 직무 카드 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg overflow-hidden flex flex-col h-full"
      >
        <div className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 border-b border-green-100/50 bg-green-50/95 backdrop-blur-sm">
          <span className="text-lg">{SECTION_EMOJIS.JOB}</span>
          <h4 className="font-medium text-gray-900 text-sm">
            실무에 최적화된 직무
          </h4>
        </div>
        <div className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300 scrollbar-track-transparent">
          <div className="flex gap-4 h-full">
            {data.typeDescription.recommendedJobs.jobs.map(
              (job: any, index: number) => (
                <div
                  key={index}
                  className="flex-1 p-3 bg-white/50 rounded-lg border border-green-100/50"
                >
                  <input
                    value={job.name}
                    onChange={e =>
                      onChange(
                        "typeDescription",
                        `recommendedJobs.jobs.${index}.name`,
                        e.target.value
                      )
                    }
                    className="font-medium text-sm text-gray-800 mb-3 pb-2 border-b border-green-100/50 w-full"
                  />
                  <div className="space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300 scrollbar-track-transparent">
                    {job.details.map((detail: string, detailIndex: number) => (
                      <textarea
                        key={detailIndex}
                        value={detail}
                        onChange={e =>
                          onChange(
                            "typeDescription",
                            `recommendedJobs.jobs.${index}.details`,
                            e.target.value,
                            detailIndex
                          )
                        }
                        className="text-xs text-gray-600 w-full p-2 border rounded-lg"
                        rows={2}
                      />
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </motion.div>

      {/* 최종 의견 카드 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-purple-50 to-fuchsia-50 rounded-lg overflow-hidden flex flex-col h-full"
      >
        <div className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 border-b border-purple-100/50 bg-purple-50/95 backdrop-blur-sm">
          <span className="text-lg">{SECTION_EMOJIS.OPINION}</span>
          <h4 className="font-medium text-gray-900 text-sm">최종 추천 의견</h4>
        </div>
        <div className="flex-1 p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300 scrollbar-track-transparent">
          <div className="relative h-full">
            <span className="absolute -left-2 top-0 text-4xl text-purple-200 font-serif">
              "
            </span>
            <div className="pl-6 pr-4 h-full">
              <textarea
                value={data.typeDescription.finalOpinion.content}
                onChange={e =>
                  onChange(
                    "typeDescription",
                    "finalOpinion.content",
                    e.target.value
                  )
                }
                className="text-base leading-relaxed tracking-wide text-gray-800 font-medium w-full h-full p-2 border rounded-lg"
              />
            </div>
            <span className="absolute -right-2 bottom-0 text-4xl text-purple-200 font-serif rotate-180">
              "
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  </div>
);

const CharacteristicsEditor: React.FC<EditorProps> = ({ data, onChange }) => (
  <div className="p-6 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300 scrollbar-track-transparent">
    <div className="space-y-6">
      {/* 상단 2열 섹션 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 최고의 성과 섹션 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-5"
        >
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
            <span className="text-2xl">✨</span>
            이럴 때 최고의 성과를 냅니다
          </h3>
          <div className="space-y-2">
            {data.characteristics.bestPerformance.points.map(
              (point: string, index: number) => (
                <div key={index} className="bg-white/60 rounded-lg p-3">
                  <textarea
                    value={point}
                    onChange={e =>
                      onChange(
                        "characteristics",
                        "bestPerformance.points",
                        e.target.value,
                        index
                      )
                    }
                    className="text-gray-700 w-full p-2 border rounded-lg bg-white"
                    rows={2}
                  />
                </div>
              )
            )}
          </div>
        </motion.div>

        {/* 주의점 섹션 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-5"
        >
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
            <span className="text-2xl">⚠️</span>
            이런 부분은 특별한 관심이 필요해요
          </h3>
          <div className="space-y-3">
            {data.characteristics.attentionPoints.points.map(
              (point: any, index: number) => (
                <div key={index} className="bg-white/60 rounded-lg p-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-start gap-2">
                      <span className="flex-shrink-0 px-2 py-1 bg-orange-100 rounded-md text-xs font-medium text-orange-600">
                        이슈
                      </span>
                      <textarea
                        value={point.issue}
                        onChange={e =>
                          onChange(
                            "characteristics",
                            `attentionPoints.points.${index}.issue`,
                            e.target.value
                          )
                        }
                        className="text-gray-700 w-full p-2 border rounded-lg bg-white"
                        rows={2}
                      />
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="flex-shrink-0 px-2 py-1 bg-green-100 rounded-md text-xs font-medium text-green-600">
                        해결방안
                      </span>
                      <textarea
                        value={point.solution}
                        onChange={e =>
                          onChange(
                            "characteristics",
                            `attentionPoints.points.${index}.solution`,
                            e.target.value
                          )
                        }
                        className="text-gray-700 w-full p-2 border rounded-lg bg-white"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </motion.div>
      </div>

      {/* 종합의견 섹션 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-5"
      >
        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
          <span className="text-2xl">🔥</span>
          종합의견
        </h3>
        <div className="space-y-3">
          <textarea
            value={data.characteristics.finalOpinion.content}
            onChange={e =>
              onChange(
                "characteristics",
                "finalOpinion.content",
                e.target.value
              )
            }
            className="text-gray-700 w-full p-2 border rounded-lg bg-white"
            rows={4}
          />
          <textarea
            value={data.characteristics.finalOpinion.additionalNote}
            onChange={e =>
              onChange(
                "characteristics",
                "finalOpinion.additionalNote",
                e.target.value
              )
            }
            className="text-sm text-gray-600 w-full p-2 border rounded-lg bg-white"
            rows={3}
            placeholder="추가 의견을 입력하세요"
          />
        </div>
      </motion.div>
    </div>
  </div>
);

const OnboardingEditor: React.FC<EditorProps> = ({ data, onChange }) => (
  <div className="p-6 space-y-8 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300 scrollbar-track-transparent">
    {/* 단계별 프로세스 */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {data.onboarding.stages.map((stage: any, index: number) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-5 relative"
        >
          {/* 단계 표시 배지 */}
          <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white flex items-center justify-center text-sm font-medium">
            {index + 1}
          </div>

          {/* 헤더 영역 */}
          <div className="mb-5">
            <input
              value={stage.period}
              onChange={e =>
                onChange("onboarding", `stages.${index}.period`, e.target.value)
              }
              className="text-lg font-semibold text-gray-900 mb-1 w-full bg-transparent border-b border-orange-100 focus:border-orange-200 px-1 py-0.5"
              placeholder="기간 입력"
            />
            <div className="inline-block px-3 py-1 bg-orange-100 rounded-full">
              <input
                value={stage.subtitle}
                onChange={e =>
                  onChange(
                    "onboarding",
                    `stages.${index}.subtitle`,
                    e.target.value
                  )
                }
                className="text-orange-600 text-sm font-medium bg-transparent w-full text-center"
                placeholder="소제목 입력"
              />
            </div>
          </div>

          {/* 태스크 리스트 */}
          <div className="space-y-3">
            {stage.tasks.map((task: string, taskIndex: number) => (
              <div
                key={taskIndex}
                className="flex items-start gap-3 bg-white rounded-lg p-4"
              >
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                <textarea
                  value={task}
                  onChange={e =>
                    onChange(
                      "onboarding",
                      `stages.${index}.tasks`,
                      e.target.value,
                      taskIndex
                    )
                  }
                  className="text-gray-700 text-sm leading-relaxed w-full p-2 border rounded-lg bg-white"
                  rows={2}
                />
              </div>
            ))}
          </div>

          {/* 단계 연결선 (마지막 아이템 제외) */}
          {index < (data?.onboarding?.stages?.length || 0) - 1 && (
            <div className="hidden md:block absolute -right-6 top-1/2 transform -translate-y-1/2 w-6 h-px bg-gradient-to-r from-orange-200 to-transparent" />
          )}
        </motion.div>
      ))}
    </div>

    {/* 종합 의견 */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-gradient-to-br from-purple-50 to-fuchsia-50 rounded-xl p-6"
    >
      <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
        <span className="text-2xl">💡</span>
        온보딩 종합 의견
      </h3>
      <div className="space-y-4">
        {data.onboarding.finalOpinion.points.map(
          (point: string, index: number) => (
            <div
              key={index}
              className="bg-white rounded-lg p-4 border border-purple-100/50"
            >
              <textarea
                value={point}
                onChange={e =>
                  onChange(
                    "onboarding",
                    "finalOpinion.points",
                    e.target.value,
                    index
                  )
                }
                className="w-full text-gray-700 p-2 border rounded-lg bg-white"
                rows={3}
              />
            </div>
          )
        )}
      </div>
    </motion.div>
  </div>
);

export default SauceResultEditor;
