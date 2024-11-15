"use server";

import { TestDBType } from "@/types/test";
import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "./initFirebase";

export async function updateSauceTest(testDB: TestDBType) {
  const testDBRef = doc(firestore, "tests", "saucetest");
  await updateDoc(testDBRef, testDB);
}
