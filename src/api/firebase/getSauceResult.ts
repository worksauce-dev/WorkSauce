import { getDoc } from "firebase/firestore";
import { doc } from "firebase/firestore";
import { firestore } from "./initFirebase";
import { SauceTestResultDescriptionType } from "@/types/saucetest/test";

export async function getSauceResult() {
  const docRef = doc(firestore, "tests", "results");
  const docSnap = await getDoc(docRef);

  return docSnap.data() as SauceTestResultDescriptionType;
}
