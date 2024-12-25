"use server";

import { Contact } from "@/types/contacts";
import { firestore } from "@/api/firebase/initFirebase";
import {
  collection,
  getDocs,
  query,
  where,
  CollectionReference,
  Query,
  DocumentData,
} from "firebase/firestore";

// 특정 유저의 연락처 목록 가져오기 (옵션: 그룹별 필터링)
export const getContacts = async (userId: string, groupId?: string) => {
  try {
    const contactsRef = collection(firestore, `users/${userId}/contacts`);
    let contactsQuery: Query<DocumentData> | CollectionReference<DocumentData> =
      contactsRef;

    // 그룹 ID가 제공된 경우 해당 그룹의 연락처만 필터링
    if (groupId) {
      contactsQuery = query(contactsRef, where("groupId", "==", groupId));
    }

    const contactsSnapshot = await getDocs(contactsQuery);

    const contacts: Contact[] = [];
    contactsSnapshot.forEach(doc => {
      contacts.push({
        id: doc.id,
        ...doc.data(),
      } as Contact);
    });

    return { contacts, total: contacts.length };
  } catch (error) {
    console.error("Error fetching contacts:", error);
    throw error;
  }
};
