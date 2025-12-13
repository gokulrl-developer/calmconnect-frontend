export const TransactionReferenceType = {
  BOOKING: "booking",
  PSYCHOLOGIST_PAYMENT: "psychologistPayment",
  REFUND: "refund",
} as const;

export type TransactionReferenceType = typeof TransactionReferenceType[keyof typeof TransactionReferenceType];
