import { firestore } from "@/api/firebase/initFirebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import KakaoProvider from "next-auth/providers/kakao";
import CredentialsProvider from "next-auth/providers/credentials";
import { loginUser } from "@/api/firebase/users/loginUser";
import { UserBase } from "@/types/user";

export async function createOrUpdateUser({
  id,
  name,
  provider,
}: {
  id: string;
  name?: string;
  provider?: string;
}) {
  const userRef = doc(firestore, "users", id);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    const data: UserBase = {
      id,
      email: "",
      name: name ?? "",
      userType: "individual",
      status: "active",
      isAdmin: false,
      plan: "free",
      provider: provider ?? "kakao",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      agreeTerms: true,
      dashboardId: "",
      members: [],
    };

    await setDoc(userRef, data);
  } else {
    // 로그인 시 lastLoginAt 업데이트
    await updateDoc(userRef, {
      lastLoginAt: new Date().toISOString(),
    });
  }
}

export const authOptions = {
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID ?? "",
      clientSecret: process.env.KAKAO_CLIENT_SECRET ?? "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.email || !credentials.password) {
          throw new Error("이메일과 비밀번호를 입력해주세요.");
        }

        try {
          const loginResult = await loginUser(
            credentials.email,
            credentials.password
          );

          if (loginResult.success) {
            return {
              id: loginResult.id || "",
              email: loginResult.email || "",
              name: loginResult.name || "",
              accessToken: loginResult.accessToken || "",
              refreshToken: loginResult.refreshToken || "",
            };
          }

          // loginResult.success가 false인 경우 에러 메시지 전달
          throw new Error(loginResult.message || "로그인에 실패했습니다.");
        } catch (error) {
          if (process.env.NODE_ENV === "development") {
            console.error("Login error:", error);
          }
          // Error 객체인 경우 해당 메시지 사용, 아닌 경우 기본 메시지 사용
          throw new Error(
            error instanceof Error ? error.message : "인증에 실패했습니다."
          );
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account }: any) {
      if (user) {
        // firestore 관련 로직을 별도 함수로 분리
        await createOrUpdateUser({
          id: user.id,
          name: user.name,
          provider: account?.provider,
        });
      }

      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }: any) {
      if (token) {
        session.user.accessToken = token.accessToken;
        session.user.refreshToken = token.refreshToken;
        session.user.id = token.id;
      }
      return session;
    },
  },
};
