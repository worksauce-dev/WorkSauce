"use client";

import WelcomeScreen from "./WelcomeScreen";
import useWelcomeScreenStore from "../stores/useWelcomeScreenStore";
import TeamDashboard from "./TeamDashboard";
import { UserBase } from "@/types/user";
interface DashboardContentProps {
  userBase: UserBase;
}

const DashboardContent = ({ userBase }: DashboardContentProps) => {
  const { isWelcomeScreen } = useWelcomeScreenStore();

  return isWelcomeScreen ? (
    <WelcomeScreen userBase={userBase} />
  ) : (
    <TeamDashboard userBase={userBase} />
  );
};

export default DashboardContent;
