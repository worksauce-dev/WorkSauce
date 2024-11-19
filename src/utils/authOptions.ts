import { firestore } from "@/api/firebase/initFirebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import KakaoProvider from "next-auth/providers/kakao";

export const authOptions = {
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID ?? "",
      clientSecret: process.env.KAKAO_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }: any) {
      if (user) {
        const userRef = doc(firestore, "users", user.id);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
          // Create a new user document if it doesn't exist
          await setDoc(userRef, {
            id: user.id ?? "",
            name: user.name ?? "",
            type: "user",
            status: "active",
            isFirstLogin: true,
            isAdmin: false,
          });
        }
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
        session.user.id = token.id;
      }
      return session;
    },
  },
};
