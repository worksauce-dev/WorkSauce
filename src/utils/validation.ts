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

export const isValidPhoneNumber = (phone: string): boolean => {
  // 숫자만 추출
  const cleaned = phone.replace(/[^\d]/g, "");

  // 길이 체크 (10-11자리)
  if (cleaned.length < 10 || cleaned.length > 11) return false;

  // 패턴 체크
  const pattern = /^(01[016789])(\d{3,4})(\d{4})$/;
  if (!pattern.test(cleaned)) return false;

  return true;
};

export const isValidBusinessNumber = (number: string): boolean => {
  // 하이픈을 제외한 숫자만 추출
  const cleaned = number.replace(/-/g, "");

  // 숫자만 있는지 확인
  if (!/^\d+$/.test(cleaned)) return false;

  // 길이 체크 (10자리)
  if (cleaned.length !== 10) return false;

  return true;
};

// 사업자등록번호 포맷팅 함수
export const formatBusinessNumber = (number: string): string => {
  const cleaned = number.replace(/[^\d]/g, "");
  if (cleaned.length >= 3) {
    if (cleaned.length >= 5) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 5)}-${cleaned.slice(
        5,
        10
      )}`;
    }
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
  }
  return cleaned;
};

export const isValidWorkPhone = (phone: string): boolean => {
  // 숫자만 있는지 확인
  if (!/^\d+$/.test(phone)) return false;

  // 길이 체크 (8-12자리)
  if (phone.length < 8 || phone.length > 12) return false;

  // 휴대폰 번호 체크
  if (
    phone.startsWith("010") ||
    phone.startsWith("011") ||
    phone.startsWith("016") ||
    phone.startsWith("017") ||
    phone.startsWith("018") ||
    phone.startsWith("019")
  ) {
    return phone.length === 10 || phone.length === 11;
  }

  // 일반 전화번호 체크 (02로 시작하면 9-10자리, 그 외는 10-11자리)
  if (phone.startsWith("02")) {
    return phone.length >= 9 && phone.length <= 10;
  }

  // 기타 지역번호로 시작하는 경우
  return phone.length >= 10 && phone.length <= 11;
};
