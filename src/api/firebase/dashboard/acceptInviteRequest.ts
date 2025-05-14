"use server";

import { firestore } from "../initFirebase";
import {
  doc,
  arrayUnion,
  runTransaction,
  query,
  where,
  getDocs,
  collection,
} from "firebase/firestore";
import { CollaboratorNotification, DashboardMember } from "@/types/dashboard";

interface AcceptInviteResponse {
  success: boolean;
  message?: string;
}

export async function acceptInviteRequest(
  dashboardId: string
): Promise<AcceptInviteResponse> {
  try {
    const dashboardRef = doc(firestore, "dashboards", dashboardId);

    return await runTransaction(firestore, async transaction => {
      // 1. Get dashboard data
      const dashboardDoc = await transaction.get(dashboardRef);

      if (!dashboardDoc.exists()) {
        return {
          success: false,
          message: "대시보드를 찾을 수 없습니다.",
        };
      }

      const dashboardData = dashboardDoc.data();
      const notifications = dashboardData.notifications || [];
      const members = dashboardData.members || [];

      // 2. Find the pending invite request
      const inviteRequestIndex = notifications.findIndex(
        (notification: CollaboratorNotification) =>
          notification.type === "invite" && notification.status === "pending"
      );

      if (inviteRequestIndex === -1) {
        return {
          success: false,
          message: "초대 요청을 찾을 수 없습니다.",
        };
      }

      const inviteRequest = notifications[inviteRequestIndex];
      const userId = inviteRequest.userId;

      // 3. Get user data
      const userRef = doc(firestore, "users", userId);
      const userDoc = await transaction.get(userRef);

      if (!userDoc.exists()) {
        return {
          success: false,
          message: "유저를 찾을 수 없습니다.",
        };
      }

      const userData = userDoc.data();

      // 4. Find requester's user document
      const usersRef = collection(firestore, "users");
      const requesterQuery = query(
        usersRef,
        where("email", "==", inviteRequest.email)
      );
      const requesterSnapshot = await getDocs(requesterQuery);

      if (requesterSnapshot.empty) {
        return {
          success: false,
          message: "초대 요청자를 찾을 수 없습니다.",
        };
      }

      const requesterDoc = requesterSnapshot.docs[0];
      const requesterRef = doc(firestore, "users", requesterDoc.id);

      // 5. Create member data
      const newMember: DashboardMember = {
        id: userId,
        name: userData.name,
        email: userData.email,
        joinedAt: new Date().toISOString(),
      };

      // 6. Update notification status
      const updatedNotifications = [...notifications];
      updatedNotifications[inviteRequestIndex] = {
        ...updatedNotifications[inviteRequestIndex],
        status: "accepted",
        completedAt: new Date().toISOString(),
      };

      // 7. Update dashboard
      transaction.update(dashboardRef, {
        members: arrayUnion(newMember),
        notifications: updatedNotifications,
      });

      // 8. Update user's dashboardId
      transaction.update(userRef, {
        dashboardId: dashboardId,
      });

      // 9. Update requester's dashboardId
      transaction.update(requesterRef, {
        dashboardId: dashboardId,
      });

      console.log("Invite request accepted");

      return {
        success: true,
      };
    });
  } catch (error) {
    console.error("Error accepting invite request:", error);
    return {
      success: false,
      message: "초대 요청 수락 중 오류가 발생했습니다.",
    };
  }
}
