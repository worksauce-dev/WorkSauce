"use server";

import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { firestore } from "./initFirebase";
import { ScoreType } from "@/types/test";

export async function submitTest(
  groupId: string,
  email: string,
  name: string,
  testResult: ScoreType[]
) {
  const groupRef = doc(firestore, "groups", groupId);

  try {
    const groupDoc = await getDoc(groupRef);

    if (!groupDoc.exists()) {
      throw new Error("Group not found");
    }

    const groupData = groupDoc.data();
    const applicants = groupData.applicants || [];

    const applicantIndex = applicants.findIndex(
      (applicant: any) => applicant.email === email && applicant.name === name
    );

    if (applicantIndex === -1) {
      throw new Error("Applicant not found");
    }

    const updatedApplicants = applicants.map(
      (applicant: any, index: number) => {
        if (index === applicantIndex) {
          return {
            ...applicant,
            testResult,
            testStatus: "completed",
            completedAt: new Date().toISOString(),
          };
        }
        return applicant;
      }
    );

    // Update the entire applicants array
    await updateDoc(groupRef, {
      applicants: updatedApplicants,
    });

    // Create unique document ID using name and email
    const documentId = `${name}-${email.replace("@", "-at-")}`;
    const testResultRef = doc(firestore, "sauceTestResults", documentId);
    await setDoc(testResultRef, {
      email,
      name,
      testResult,
      groupId,
      completedAt: new Date().toISOString(),
    });

    console.log("Test result submitted successfully");

    return updatedApplicants[applicantIndex];
  } catch (error) {
    console.error("Error submitting test result:", error);
    throw error;
  }
}
