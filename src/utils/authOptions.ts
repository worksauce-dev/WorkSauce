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
    async jwt({ token, user }: any) {
      if (user) {
        const userRef = doc(firestore, "users", user.id);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
          // Create a new user document if it doesn't exist
          await setDoc(userRef, {
            id: user.id ?? "",
            name: user.name ?? "",
            email: user.email ?? "",
            image: user.image ?? "",
            provider: "kakao",
            createdAt: new Date(),
            updatedAt: new Date(),
            lastLoginAt: new Date(),
            type: "user",
            status: "active",
            isFirstLogin: true,
            isAdmin: false,
          });
        }
      }

      return { ...token, ...user };
    },

    async session({ session, token }: any) {
      session.user = token as any;
      return session;
    },
  },
};
