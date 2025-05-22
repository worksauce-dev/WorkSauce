"use client";

import WelcomeScreen from "./WelcomeScreen";
import { TestInfo, UserBase, UserTeam } from "@/types/user";
interface DashboardContentProps {
  userBase: UserBase;
  fetchTeams: UserTeam[];
  fetchTests: TestInfo[];
}

const DashboardContent = ({ userBase }: DashboardContentProps) => {
  return <WelcomeScreen userBase={userBase} />;
};

export default DashboardContent;
