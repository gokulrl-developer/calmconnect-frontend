import type PaginationData from "../pagination.types"

export interface TransactionListItem {
  transactionId: string;
  type: "credit" | "debit";
  amount: number;
  referenceType?: "booking" | "psychologistPayment" | "refund";
  createdAt: Date;
}

export interface TransactionListingResponse{
  transactions:TransactionListItem[];
  paginationData:PaginationData
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

export interface ClearNotificationsRequest{
  
}

export interface GetUnreadNotificationCountResponse{
 count:number,
 message:string
}

export interface GetNotificationsPayload {
   page:number,
   limit:number
}

export interface GetNotificationResponse {
  notifications:NotificationListingItem[],
  paginationData:PaginationData
}

export interface NotificationListingItem{
    title: string,
    message: string,
    type: string,
    isRead: boolean ,
    createdAt: Date,
    notificationId: string 
}

export interface MarkNotificationsReadResponse{
 message:string
}