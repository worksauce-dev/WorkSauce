import { Header } from "@/components/landing/header/Header";
import { TestContainer } from "@/components/test/TestContainer";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "워크소스 - Sauce Test",
};

export default function TestPage() {
  return (
    <>
      <Header />
      <TestContainer />
    </>
  );
}
