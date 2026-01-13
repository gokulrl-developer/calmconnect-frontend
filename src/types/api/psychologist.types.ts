import type { ApplicationStatus } from "../../constants/application-status";
import type { AvailabilityRuleStatus } from "../../constants/availability-rule.status";
import type { PsychologistGender } from "../../constants/psychologist-gender";
import type { QuickSlotStatus } from "../../constants/quick-slot-status";
import type { SessionStatus } from "../../constants/SessionStatus";
import type { SpecialDayStatus } from "../../constants/SpecialDayStatus";
import type { SpecialDayType } from "../../constants/SpecialDayType";
import type PaginationData from "../pagination.types"

export interface PsychProfile{
profile: {
    firstName: string;
    lastName: string;
    email: string;
    gender?: PsychologistGender;
    dob?: Date;
    profilePicture?: string;
    address?: string;
    languages?: string;
    specializations?: string[];
    bio?: string;
    qualifications?: string;
    hourlyFees?: number;
  }
}


// ---------- Generic Response ----------
export interface MessageResponse {
  message: string;
}

// ---------- Availability Rules ----------
export interface AvailabilityRuleDetails {
  weekDay: number; // 0-6
  startTime: string; // "09:00"
  endTime: string;   // "17:00"
  durationInMins: number;
  bufferTimeInMins: number;
  status: AvailabilityRuleStatus;
  availabilityRuleId: string;
}

export interface AvailabilityRuleSummary {
  weekDay: number;
  availabilityRuleId: string;
}

// ---------- Special Days ----------
export interface SpecialDay {
  type: SpecialDayType;
  startTime?: string; // ISO string
  endTime?: string;   // ISO string
  durationInMins?: number;
  bufferTimeInMins?: number;
  status: SpecialDayStatus;
  specialDayId: string;
}

// ---------- Quick Slots ----------
export interface QuickSlot {
  startTime: string; // ISO string
  endTime: string;   // ISO string
  durationInMins: number;
  bufferTimeInMins: number;
  status: QuickSlotStatus;
  quickSlotId: string;
}

// ---------- Daily Availability ----------
export interface DailyAvailability {
  availabilityRules: AvailabilityRuleDetails[];
  specialDay?: SpecialDay;
  quickSlots: QuickSlot[];
}

// ---------- Request Payloads ----------
export interface CreateAvailabilityRulePayload {
  weekDay: number;
  startTime: string;
  endTime: string;
  durationInMins: number;
  bufferTimeInMins?: number;
}

export interface EditAvailabilityRulePayload {
  startTime?: string;
  endTime?: string;
  durationInMins?: number;
  bufferTimeInMins?: number;
  status?: AvailabilityRuleStatus;
}

export interface CreateSpecialDayPayload {
  date: string; // ISO date
  type: SpecialDayType;
  startTime?: string;  // ISO string
  endTime?: string;    // ISO string
  durationInMins?: number;
  bufferTimeInMins?: number;
}

export interface EditSpecialDayPayload {
  type?: SpecialDayType;
  startTime?: string;  // ISO string
  endTime?: string;    // ISO string
  durationInMins?: number;
  bufferTimeInMins?: number;
  status?: SpecialDayStatus;
}

export interface CreateQuickSlotPayload {
  date: string; // ISO date
  startTime: string;  // ISO string
  endTime: string;    // ISO string
  durationInMins: number;
  bufferTimeInMins?: number;
}

export interface EditQuickSlotPayload {
  startTime?: string;  // ISO string
  endTime?: string;    // ISO string
  durationInMins?: number;
  bufferTimeInMins?: number;
  status?: QuickSlotStatus;
}

export interface FetchDailyAvailabilityPayload {
  date: string; // ISO date
}

export interface SessionListingPsychItem {
  userFullName: string;
  userEmail:string;
  startTime: Date;
  endTime:Date;
  durationInMins: number;
  status: SessionStatus;
  fees: number;
  sessionId: string;
}

export interface SessionListingResponse{
  sessions:SessionListingPsychItem[],
  paginationData:PaginationData
}

export interface RejectedApplication{
  submittedAt: Date;
  phone: string;
  gender: PsychologistGender;
  dob: Date;
  profilePicture: string;
  address: string;
  languages: string;
  specializations: string[];
  bio: string;
  license: string;
  resume: string;
  qualifications: string;
  reason:string;
}

export interface CheckSessionAccessResponse{
    allowed:boolean,
    reason?:string,
    session?:SessionDetailsInVideoCall
}

export interface SessionDetailsInVideoCall{
 psychologist:string,
 user:string,
 startTime:Date,
 endTime:Date,
 durationInMins:number,
 sessionId:string
}

export interface DashboardSummary {
  sessionSummary: PsychSessionsSummary;
  ratingSummary: PsychRatingSummary;
  revenueSummary: PsychRevenueSummary;
}
export interface PsychSessionsSummary {
  todaySessionCount: number;
  upcomingSessionCount: number;
  nextSessionTime: string;
  totalSessionCount: number;
  thisMonthSessionCount: number;
}
export interface PsychRatingSummary {
  currentRating: number;
  lastMonthRating: number;
}
export interface PsychRevenueSummary {
  currentRevenue: number;
  lastMonthRevenue: number;
}

export interface PsychSessionsTrendEntry {
  week: string;
  sessionCount: number;
}

export interface RevenueTrendEntry {
  week: string;
  revenue: number;
}

export interface RecentSessionEntry {
  sessionId: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
  startTime: string;
  status: SessionStatus;
}

export interface PsychologistDashboardResponse {
  summary: DashboardSummary;
  sessionsTrend: PsychSessionsTrendEntry[];
  revenueTrend: RevenueTrendEntry[];
  recentSessions: RecentSessionEntry[];
}

export interface IApplicationResponse {
  success: boolean;
  message: string;
}

export interface LatestApplicationData{
    firstName:string,
    lastName:string,
    email:string,
    submittedAt:Date, 
    phone:string, 
    gender:PsychologistGender,
    dob:Date,
    profilePicture:string,
    address:string,
    languages:string,
    specializations:string[],
    bio:string,
    licenseUrl:string,
    resume:string,
    qualifications:string,
    status:ApplicationStatus,
    rejectionReason?:string
}
export interface LatestApplicationDataResponse {
  psych: {
    psychId: string;
    role: string;
    isVerified: boolean;
  };
  application:LatestApplicationData | null
}
