export const SpecialDayStatus = {
  ACTIVE: "active",
  INACTIVE: "inactive",
} as const;

export type SpecialDayStatus = typeof SpecialDayStatus[keyof typeof SpecialDayStatus];
