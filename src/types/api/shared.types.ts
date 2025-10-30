import type paginationData from "../pagination.types";

export interface TransactionListItem {
  transactionId: string;
  type: "credit" | "debit";
  amount: number;
  referenceType?: "booking" | "psychologistPayment" | "refund";
  createdAt: Date;
}

export interface TransactionListingResponse{
  transactions:TransactionListItem[];
  paginationData:paginationData
}

export interface WalletData {
  walletId: string;
  ownerType: "user" | "psychologist" | "platform";
  balance: number;
}

export interface WalletResponse{
    wallet:WalletData
}
export interface TransactionListingPayload{
 type?:"credit"|"debit",
  referenceType?:"booking" | "psychologistPayment" | "refund",
  date?:string,
  page?:number;
  limit?:number
}