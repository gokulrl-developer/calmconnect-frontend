export interface PsychProfile{
profile: {
    firstName: string;
    lastName: string;
    email: string;
    gender?: 'male' | 'female' | 'others';
    dob?: Date;
    profilePicture?: string | File;
    address?: string;
    languages?: string;
    specializations?: string[];
    bio?: string;
    qualifications?: string;
    hourlyFees?: number;
    quickSlotHourlyFees?: number;
  }
}
