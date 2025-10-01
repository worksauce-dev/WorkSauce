// 공유 데이터 인터페이스
export interface ShareData {
  title: string;
  description: string;
  imageUrl: string;
  url: string;
  hashtags: string[];
  typeName: string;
}

// URL 복사 함수
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const result = document.execCommand("copy");
      textArea.remove();
      return result;
    }
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    return false;
  }
};

// 유형별 OG 이미지 매핑 함수
const getOGImageByType = (typeName: string): string => {
  const baseUrl = "https://worksauce.kr";

  // 유형명에 따른 OG 이미지 매핑
  const typeImageMap: { [key: string]: string } = {
    기준심미형: "OG_기준심미형.png",
    기준윤리형: "OG_기준윤리형.png",
    도전목표형: "OG_도전목표형.png",
    도전확장형: "OG_도전확장형.png",
    소통도움형: "OG_소통도움형.png",
    소통조화형: "OG_소통조화형.png",
    예술느낌형: "OG_예술느낌형.png",
    예술융합형: "OG_예술융합형.png",
    이해관리형: "OG_이해관리형.png",
    이해연구형: "OG_이해연구형.png",
  };

  // 유형명이 매핑에 있으면 해당 이미지 사용, 없으면 기본 이미지 사용
  const imageFileName = typeImageMap[typeName] || "OG_orangebg.png";
  return `${baseUrl}/images/${imageFileName}`;
};

// 한글 finalType을 영문으로 변환하는 함수
const convertFinalTypeToEnglish = (finalType: string): string => {
  const typeMapping: { [key: string]: string } = {
    기준심미형: "aesthetic-standard",
    기준윤리형: "ethical-standard",
    도전목표형: "challenge-goal",
    도전확장형: "challenge-expansion",
    소통도움형: "communication-help",
    소통조화형: "communication-harmony",
    예술느낌형: "artistic-feeling",
    예술융합형: "artistic-fusion",
    이해관리형: "understanding-management",
    이해연구형: "understanding-research",
  };

  return typeMapping[finalType] || finalType.toLowerCase().replace(/\s+/g, "-");
};

const convertEnglishToFinalType = (englishType: string): string => {
  const typeMapping: { [key: string]: string } = {
    "aesthetic-standard": "기준심미형",
    "ethical-standard": "기준윤리형",
    "challenge-goal": "도전목표형",
    "challenge-expansion": "도전확장형",
    "communication-help": "소통도움형",
    "communication-harmony": "소통조화형",
    "artistic-feeling": "예술느낌형",
    "artistic-fusion": "예술융합형",
    "understanding-management": "이해관리형",
    "understanding-research": "이해연구형",
  };

  return typeMapping[englishType] || englishType;
};

// 공유 데이터 생성 함수
export const createShareData = (
  typeName: string,
  oneLiner: string,
  keywords: string[]
): ShareData => {
  const baseUrl = "https://worksauce.kr";

  // 한글 finalType을 영문으로 변환
  const englishFinalType = convertFinalTypeToEnglish(typeName);
  const shareUrl = `${baseUrl}/mini-test/${englishFinalType}`;

  return {
    title: `나의 워크소스는 ${typeName}입니다!`,
    description: oneLiner,
    imageUrl: getOGImageByType(typeName), // 유형별 OG 이미지 사용
    url: shareUrl,
    hashtags: ["워크소스", "worksauce", typeName, ...keywords.slice(0, 2)],
    typeName, // 타입명 추가
  };
};

// 변환 함수들 export
export { convertFinalTypeToEnglish, convertEnglishToFinalType };
