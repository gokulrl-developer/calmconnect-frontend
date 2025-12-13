export const FetchPsychTrendsByAdminInterval = {
  DAY: "day",
  MONTH: "month",
  YEAR: "year",
} as const;

export type FetchPsychTrendsByAdminInterval =
  typeof FetchPsychTrendsByAdminInterval[keyof typeof FetchPsychTrendsByAdminInterval];
