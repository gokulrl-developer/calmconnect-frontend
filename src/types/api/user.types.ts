import type { CheckoutData } from "../components/user.types";
import type { Slot } from "../domain/AvailabiliityRule.types";

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
  quickSlotFees: number;
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
 data:{ providerOrderId: string;
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