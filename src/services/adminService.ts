import type { AdminRegistrationTrendsResponse, AdminPsychDetailsResponse, AdminRevenueTrendsResponse, AdminSessionTrendsResponse, AdminTopPsychologistResponse, AdminUserDetailsResponse, ComplaintDetailsResponse, ComplaintHistoryResponse, ComplaintListingResponse, FetchRevenueGraphRequest, FetchSessionsGraphRequest, FetchTopPsychologistRequest, SessionListingAdminResponse, FetchRegistrationTrendsRequest, FetchDashboardDataRequest, DashboardSummaryCardResponse, ApplicationList, ApplicationDetailsResponse, IApplicationResponse, UserList, IUserResponse, PsychList, IPsychResponse } from "../types/api/admin.types";
import type { MessageResponse } from "../types/api/psychologist.types";
import type { TransactionListingPayload, TransactionListingResponse, WalletResponse } from "../types/api/shared.types";
import type { GetNotificationResponse, GetNotificationsPayload, GetUnreadNotificationCountResponse, MarkNotificationsReadResponse } from "../types/domain/Notification.types";
import axiosInstance from "./axiosInstance";


export const fetchApplications = (
  page: number = 1,
  status?: "pending" | "accepted" | "rejected"
) =>
  axiosInstance
    .get<ApplicationList>(`/admin/applications`, {
      params: {
        page,
        ...(status ? { status } : {}),
      },
    })
    .then(res => res.data);

export const fetchApplicationDetails = (applicationId:string) =>
  axiosInstance
    .get<ApplicationDetailsResponse>(`/admin/application/${applicationId}`)
    .then(res => res.data); 

export const updateApplication = (
  applicationId: string,
  status: "rejected" | "accepted",
  reason:string | null,
) =>
  axiosInstance
    .patch<IApplicationResponse>(`/admin/application/${applicationId}`, { status,reason })
    .then(res => res.data);



export const fetchUsers = (page: number = 1) =>
  axiosInstance
    .get<UserList>(`/admin/users?page=${page}`)
    .then(res => res.data);

export const updateUserStatus = (userId: string, status: "active" | "inactive") =>
  axiosInstance
    .patch<IUserResponse>(`/admin/user/${userId}`, { status })
    .then(res => res.data);


export const fetchPsychologists = (page: number = 1) =>
  axiosInstance
    .get<PsychList>(`/admin/psychologists?page=${page}`)
    .then(res => res.data);

export const updatePsychologistStatus = (
  psychId: string,
  status: "active" | "inactive"
) =>
  axiosInstance
    .patch<IPsychResponse>(`/admin/psychologist/${psychId}`, { status })
    .then(res => res.data);

export const fetchPsychDetailsByAdminAPI = (psychId: string) =>
  axiosInstance
    .get<{data:AdminPsychDetailsResponse}>(`/admin/psychologist-details/${psychId}`)
    .then(res => res);

export const fetchUserDetailsByAdminAPI = (userId: string) =>
  axiosInstance
    .get<{data:AdminUserDetailsResponse}>(`/admin/user-details/${userId}`)
    .then(res => res);

export const fetchSessionListingByAdminAPI = (params:string) =>
  axiosInstance
    .get<SessionListingAdminResponse>(`/admin/sessions/${params}`)
    .then(res => res);

export const fetchNotificationsAPI = (data: GetNotificationsPayload) => {
  const { page, limit } = data;

  return axiosInstance
    .get<GetNotificationResponse>(`/admin/notifications?page=${page}&limit=${limit}`)
    .then((res) => res);
};

export const markAllNotificationsReadAPI = () => {
  return axiosInstance
    .patch<MarkNotificationsReadResponse>(`/admin/notifications`,{},{isSilentError:true} as any)
    .then((res) => res);
};
export const clearNotificationsAPI = () => {
  return axiosInstance
    .delete<MessageResponse>(`/admin/notifications`)
    .then((res) => res);
};

