import { Question } from "../types";

interface MiniTestQuestionProps {
  q: Question;
  qIdx: number;
  answer: number;
  onSelect: (score: number) => void;
}

export function MiniTestQuestion({
  q,
  qIdx,
  answer,
  onSelect,
}: MiniTestQuestionProps) {
  return (
    <div className="gap-2 sm:gap-3 flex flex-col mb-4 sm:mb-6 min-h-[100px] last:mb-0">
      <div className="flex items-start">
        <span className="text-orange-500 font-bold mr-2 mt-0.5">
          {qIdx + 1}.
        </span>
        <span className="text-gray-900 font-medium text-sm sm:text-base break-words leading-relaxed">
          {q.text}
        </span>
      </div>
      <div className="flex gap-8 justify-center mt-2">
        {[1, 2, 3, 4, 5].map(score => (
          <button
            key={score}
            type="button"
            onClick={() => onSelect(score)}
            className={`w-6 h-6 text-xs sm:text-base sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold border-2
            ${
              answer === score
                ? "bg-orange-500 text-white border-orange-500 scale-110"
                : "bg-white text-gray-400 border-gray-300 hover:border-orange-300"
            }
            transition`}
            aria-label={`${score}점`}
          >
            {score}
          </button>
        ))}
      </div>
    </div>
  );
}