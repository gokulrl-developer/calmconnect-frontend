export const UserStatus = {
  ACTIVE: "active",
  INACTIVE: "inactive",
} as const;

export type UserStatus = typeof UserStatus[keyof typeof UserStatus];
