import { ReactElement } from "react";

export const PersonalLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <div className="border">{children}</div>;
};
