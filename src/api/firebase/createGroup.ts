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
    // 그룹을 생성하고 생성된 문서의 참조를 받습니다.
    const groupDoc = await addDoc(groupRef, groupWithoutApplicants);

    // 생성된 그룹의 ID를 이용하여 groupId 필드를 추가하고 applicants를 업데이트합니다.
    const groupId = groupDoc.id;
    const updatedGroup = {
      ...groupWithoutApplicants,
      groupId,
      applicants: applicants.map(applicant => ({
        ...applicant,
        groupId,
      })),
    };

    // 업데이트된 그룹 정보로 그룹 문서를 업데이트합니다.
    await updateDoc(groupDoc, updatedGroup);

    // 각 지원자의 사용자 문서의 groups 배열에 새 그룹 ID를 추가합니다.
    const userDocRef = doc(firestore, "users", userId);
    await updateDoc(userDocRef, {
      groups: arrayUnion(groupId),
    });

    return groupId;
  } catch (error) {
    throw error;
  }
}
