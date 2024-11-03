import { Applicant } from "@/types/group";

export function getApplicantType(testResult: Applicant["testResult"]) {
  if (!testResult || testResult.length === 0) {
    return { main: null, sub: null };
  }

  const sortedResults = [...testResult].sort((a, b) => b.score - a.score);

  return {
    main: sortedResults[0]?.sort || null,
    sub: sortedResults[1]?.sort || null,
  };
}
