import type { MessageResponse } from "../types/api/psychologist.types";
import type { TransactionListingPayload, TransactionListingResponse, WalletResponse } from "../types/api/shared.types";
import type {
  CheckoutDataResponse,
  CheckSessionAccessResponse,
  CreateOrderRequest,
  CreateOrderResponse,
  FetchCheckoutRequest,
  ListPsychSummary,
  PsychDetails,
  SessionListingUserResponse,
  UserProfile,
  VerifyPaymentPayload,
  VerifyPaymentResponse,
} from "../types/api/user.types";
import type { GetNotificationResponse, GetNotificationsPayload, GetUnreadNotificationCountResponse, MarkNotificationsReadResponse } from "../types/domain/Notification.types";
import type paginationData from "../types/pagination.types";
import axiosInstance from "./axiosInstance";

interface DashboardData {
  user: {
    id: string;
    role: string;
  };
}

export const fetchDashboard = () =>
  axiosInstance.get<DashboardData>("/user/dashboard").then((res) => res);

export const fetchPsychologistsByUser = (params: string) =>
  axiosInstance
    .get<{ psychologists: ListPsychSummary[]; paginationData: paginationData }>(
      `/user/psychologists?${params}`
    )
    .then((res) => res);

export const fetchPsychDetailsByUser = (params: string) =>
  axiosInstance
    .get<PsychDetails>(`/user/psychologist-details?${params}`)
    .then((res) => res);

export const fetchUserProfile = () =>
  axiosInstance.get<UserProfile>(`/user/profile`).then((res) => res);

export const updateUserProfile = (formData: FormData) =>
  axiosInstance
    .patch<{ message: string }>(`/user/profile`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => res);

export const fetchCheckoutData = (data: FetchCheckoutRequest) => {
  const queryParams = new URLSearchParams();
  queryParams.append("psychId", data.psychId);
  queryParams.append("date", data.date);
  queryParams.append("startTime", data.startTime);
  return axiosInstance
    .get<CheckoutDataResponse>(`/user/checkout?${queryParams}`)
    .then((res) => res);
};

export const createOrder = (data: CreateOrderRequest) => {
  return axiosInstance
    .post<CreateOrderResponse>(`/user/create-order`, data)
    .then((res) => res);
};
export const verifyPayment = (data: VerifyPaymentPayload) => {
  return axiosInstance
    .post<VerifyPaymentResponse>(`/user/verify-payment`, data)
    .then((res) => res);
};

export const fetchSessionsByUserAPI = (params: string) =>
  axiosInstance
    .get<SessionListingUserResponse>(`/user/sessions/${params}`)
    .then((res) => res);

export const cancelSessionAPI = (sessionId: string) =>
  axiosInstance
    .patch<MessageResponse>(`/user/sessions/${sessionId}`)
    .then((res) => res);

export const checkSessionAccessAPI = (sessionId: string) =>
  axiosInstance
    .get<CheckSessionAccessResponse>(`/user/sessions/${sessionId}/access`)
    .then((res) => res);

export const fetchNotificationsAPI = (data: GetNotificationsPayload) => {
  const { page, limit } = data;

  return axiosInstance
    .get<GetNotificationResponse>(`/user/notifications?page=${page}&limit=${limit}`)
    .then((res) => res);
};

export const markAllNotificationsReadAPI = () => {
  return axiosInstance
    .patch<MarkNotificationsReadResponse>(`/user/notifications`,{},{isSilentError:true} as any)
    .then((res) => res);
};

export const getUserUnreadNotificationsCountAPI = () => {
  return axiosInstance
    .get<GetUnreadNotificationCountResponse>(`/user/notifications/count`,{isSilentError:true} as any)
    .then((res) => res);
};
export const getUserTransactionsAPI = (payload:TransactionListingPayload) => {
  const{page,limit,type,date,referenceType}=payload;
  const params = new URLSearchParams();

  params.append("page", page!.toString());
  params.append("limit", limit!.toString());

  if (type) params.append("type", type);
  if (referenceType) params.append("referenceType", referenceType);
  if (date) params.append("date", date);
  return axiosInstance
    .get<TransactionListingResponse>(`/user/transactions?${params}`)
    .then((res) => res);
};
export const getUserWalletAPI = () => {
  return axiosInstance
    .get<WalletResponse>(`/user/wallet`)
    .then((res) => res);
};
export const downloadTransactionReceiptAPI = (transactionId:string) => {
  return axiosInstance
    .get(`/user/transactions/${transactionId}/receipt`, {
  responseType: "blob"
})
    .then((res) => res);
};