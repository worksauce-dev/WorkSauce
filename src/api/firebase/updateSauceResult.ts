"use server";

import { SauceResultType } from "@/types/test";
import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "./initFirebase";

export async function updateSauceResult(resultDB: SauceResultType) {
  const resultDBRef = doc(firestore, "tests", "results");
  await updateDoc(resultDBRef, resultDB);
}
