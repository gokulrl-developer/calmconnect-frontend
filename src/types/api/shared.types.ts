import type { TransactionReferenceType } from "../../constants/TransactionReferenceType";
import type { TransactionType } from "../../constants/TransactionType";
import type { WalletOwnerType } from "../../constants/wallet-owner-type";
import type PaginationData from "../pagination.types"

export interface TransactionListItem {
  transactionId: string;
  type: TransactionType;
  amount: number;
  referenceType?: TransactionReferenceType;
  createdAt: Date;
}

export interface TransactionListingResponse{
  transactions:TransactionListItem[];
  paginationData:PaginationData
}

export interface WalletData {
  walletId: string;
  ownerType: WalletOwnerType;
  balance: number;
}

export interface WalletResponse{
    wallet:WalletData
}
export interface TransactionListingPayload{
 type?:TransactionType,
  referenceType?:TransactionReferenceType,
  date?:string,
  page?:number;
  limit?:number
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
    notificationId: string,
    link?:string
}

export interface MarkNotificationsReadResponse{
 message:string
}