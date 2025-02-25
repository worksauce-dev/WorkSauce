"use server";

import { SauceTest } from "@/types/saucetest/test";
import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "./initFirebase";

export async function updateSauceTest(testDB: SauceTest) {
  const testDBRef = doc(firestore, "tests", "saucetest");
  await updateDoc(testDBRef, testDB);
}
