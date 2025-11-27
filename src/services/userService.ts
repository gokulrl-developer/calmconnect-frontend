
import { USER_ENDPOINTS } from "../constants/user-endpoints";
import type { MessageResponse } from "../types/api/psychologist.types";
import type {
  GetNotificationResponse,
  GetNotificationsPayload,
  GetUnreadNotificationCountResponse,
  MarkNotificationsReadResponse,
  TransactionListingPayload,
  TransactionListingResponse,
  WalletResponse,
} from "../types/api/shared.types";
import type {
  CheckoutDataResponse,
  CheckSessionAccessResponse,
  ComplaintDetailsResponse,
  ComplaintListingResponse,
  CreateOrderRequest,
  CreateOrderResponse,
  CreateReviewRequest,
  FetchCheckoutRequest,
  ListPsychReviewsResponse,
  ListPsychSummary,
  PsychDetails,
  SessionListingUserResponse,
  UserDashboardResponse,
  UserProfile,
  VerifyPaymentPayload,
  VerifyPaymentResponse,
} from "../types/api/user.types";

import type paginationData from "../types/pagination.types";
import axiosInstance from "./axiosInstance";

// Dashboard -----------------------------
export const fetchDashboard = () =>
  axiosInstance
    .get<{ dashboard: UserDashboardResponse }>(USER_ENDPOINTS.DASHBOARD)
    .then((res) => res);

// Psychologists -------------------------
export const fetchPsychologistsByUser = (params: string) =>
  axiosInstance
    .get<{ psychologists: ListPsychSummary[]; paginationData: paginationData }>(
      USER_ENDPOINTS.LIST_PSYCHOLOGISTS(params)
    )
    .then((res) => res);

export const fetchPsychDetailsByUser = (params: string) =>
  axiosInstance
    .get<PsychDetails>(USER_ENDPOINTS.PSYCH_DETAILS(params))
    .then((res) => res);

// Profile ------------------------------
export const fetchUserProfile = () =>
  axiosInstance.get<UserProfile>(USER_ENDPOINTS.USER_PROFILE).then((res) => res);

export const updateUserProfile = (formData: FormData) =>
  axiosInstance
    .patch<{ message: string }>(USER_ENDPOINTS.UPDATE_PROFILE, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => res);

// Checkout -----------------------------
export const fetchCheckoutData = (data: FetchCheckoutRequest) => {
  const queryParams = new URLSearchParams();
  queryParams.append("psychId", data.psychId);
  queryParams.append("date", data.date);
  queryParams.append("startTime", data.startTime);

  return axiosInstance
    .get<CheckoutDataResponse>(USER_ENDPOINTS.CHECKOUT(queryParams.toString()))
    .then((res) => res);
};

export const createOrder = (data: CreateOrderRequest) =>
  axiosInstance.post<CreateOrderResponse>(USER_ENDPOINTS.CREATE_ORDER, data).then((res) => res);

export const verifyPayment = (data: VerifyPaymentPayload) =>
  axiosInstance.post<VerifyPaymentResponse>(USER_ENDPOINTS.VERIFY_PAYMENT, data).then((res) => res);

// Sessions -----------------------------
export const fetchSessionsByUserAPI = (params: string) =>
  axiosInstance
    .get<SessionListingUserResponse>(USER_ENDPOINTS.LIST_SESSIONS(params))
    .then((res) => res);

export const cancelSessionAPI = (sessionId: string) =>
  axiosInstance
    .patch<MessageResponse>(USER_ENDPOINTS.CANCEL_SESSION(sessionId))
    .then((res) => res);

export const checkSessionAccessAPI = (sessionId: string) =>
  axiosInstance
    .get<CheckSessionAccessResponse>(USER_ENDPOINTS.CHECK_SESSION_ACCESS(sessionId))
    .then((res) => res);

// Notifications ------------------------
export const fetchNotificationsAPI = (data: GetNotificationsPayload) =>
  axiosInstance
    .get<GetNotificationResponse>(
      USER_ENDPOINTS.FETCH_NOTIFICATIONS(data.page, data.limit)
    )
    .then((res) => res);

export const markAllNotificationsReadAPI = () =>
  axiosInstance
    .patch<MarkNotificationsReadResponse>(USER_ENDPOINTS.MARK_NOTIFICATIONS_READ, {}, {
      isSilentError: true,
    } as any)
    .then((res) => res);

export const clearNotificationsAPI = () =>
  axiosInstance
    .delete<MessageResponse>(USER_ENDPOINTS.CLEAR_NOTIFICATIONS)
    .then((res) => res);

export const getUserUnreadNotificationsCountAPI = () =>
  axiosInstance
    .get<GetUnreadNotificationCountResponse>(USER_ENDPOINTS.UNREAD_NOTIFICATIONS_COUNT, {
      isSilentError: true,
    } as any)
    .then((res) => res);

// Wallet & Transactions ----------------
export const getUserTransactionsAPI = (payload: TransactionListingPayload) => {
  const { page, limit, type, date, referenceType } = payload;
  const params = new URLSearchParams();

  params.append("page", page!.toString());
  params.append("limit", limit!.toString());
  if (type) params.append("type", type);
  if (referenceType) params.append("referenceType", referenceType);
  if (date) params.append("date", date);

  return axiosInstance
    .get<TransactionListingResponse>(USER_ENDPOINTS.TRANSACTIONS(params.toString()))
    .then((res) => res);
};

export const getUserWalletAPI = () =>
  axiosInstance.get<WalletResponse>(USER_ENDPOINTS.WALLET).then((res) => res);

export const downloadTransactionReceiptAPI = (transactionId: string) =>
  axiosInstance
    .get(USER_ENDPOINTS.TRANSACTION_RECEIPT(transactionId), { responseType: "blob" })
    .then((res) => res);

// Complaints ---------------------------
export const createComplaintAPI = (sessionId: string, description: string) =>
  axiosInstance
    .post<MessageResponse>(USER_ENDPOINTS.CREATE_COMPLAINT, {
      sessionId,
      description,
    })
    .then((res) => res);

export const listComplaintsAPI = (page: number, limit: number) => {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("limit", limit.toString());

  return axiosInstance
    .get<ComplaintListingResponse>(USER_ENDPOINTS.LIST_COMPLAINTS(params.toString()))
    .then((res) => res);
};

export const fetchComplaintDetailsAPI = (complaintId: string) =>
  axiosInstance
    .get<ComplaintDetailsResponse>(USER_ENDPOINTS.COMPLAINT_DETAILS(complaintId))
    .then((res) => res);

// Reviews ------------------------------
export const createReviewAPI = (payload: CreateReviewRequest) =>
  axiosInstance
    .post<MessageResponse>(USER_ENDPOINTS.CREATE_REVIEW, payload)
    .then((res) => res);

export const listPsychReviewsAPI = (query: string) =>
  axiosInstance
    .get<ListPsychReviewsResponse>(USER_ENDPOINTS.LIST_REVIEWS(query))
    .then((res) => res);
