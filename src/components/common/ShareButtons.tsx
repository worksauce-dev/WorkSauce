"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MdContentCopy, MdCheck } from "react-icons/md";
import { copyToClipboard, ShareData } from "@/utils/shareUtils";

interface ShareButtonProps {
  shareData: ShareData;
  className?: string;
}

// 링크 복사 버튼
export const ShareButton = ({
  shareData,
  className = "",
}: ShareButtonProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    const success = await copyToClipboard(shareData.url);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.button
      onClick={handleCopyLink}
      className={`group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:from-yellow-500 hover:to-orange-500 transition-all duration-300 ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {copied ? (
        <MdCheck className="text-lg" />
      ) : (
        <MdContentCopy className="text-lg group-hover:rotate-12 transition-transform duration-300" />
      )}
      <span>{copied ? "복사 완료!" : "링크 복사"}</span>
    </motion.button>
  );
};
