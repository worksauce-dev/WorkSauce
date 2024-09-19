import { Header } from "@/components/landing/header/Header";
import { TestContainer } from "@/components/test/TestContainer";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "소스테스트",
};

export default function TestPage() {
  return (
    <>
      <TestContainer />
    </>
  );
}
