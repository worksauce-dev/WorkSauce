import { ErrorPage } from "@/components/common/ErrorPage";
import { AppError } from "@/types/error";

export function handleAppError(error: AppError) {
  return (
    <ErrorPage
      title={error.title}
      message={error.message}
      showHomeButton={error.showHomeButton}
    />
  );
}
