export const isValidEmail = (email: string): boolean => {
  // 기본 구조 검증
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return false;

  // 추가 검증 (선택적)
  const [localPart, domain] = email.split("@");
  if (localPart.length > 64) return false; // 로컬 파트 최대 길이
  if (domain.length > 255) return false; // 도메인 최대 길이

  return true;
};
