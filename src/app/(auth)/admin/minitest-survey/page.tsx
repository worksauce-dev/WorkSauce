import { getSurvey } from "@/api/firebase/minitest/getSurvey";
import { MinitestSurvey } from "@/components/admin/MinitestSurvey";

const AdminMinitestSurveyPage = async () => {
  const survey = await getSurvey();

  return <MinitestSurvey survey={survey} />;
};

export default AdminMinitestSurveyPage;
