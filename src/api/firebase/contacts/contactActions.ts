"use server";

import { firestore } from "@/api/firebase/initFirebase";
import {
  collection,
  doc,
  addDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { CreateContactDto, UpdateContactDto } from "@/types/contacts";

// 연락처 생성
export const createContact = async (
  userId: string,
  contactData: CreateContactDto
) => {
  try {
    const contactsRef = collection(firestore, `users/${userId}/contacts`);
    const newContact = await addDoc(contactsRef, {
      ...contactData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return { id: newContact.id };
  } catch (error) {
    console.error("Error creating contact:", error);
    throw error;
  }
};

// 연락처 수정
export const updateContact = async (
  userId: string,
  { id, ...updateData }: UpdateContactDto
) => {
  try {
    const contactRef = doc(firestore, `users/${userId}/contacts/${id}`);
    await updateDoc(contactRef, {
      ...updateData,
      updatedAt: new Date().toISOString(),
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating contact:", error);
    throw error;
  }
};

// 연락처 삭제
export const deleteContact = async (userId: string, contactId: string) => {
  try {
    const contactRef = doc(firestore, `users/${userId}/contacts/${contactId}`);
    await deleteDoc(contactRef);

    return { success: true };
  } catch (error) {
    console.error("Error deleting contact:", error);
    throw error;
  }
};

// 연락처 그룹 이동
export const moveContactToGroup = async (
  userId: string,
  contactId: string,
  groupId: string | null
) => {
  try {
    const contactRef = doc(firestore, `users/${userId}/contacts/${contactId}`);
    await updateDoc(contactRef, {
      groupId,
      updatedAt: new Date().toISOString(),
    });

    return { success: true };
  } catch (error) {
    console.error("Error moving contact to group:", error);
    throw error;
  }
};
