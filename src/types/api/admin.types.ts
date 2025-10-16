import type paginationData from "../pagination.types";

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

export interface SessionListingAdminItem {
  userFullName: string;
  psychFullName: string;
  userEmail:string,
  psychEmail:string,
  startTime: Date;
  endTime:Date;
  durationInMins: number;
  status: "scheduled"|"completed"|"cancelled"|"available"|"pending";
  fees: number;
  sessionId: string;
}

export interface SessionListingAdminResponse {
  sessions:SessionListingAdminItem[],
  paginationData:paginationData
}