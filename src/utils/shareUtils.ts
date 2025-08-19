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
    // 최신 카카오 SDK API 사용
    if (
      window.Kakao.Share &&
      typeof window.Kakao.Share.sendDefault === "function"
    ) {
      // 새로운 Share API 사용 (v2.7.6+)
      window.Kakao.Share.sendDefault({
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
            title: "테스트 하러가기",
            link: {
              mobileWebUrl: shareData.url,
              webUrl: shareData.url,
            },
          },
        ],
      });
    } else if (
      window.Kakao.Link &&
      typeof window.Kakao.Link.sendDefault === "function"
    ) {
      // 기존 Link API 사용 (하위 호환성)
      window.Kakao.Link.sendDefault({
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
            title: "테스트 하러가기",
            link: {
              mobileWebUrl: shareData.url,
              webUrl: shareData.url,
            },
          },
        ],
      });
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

// 공유 데이터 생성 함수
export const createShareData = (
  typeName: string,
  oneLiner: string,
  keywords: string[],
  finalType: string
): ShareData => {
  const baseUrl = "https://worksauce.kr";
  const shareUrl = `${baseUrl}/mini-testV2/${finalType}`;

  return {
    title: `나의 워크소스는 ${typeName}입니다!`,
    description: oneLiner,
    imageUrl: `${baseUrl}/images/OG_orangebg.png`, // 기본 OG 이미지 사용
    url: shareUrl,
    hashtags: ["워크소스", "worksauce", typeName, ...keywords.slice(0, 2)],
  };
};
