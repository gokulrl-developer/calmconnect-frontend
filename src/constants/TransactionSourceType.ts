export const TransactionSourceType = {
  USER: "user",
  PSYCHOLOGIST: "psychologist",
  PLATFORM: "platform",
} as const;

export type TransactionSourceType = typeof TransactionSourceType[keyof typeof TransactionSourceType];
