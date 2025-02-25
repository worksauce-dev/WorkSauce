import { getSauceResult } from "@/api/firebase/getSauceResult";
import SauceResultEditor from "@/components/admin/SauceResultEditor";
import { SauceResultType } from "@/types/saucetest/test";
import { updateSauceResult } from "@/api/firebase/updateSauceResult";

export default async function EditSauceResult() {
  const sauceResult = await getSauceResult();

  return (
    <div className="w-full bg-[#F7F7F9] px-4 sm:px-6 sm:py-6 mx-auto lg:px-8 py-6 flex flex-col h-screen gap-4">
      <SauceResultEditor
        initialData={sauceResult as SauceResultType}
        updateResult={updateSauceResult}
      />
    </div>
  );
}
