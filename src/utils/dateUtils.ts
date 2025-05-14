/**
 * ISO 날짜 문자열을 'M월 D일' 형식으로 변환합니다.
 * @param dateString - ISO 형식의 날짜 문자열 또는 null/undefined
 * @returns 포맷된 날짜 문자열 또는 기본값 ("-")
 */
export const formatDateToKorean = (
  dateString: string | null | undefined
): string => {
  if (!dateString) return "-";

  const date = new Date(dateString);

  // 유효하지 않은 날짜인 경우
  if (isNaN(date.getTime())) return "-";

  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
};

// 날짜 포맷팅 함수
export const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
