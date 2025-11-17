import type PaginationData from "../pagination.types"

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