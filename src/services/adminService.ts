import { ADMIN_ENDPOINTS } from "../constants/admin-endpoints";
import type {
AdminRegistrationTrendsResponse,
AdminPsychDetailsResponse,
AdminRevenueTrendsResponse,
AdminSessionTrendsResponse,
AdminTopPsychologistResponse,
AdminUserDetailsResponse,
ComplaintDetailsResponse,
ComplaintHistoryResponse,
ComplaintListingResponse,
FetchRevenueGraphRequest,
FetchSessionsGraphRequest,
FetchTopPsychologistRequest,
SessionListingAdminResponse,
FetchRegistrationTrendsRequest,
FetchDashboardDataRequest,
DashboardSummaryCardResponse,
ApplicationList,
ApplicationDetailsResponse,
IApplicationResponse,
UserList,
IUserResponse,
PsychList,
IPsychResponse
} from "../types/api/admin.types";
import type { MessageResponse } from "../types/api/psychologist.types";
import type {
GetNotificationResponse,
GetNotificationsPayload,
GetUnreadNotificationCountResponse,
MarkNotificationsReadResponse,
TransactionListingPayload,
TransactionListingResponse,
WalletResponse
} from "../types/api/shared.types";
import axiosInstance from "./axiosInstance";

// ---------- Applications ----------
export const fetchApplications = (page: number = 1, status?: "pending" | "accepted" | "rejected") =>
axiosInstance
.get<ApplicationList>(ADMIN_ENDPOINTS.FETCH_APPLICATIONS, { params: { page, ...(status ? { status } : {}) } })
.then(res => res.data);

export const fetchApplicationDetails = (applicationId: string) =>
axiosInstance.get<ApplicationDetailsResponse>(ADMIN_ENDPOINTS.APPLICATION_DETAILS(applicationId)).then(res => res.data);

export const updateApplication = (applicationId: string, status: "rejected" | "accepted", reason: string | null) =>
axiosInstance.patch<IApplicationResponse>(ADMIN_ENDPOINTS.UPDATE_APPLICATION(applicationId), { status, reason }).then(res => res.data);

// ---------- Users ----------
export const fetchUsers = (page: number = 1) =>
axiosInstance.get<UserList>(ADMIN_ENDPOINTS.FETCH_USERS, { params: { page } }).then(res => res.data);

export const updateUserStatus = (userId: string, status: "active" | "inactive") =>
axiosInstance.patch<IUserResponse>(ADMIN_ENDPOINTS.UPDATE_USER_STATUS(userId), { status }).then(res => res.data);

export const fetchUserDetailsByAdminAPI = (userId: string) =>
axiosInstance.get<{ data: AdminUserDetailsResponse }>(ADMIN_ENDPOINTS.USER_DETAILS(userId)).then(res => res);

// ---------- Psychologists ----------
export const fetchPsychologists = (page: number = 1) =>
axiosInstance.get<PsychList>(ADMIN_ENDPOINTS.FETCH_PSYCHOLOGISTS, { params: { page } }).then(res => res.data);

export const updatePsychologistStatus = (psychId: string, status: "active" | "inactive") =>
axiosInstance.patch<IPsychResponse>(ADMIN_ENDPOINTS.UPDATE_PSYCH_STATUS(psychId), { status }).then(res => res.data);

export const fetchPsychDetailsByAdminAPI = (psychId: string) =>
axiosInstance.get<{ data: AdminPsychDetailsResponse }>(ADMIN_ENDPOINTS.PSYCH_DETAILS(psychId)).then(res => res);

// ---------- Sessions ----------
export const fetchSessionListingByAdminAPI = (params: string) =>
axiosInstance.get<SessionListingAdminResponse>(ADMIN_ENDPOINTS.SESSION_LISTING(params)).then(res => res);

// ---------- Notifications ----------
export const fetchNotificationsAPI = (data: GetNotificationsPayload) => {
const { page, limit } = data;
return axiosInstance.get<GetNotificationResponse>(`${ADMIN_ENDPOINTS.FETCH_NOTIFICATIONS}?page=${page}&limit=${limit}`).then(res => res);
};

export const markAllNotificationsReadAPI = () =>
axiosInstance.patch<MarkNotificationsReadResponse>(ADMIN_ENDPOINTS.MARK_NOTIFICATIONS_READ, {}).then(res => res);

export const clearNotificationsAPI = () =>
axiosInstance.delete<MessageResponse>(ADMIN_ENDPOINTS.CLEAR_NOTIFICATIONS).then(res => res);

