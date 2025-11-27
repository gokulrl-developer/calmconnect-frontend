import { PSYCHOLOGIST_ENDPOINTS } from "../constants/psychologist-endpoints";
import type {
AvailabilityRuleDetails,
AvailabilityRuleSummary,
CheckSessionAccessResponse,
CreateAvailabilityRulePayload,
CreateQuickSlotPayload,
CreateSpecialDayPayload,
DailyAvailability,
EditAvailabilityRulePayload,
EditQuickSlotPayload,
EditSpecialDayPayload,
FetchDailyAvailabilityPayload,
IApplicationResponse,
LatestApplicationDataResponse,
MessageResponse,
PsychologistDashboardResponse,
PsychProfile,
RejectedApplication,
SessionListingResponse,
} from "../types/api/psychologist.types";
import type {
GetNotificationResponse,
GetNotificationsPayload,
GetUnreadNotificationCountResponse,
MarkNotificationsReadResponse,
TransactionListingPayload,
TransactionListingResponse,
WalletResponse,
} from "../types/api/shared.types";
import axiosInstance from "./axiosInstance";

// ---------- Applications ----------
export const fetchLatestApplicationAPI = () =>
axiosInstance.get<LatestApplicationDataResponse>(PSYCHOLOGIST_ENDPOINTS.LATEST_APPLICATION).then(res => res);

export const fetchRejectedApplicationAPI = () =>
axiosInstance.get<{ application: RejectedApplication }>(PSYCHOLOGIST_ENDPOINTS.REJECTED_APPLICATION).then(res => res);

export const psychologistApply = (formData: FormData) =>
axiosInstance.post<IApplicationResponse>(PSYCHOLOGIST_ENDPOINTS.APPLY, formData).then(res => res);

// ---------- Dashboard ----------
export const fetchDashboard = () =>
axiosInstance.get<{ dashboard: PsychologistDashboardResponse }>(PSYCHOLOGIST_ENDPOINTS.DASHBOARD).then(res => res);

// ---------- Profile ----------
export const fetchPsychProfile = () =>
axiosInstance.get<PsychProfile>(PSYCHOLOGIST_ENDPOINTS.PROFILE).then(res => res);

export const updatePsychProfile = (formData: FormData) =>
axiosInstance.patch<{ message: string }>(PSYCHOLOGIST_ENDPOINTS.UPDATE_PROFILE, formData, {
headers: { "Content-Type": "multipart/form-data" },
}).then(res => res);

// ---------- Availability Rules ----------
export const createAvailabilityRuleAPI = (data: CreateAvailabilityRulePayload) =>
axiosInstance.post<MessageResponse>(PSYCHOLOGIST_ENDPOINTS.CREATE_AVAILABILITY_RULE, data).then(res => res);

export const editAvailabilityRuleAPI = (availabilityRuleId: string, data: EditAvailabilityRulePayload) =>
axiosInstance.patch<MessageResponse>(PSYCHOLOGIST_ENDPOINTS.EDIT_AVAILABILITY_RULE(availabilityRuleId), data).then(res => res);

export const deleteAvailabilityRuleAPI = (availabilityRuleId: string) =>
axiosInstance.delete<MessageResponse>(PSYCHOLOGIST_ENDPOINTS.DELETE_AVAILABILITY_RULE(availabilityRuleId)).then(res => res);

export const fetchAvailabilityRuleAPI = (availabilityRuleId: string) =>
axiosInstance.get<{ availabilityRule: AvailabilityRuleDetails }>(PSYCHOLOGIST_ENDPOINTS.FETCH_AVAILABILITY_RULE(availabilityRuleId)).then(res => res);

export const listAvailabilityRules = () =>
axiosInstance.get<{ summaries: AvailabilityRuleSummary[] }>(PSYCHOLOGIST_ENDPOINTS.LIST_AVAILABILITY_RULES).then(res => res);

// ---------- Special Days ----------
export const createSpecialDay = (data: CreateSpecialDayPayload) =>
axiosInstance.post<MessageResponse>(PSYCHOLOGIST_ENDPOINTS.CREATE_SPECIAL_DAY, data).then(res => res);

