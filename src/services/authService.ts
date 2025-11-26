import type { IAdminLoginResponse, ILoginCredentials, IPsychologistLoginResponse, IRegisterPayload, IRegisterResponse, ISignupCredentials, ISignupResponse, IUserLoginResponse, ResetPassword } from "../types/api/auth.types";
import axiosInstance from "./axiosInstance";


export const googleAuthUser = (credentials: {code:string}) => axiosInstance.post<IUserLoginResponse>("/user/social", credentials).then(res => res.data);

export const loginUser = (credentials: ILoginCredentials) => axiosInstance.post<IUserLoginResponse>("/user/login", credentials).then(res => res.data);
export const signupUser = (data: ISignupCredentials) =>
  axiosInstance.post<ISignupResponse>("/user/sign-up", data).then(res => res.data);
export const registerUser = (payload: IRegisterPayload) =>
  axiosInstance.post<IRegisterResponse>("/user/register", payload).then(res => res.data);

export const resendUserOtp = (data: {email:string}) =>
  axiosInstance.post<ISignupResponse>("/user/resend-otp-signup", data).then(res => res.data);



export const googleAuthPsychologist = (credentials: {code:string}) => axiosInstance.post<IPsychologistLoginResponse>("/psychologist/social", credentials).then(res => res.data);

export const loginPsychologist = (credentials: ILoginCredentials) => axiosInstance.post<IPsychologistLoginResponse>("/psychologist/login", credentials).then(res => res.data);
export const signupPsychologist = (data: ISignupCredentials) =>
  axiosInstance.post<ISignupResponse>("/psychologist/sign-up", data).then(res => res.data);

export const registerPsychologist = (payload: IRegisterPayload) =>
  axiosInstance.post<IRegisterResponse>("/psychologist/register", payload).then(res => res.data);

export const resendPsychologistOtp = (data: {email:string}) =>
  axiosInstance.post<ISignupResponse>("/psychologist/resend-otp-signup", data).then(res => res.data);

export const loginAdmin = (credentials: ILoginCredentials) => axiosInstance.post<IAdminLoginResponse>("/admin/login", credentials).then(res => res.data);
export const logOut = () => axiosInstance.post<{messsage:string}>("/logout" ).then(res => res.data);
export const forgotPasswordUser = (data: {email:string}) =>
  axiosInstance.post<{message:string}>("/user/forgot-password", data).then(res => res.data);
export const forgotPasswordPsych = (data: {email:string}) =>
  axiosInstance.post<{message:string}>("/psychologist/forgot-password", data).then(res => res.data);
export const resetPasswordPsych = (data: ResetPassword) =>
  axiosInstance.post<{message:string}>("/psychologist/reset-password", data).then(res => res.data);
export const resetPasswordUser = (data: ResetPassword) =>
  axiosInstance.post<{message:string}>("/user/reset-password", data).then(res => res.data);
export const resendOtpResetUser=(data:{email:string})=>
  axiosInstance.post<{message:string}>("/user/resend-otp-reset",data).then(res=>res.data)
export const resendOtpResetPsych=(data:{email:string})=>
  axiosInstance.post<{message:string}>("/psych/resend-otp-reset",data).then(res=>res.data)
export const refreshTokenAPI=()=>
  axiosInstance.post("/refresh").then(res=>res.data);