export const getAdminUnreadNotificationsCountAPI = () => {
  return axiosInstance
    .get<GetUnreadNotificationCountResponse>(`/admin/notifications/count`,{isSilentError:true} as any)
    .then((res) => res);
};
export const getAdminTransactionsAPI = (payload:TransactionListingPayload) => {
  const{page,limit,type,date,referenceType}=payload;
  const params = new URLSearchParams();

  params.append("page", page!.toString());
  params.append("limit", limit!.toString());

  if (type) params.append("type", type);
  if (referenceType) params.append("referenceType", referenceType);
  if (date) params.append("date", date);
  return axiosInstance
    .get<TransactionListingResponse>(`/admin/transactions?${params}`)
    .then((res) => res);
};
export const getAdminWalletAPI = () => {
  return axiosInstance
    .get<WalletResponse>(`/admin/wallet`)
    .then((res) => res);
};
export const downloadTransactionReceiptAPI = (transactionId:string) => {
  return axiosInstance
    .get(`/admin/transactions/${transactionId}/receipt`, {
  responseType: "blob"
})
    .then((res) => res);
};

// Complaints  --------------------------------
export const resolveComplaintAPI = (complaintId:string,adminNotes:string) => {
  return axiosInstance
    .patch<MessageResponse>(`/admin/complaints/${complaintId}`, {
  adminNotes
})
    .then((res) => res);
};
export const listComplaintsAPI = (page:number,limit:number,status?:"pending"|"resolved",search?:string) => {
  const params=new URLSearchParams();
params.append("page",page.toString());
params.append("limit",limit.toString());
if(status){
  params.append("status",status)
}
if(search){
  params.append("search",search)
}
  return axiosInstance
    .get<ComplaintListingResponse>(`/admin/complaints?${params}`
)
    .then((res) => res);
};
export const fetchComplaintHistoryAPI = (psychId:string,page:number,limit:number) => {
  const params=new URLSearchParams();
params.append("page",page.toString());
params.append("limit",limit.toString());
params.append("psychId",psychId);
  return axiosInstance
    .get<ComplaintHistoryResponse>(`/admin/complaints/?${params}`
)
    .then((res) => res);
};
export const fetchComplaintDetailsAPI = (complaintId:string) => {
  return axiosInstance
    .get<ComplaintDetailsResponse>(`/admin/complaints/${complaintId}`
)
    .then((res) => res);
};


export const fetchRevenueTrendsAPI = (data: FetchRevenueGraphRequest) => {
  const { fromDate, toDate } = data;
  return axiosInstance
    .get<AdminRevenueTrendsResponse >(
      `/admin/dashboard/revenue?fromDate=${fromDate}&toDate=${toDate}`
    )
    .then((res) => res);
};

export const fetchRegistrationTrendsAPI = (data: FetchRegistrationTrendsRequest) => {
  const { fromDate, toDate } = data;
  return axiosInstance
    .get<AdminRegistrationTrendsResponse >(
      `/admin/dashboard/clients?fromDate=${fromDate}&toDate=${toDate}`
    )
    .then((res) => res);
};

export const fetchSessionTrendsAPI = (data: FetchSessionsGraphRequest) => {
  const { fromDate, toDate } = data;
  return axiosInstance
    .get<AdminSessionTrendsResponse >(
      `/admin/dashboard/sessions?fromDate=${fromDate}&toDate=${toDate}`
    )
    .then((res) => res);
};

export const fetchTopPsychologistsAPI = (data: FetchTopPsychologistRequest) => {
  const { fromDate, toDate, limit } = data;
  return axiosInstance
    .get<AdminTopPsychologistResponse >(
      `/admin/dashboard/top-psychologists?fromDate=${fromDate}&toDate=${toDate}&limit=${limit}`
    )
    .then((res) => res);
};
export const fetchDashboardSummaryCardsAPI = (data: FetchDashboardDataRequest) => {
  const { fromDate, toDate} = data;
  return axiosInstance
    .get<{summaryCards:DashboardSummaryCardResponse} >(
      `/admin/dashboard/summary-cards?fromDate=${fromDate}&toDate=${toDate}`
    )
    .then((res) => res);
};