export const editSpecialDay = (specialDayId: string, data: EditSpecialDayPayload) =>
axiosInstance.patch<MessageResponse>(PSYCHOLOGIST_ENDPOINTS.EDIT_SPECIAL_DAY(specialDayId), data).then(res => res);

export const deleteSpecialDay = (specialDayId: string) =>
axiosInstance.delete<MessageResponse>(PSYCHOLOGIST_ENDPOINTS.DELETE_SPECIAL_DAY(specialDayId)).then(res => res);

// ---------- Quick Slots ----------
export const createQuickSlotAPI = (data: CreateQuickSlotPayload) =>
axiosInstance.post<MessageResponse>(PSYCHOLOGIST_ENDPOINTS.CREATE_QUICK_SLOT, data).then(res => res);

export const editQuickSlotAPI = (quickSlotId: string, data: EditQuickSlotPayload) =>
axiosInstance.patch<MessageResponse>(PSYCHOLOGIST_ENDPOINTS.EDIT_QUICK_SLOT(quickSlotId), data).then(res => res);

export const deleteQuickSlotAPI = (quickSlotId: string) =>
axiosInstance.delete<MessageResponse>(PSYCHOLOGIST_ENDPOINTS.DELETE_QUICK_SLOT(quickSlotId)).then(res => res);

// ---------- Daily Availability ----------
export const fetchDailyAvailabilityAPI = (data: FetchDailyAvailabilityPayload) =>
axiosInstance.get<DailyAvailability>(PSYCHOLOGIST_ENDPOINTS.DAILY_AVAILABILITY, { params: data }).then(res => res);

// ---------- Sessions ----------
export const fetchSessionsByPsychAPI = (params: string) =>
axiosInstance.get<SessionListingResponse>(PSYCHOLOGIST_ENDPOINTS.SESSION_LISTING(params)).then(res => res);

export const cancelSessionAPI = (sessionId: string) =>
axiosInstance.patch<MessageResponse>(PSYCHOLOGIST_ENDPOINTS.CANCEL_SESSION(sessionId)).then(res => res);

export const checkSessionAccessAPI = (sessionId: string) =>
axiosInstance.get<CheckSessionAccessResponse>(PSYCHOLOGIST_ENDPOINTS.CHECK_SESSION_ACCESS(sessionId)).then(res => res);

// ---------- Notifications ----------
export const fetchNotificationsAPI = (data: GetNotificationsPayload) =>
axiosInstance.get<GetNotificationResponse>(PSYCHOLOGIST_ENDPOINTS.FETCH_NOTIFICATIONS(data.page, data.limit)).then(res => res);

export const markAllNotificationsReadAPI = () =>
axiosInstance.patch<MarkNotificationsReadResponse>(PSYCHOLOGIST_ENDPOINTS.MARK_NOTIFICATIONS_READ, {}, { isSilentError: true } as any).then(res => res);

export const clearNotificationsAPI = () =>
axiosInstance.delete<MessageResponse>(PSYCHOLOGIST_ENDPOINTS.CLEAR_NOTIFICATIONS).then(res => res);

export const getPsychUnreadNotificationsCountAPI = () =>
axiosInstance.get<GetUnreadNotificationCountResponse>(PSYCHOLOGIST_ENDPOINTS.UNREAD_NOTIFICATIONS_COUNT, { isSilentError: true } as any).then(res => res);

// ---------- Transactions ----------
export const getPsychTransactionsAPI = (payload: TransactionListingPayload) => {
const { page, limit, type, date, referenceType } = payload;
const params = new URLSearchParams();
params.append("page", page!.toString());
params.append("limit", limit!.toString());
if (type) params.append("type", type);
if (referenceType) params.append("referenceType", referenceType);
if (date) params.append("date", date);
return axiosInstance.get<TransactionListingResponse>(PSYCHOLOGIST_ENDPOINTS.TRANSACTIONS(params.toString())).then(res => res);
};

export const getPsychWalletAPI = () =>
axiosInstance.get<WalletResponse>(PSYCHOLOGIST_ENDPOINTS.WALLET).then(res => res);

export const downloadTransactionReceiptAPI = (transactionId: string) =>
axiosInstance.get(PSYCHOLOGIST_ENDPOINTS.TRANSACTION_RECEIPT(transactionId), { responseType: "blob" }).then(res => res);
