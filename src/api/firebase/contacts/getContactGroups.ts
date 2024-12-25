"use server";

import { firestore } from "@/api/firebase/initFirebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Contact, ContactGroup } from "@/types/contacts";

// 특정 유저의 모든 그룹 가져오기
export const getContactGroups = async (userId: string) => {
  try {
    const groupsRef = collection(firestore, `users/${userId}/groups`);
    const groupsSnapshot = await getDocs(groupsRef);

    const groups: ContactGroup[] = [];
    groupsSnapshot.forEach(doc => {
      groups.push({
        id: doc.id,
        ...doc.data(),
      } as ContactGroup);
    });

    return { groups, total: groups.length };
  } catch (error) {
    console.error("Error fetching contact groups:", error);
    throw error;
  }
};
