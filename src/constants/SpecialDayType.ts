export const SpecialDayType = {
  OVERRIDE: "override",
  ABSENT: "absent",
} as const;

export type SpecialDayType = typeof SpecialDayType[keyof typeof SpecialDayType];
