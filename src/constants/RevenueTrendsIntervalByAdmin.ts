export const RevenueTrendsIntervalByAdmin = {
  DAY: "day",
  MONTH: "month",
  YEAR: "year",
} as const;

export type RevenueTrendsIntervalByAdmin = 
  typeof RevenueTrendsIntervalByAdmin[keyof typeof RevenueTrendsIntervalByAdmin];
