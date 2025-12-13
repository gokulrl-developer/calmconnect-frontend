export const SessionTrendsByAdminInterval = {
  DAY: "day",
  MONTH: "month",
  YEAR: "year",
} as const;

export type SessionTrendsByAdminInterval = typeof SessionTrendsByAdminInterval[keyof typeof SessionTrendsByAdminInterval];
