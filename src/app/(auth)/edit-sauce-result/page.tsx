import { getSauceResult } from "@/api/firebase/getSauceResult";
import SauceResultEditor from "@/components/admin/SauceResultEditor";
import { SauceResultType } from "@/types/test";
import { updateSauceResult } from "@/api/firebase/updateSauceResult";

export default async function EditSauceResult() {
  const sauceResult = await getSauceResult();

  return (
    <div className="w-full h-screen flex flex-col lg:flex-row ">
      <SauceResultEditor
        initialData={sauceResult as SauceResultType}
        updateResult={updateSauceResult}
      />
    </div>
  );
}
