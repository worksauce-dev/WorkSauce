import { firestore } from "../initFirebase";
import { doc, getDoc } from "firebase/firestore";
import { DashboardInterface } from "@/types/dashboard";

export async function getDashboardData(dashboardId: string) {
  const dashboardRef = doc(firestore, "dashboards", dashboardId);
  const dashboardDoc = await getDoc(dashboardRef);
  return dashboardDoc.data() as DashboardInterface;
}
