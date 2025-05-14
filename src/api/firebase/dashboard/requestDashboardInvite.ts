"use server";

import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "../initFirebase";
import { CollaboratorNotification } from "@/types/dashboard";

interface RequestResponse {
  success: boolean;
  dashboardId?: string;
  message?: string;
}

export async function requestDashboardInvite(
  senderEmail: string,
  recipientEmail: string,
  senderUserId: string,
  userName: string
): Promise<RequestResponse> {
  try {
    // 1. Find user by email
    const usersRef = collection(firestore, "users");
    const userQuery = query(usersRef, where("email", "==", recipientEmail));
    const userSnapshot = await getDocs(userQuery);

    if (userSnapshot.empty) {
      return {
        success: false,
        message: "해당 이메일을 가진 사용자를 찾을 수 없습니다.",
      };
    }

    const userId = userSnapshot.docs[0].id;

    // 2. Find dashboard where user is owner
    const dashboardsRef = collection(firestore, "dashboards");
    const dashboardQuery = query(dashboardsRef, where("ownerId", "==", userId));
    const dashboardSnapshot = await getDocs(dashboardQuery);

    if (dashboardSnapshot.empty) {
      return {
        success: false,
        message: "해당 사용자의 대시보드를 찾을 수 없습니다.",
      };
    }

    // 3. Update inviteRequests array
    const dashboardDoc = dashboardSnapshot.docs[0];
    const dashboardId = dashboardDoc.id;
    const currentData = dashboardDoc.data();

    const notifications = currentData.notifications || [];

    const inviteRequest: CollaboratorNotification = {
      name: userName,
      email: senderEmail,
      userId: senderUserId,
      type: "invite",
      status: "pending",
      createdAt: new Date().toISOString(),
      completedAt: "",
    };

    if (!notifications.includes(senderEmail)) {
      await updateDoc(dashboardDoc.ref, {
        notifications: [...notifications, inviteRequest],
      });
    }

    return {
      success: true,
      dashboardId,
    };
  } catch (error) {
    console.error("Error in requestDashboardInvite:", error);
    return {
      success: false,
      message: "초대 요청 처리 중 오류가 발생했습니다.",
    };
  }
}
