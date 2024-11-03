"use server";

import { firestore } from "@/api/firebase/initFirebase";
import { Group } from "@/types/group";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  arrayUnion,
} from "firebase/firestore";

export async function createGroup(group: Group, userId: string) {
  const groupRef = collection(firestore, "groups");
  const { applicants, ...groupWithoutApplicants } = group;

  try {
    // 처음부터 완성된 데이터로 그룹을 생성합니다
    const groupDoc = await addDoc(groupRef, {
      ...groupWithoutApplicants,
      groupId: null, // 임시 ID
      applicants: applicants.map(applicant => ({
        ...applicant,
        groupId: null, // 임시 ID
      })),
    });

    const groupId = groupDoc.id;

    // 병렬로 업데이트 작업을 수행합니다
    await Promise.all([
      // groupId 업데이트
      updateDoc(groupDoc, {
        groupId,
        applicants: applicants.map(applicant => ({
          ...applicant,
          groupId,
        })),
      }),
      // 사용자 문서 업데이트
      updateDoc(doc(firestore, "users", userId), {
        groups: arrayUnion(groupId),
      }),
    ]);

    return groupId;
  } catch (error) {
    throw error;
  }
}
