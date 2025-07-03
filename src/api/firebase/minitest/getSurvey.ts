"use server";

import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../initFirebase";
import { SurveyData } from "@/types/surveyData";

export async function getSurvey() {
  try {
    const surveyRef = collection(firestore, "minitest-survey");
    const snapshot = await getDocs(surveyRef);
    return snapshot.docs.map(doc => doc.data()) as SurveyData[];
  } catch (error) {
    console.error("Error getting survey:", error);
    throw error;
  }
}
