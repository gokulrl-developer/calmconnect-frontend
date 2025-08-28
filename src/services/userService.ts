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

