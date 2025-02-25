"use server";

import { TestData } from "@/types/saucetest/sauceTestResult";
import { firestore } from "./initFirebase";
import { doc, updateDoc } from "firebase/firestore";
import { SugarTest } from "@/types/sugartest/test";
const saveResult = async (
  mainType:
    | "예술융합형"
    | "예술느낌형"
    | "이해관리형"
    | "이해연구형"
    | "소통도움형"
    | "소통조화형"
    | "기준윤리형"
    | "기준심미형"
    | "도전확장형"
    | "도전목표형",
  subType:
    | "예술융합형"
    | "예술느낌형"
    | "이해관리형"
    | "이해연구형"
    | "소통도움형"
    | "소통조화형"
    | "기준윤리형"
    | "기준심미형"
    | "도전확장형"
    | "도전목표형",
  testData: TestData
) => {
  try {
    const testRef = doc(firestore, "tests", "results");

    await updateDoc(testRef, {
      [`${mainType}.${subType}`]: testData,
      updatedAt: new Date().toISOString(),
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating test result:", error);
    return { success: false, error };
  }
};

const saveSugartest = async (testData: SugarTest) => {
  try {
    const testRef = doc(firestore, "tests", "sugartest");

    await updateDoc(testRef, {
      ...testData,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating test result:", error);
    return { success: false, error };
  }
};

export { saveResult, saveSugartest };
