"use server";

import { CategoryData, SauceTest } from "@/types/saucetest/test";
import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "./initFirebase";

export async function updateSauceTest(testDB: SauceTest) {
  const testDBRef = doc(firestore, "tests", "saucetest");
  await updateDoc(testDBRef, testDB);

  // V2용 데이터 생성 - isDeleted가 true인 문항 제거
  const testDBV2 = {
    ...testDB,
    // 각 카테고리의 questions에서 isDeleted가 true인 문항 제거
    ...Object.fromEntries(
      Object.entries(testDB).map(([key, value]) => {
        if (key === "updatedAt" || key === "createdAt") {
          return [key, value];
        }
        const categoryData = value as CategoryData;
        return [
          key,
          {
            ...categoryData,
            // isDeleted가 true인 문항을 제외하고, 나머지 문항에서 isDeleted 속성 제거
            questions: categoryData.questions
              .filter(q => !q.isDeleted)
              .map(({ text, score }) => ({ text, score })),
          },
        ];
      })
    ),
  };

  const testDBV2Ref = doc(firestore, "tests", "saucetestV2");
  await updateDoc(testDBV2Ref, testDBV2);
}
