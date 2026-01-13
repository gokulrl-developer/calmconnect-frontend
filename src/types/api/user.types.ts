import type { ComplaintStatus } from "../../constants/complaint-status";
import type { ListPsychByUserSort } from "../../constants/list-psych-by-user-sort";
import type { SessionStatus } from "../../constants/SessionStatus";
import type { TransactionReferenceType } from "../../constants/TransactionReferenceType";
import type { TransactionType } from "../../constants/TransactionType";
import type { UserGender } from "../../constants/UserGender";
import type { CheckoutData } from "../components/user.types";
import type { Slot } from "../domain/AvailabiliityRule.types";
import type PaginationData from "../pagination.types"

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
    gender?: UserGender;
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
  status:SessionStatus;
  fees: number;
  sessionId: string;
}

export interface SessionListingUserResponse {
  sessions: SessionListingUserItem[];
  paginationData: PaginationData;
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
  sessionStatus: SessionStatus;
  sessionFees: number;
  description: string;
  status: ComplaintStatus;
  createdAt: string;
  adminNotes?: string;
  resolvedAt?: string;
}

export interface ComplaintListingItem {
  complaintId: string;
  psychologistFullName: string;
  psychologistEmail: string;
  sessionId?: string;
  status: ComplaintStatus;
  createdAt: string;
}

export interface ComplaintListingResponse {
  complaints: ComplaintListingItem[];
  paginationData: PaginationData;
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
  paginationData: PaginationData;
  reviews: ListPsychReviewsItem[];
}

export interface ListPsychReviewsRequest{
 psychId:string;
 sort:ListPsychByUserSort;
 skip:number;
 limit:number;
}

export interface UserSessionSummary{
    totalSessionCount:number;
    completedSessionCount:number;
    upcomingSessionCount:number;
    cancelledSessionCount:number;
}

export interface UserRecentSessionsEntry{
    sessionId:string;
    firstName:string;
    lastName:string;
    profilePicture:string;
    startTime: string;
    status:SessionStatus
}

export interface UserRecentTransactionsEntry{
    transactionId:string;
    time:string;
    type:TransactionType;
    referenceType?:TransactionReferenceType;
    psychFirstName:string;
    psychLastName:string
}

export interface UserRecentComplaintsEntry{
    complaintId:string;
    psychFirstName:string;
    psychLastName:string;
    raisedTime:string;
    status:ComplaintStatus
}
export interface UserDashboardResponse{
    sessionSummary:UserSessionSummary,
    recentSessions:UserRecentSessionsEntry[],
    recentTransactions:UserRecentTransactionsEntry[],
    recentComplaints:UserRecentComplaintsEntry[]
}