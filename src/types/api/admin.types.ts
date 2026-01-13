import type { ComplaintStatus } from "../../constants/complaint-status";
import type { PsychologistGender } from "../../constants/psychologist-gender";
import type { PsychologistStatus } from "../../constants/psychologist-status";
import type { SessionStatus } from "../../constants/SessionStatus";
import type { UserGender } from "../../constants/UserGender";
import type { UserStatus } from "../../constants/UserStatus";
import type PaginationData from "../pagination.types"

export interface AdminPsychDetailsResponse {
  firstName: string;
  lastName: string;
  email: string;
  isBlocked: boolean;
  psychId: string;
  gender?: PsychologistGender;
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
  gender?: UserGender;
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
  status:  SessionStatus;
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
  psychologistStatus:PsychologistStatus;
  sessionId?: string;
  sessionStartTime: string;
  sessionEndTime: string;
  sessionStatus: SessionStatus;
  sessionFees: number;
  description: string;
  status: ComplaintStatus;
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
    status:ComplaintStatus,
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
    status:ComplaintStatus,
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
  userCount: number;       
  psychologistCount: number; 
}

export interface AdminSessionTrendsEntry {
  label: string;             // day or month
  sessionCount: number;          // total booked sessions
  cancelledSessionCount: number; // cancelled sessions
}

export interface AdminTopPsychologistEntry {
  psychId: string;
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

export interface UserSummary{
    totalUserCount:number; // all time total
    addedUserCount:number; // added in the time range
}
export interface PsychSummary{
    totalPsychologistCount:number; // all time total
    addedPsychologistCount:number; // added in the time range
}
export interface SessionSummary{
    totalSessionCount:number; // all time total
    addedSessionCount:number; // added in the time range
}
export interface RevenueSummary{
    totalRevenue:number; // all time total
    addedRevenue:number; // added in the time range
}

export interface DashboardSummaryCardResponse{
   userSummary:UserSummary;
    psychologistSummary:PsychSummary;
    sessionSummary:SessionSummary;
    revenueSummary:RevenueSummary;
}

export interface ApplicationItem {
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  specializations: string[];
  applicationId:string
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
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  status: UserStatus ;
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
  psychId: string;
  firstName: string;
  lastName: string;
  email: string;
  status: PsychologistStatus ;
}

export interface PsychList {
  success: boolean;
  data: PsychItem[];
}

export interface IPsychResponse {
  success: boolean;
  message: string;
}