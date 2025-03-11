import { JoinContainer } from "@/components/join/JoinContainer";
import { Metadata } from "next";
import { createUser } from "@/api/firebase/users/createUser";

export const metadata: Metadata = {
  title: "회원가입",
};

export default function JoinPage() {
  return <JoinContainer createUser={createUser} />;
}
