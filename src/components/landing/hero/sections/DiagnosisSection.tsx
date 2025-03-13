import { useState } from "react";
import { motion } from "framer-motion";
import { diagnosisQuestions } from "@/constants/selfDiagnosis";

// 자가진단 결과 타입 정의
interface DiagnosisResult {
  score: number;
  efficiency: string;
  recommendation: string;
}

interface DiagnosisSectionProps {
  isLogin: boolean;
}

export const DiagnosisSection = ({ isLogin }: DiagnosisSectionProps) => {
  // 응답 상태 관리 (1-5점)
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  // 결과 표시 여부
  const [showResult, setShowResult] = useState<boolean>(false);
  // 현재 페이지 (0: 첫 2개 문항, 1: 다음 2개 문항, ...)
  const [currentPage, setCurrentPage] = useState<number>(0);

  // 응답 처리 함수
  const handleAnswer = (questionId: number, value: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value,
    }));
  };

  // 다음 페이지로 이동
  const nextPage = () => {
    if (currentPage < Math.ceil(diagnosisQuestions.length / 2) - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      // 마지막 페이지에서는 결과 표시
      setShowResult(true);
    }
  };

  // 이전 페이지로 이동
  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // 현재 페이지의 문항들
  const currentQuestions = diagnosisQuestions.slice(
    currentPage * 2,
    currentPage * 2 + 2
  );

  // 결과 계산 함수
  const calculateResult = (): DiagnosisResult => {
    // 응답한 문항 수
    const answeredCount = Object.keys(answers).length;

    // 총점 계산
    const totalScore = Object.values(answers).reduce(
      (sum, score) => sum + score,
      0
    );

    // 평균 점수 (5점 만점)
    const averageScore = answeredCount > 0 ? totalScore / answeredCount : 0;

    // 백분율 점수 (100점 만점)
    const percentageScore = (averageScore / 5) * 100;

    // 효율성 등급 결정
    let efficiency = "";
    let recommendation = "";

    if (percentageScore >= 80) {
      efficiency = "매우 높음";
      recommendation =
        "귀사의 HR 업무 효율성은 매우 높은 수준입니다. 현재의 시스템을 유지하면서 지속적인 개선을 통해 경쟁력을 더욱 강화하세요.";
    } else if (percentageScore >= 60) {
      efficiency = "높음";
      recommendation =
        "귀사의 HR 업무 효율성은 높은 편이지만, 일부 영역에서 개선의 여지가 있습니다. 데이터 분석 및 자동화 기능을 더욱 강화하여 효율성을 높이세요.";
    } else if (percentageScore >= 40) {
      efficiency = "보통";
      recommendation =
        "귀사의 HR 업무 효율성은 보통 수준입니다. HR 프로세스의 디지털화와 데이터 기반 의사결정을 강화하여 효율성을 높일 필요가 있습니다.";
    } else if (percentageScore >= 20) {
      efficiency = "낮음";
      recommendation =
        "귀사의 HR 업무 효율성은 다소 낮은 수준입니다. HR 시스템의 체계적인 구축과 프로세스 개선을 통해 효율성을 높이는 것이 시급합니다.";
    } else {
      efficiency = "매우 낮음";
      recommendation =
        "귀사의 HR 업무 효율성은 매우 낮은 수준입니다. 기본적인 HR 시스템 도입과 프로세스 표준화부터 시작하여 단계적으로 개선해 나가세요.";
    }

    return {
      score: percentageScore,
      efficiency,
      recommendation,
    };
  };

  // 결과 객체
  const result = calculateResult();

  return (
    <section
      id="diagnosis"
      className="min-h-screen w-full flex items-center py-12 sm:py-16 bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2 w-full">
            <div className="max-w-lg mx-auto md:mx-0">
              <motion.h2
                className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-3 sm:mb-4 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                HR 업무 효율성 <span className="text-orange-500">자가진단</span>
              </motion.h2>
              <motion.p
                className="text-sm sm:text-base md:text-lg text-gray-600 mb-4 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                자가진단을 통해 귀하의 HR 업무 효율성을 객관적으로 평가하고,{" "}
                <br />
                <span className="font-medium text-orange-500">
                  {" "}
                  개선 가능한 영역
                </span>
                을 파악해보세요.
              </motion.p>
            </div>
          </div>

          <div className="md:w-1/2 w-full" id="diagnosis-form">
            <motion.div
              className="bg-white rounded-xl shadow-lg p-4 sm:p-6 max-w-md mx-auto border border-gray-100"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="h-auto py-3 sm:py-4">
                {!showResult ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-4 sm:space-y-6"
                  >
                    <div className="mb-3 sm:mb-4">
                      <div className="flex justify-between mb-1 sm:mb-2 text-xs font-medium">
                        <span className="text-gray-500">진행률</span>
                        <span className="text-orange-500 font-semibold">
                          {Math.min(
                            100,
                            Math.round(
                              (Object.keys(answers).length /
                                diagnosisQuestions.length) *
                                100
                            )
                          )}
                          %
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <motion.div
                          className="bg-gradient-to-r from-orange-400 to-orange-500 h-1.5 rounded-full"
                          initial={{ width: "0%" }}
                          animate={{
                            width: `${Math.min(
                              100,
                              Math.round(
                                (Object.keys(answers).length /
                                  diagnosisQuestions.length) *
                                  100
                              )
                            )}%`,
                          }}
                          transition={{ duration: 0.3 }}
                        ></motion.div>
                      </div>
                    </div>

                    <div className="space-y-4 sm:space-y-5">
                      {currentQuestions.map((question, index) => (
                        <motion.div
                          key={question.id}
                          className="mb-4 sm:mb-5"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                        >
                          <h3 className="text-gray-800 text-sm sm:text-base font-medium mb-2 sm:mb-3">
                            {question.text}
                          </h3>

                          {/* 모바일에서는 세로 배치, 태블릿 이상에서는 가로 배치 */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex justify-between mb-2 sm:mb-0 sm:w-auto">
                              <span className="text-xs text-gray-400 sm:w-16">
                                전혀 아니다
                              </span>
                              <span className="text-xs text-gray-400 sm:hidden">
                                매우 그렇다
                              </span>
                            </div>

                            <div className="flex justify-between sm:justify-center space-x-1 sm:space-x-2">
                              {[1, 2, 3, 4, 5].map(value => (
                                <motion.button
                                  key={value}
                                  onClick={() =>
                                    handleAnswer(question.id, value)
                                  }
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className={`w-10 h-10 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
                                    answers[question.id] === value
                                      ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-md"
                                      : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                                  } text-sm font-medium`}
                                >
                                  {value}
                                </motion.button>
                              ))}
                            </div>

                            <span className="text-xs text-gray-400 w-16 text-right hidden sm:block">
                              매우 그렇다
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="flex justify-between mt-4 sm:mt-6">
                      {currentPage > 0 ? (
                        <motion.button
                          onClick={prevPage}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="px-3 sm:px-4 py-2 text-orange-500 text-sm font-medium rounded-lg border border-orange-200 hover:bg-orange-50 transition-colors"
                        >
                          이전
                        </motion.button>
                      ) : (
                        <div></div>
                      )}
                      <motion.button
                        onClick={nextPage}
                        disabled={currentQuestions.some(
                          q => answers[q.id] === undefined
                        )}
                        whileHover={
                          !currentQuestions.some(
                            q => answers[q.id] === undefined
                          )
                            ? { scale: 1.02 }
                            : {}
                        }
                        whileTap={
                          !currentQuestions.some(
                            q => answers[q.id] === undefined
                          )
                            ? { scale: 0.98 }
                            : {}
                        }
                        className={`px-4 sm:px-5 py-2 rounded-lg text-sm font-medium ${
                          currentQuestions.some(
                            q => answers[q.id] === undefined
                          )
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-md hover:shadow-lg transition-all"
                        }`}
                      >
                        {currentPage <
                        Math.ceil(diagnosisQuestions.length / 2) - 1
                          ? "다음"
                          : "결과 보기"}
                      </motion.button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                  >
                    <h3 className="text-base sm:text-lg font-bold mb-4 sm:mb-6 text-gray-800">
                      자가진단 결과
                    </h3>

                    <div className="mb-4 sm:mb-6">
                      <motion.div
                        className="w-24 h-24 sm:w-28 sm:h-28 mx-auto relative mb-2 sm:mb-3"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <svg
                          viewBox="0 0 100 100"
                          className="w-full h-full drop-shadow-md"
                        >
                          <circle
                            cx="50"
                            cy="50"
                            r="42"
                            fill="none"
                            stroke="#f3f4f6"
                            strokeWidth="8"
                          />
                          <motion.circle
                            cx="50"
                            cy="50"
                            r="42"
                            fill="none"
                            stroke="url(#gradient)"
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray="264"
                            initial={{ strokeDashoffset: 264 }}
                            animate={{
                              strokeDashoffset:
                                264 - 264 * (result.score / 100),
                            }}
                            transition={{ duration: 1, delay: 0.5 }}
                            transform="rotate(-90 50 50)"
                          />
                          <defs>
                            <linearGradient
                              id="gradient"
                              x1="0%"
                              y1="0%"
                              x2="100%"
                              y2="0%"
                            >
                              <stop offset="0%" stopColor="#fb923c" />
                              <stop offset="100%" stopColor="#f97316" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3, delay: 1 }}
                        >
                          <span className="text-xl sm:text-2xl font-bold text-gray-800">
                            {Math.round(result.score)}%
                          </span>
                        </motion.div>
                      </motion.div>
                      <motion.p
                        className="text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.7 }}
                      >
                        HR 업무 효율성:{" "}
                        <span className="font-bold text-orange-500">
                          {result.efficiency}
                        </span>
                      </motion.p>
                    </div>

                    <motion.div
                      className="bg-gray-50 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6 text-left border-l-4 border-orange-400 shadow-sm"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.9 }}
                    >
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                        {result.recommendation}
                      </p>
                    </motion.div>

                    <div className="mt-4 sm:mt-6 space-y-3">
                      <motion.a
                        href={isLogin ? "/dashboard" : "/login"}
                        className="block w-full py-2.5 bg-gradient-to-r from-orange-400 to-orange-500 text-white font-medium rounded-lg hover:shadow-lg transition-all text-sm"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 1.1 }}
                      >
                        워크소스 무료로 시작하기
                      </motion.a>
                      <motion.button
                        onClick={() => {
                          setShowResult(false);
                          setAnswers({});
                          setCurrentPage(0);
                        }}
                        className="text-orange-500 hover:text-orange-600 text-sm font-medium mt-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 1.2 }}
                      >
                        다시 진단하기
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
