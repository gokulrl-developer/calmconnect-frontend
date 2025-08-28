import axiosInstance from "./axiosInstance";

interface IApplicationResponse {
  success: boolean;
  message: string;
}

interface ApplicationStatus {
  psych: {
    id: string;
    role: string;
    isVerified: boolean;
  };
  status: string;
}

interface DashboardData{
  psych:{
    id:string;
    role:string;
    isVerified:boolean
  }
}
export const fetchApplication = () =>
  axiosInstance
    .get<ApplicationStatus>("/psychologist/application")
    .then((res) => res);
export const fetchDashboard = () =>
  axiosInstance
    .get<DashboardData>("/psychologist/dashboard")
    .then((res) => res);
export const psychologistApply = (formData: FormData) =>
  axiosInstance
    .post<IApplicationResponse>("/psychologist/apply", formData)
    .then((res) => res);
