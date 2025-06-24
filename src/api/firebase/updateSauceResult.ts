"use server";

import { SauceTestResultDescriptionType } from "@/types/saucetest/test";
import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "./initFirebase";

export async function updateSauceResult(
  resultDB: SauceTestResultDescriptionType
) {
  const resultDBRef = doc(firestore, "tests", "results");
  await updateDoc(resultDBRef, {
    ...resultDB,
  });
}
