// 카카오톡 공유 관련 타입 정의
declare global {
  interface Window {
    Kakao: {
      init: (appKey: string) => void;
      isInitialized: () => boolean;
      Share?: {
        sendDefault: (options: {
          objectType: string;
          content: {
            title: string;
            description: string;
            imageUrl: string;
            link: {
              mobileWebUrl: string;
              webUrl: string;
            };
          };
          buttons: Array<{
            title: string;
            link: {
              mobileWebUrl: string;
              webUrl: string;
            };
          }>;
        }) => void;
      };
      Link?: {
        sendDefault: (options: {
          objectType: string;
          content: {
            title: string;
            description: string;
            imageUrl: string;
            link: {
              mobileWebUrl: string;
              webUrl: string;
            };
          };
          buttons: Array<{
            title: string;
            link: {
              mobileWebUrl: string;
              webUrl: string;
            };
          }>;
        }) => void;
      };
    };
  }
}

// 공유 데이터 인터페이스
export interface ShareData {
  title: string;
  description: string;
  imageUrl: string;
  url: string;
  hashtags: string[];
  typeName: string;
}

// 카카오 SDK가 로드되었는지 확인 (기존 방식)
export const waitForKakaoSDK = (): Promise<void> => {
  return new Promise(resolve => {
    if (typeof window === "undefined") {
      resolve();
      return;
    }

    // 이미 로드되어 있으면 즉시 resolve
    if (window.Kakao) {
      resolve();
      return;
    }

    // SDK 로드 대기
    let attempts = 0;
    const maxAttempts = 50; // 5초 대기 (100ms * 50)

    const checkSDK = () => {
      attempts++;
      if (window.Kakao) {
        console.log("Kakao SDK loaded after", attempts * 100, "ms");
        resolve();
      } else if (attempts < maxAttempts) {
        setTimeout(checkSDK, 100);
      } else {
        console.error("Kakao SDK failed to load within 5 seconds");
        resolve();
      }
    };

    checkSDK();
  });
};

// 카카오 SDK 초기화 (KakaoScript 컴포넌트에서 처리됨)
export const initKakaoSDK = async () => {
  // KakaoScript 컴포넌트에서 이미 초기화를 처리하므로
  // SDK가 로드되고 초기화될 때까지 대기만 함
  await waitForKakaoSDK();

  if (typeof window !== "undefined" && window.Kakao) {
    console.log("Kakao SDK check:", {
      hasKakao: !!window.Kakao,
      hasIsInitialized: typeof window.Kakao.isInitialized === "function",
      isInitialized:
        typeof window.Kakao.isInitialized === "function"
          ? window.Kakao.isInitialized()
          : "function not available",
    });
  }
};

// 카카오 SDK가 사용 가능한지 확인
export const isKakaoSDKAvailable = (): boolean => {
  if (typeof window === "undefined" || !window.Kakao) {
    return false;
  }

  if (
    typeof window.Kakao.isInitialized !== "function" ||
    !window.Kakao.isInitialized()
  ) {
    return false;
  }

  const hasShareAPI = !!(
    window.Kakao.Share && typeof window.Kakao.Share.sendDefault === "function"
  );
  const hasLinkAPI = !!(
    window.Kakao.Link && typeof window.Kakao.Link.sendDefault === "function"
  );

  return hasShareAPI || hasLinkAPI;
};

// 카카오톡 공유 함수
export const shareToKakao = async (shareData: ShareData) => {
  console.log("Sharing to Kakao with data:", shareData);

  // 카카오 SDK 사용 가능 여부 확인
  if (!isKakaoSDKAvailable()) {
    console.error("Kakao SDK is not available or not properly initialized");
    // Fallback: URL 복사
    const success = await copyToClipboard(shareData.url);
    if (success) {
      alert("링크가 클립보드에 복사되었습니다!");
    }
    return;
  }

  try {
    const shareOptions = {
      objectType: "feed",
      content: {
        title: shareData.title,
        description: shareData.description,
        imageUrl: shareData.imageUrl,
        link: {
          mobileWebUrl: shareData.url,
          webUrl: shareData.url,
        },
      },
      buttons: [
        {
          title: "자세히 보기",
          link: {
            mobileWebUrl: shareData.url,
            webUrl: shareData.url,
          },
        },
      ],
    };

    console.log("Kakao share options:", shareOptions);

    // 최신 카카오 SDK API 사용
    if (
      window.Kakao.Share &&
      typeof window.Kakao.Share.sendDefault === "function"
    ) {
      // 새로운 Share API 사용 (v2.7.6+)
      window.Kakao.Share.sendDefault(shareOptions);
    } else if (
      window.Kakao.Link &&
      typeof window.Kakao.Link.sendDefault === "function"
    ) {
      // 기존 Link API 사용 (하위 호환성)
      window.Kakao.Link.sendDefault(shareOptions);
    } else {
      throw new Error("Neither Share nor Link API is available");
    }
  } catch (error) {
    console.error("Failed to share to Kakao:", error);
    // Fallback: URL 복사
    const success = await copyToClipboard(shareData.url);
    if (success) {
      alert(
        "카카오톡 공유에 실패했습니다. 대신 링크가 클립보드에 복사되었습니다!"
      );
    }
  }
};

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

// 공유 데이터 생성 함수
export const createShareData = (
  typeName: string,
  oneLiner: string,
  keywords: string[],
  finalType: string
): ShareData => {
  const baseUrl = "https://worksauce.kr";

  // finalType이 이미 URL 인코딩되어 있는지 확인
  // 만약 이미 인코딩되어 있다면 그대로 사용, 아니라면 인코딩
  let encodedFinalType = finalType;
  try {
    // 이미 인코딩되어 있는지 확인 (디코딩 후 다시 인코딩했을 때 같으면 원본이 인코딩된 것)
    const decoded = decodeURIComponent(finalType);
    if (decoded !== finalType) {
      // 이미 인코딩되어 있음
      encodedFinalType = finalType;
    } else {
      // 인코딩되지 않았음
      encodedFinalType = encodeURIComponent(finalType);
    }
  } catch (error) {
    // 디코딩 실패 시 그대로 인코딩
    encodedFinalType = encodeURIComponent(finalType);
  }

  const shareUrl = `${baseUrl}/mini-test/${encodedFinalType}`;

  console.log("Share data creation:", {
    typeName,
    finalType,
    encodedFinalType,
    shareUrl,
  });

  return {
    title: `나의 워크소스는 ${typeName}입니다!`,
    description: oneLiner,
    imageUrl: getOGImageByType(typeName), // 유형별 OG 이미지 사용
    url: shareUrl,
    hashtags: ["워크소스", "worksauce", typeName, ...keywords.slice(0, 2)],
    typeName, // 타입명 추가
  };
};
