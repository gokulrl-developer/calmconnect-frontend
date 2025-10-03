

export interface UserProfile{
   profile: {
    firstName: string;
    lastName: string;
    email: string;
    gender?: 'male' | 'female' | 'others';
    dob?: Date;
    profilePicture?: string | File;
    address?: string;
  };
}

export interface CheckoutData {
  startTime: string;
  endTime: string;
  durationInMins: number;
  quickSlot: boolean;
  fees: number;
}