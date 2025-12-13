export const UserTrendsIntervalByAdmin = {
  DAY: "day",
  MONTH: "month",
  YEAR: "year",
} as const;

export type UserTrendsIntervalByAdmin = typeof UserTrendsIntervalByAdmin[keyof typeof UserTrendsIntervalByAdmin];
