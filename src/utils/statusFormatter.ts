import { AssessmentStatus } from "@services/AssessmentService";

export const formatStatus = (status: AssessmentStatus | null): string => {
  if (!status) return "All Statuses";
  return status
    .toLowerCase()
    .split("_")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
};
