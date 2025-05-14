"use server";

import { getDocs } from "firebase/firestore";
import { collection } from "firebase/firestore";
import { firestore } from "../initFirebase";
import { UserTeam } from "@/types/user";
export async function getTeams(dashboardId: string) {
  const teamsRef = collection(firestore, "dashboards", dashboardId, "teams");
  const teamsSnapshot = await getDocs(teamsRef);
  return teamsSnapshot.docs.map(doc => doc.data()) as UserTeam[];
}
