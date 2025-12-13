export const Role = {
  USER: "user",
  PSYCHOLOGIST: "psychologist",
  ADMIN: "admin",
} as const;

export type Role = typeof Role[keyof typeof Role];
