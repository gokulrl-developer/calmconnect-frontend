import type { ListPsychSummary, PsychDetails, UserProfile } from "../types/api/user.types";
import type paginationData from "../types/pagination.types";
import axiosInstance from "./axiosInstance";


interface DashboardData{
  user:{
    id:string;
    role:string;
  }
}

export const fetchDashboard = () =>
  axiosInstance
    .get<DashboardData>("/user/dashboard")
    .then((res) => res);

export const fetchPsychologistsByUser = (params:string) =>
  axiosInstance
    .get<{psychologists:ListPsychSummary[],paginationData:paginationData}>(`/user/psychologists?${params}`)
    .then((res) => res);
    
export const fetchPsychDetailsByUser = (params:string) =>
  axiosInstance
    .get<PsychDetails>(`/user/psychologist-details?${params}`)
    .then((res) => res);

export const fetchUserProfile=()=>
    axiosInstance
  .get<UserProfile>(`/user/profile`)
  .then((res)=>res)

  export const updateUserProfile=(formData:FormData)=>
    axiosInstance
  .patch<{message:string}>(`/user/profile`,formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      }})
  .then((res)=>res)