"use server";

import { firestore } from "@/api/firebase/initFirebase";
import { SauceTestV2 } from "@/types/saucetestV2Type";
import { SugarTest } from "@/types/sugartest/test";
import { doc, getDoc } from "firebase/firestore";

export async function getTestDB(testName: string) {
  const testRef = doc(firestore, "tests", testName);
  const testDoc = await getDoc(testRef);

  if (testDoc.exists()) {
    return testDoc.data() as SauceTestV2 | SugarTest;
  } else {
    return null;
  }
}
