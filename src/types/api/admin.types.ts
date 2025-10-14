export interface AdminPsychDetailsResponse {
  firstName: string;
  lastName: string;
  email: string;
  isBlocked: boolean;
  psychId: string;
  gender?: "male" | "female" | "others";
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
  gender?: "male" | "female" | "others";
  dob?: Date;
  profilePicture?: string;
  address?: string;
}