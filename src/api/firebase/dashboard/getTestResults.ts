"use server";

import { getDocs } from "firebase/firestore";
import { collection } from "firebase/firestore";
import { firestore } from "../initFirebase";
import { TestInfo } from "@/types/user";

export async function getTestResults(dashboardId: string) {
  const testsRef = collection(
    firestore,
    "dashboards",
    dashboardId,
    "testResults"
  );
  const testsSnapshot = await getDocs(testsRef);
  return testsSnapshot.docs.map(doc => doc.data()) as TestInfo[];
}
