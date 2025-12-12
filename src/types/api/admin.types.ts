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
  psychologistStatus:"active"|"inactive";
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
export interface FetchRevenueGraphRequest{
fromDate: string;
  toDate: string;
}
export interface FetchRegistrationTrendsRequest {
  fromDate: string;
  toDate: string;
}
export interface FetchSessionsGraphRequest {
  fromDate: string;
  toDate: string;
}
export interface FetchTopPsychologistRequest {
  fromDate: string;
  toDate: string;
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

export interface ApplicationItem {
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  specializations: string[];
  id:string
}

export interface ApplicationList {
  success: boolean;
  data: ApplicationItem[];
}

export interface ApplicationDetails{
    firstName:string,
    lastName:string,
    email:string,
    submittedAt:string, 
    phone:string | null, 
    gender:string,
    dob:string,
    profilePicture:string,
    address:string,
    languages:string,
    specializations:string[],
    bio:string,
    licenseUrl:string,
    resume:string,
    qualifications:string,
    status:string,
}

export interface ApplicationDetailsResponse{
  details:ApplicationDetails,
  message:string
}
export interface IApplicationResponse {
  success: boolean;
  message: string;
}

export interface UserItem {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: "active" | "inactive" ;
}

export interface UserList {
  success: boolean;
  data: UserItem[];
}

export interface IUserResponse {
  success: boolean;
  message: string;
}

export interface PsychItem {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: "active" | "inactive" ;
}

export interface PsychList {
  success: boolean;
  data: PsychItem[];
}

export interface IPsychResponse {
  success: boolean;
  message: string;
}