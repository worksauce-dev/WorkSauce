import { TestDBType } from "@/types/test";

import TestDBEditor from "@/components/admin/TestDBEditor";
import { updateSauceTest } from "@/api/firebase/updateSauceTest";
import { getTestDB } from "@/api/firebase/getTestDB";

export default async function EditSauceTest() {
  const testDB = await getTestDB("saucetest");

  return (
    <div className="w-full h-screen flex flex-col lg:flex-row bg-[#F7F7F9] ">
      <TestDBEditor
        initialData={testDB as TestDBType}
        updateTestDB={updateSauceTest}
      />
    </div>
  );
}