export const getAdminUnreadNotificationsCountAPI = () =>
axiosInstance.get<GetUnreadNotificationCountResponse>(ADMIN_ENDPOINTS.UNREAD_NOTIFICATIONS_COUNT).then(res => res);

// ---------- Transactions ----------
export const getAdminTransactionsAPI = (payload: TransactionListingPayload) => {
const { page, limit, type, date, referenceType } = payload;
const params = new URLSearchParams();
params.append("page", page!.toString());
params.append("limit", limit!.toString());
if (type) params.append("type", type);
if (referenceType) params.append("referenceType", referenceType);
if (date) params.append("date", date);
return axiosInstance.get<TransactionListingResponse>(`${ADMIN_ENDPOINTS.TRANSACTIONS}?${params}`).then(res => res);
};

export const getAdminWalletAPI = () => axiosInstance.get<WalletResponse>(ADMIN_ENDPOINTS.WALLET).then(res => res);

export const downloadTransactionReceiptAPI = (transactionId: string) =>
axiosInstance.get(ADMIN_ENDPOINTS.TRANSACTION_RECEIPT(transactionId), { responseType: "blob" }).then(res => res);

// ---------- Complaints ----------
export const resolveComplaintAPI = (complaintId: string, adminNotes: string) =>
axiosInstance.patch<MessageResponse>(ADMIN_ENDPOINTS.RESOLVE_COMPLAINT(complaintId), { adminNotes }).then(res => res);

export const listComplaintsAPI = (page: number, limit: number, status?: "pending" | "resolved", search?: string) => {
const params = new URLSearchParams();
params.append("page", page.toString());
params.append("limit", limit.toString());
if (status) params.append("status", status);
if (search) params.append("search", search);
return axiosInstance.get<ComplaintListingResponse>(`${ADMIN_ENDPOINTS.LIST_COMPLAINTS}?${params}`).then(res => res);
};

export const fetchComplaintHistoryAPI = (psychId: string, page: number, limit: number) => {
const params = new URLSearchParams();
params.append("psychId", psychId);
params.append("page", page.toString());
params.append("limit", limit.toString());
return axiosInstance.get<ComplaintHistoryResponse>(`${ADMIN_ENDPOINTS.COMPLAINT_HISTORY}/?${params}`).then(res => res);
};

export const fetchComplaintDetailsAPI = (complaintId: string) =>
axiosInstance.get<ComplaintDetailsResponse>(ADMIN_ENDPOINTS.COMPLAINT_DETAILS(complaintId)).then(res => res);

// ---------- Dashboard ----------
export const fetchRevenueTrendsAPI = (data: FetchRevenueGraphRequest) => {
const { fromDate, toDate } = data;
return axiosInstance.get<AdminRevenueTrendsResponse>(`${ADMIN_ENDPOINTS.DASHBOARD_REVENUE}?fromDate=${fromDate}&toDate=${toDate}`).then(res => res);
};

export const fetchRegistrationTrendsAPI = (data: FetchRegistrationTrendsRequest) => {
const { fromDate, toDate } = data;
return axiosInstance.get<AdminRegistrationTrendsResponse>(`${ADMIN_ENDPOINTS.DASHBOARD_CLIENTS}?fromDate=${fromDate}&toDate=${toDate}`).then(res => res);
};

export const fetchSessionTrendsAPI = (data: FetchSessionsGraphRequest) => {
const { fromDate, toDate } = data;
return axiosInstance.get<AdminSessionTrendsResponse>(`${ADMIN_ENDPOINTS.DASHBOARD_SESSIONS}?fromDate=${fromDate}&toDate=${toDate}`).then(res => res);
};

export const fetchTopPsychologistsAPI = (data: FetchTopPsychologistRequest) => {
const { fromDate, toDate, limit } = data;
return axiosInstance.get<AdminTopPsychologistResponse>(`${ADMIN_ENDPOINTS.DASHBOARD_TOP_PSYCHOLOGISTS}?fromDate=${fromDate}&toDate=${toDate}&limit=${limit}`).then(res => res);
};

export const fetchDashboardSummaryCardsAPI = (data: FetchDashboardDataRequest) => {
const { fromDate, toDate } = data;
return axiosInstance.get<{ summaryCards: DashboardSummaryCardResponse }>(`${ADMIN_ENDPOINTS.DASHBOARD_SUMMARY_CARDS}?fromDate=${fromDate}&toDate=${toDate}`).then(res => res);
};
