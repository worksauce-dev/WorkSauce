import { useEffect, useState } from "react";
import { auth } from "@/api/firebase/initFirebase";
import { onAuthStateChanged } from "firebase/auth";

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        // 유저가 로그인 되어 있을 때
        setUser(user);
      } else {
        // 유저가 로그인 되어 있지 않을 때
        setUser(null);
      }
      setLoading(false); // 로딩 상태 종료
    });

    // 컴포넌트가 언마운트될 때 구독 해제
    return () => unsubscribe();
  }, []);

  return { user, loading };
}
