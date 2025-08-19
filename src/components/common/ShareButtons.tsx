"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RiKakaoTalkFill } from "react-icons/ri";
import { MdShare, MdContentCopy, MdCheck } from "react-icons/md";
import {
  shareToKakao,
  copyToClipboard,
  initKakaoSDK,
  ShareData,
} from "@/utils/shareUtils";

interface ShareButtonsProps {
  shareData: ShareData;
  className?: string;
}

export const ShareButtons = ({
  shareData,
  className = "",
}: ShareButtonsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // 카카오 SDK 초기화
    const initializeSDK = async () => {
      try {
        await initKakaoSDK();
      } catch (error) {
        console.error("Failed to initialize Kakao SDK:", error);
      }
    };

    initializeSDK();
  }, []);

  const handleKakaoShare = async () => {
    try {
      await shareToKakao(shareData);
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to share:", error);
      // 에러 발생 시 URL 복사로 fallback
      await handleCopyUrl();
    }
  };

  const handleCopyUrl = async () => {
    const success = await copyToClipboard(shareData.url);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      setIsOpen(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* 메인 공유 버튼 */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2 px-4 py-3 sm:px-6 sm:py-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-xl sm:rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:from-yellow-500 hover:to-orange-500 transition-all duration-300 text-sm sm:text-base"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <MdShare className="text-base sm:text-lg group-hover:rotate-12 transition-transform duration-300" />
        <span>공유하기</span>
      </motion.button>

      {/* 공유 옵션 드롭다운 */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* 배경 오버레이 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* 드롭다운 메뉴 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 mt-2 z-50 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden min-w-[200px]"
            >
              {/* 카카오톡 공유 버튼 */}
              <motion.button
                onClick={handleKakaoShare}
                className="w-full flex items-center gap-3 px-6 py-4 text-slate-700 hover:bg-yellow-50 hover:shadow-sm transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <RiKakaoTalkFill className="text-2xl text-yellow-400" />
                <span className="font-medium">카카오톡</span>
              </motion.button>

              {/* 구분선 */}
              <div className="border-t border-slate-100" />

              {/* URL 복사 버튼 */}
              <motion.button
                onClick={handleCopyUrl}
                className="w-full flex items-center gap-3 px-6 py-4 text-slate-700 hover:bg-slate-50 hover:shadow-sm transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {copied ? (
                  <MdCheck className="text-xl text-green-500" />
                ) : (
                  <MdContentCopy className="text-xl text-slate-500" />
                )}
                <span className="font-medium">
                  {copied ? "복사 완료!" : "링크 복사"}
                </span>
              </motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// 간단한 공유 버튼 (드롭다운 없이)
export const SimpleShareButton = ({
  shareData,
  className = "",
}: ShareButtonsProps) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // 카카오 SDK 초기화
    const initializeSDK = async () => {
      try {
        await initKakaoSDK();
      } catch (error) {
        console.error("Failed to initialize Kakao SDK:", error);
      }
    };

    initializeSDK();
  }, []);

  const handleShare = async () => {
    // 모바일에서는 카카오톡 공유, 데스크톱에서는 URL 복사
    if (window.innerWidth <= 768) {
      shareToKakao(shareData);
    } else {
      const success = await copyToClipboard(shareData.url);
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  return (
    <motion.button
      onClick={handleShare}
      className={`group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:from-yellow-500 hover:to-orange-500 transition-all duration-300 ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {copied ? (
        <MdCheck className="text-lg" />
      ) : (
        <MdShare className="text-lg group-hover:rotate-12 transition-transform duration-300" />
      )}
      <span>{copied ? "복사 완료!" : "공유하기"}</span>
    </motion.button>
  );
};
