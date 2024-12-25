"use server";

import { firestore } from "@/api/firebase/initFirebase";
import {
  collection,
  doc,
  addDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { CreateGroupDto, UpdateGroupDto } from "@/types/contacts";

// 그룹 생성
export const createGroup = async (
  userId: string,
  groupData: CreateGroupDto
) => {
  try {
    const groupsRef = collection(firestore, `users/${userId}/groups`);
    const newGroup = await addDoc(groupsRef, {
      ...groupData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return { id: newGroup.id };
  } catch (error) {
    console.error("Error creating group:", error);
    throw error;
  }
};

// 그룹 수정
export const updateGroup = async (
  userId: string,
  { id, ...updateData }: UpdateGroupDto
) => {
  try {
    const groupRef = doc(firestore, `users/${userId}/groups/${id}`);
    await updateDoc(groupRef, {
      ...updateData,
      updatedAt: new Date().toISOString(),
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating group:", error);
    throw error;
  }
};

// 그룹 삭제
export const deleteGroup = async (userId: string, groupId: string) => {
  try {
    const groupRef = doc(firestore, `users/${userId}/groups/${groupId}`);
    await deleteDoc(groupRef);

    return { success: true };
  } catch (error) {
    console.error("Error deleting group:", error);
    throw error;
  }
};
