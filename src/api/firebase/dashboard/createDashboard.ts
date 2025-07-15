"use server";

import { DashboardInterface } from "@/types/dashboard";
import { firestore } from "../initFirebase";
import {
  collection,
  addDoc,
  setDoc,
  doc,
  updateDoc,
  getDocs,
  runTransaction,
} from "firebase/firestore";

export async function createDashboard(
  userId: string,
  userName: string,
  userEmail: string
) {
  try {
    // 1. 현재 날짜 및 시간
    const createdAt = new Date().toISOString();

    // 2. 기존 초대 요청 상태 업데이트
    const dashboardsRef = collection(firestore, "dashboards");
    const allDashboards = await getDocs(dashboardsRef);

    // 조건에 맞는 문서 찾기
    const dashboardsWithPendingRequests = allDashboards.docs.filter(
      dashboardDoc => {
        const dashboardData = dashboardDoc.data();
        const notifications = dashboardData.notifications || [];
        return notifications.some(
          (notification: any) =>
            notification.userId === userId &&
            notification.type === "invite" &&
            notification.status === "pending"
        );
      }
    );

    // 조건에 맞는 문서가 있으면 트랜잭션 실행
    if (dashboardsWithPendingRequests.length > 0) {
      await runTransaction(firestore, async transaction => {
        dashboardsWithPendingRequests.forEach(dashboardDoc => {
          const dashboardData = dashboardDoc.data();
          const notifications = dashboardData.notifications || [];

          const updatedNotifications = notifications.map(
            (notification: any) => {
              if (
                notification.userId === userId &&
                notification.type === "invite" &&
                notification.status === "pending"
              ) {
                return {
                  ...notification,
                  status: "rejected",
                  completedAt: createdAt,
                };
              }
              return notification;
            }
          );

          transaction.update(dashboardDoc.ref, {
            notifications: updatedNotifications,
          });
        });
      });
    }

    // 3. 대시보드 객체 생성
    const dashboardData: DashboardInterface = {
      dashboardId: "",
      ownerId: userId,
      createdAt,
      notifications: [],
      invitations: [],
      members: [
        {
          id: userId,
          name: userName,
          email: userEmail,
          joinedAt: createdAt,
        },
      ],
      isVerified: "notRequested",
      organization: {
        companyInfo: {
          businessNumber: "",
          representativeName: "",
          companyName: "",
          businessType: "",
          companyAddress: "",
        },
        managerInfo: {
          position: "",
          department: "",
          workEmail: "",
          workPhone: "",
        },
        additionalInfo: {
          companyWebsite: "",
          companySize: "",
          establishedYear: "",
          serviceUsage: "",
          recruitmentField: "",
          annualRecruitmentPlan: "",
          serviceUtilizationPlan: "",
        },
        files: {
          businessLicenseUrl: null,
          employmentCertificateUrl: null,
        },
        status: "notRequested",
        updatedAt: createdAt,
        createdAt,
        dashboardId: "",
      },
      userTeam: [],
    };

    // 4. 대시보드 문서 생성
    const newDashboardDoc = await addDoc(dashboardsRef, dashboardData);
    const dashboardId = newDashboardDoc.id;

    // 5. 대시보드 ID 업데이트
    await setDoc(doc(firestore, "dashboards", dashboardId), {
      ...dashboardData,
      dashboardId,
    });

    // 6. 유저 문서 업데이트
    const userRef = doc(firestore, "users", userId);
    await updateDoc(userRef, {
      dashboardId,
    });

    return dashboardId;
  } catch (error) {
    console.error("대시보드 생성 중 오류 발생:", error);
    throw error;
  }
}
