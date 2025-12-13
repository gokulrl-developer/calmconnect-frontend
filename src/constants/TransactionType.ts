export const TransactionType = {
  CREDIT: "credit",
  DEBIT: "debit",
} as const;

export type TransactionType = typeof TransactionType[keyof typeof TransactionType];
