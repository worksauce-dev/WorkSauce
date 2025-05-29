"use server";

import { Organization } from "@/types/dashboard";
import { firestore } from "../initFirebase";
import { collection, getDocs } from "firebase/firestore";

export async function getVerifyingQueue() {
  const verifyingQueueRef = collection(firestore, "verifyingCompany");
  const verifyingQueueSnapshot = await getDocs(verifyingQueueRef);

  if (verifyingQueueSnapshot.empty) {
    return [];
  }

  return verifyingQueueSnapshot.docs.map(doc => doc.data()) as Organization[];
}
