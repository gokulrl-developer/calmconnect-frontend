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