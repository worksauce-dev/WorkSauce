"use server";

import { firestore } from "@/api/firebase/initFirebase";
import { doc, getDoc } from "firebase/firestore";

export async function getTestDB(testName: string) {
  const testRef = doc(firestore, "tests", testName);
  const testDoc = await getDoc(testRef);

  if (testDoc.exists()) {
    return testDoc.data();
  } else {
    return null;
  }
}
