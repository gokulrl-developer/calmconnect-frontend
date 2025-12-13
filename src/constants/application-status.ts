export const ApplicationStatus = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
} as const;

export type ApplicationStatus =
  typeof ApplicationStatus[keyof typeof ApplicationStatus];
