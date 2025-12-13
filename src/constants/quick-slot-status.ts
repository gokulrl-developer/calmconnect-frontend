export const QuickSlotStatus = {
  ACTIVE: "active",
  INACTIVE: "inactive",
} as const;

export type QuickSlotStatus = typeof QuickSlotStatus[keyof typeof QuickSlotStatus];
