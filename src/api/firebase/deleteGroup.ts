"use server";

import {
  doc,
  deleteDoc,
  getDoc,
  updateDoc,
  arrayRemove,
} from "firebase/firestore";
import { firestore } from "./initFirebase";

export async function deleteGroup(groupId: string) {
  // 그룹 문서 참조
  const groupRef = doc(firestore, "groups", groupId);

  // 그룹 데이터를 가져와서 멤버들의 ID 확인
  const groupSnap = await getDoc(groupRef);
  if (groupSnap.exists()) {
    const groupData = groupSnap.data();
    const creatorId = groupData.createdBy.id;

    const userRef = doc(firestore, "users", creatorId);
    await updateDoc(userRef, {
      groups: arrayRemove(groupId),
    });
  }

  // 그룹 문서 삭제
  await deleteDoc(groupRef);
}
