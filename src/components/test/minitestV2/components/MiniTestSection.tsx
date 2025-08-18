import { miniTestQuestions } from "../data/testData";
import { MiniTestQuestion } from "./MiniTestQuestion";

interface MiniTestSectionProps {
  currentTypeIdx: number;
  miniTestAnswers: number[][];
  onAnswer: (typeIdx: number, qIdx: number, score: number) => void;
  onNext: () => void;
  onFinish: () => void;
  isComplete: boolean;
  isLastType: boolean;
}

export function MiniTestSection({
  currentTypeIdx,
  miniTestAnswers,
  onAnswer,
  onNext,
  onFinish,
  isComplete,
  isLastType,
}: MiniTestSectionProps) {
  const typeBlock = miniTestQuestions[currentTypeIdx];

  return (
    <div className="px-4 py-8 sm:p-0 min-h-screen flex flex-col items-center justify-center ">
      <div className="w-fullsm:w-[600px] bg-white rounded-2xl shadow-lg p-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-extrabold mb-2 text-orange-600 tracking-tight flex items-center justify-center gap-2">
            문항에 답해주세요
          </h2>
          <p className="text-sm text-gray-500 mt-2 flex items-center justify-center gap-1">
            <span className="text-base">👉</span>각 문항마다{" "}
            <span className="text-orange-500 font-bold">1~5점</span> 중
            선택해주세요
          </p>
          <div className="mt-2 text-xs text-gray-400">
            <span className="font-bold text-orange-500">1</span>=매우 그렇지
            않다, <span className="font-bold text-orange-500">5</span>=매우
            그렇다
          </div>
          <div className="mt-2 text-xs text-gray-400">
            유형 진행: {currentTypeIdx + 1} / {miniTestQuestions.length}
          </div>
        </div>
        
        <section className="bg-gray-50 rounded-xl shadow p-6 border border-gray-100 h-[400px] sm:h-[400px] flex flex-col justify-evenly">
          {typeBlock.questions.map((q, qIdx) => (
            <MiniTestQuestion
              key={qIdx}
              q={q}
              qIdx={qIdx}
              answer={miniTestAnswers[currentTypeIdx][qIdx]}
              onSelect={score => onAnswer(currentTypeIdx, qIdx, score)}
            />
          ))}
        </section>
        
        {!isLastType ? (
          <button
            className="w-full py-3 bg-gradient-to-r from-orange-500 via-pink-500 to-yellow-400 text-white rounded-xl font-bold mt-10 shadow-md hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onNext}
            disabled={!isComplete}
          >
            다음
          </button>
        ) : (
          <button
            className="w-full py-3 bg-gradient-to-r from-orange-500 via-pink-500 to-yellow-400 text-white rounded-xl font-bold mt-10 shadow-md hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onFinish}
            disabled={!isComplete}
          >
            결과 보기
          </button>
        )}
      </div>
    </div>
  );
}