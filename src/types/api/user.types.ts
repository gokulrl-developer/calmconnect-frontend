import type { CheckoutData } from "../components/user.types";
import type { Slot } from "../domain/AvailabiliityRule.types";
import type paginationData from "../pagination.types";

export interface ListPsychSummary {
  psychId: string;
  name: string;
  rating: number | null;
  specializations: string | null;
  hourlyFees: number | null;
  profilePicture: string | null;
  bio: string | null;
  qualifications: string | null;
}
export interface PsychDetails {
  availableSlots: Slot[];
  psychId: string;
  name: string;
  rating: number;
  specializations: string[];
  bio: string;
  qualifications: string;
  profilePicture: string;
  hourlyFees: number;
}

export interface UserProfile {
  profile: {
    firstName: string;
    lastName: string;
    email: string;
    gender?: "male" | "female" | "others";
    dob?: Date;
    profilePicture?: string;
    address?: string;
  };
}

export interface FetchCheckoutRequest {
  psychId: string;
  date: string;
  startTime: string;
}

export interface CheckoutDataResponse {
  data: CheckoutData;
}

export interface CreateOrderRequest {
  psychId: string;
  date: string;
  startTime: string;
}

export interface CreateOrderResponse {
  data: {
    providerOrderId: string;
    amount: number;
    sessionId: string;
  };
}

export interface VerifyPaymentPayload {
  providerOrderId: string;
  providerPaymentId: string;
  signature: string;
  sessionId: string;
}

export interface VerifyPaymentResponse {
  message: string;
}

export interface SessionListingUserItem {
  psychFullName: string;
  psychEmail: string;
  startTime: Date;
  endTime: Date;
  durationInMins: number;
  status: "scheduled" | "ended" | "cancelled" | "pending";
  fees: number;
  sessionId: string;
}

export interface SessionListingUserResponse {
  sessions: SessionListingUserItem[];
  paginationData: paginationData;
}

export interface CheckSessionAccessResponse {
  allowed: boolean;
  reason?: string;
  session?: SessionDetailsInVideoCall;
}

export interface SessionDetailsInVideoCall {
  psychologist: string;
  user: string;
  startTime: Date;
  endTime: Date;
  durationInMins: number;
  sessionId: string;
}

export interface ComplaintDetailsResponse {
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

export interface ComplaintListingItem {
  complaintId: string;
  psychologistFullName: string;
  psychologistEmail: string;
  sessionId?: string;
  status: "pending" | "resolved";
  createdAt: string;
}

export interface ComplaintListingResponse {
  complaints: ComplaintListingItem[];
  paginationData: paginationData;
}

export interface CreateComplaintRequest {
  sessionId: string;
  description: string;
}

export interface CreateReviewRequest{
  sessionId:string,
  rating:number,
  comment?:string, // max 300 characters
}

export interface ListPsychReviewsItem {
  reviewId: string;
  rating: number; // 1-5
  createdAt: string;
  comment?: string; // 300 characters ...
}
export interface ListPsychReviewsResponse {
  paginationData: paginationData;
  reviews: ListPsychReviewsItem[];
}

export interface ListPsychReviewsRequest{
 psychId:string;
 sort:"recent"|"top-rated";
 skip:number;
 limit:number;
}

export interface UserSessionSummary{
    totalSessions:number;
    completedSessions:number;
    upcomingSessions:number;
    cancelledSessions:number;
}

export interface UserRecentSessionsEntry{
    sessionId:string;
    firstName:string;
    lastName:string;
    profilePicture:string;
    startTime: string;
    status:"scheduled"|"cancelled"|"ended"|"pending"
}

export interface UserRecentTransactionsEntry{
    transactionId:string;
    time:string;
    type:"credit"|"debit";
    referenceType?:"booking"|"refund";
    psychFirstName:string;
    psychLastName:string
}

export interface UserRecentComplaintsEntry{
    complaintId:string;
    psychFirstName:string;
    psychLastName:string;
    raisedTime:string;
    status:"pending"|"resolved"
}
export interface UserDashboardResponse{
    sessionSummary:UserSessionSummary,
    recentSessions:UserRecentSessionsEntry[],
    recentTransactions:UserRecentTransactionsEntry[],
    recentComplaints:UserRecentComplaintsEntry[]
}