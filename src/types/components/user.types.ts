import type { UserGender } from "../../constants/UserGender";


export interface UserProfile{
   profile: {
    firstName: string;
    lastName: string;
    email: string;
    gender?: UserGender;
    dob?: Date;
    profilePicture?: string | File;
    address?: string;
  };
}

export interface CheckoutData {
  startTime: string;
  endTime: string;
  durationInMins: number;
  fees: number;
}

export interface ProfileErrors {
  firstName?: string;
  lastName?: string;
  gender?: string;
  dob?: string;
  address?: string;
  profilePicture?: string;
}

export type RazorpayCheckoutHandler = (response: {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}) => void;

export type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name?: string;
  description?: string;
  order_id: string;
  handler: RazorpayCheckoutHandler;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
};

export type RazorPayType= {
  new (options: RazorpayOptions): {
    open: () => void;
  };
};