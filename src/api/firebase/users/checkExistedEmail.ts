"use server";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../initFirebase";

export async function checkExistedEmail(email: string) {
  const usersRef = collection(firestore, "users");
  const snapshot = await getDocs(query(usersRef, where("email", "==", email)));
  return !snapshot.empty;
}
