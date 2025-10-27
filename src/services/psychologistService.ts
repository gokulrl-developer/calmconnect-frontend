import type { AvailabilityRuleDetails, AvailabilityRuleSummary, CheckSessionAccessResponse, CreateAvailabilityRulePayload, CreateQuickSlotPayload, CreateSpecialDayPayload, DailyAvailability, EditAvailabilityRulePayload, EditQuickSlotPayload, EditSpecialDayPayload, FetchDailyAvailabilityPayload, MessageResponse, PsychProfile, RejectedApplication, SessionListingResponse } from "../types/api/psychologist.types";
import type { GetNotificationResponse, GetNotificationsPayload, GetUnreadNotificationCountResponse, MarkNotificationsReadResponse } from "../types/domain/Notification.types";
import axiosInstance from "./axiosInstance";

interface IApplicationResponse {
  success: boolean;
  message: string;
}

export interface LatestApplicationData{
    firstName:string,
    lastName:string,
    email:string,
    submittedAt:Date, 
    phone:string, 
    gender:"male"|"female"|"others",
    dob:Date,
    profilePicture:string,
    address:string,
    languages:string,
    specializations:string[],
    bio:string,
    licenseUrl:string,
    resume:string,
    qualifications:string,
    status:"pending"|"accepted"|"rejected",
    rejectionReason?:string
}
interface LatestApplicationDataResponse {
  psych: {
    id: string;
    role: string;
    isVerified: boolean;
  };
  application:LatestApplicationData | null
}

interface DashboardData{
  psych:{
    id:string;
    role:string;
    isVerified:boolean
  }
}



export const fetchLatestApplicationAPI = () =>
  axiosInstance
    .get<LatestApplicationDataResponse>("/psychologist/application")
    .then((res) => res);
export const fetchDashboard = () =>
  axiosInstance
    .get<DashboardData>("/psychologist/dashboard")
    .then((res) => res);
export const psychologistApply = (formData: FormData) =>
  axiosInstance
    .post<IApplicationResponse>("/psychologist/apply", formData)
    .then((res) => res);

  export const fetchPsychProfile=()=>
    axiosInstance
  .get<PsychProfile>(`/psychologist/profile`)
  .then((res)=>res)

  export const updatePsychProfile=(formData:FormData)=>
    axiosInstance
  .patch<{message:string}>(`/psychologist/profile`,formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      }})
  .then((res)=>res)

export const createAvailabilityRuleAPI = (data: CreateAvailabilityRulePayload) =>
  axiosInstance.post<MessageResponse>("/psychologist/availability-rule", data)
    .then(res => res);

export const editAvailabilityRuleAPI = (availabilityRuleId: string, data: EditAvailabilityRulePayload) =>
  axiosInstance.patch<MessageResponse>(`/psychologist/availability-rule/${availabilityRuleId}`, data)
    .then(res => res);

export const deleteAvailabilityRuleAPI = (availabilityRuleId: string) =>
  axiosInstance.delete<MessageResponse>(`/psychologist/availability-rule/${availabilityRuleId}`)
    .then(res => res);

export const fetchAvailabilityRuleAPI = (availabilityRuleId: string) =>
  axiosInstance.get<{ availabilityRule: AvailabilityRuleDetails }>(`/psychologist/availability-rule?availabilityRuleId=${availabilityRuleId}`)
    .then(res => res);

export const listAvailabilityRules = () =>
  axiosInstance.get<{ summaries: AvailabilityRuleSummary[] }>("/psychologist/availability-rules")
    .then(res => res);

// ---------- Special Days ----------
export const createSpecialDay = (data: CreateSpecialDayPayload) =>
  axiosInstance.post<MessageResponse>("/psychologist/special-day", data)
    .then(res => res);

export const editSpecialDay = (specialDayId: string, data: EditSpecialDayPayload) =>
  axiosInstance.patch<MessageResponse>(`/psychologist/special-day/${specialDayId}`, data)
    .then(res => res);

export const deleteSpecialDay = (specialDayId: string) =>
  axiosInstance.delete<MessageResponse>(`/psychologist/special-day/${specialDayId}`)
    .then(res => res);

// ---------- Quick Slots ----------
export const createQuickSlotAPI = (data: CreateQuickSlotPayload) =>
  axiosInstance.post<MessageResponse>("/psychologist/quick-slot", data)
    .then(res => res);

export const editQuickSlotAPI = (quickSlotId: string, data: EditQuickSlotPayload) =>
  axiosInstance.patch<MessageResponse>(`/psychologist/quick-slot/${quickSlotId}`, data)
    .then(res => res);

export const deleteQuickSlotAPI = (quickSlotId: string) =>
  axiosInstance.delete<MessageResponse>(`/psychologist/quick-slot/${quickSlotId}`)
    .then(res => res);

// ---------- Daily Availability ----------
export const fetchDailyAvailabilityAPI = (data: FetchDailyAvailabilityPayload) =>
  axiosInstance.get<DailyAvailability>("/psychologist/daily-availability", { params: data })
    .then(res => res);

export const fetchSessionsByPsychAPI = (params:string) =>
  axiosInstance
    .get<SessionListingResponse>(`/psychologist/sessions/${params}`)
    .then(res => res);

export const cancelSessionAPI = (sessionId:string) =>
  axiosInstance
    .patch<MessageResponse>(`/psychologist/sessions/${sessionId}`)
    .then(res => res);

    export const fetchRejectedApplicationAPI = () =>
  axiosInstance
    .get<{application:RejectedApplication}>(`/psychologist/application`)
    .then(res => res);

    export const checkSessionAccessAPI = (sessionId: string) =>
  axiosInstance
    .get<CheckSessionAccessResponse>(`/psychologist/sessions/${sessionId}/access`)
    .then((res) => res);

export const fetchNotificationsAPI = (data: GetNotificationsPayload) => {
  const { page, limit } = data;

  return axiosInstance
    .get<GetNotificationResponse>(`/psychologist/notifications?page=${page}&limit=${limit}`)
    .then((res) => res);
};

export const markAllNotificationsReadAPI = () => {
  return axiosInstance
    .patch<MarkNotificationsReadResponse>(`/psychologist/notifications`,{},{isSilentError:true} as any)
    .then((res) => res);
};

export const getPsychUnreadNotificationsCountAPI = () => {
  return axiosInstance
    .get<GetUnreadNotificationCountResponse>(`/psychologist/notifications/count`,{isSilentError:true} as any)
    .then((res) => res);
};