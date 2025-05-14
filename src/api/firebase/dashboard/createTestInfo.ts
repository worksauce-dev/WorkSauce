"use server";

import {
  getDocs,
  collection,
  updateDoc,
  doc,
  arrayUnion,
} from "firebase/firestore";
import { firestore } from "@/api/firebase/initFirebase";
import { TestInfo } from "@/types/user";

export async function createTestInfo(
  dashboardId: string,
  teamId: string,
  testInfo: TestInfo
) {
  try {
    const teamsRef = collection(firestore, "dashboards", dashboardId, "teams");
    const teamsSnapshot = await getDocs(teamsRef);

    if (teamsSnapshot.empty) {
      throw new Error("teams not found");
    }

    const team = teamsSnapshot.docs.find(doc => doc.id === teamId);

    if (!team) {
      throw new Error("team not found");
    }

    const teamRef = doc(firestore, "dashboards", dashboardId, "teams", teamId);
    await updateDoc(teamRef, {
      testIds: arrayUnion(testInfo.testId),
    });

    return testInfo;
  } catch (error) {
    console.error("Error creating test info:", error);
    throw error;
  }
}
