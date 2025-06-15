"use client";

interface QuestionSectionProps {
  currentQuestion: number;
  totalQuestions: number;
  question: string;
  options: { type: string; verb: string; score: number; sort: string }[];
  selectedOptions: number[];
  onSelectOption: (index: number) => void;
  onNext: () => void;
}

export function QuestionSection({
  currentQuestion,
  totalQuestions,
  question,
  options,
  selectedOptions,
  onSelectOption,
  onNext,
}: QuestionSectionProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">
          질문 {currentQuestion} / {totalQuestions}
        </h2>
        <p className="text-lg">{question}</p>
        <p className="text-sm text-gray-500 mt-2">
          가장 잘 맞는 2가지를 선택해주세요
        </p>
      </div>

      <div className="space-y-3">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => onSelectOption(index)}
            className={`w-full p-4 text-left rounded-lg border transition-colors ${
              selectedOptions.includes(index)
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-blue-300"
            }`}
          >
            {option.verb}
          </button>
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <button
          onClick={onNext}
          disabled={selectedOptions.length !== 2}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {currentQuestion === totalQuestions ? "결과 보기" : "다음"}
        </button>
      </div>
    </div>
  );
}
