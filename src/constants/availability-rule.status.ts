export const AvailabilityRuleStatus = {
  ACTIVE: "active",
  INACTIVE: "inactive",
} as const;

export type AvailabilityRuleStatus =
  typeof AvailabilityRuleStatus[keyof typeof AvailabilityRuleStatus];
