import type { AvailabilityRule, AvailabilityRuleSummary, Slot } from "../types/domain/AvailabiliityRule.types";
import axiosInstance from "./axiosInstance";

interface IApplicationResponse {
  success: boolean;
  message: string;
}

interface ApplicationStatus {
  psych: {
    id: string;
    role: string;
    isVerified: boolean;
  };
  status: string;
}

interface DashboardData{
  psych:{
    id:string;
    role:string;
    isVerified:boolean
  }
}

interface DailyAvailability{
  availableSlots:Slot[]
}

interface AvailabilityRuleCreateResponse{
  message:string
}

interface MarkHolidayRequest{
  availableSlots:string[],
  date:string
}

interface RulesListResponse{
  summaries:AvailabilityRuleSummary[]
}

export const fetchApplication = () =>
  axiosInstance
    .get<ApplicationStatus>("/psychologist/application")
    .then((res) => res);
export const fetchDashboard = () =>
  axiosInstance
    .get<DashboardData>("/psychologist/dashboard")
    .then((res) => res);
export const psychologistApply = (formData: FormData) =>
  axiosInstance
    .post<IApplicationResponse>("/psychologist/apply", formData)
    .then((res) => res);
export const createAvailabilityRule=(rule:AvailabilityRule)=>
  axiosInstance
  .post<AvailabilityRuleCreateResponse>("/psychologist/availabilityRule",rule)
  .then((res)=>res);
export const fetchDailyAvailability=(date:string)=>
  axiosInstance
  .get<DailyAvailability>(`/psychologist/daily-availability?date=${date}`)
  .then((res)=>res);
  export const deleteHoliday=(date:string)=>
    axiosInstance
  .delete<{message:string}>(`/psychologist/holiday?date=${date}`)
  .then((res)=>res)
  export const deleteRule=(ruleId:string)=>
    axiosInstance
  .delete<{message:string}>(`/psychologist/availabilityRule/${ruleId}`)
  .then((res)=>res)
  export const markHoliday=(holiday:MarkHolidayRequest)=>
    axiosInstance
  .post<{message:string}>(`/psychologist/holiday`,{...holiday})
  .then((res)=>res)

  export const fetchAvailabilityRuleSummaries=()=>
    axiosInstance
  .get<RulesListResponse>("/psychologist/availabilityRules")
  .then((res)=>res)

  export const fetchAvailabilityRuleDetails=(ruleId:string)=>
    axiosInstance
  .get<{availabilityRule:AvailabilityRule}>(`/psychologist/availabilityRule/${ruleId}`)
  .then((res)=>res)