import type PaginationData from "../pagination.types"

export interface PsychProfile{
profile: {
    firstName: string;
    lastName: string;
    email: string;
    gender?: 'male' | 'female' | 'others';
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
  status: "active" | "inactive";
  availabilityRuleId: string;
}

export interface AvailabilityRuleSummary {
  weekDay: number;
  availabilityRuleId: string;
}

// ---------- Special Days ----------
export interface SpecialDay {
  type: "override" | "absent";
  startTime?: string; // ISO string
  endTime?: string;   // ISO string
  durationInMins?: number;
  bufferTimeInMins?: number;
  status: "active" | "inactive";
  specialDayId: string;
}

// ---------- Quick Slots ----------
export interface QuickSlot {
  startTime: string; // ISO string
  endTime: string;   // ISO string
  durationInMins: number;
  bufferTimeInMins: number;
  status: "active" | "inactive";
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
  status?: "active" | "inactive";
}

export interface CreateSpecialDayPayload {
  date: string; // ISO date
  type: "override" | "absent";
  startTime?: string;  // ISO string
  endTime?: string;    // ISO string
  durationInMins?: number;
  bufferTimeInMins?: number;
}

export interface EditSpecialDayPayload {
  type?: "override" | "absent";
  startTime?: string;  // ISO string
  endTime?: string;    // ISO string
  durationInMins?: number;
  bufferTimeInMins?: number;
  status?: "active" | "inactive";
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
  status?: "active" | "inactive";
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
  status: "scheduled"|"ended"|"cancelled"|"pending";
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
  gender: "male" | "female" | "others";
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
  todaySessions: number;
  upcomingSessions: number;
  nextSessionTime: string;
  totalSessions: number;
  thisMonthSessions: number;
}
export interface PsychRatingSummary {
  current: number;
  lastMonth: number;
}
export interface PsychRevenueSummary {
  current: number;
  lastMonth: number;
}

export interface PsychSessionsTrendEntry {
  week: string;
  sessions: number;
}

export interface RevenueTrendEntry {
  week: string;
  revenue: number;
}

export interface RecentSessionEntry {
  id: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
  startTime: string;
  status: "scheduled" | "cancelled" | "ended" | "pending";
}

export interface PsychologistDashboardResponse {
  summary: DashboardSummary;
  sessionsTrend: PsychSessionsTrendEntry[];
  revenueTrend: RevenueTrendEntry[];
  recentSessions: RecentSessionEntry[];
}
