"use client";

import Script from "next/script";

export default function KakaoScript() {
  const handleKakaoInit = () => {
    if (typeof window !== "undefined" && window.Kakao) {
      const appKey = process.env.NEXT_PUBLIC_KAKAO_APP_KEY;
      if (appKey) {
        window.Kakao.init(appKey);
      }
    }
  };

  return (
    <Script
      src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.6/kakao.min.js"
      integrity="sha384-WAtVcQYcmTO/N+C1N+1m6Gp8qxh+3NlnP7X1U7qP6P5dQY/MsRBNTh+e1ahJrkEm"
      crossOrigin="anonymous"
      strategy="afterInteractive"
      onLoad={handleKakaoInit}
    />
  );
}
