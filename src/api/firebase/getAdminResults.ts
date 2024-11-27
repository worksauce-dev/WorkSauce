import { firestore } from "./initFirebase";
import { collection, getDocs } from "firebase/firestore";

export async function getAdminResults() {
  const resultsRef = collection(firestore, "sauceTestResults");
  const querySnapshot = await getDocs(resultsRef);

  const results: any[] = [];
  querySnapshot.forEach(doc => {
    results.push({
      id: doc.id,
      ...doc.data(),
    });
  });

  return results;
}
