"use client";

import { useEffect } from "react";
import { ErrorPage } from "@/components/common/ErrorPage";

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorPage
      title="문제가 발생했습니다"
      message="페이지를 불러오는 중에 오류가 발생했습니다. 다시 시도해 주세요."
      showHomeButton={true}
    />
  );
}
