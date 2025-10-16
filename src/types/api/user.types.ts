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
 data:{ 
  providerOrderId: string;
  amount: number;
  sessionId: string;
 }
}

export interface VerifyPaymentPayload{
  providerOrderId: string;   
  providerPaymentId: string; 
  signature: string;         
  sessionId:string          
}

export interface VerifyPaymentResponse{
  message:string
}

export interface SessionListingUserItem {
  psychFullName: string;
  psychEmail:string;
  startTime: Date;
  endTime: Date;
  durationInMins: number;
  status: "scheduled"|"completed"|"cancelled"|"available"|"pending";
  fees: number;
  sessionId: string;
}

export interface SessionListingUserResponse{
  sessions:SessionListingUserItem[],
  paginationData:paginationData
}