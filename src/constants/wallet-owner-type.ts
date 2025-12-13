export const WalletOwnerType = {
  USER: "user",
  PSYCHOLOGIST: "psychologist",
  PLATFORM: "platform",
} as const;

export type WalletOwnerType =
  typeof WalletOwnerType[keyof typeof WalletOwnerType];
