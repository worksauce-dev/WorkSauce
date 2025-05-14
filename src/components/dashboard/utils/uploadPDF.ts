import { upload } from "@vercel/blob/client";

export const uploadPDF = async (
  file: File,
  dashboardId: string
): Promise<{ result: string; success: boolean }> => {
  try {
    // 파일명에 타임스탬프 추가
    const timestamp = new Date().getTime();
    const fileName = `${timestamp}-${file.name}`;

    // 파일 업로드 - handleUploadUrl을 올바르게 설정
    const { url } = await upload(fileName, file, {
      access: "public",
      handleUploadUrl: `/api/blob?filename=${encodeURIComponent(
        fileName
      )}&dashboardId=${encodeURIComponent(dashboardId)}`,
      // 클라이언트 토큰을 가져올 API 엔드포인트 지정
      clientPayload: dashboardId, // 필요한 경우 추가 데이터 전달
    });

    return { result: url, success: true };
  } catch (error) {
    console.error("파일 업로드 중 오류 발생:", error);
    return { result: "", success: false };
  }
};
