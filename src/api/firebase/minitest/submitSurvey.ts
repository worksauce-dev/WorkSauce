"use server";

import { collection, addDoc } from "firebase/firestore";
import { firestore } from "../initFirebase";
import { SurveyData } from "@/types/surveyData";

export async function submitSurvey(surveyData: SurveyData) {
  try {
    const surveyRef = collection(firestore, "minitest-survey");
    await addDoc(surveyRef, surveyData);
    return { success: true };
  } catch (error) {
    console.error("Error submitting survey:", error);
    throw error;
  }
}
