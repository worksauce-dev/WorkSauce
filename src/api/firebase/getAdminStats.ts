import { firestore } from "./initFirebase";
import {
  collection,
  query,
  getDocs,
  where,
  Timestamp,
  doc,
  getDoc,
} from "firebase/firestore";

interface DashboardStats {
  totalUsers: number;
  last30DaysNewUsers: number;
  paidSubscribers: number;
  recentTestUpdates: string;
  recentResultUpdates: string;
}

export async function getAdminStats(): Promise<DashboardStats> {
  // 전체 사용자 수 조회
  const usersSnapshot = await getDocs(collection(firestore, "users"));
  const totalUsers = usersSnapshot.size;

  // 최근 30일 신규 가입자 수 조회
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const thirtyDaysAgoString = thirtyDaysAgo.toISOString();

  const newUsersQuery = query(
    collection(firestore, "users"),
    where("createdAt", ">=", thirtyDaysAgoString)
  );
  const newUsersSnapshot = await getDocs(newUsersQuery);
  const last30DaysNewUsers = newUsersSnapshot.size;

  // 유료 구독자 수 조회
  const paidSubscribersQuery = query(
    collection(firestore, "users"),
    where("plan", "==", "premium")
  );
  const paidSubscribersSnapshot = await getDocs(paidSubscribersQuery);
  const paidSubscribers = paidSubscribersSnapshot.size;

  // saucetest 문서의 업데이트 정보 조회
  const saucetestDoc = await getDoc(doc(firestore, "tests", "saucetest"));
  const saucetestData = saucetestDoc.data();
  const recentTestUpdates = saucetestData?.updatedAt;

  const saucetestResultDoc = await getDoc(doc(firestore, "tests", "results"));
  const saucetestResultData = saucetestResultDoc.data();
  const recentResultUpdates = saucetestResultData?.updatedAt;

  return {
    totalUsers,
    last30DaysNewUsers,
    paidSubscribers,
    recentTestUpdates,
    recentResultUpdates,
  };
}
