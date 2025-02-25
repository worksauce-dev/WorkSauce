import { SauceTest } from "@/types/saucetest/test";

import TestDBEditor from "@/components/admin/TestDBEditor";
import { updateSauceTest } from "@/api/firebase/updateSauceTest";
import { getTestDB } from "@/api/firebase/getTestDB";

export default async function EditSauceTest() {
  const testDB = await getTestDB("saucetest");

  return (
    <div className="w-full h-screen flex flex-col lg:flex-row  ">
      <TestDBEditor
        initialData={testDB as SauceTest}
        updateTestDB={updateSauceTest}
      />
    </div>
  );
}
