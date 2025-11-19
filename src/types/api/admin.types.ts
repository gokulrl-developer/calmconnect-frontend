import type PaginationData from "../pagination.types"

export interface AdminPsychDetailsResponse {
  firstName: string;
  lastName: string;
  email: string;
  isBlocked: boolean;
  psychId: string;
  gender?: "male" | "female" | "others";
  dob?: Date;
  profilePicture?: string;
  address?: string;
  languages?: string;
  specializations?: string[];
  bio?: string;
  rating?: number;
  license?: string;
  qualifications?: string;
  createdAt?: Date;
}

export interface AdminUserDetailsResponse {
  firstName: string;
  lastName: string;
  email: string;
  isBlocked: boolean;
  userId: string;
  gender?: "male" | "female" | "others";
  dob?: Date;
  profilePicture?: string;
  address?: string;
}

export interface SessionListingAdminItem {
  userFullName: string;
  psychFullName: string;
  userEmail:string,
  psychEmail:string,
  startTime: Date;
  endTime:Date;
  durationInMins: number;
  status:  "scheduled"|"ended"|"cancelled"|"pending";
  fees: number;
  sessionId: string;
}

export interface SessionListingAdminResponse {
  sessions:SessionListingAdminItem[],
  paginationData:PaginationData
}

export interface ComplaintDetailsResponse {
  userId: string;
  userFullName: string;
  userEmail: string;
  psychologistId: string;
  psychologistFullName: string;
  psychologistEmail: string;
  sessionId?: string;
  sessionStartTime: string;
  sessionEndTime: string;
  sessionStatus: "scheduled" | "cancelled" | "ended" | "pending";
  sessionFees: number;
  description: string;
  status: "pending" | "resolved";
  createdAt: string;
  adminNotes?: string;
  resolvedAt?: string;
}

export interface ComplaintListingResponse{
  complaints:ComplaintListItem[],
  paginationData:PaginationData
}

export interface ComplaintListItem{
    complaintId:string,
    userFullName:string,
    userEmail:string,
    psychologistFullName:string,
    psychologistEmail:string,
    sessionId?:string,
    status:"pending"|"resolved",
    createdAt:string
}

export interface ComplaintResolutionRequest{
  adminNotes:string
}

export interface ComplaintHistoryItem{
    complaintId:string,
    userFullName:string,
    userEmail:string,
    psychologistFullName:string,
    psychologistEmail:string,
    sessionId?:string,
    status:"pending"|"resolved",
    createdAt:string
}

export interface ComplaintHistoryResponse{
  complaints:ComplaintHistoryItem[],
  paginationData:PaginationData
}


export interface AdminRevenueTrendsEntry {
  label: string;   
  revenue: number; 
}

export interface AdminRegistrationTrendsEntry {
  label: string;       
  users: number;       
  psychologists: number; 
}

export interface AdminSessionTrendsEntry {
  label: string;             // day or month
  sessions: number;          // total booked sessions
  cancelledSessions: number; // cancelled sessions
}

export interface AdminTopPsychologistEntry {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  sessionCount: number;
  profilePicture: string;
}
export interface AdminTopPsychologistResponse {
  topPsychologists:AdminTopPsychologistEntry[]
}

export interface FetchDashboardDataRequest {
  fromDate: string;
  toDate: string;
}

export interface AdminSessionTrendsResponse{
  sessionTrends:AdminSessionTrendsEntry[]
}
export interface AdminRegistrationTrendsResponse{
registrationTrends:AdminRegistrationTrendsEntry[]
}
export interface AdminRevenueTrendsResponse{
  revenueTrends:AdminRevenueTrendsEntry[]
}
export interface FetchRevenueGraphRequest extends FetchDashboardDataRequest {}
export interface FetchRegistrationTrendsRequest extends FetchDashboardDataRequest {}
export interface FetchSessionsGraphRequest extends FetchDashboardDataRequest {}
export interface FetchTopPsychologistRequest extends FetchDashboardDataRequest {
  limit: number; 
}

export interface SummaryCardItem{
    totalValue:number; // all time total
    addedValue:number; // added in the time range
}

export interface DashboardSummaryCardResponse{
    users:SummaryCardItem;
    psychologists:SummaryCardItem;
    sessions:SummaryCardItem;
    revenue:SummaryCardItem;
}