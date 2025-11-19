

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