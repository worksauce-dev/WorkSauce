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
  newUsersThisMonth: number;
  paidSubscribers: number;
  recentUpdates: string;
}

export async function getAdminStats(): Promise<DashboardStats> {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // 전체 사용자 수 조회
  const usersSnapshot = await getDocs(collection(firestore, "users"));
  const totalUsers = usersSnapshot.size;

  // 이번 달 신규 가입자 수 조회
  const newUsersQuery = query(
    collection(firestore, "users"),
    where("createdAt", ">=", Timestamp.fromDate(firstDayOfMonth))
  );
  const newUsersSnapshot = await getDocs(newUsersQuery);
  const newUsersThisMonth = newUsersSnapshot.size;

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

  const recentUpdates = saucetestData?.updatedAt;

  return {
    totalUsers,
    newUsersThisMonth,
    paidSubscribers,
    recentUpdates,
  };
}
