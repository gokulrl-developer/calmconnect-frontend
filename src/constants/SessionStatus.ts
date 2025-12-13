export const SessionStatus = {
  SCHEDULED: "scheduled",
  CANCELLED: "cancelled",
  ENDED: "ended",
  PENDING: "pending",
} as const;

export type SessionStatus = typeof SessionStatus[keyof typeof SessionStatus];
