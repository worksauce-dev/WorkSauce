"use server";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

/**
 * Firebase Storage에 이미지 파일을 업로드하고 다운로드 URL을 반환합니다.
 * @param file 업로드할 이미지 파일
 * @param path 저장할 경로 (예: 'companies/userId/business-license')
 * @returns 업로드된 이미지의 다운로드 URL
 */
export const uploadImageToStorage = async (
  file: File,
  path: string
): Promise<string> => {
  try {
    const storage = getStorage();
    const storageRef = ref(storage, path);

    // 이미지 파일 업로드
    const snapshot = await uploadBytes(storageRef, file);

    // 업로드된 이미지의 다운로드 URL 가져오기
    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL;
  } catch (error) {
    console.error("이미지 업로드 중 오류 발생:", error);
    throw new Error("이미지 업로드에 실패했습니다.");
  }
};
