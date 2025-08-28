import axiosInstance from "./axiosInstance";

export interface ApplicationItem {
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  specializations: string[];
  id:string
}

export interface ApplicationList {
  success: boolean;
  data: ApplicationItem[];
}

export interface ApplicationDetails{
    firstName:string,
    lastName:string,
    email:string,
    submittedAt:string, 
    phone:string | null, 
    gender:string,
    dob:string,
    profilePicture:string,
    address:string,
    languages:string,
    specializations:string[],
    bio:string,
    licenseUrl:string,
    resume:string,
    qualifications:string,
    status:string,
}

export interface ApplicationDetailsResponse{
  details:ApplicationDetails,
  message:string
}
export interface IApplicationResponse {
  success: boolean;
  message: string;
}

export interface UserItem {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: "active" | "inactive" ;
}

export interface UserList {
  success: boolean;
  data: UserItem[];
}

export interface IUserResponse {
  success: boolean;
  message: string;
}

export interface PsychItem {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: "active" | "inactive" ;
}

export interface PsychList {
  success: boolean;
  data: PsychItem[];
}

export interface IPsychResponse {
  success: boolean;
  message: string;
}
export const fetchApplications = (page: number = 1) =>
  axiosInstance
    .get<ApplicationList>(`/admin/applications?page=${page}`)
    .then(res => res.data); 

export const fetchApplicationDetails = (applicationId:string) =>
  axiosInstance
    .get<ApplicationDetailsResponse>(`/admin/application/${applicationId}`)
    .then(res => res.data); 

export const updateApplication = (
  applicationId: string,
  status: "rejected" | "accepted",
  reason:string | null,
) =>
  axiosInstance
    .patch<IApplicationResponse>(`/admin/application/${applicationId}`, { status,reason })
    .then(res => res.data);



export const fetchUsers = (page: number = 1) =>
  axiosInstance
    .get<UserList>(`/admin/users?page=${page}`)
    .then(res => res.data);

export const updateUserStatus = (userId: string, status: "active" | "inactive") =>
  axiosInstance
    .patch<IUserResponse>(`/admin/user/${userId}`, { status })
    .then(res => res.data);


export const fetchPsychologists = (page: number = 1) =>
  axiosInstance
    .get<PsychList>(`/admin/psychologists?page=${page}`)
    .then(res => res.data);

export const updatePsychologistStatus = (
  psychId: string,
  status: "active" | "inactive"
) =>
  axiosInstance
    .patch<IPsychResponse>(`/admin/psychologist/${psychId}`, { status })
    .then(res => res.data);
