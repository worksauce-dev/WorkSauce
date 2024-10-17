"use server";

import { firestore } from "@/api/firebase/initFirebase";
import { doc, getDoc } from "firebase/firestore";

export async function getGroup(groupId: string) {
  const groupRef = doc(firestore, "groups", groupId);
  const groupDoc = await getDoc(groupRef);

  if (groupDoc.exists()) {
    return groupDoc.data();
  } else {
    return null;
  }
}
