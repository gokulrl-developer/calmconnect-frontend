import { AUTH_ROUTES } from "../constants/auth-endpoints";
import type { IAdminLoginResponse, ILoginCredentials, IPsychologistLoginResponse, IRegisterPayload, IRegisterResponse, ISignupCredentials, ISignupResponse, IUserLoginResponse, ResetPassword } from "../types/api/auth.types";
import axiosInstance from "./axiosInstance";

// -------- User Auth --------
export const googleAuthUser = (credentials: { code: string }) =>
  axiosInstance.post<IUserLoginResponse>(AUTH_ROUTES.USER_GOOGLE_AUTH, credentials).then(res => res.data);

export const loginUser = (credentials: ILoginCredentials) =>
  axiosInstance.post<IUserLoginResponse>(AUTH_ROUTES.USER_LOGIN, credentials).then(res => res.data);

export const signupUser = (data: ISignupCredentials) =>
  axiosInstance.post<ISignupResponse>(AUTH_ROUTES.USER_SIGNUP, data).then(res => res.data);

export const registerUser = (payload: IRegisterPayload) =>
  axiosInstance.post<IRegisterResponse>(AUTH_ROUTES.USER_REGISTER, payload).then(res => res.data);

export const resendUserOtp = (data: { email: string }) =>
  axiosInstance.post<ISignupResponse>(AUTH_ROUTES.USER_RESEND_SIGNUP_OTP, data).then(res => res.data);

// -------- Psychologist Auth --------
export const googleAuthPsychologist = (credentials: { code: string }) =>
  axiosInstance.post<IPsychologistLoginResponse>(AUTH_ROUTES.PSYCH_GOOGLE_AUTH, credentials).then(res => res.data);

export const loginPsychologist = (credentials: ILoginCredentials) =>
  axiosInstance.post<IPsychologistLoginResponse>(AUTH_ROUTES.PSYCH_LOGIN, credentials).then(res => res.data);

export const signupPsychologist = (data: ISignupCredentials) =>
  axiosInstance.post<ISignupResponse>(AUTH_ROUTES.PSYCH_SIGNUP, data).then(res => res.data);

export const registerPsychologist = (payload: IRegisterPayload) =>
  axiosInstance.post<IRegisterResponse>(AUTH_ROUTES.PSYCH_REGISTER, payload).then(res => res.data);

export const resendPsychologistOtp = (data: { email: string }) =>
  axiosInstance.post<ISignupResponse>(AUTH_ROUTES.PSYCH_RESEND_SIGNUP_OTP, data).then(res => res.data);

// -------- Admin Auth --------
export const loginAdmin = (credentials: ILoginCredentials) =>
  axiosInstance.post<IAdminLoginResponse>(AUTH_ROUTES.ADMIN_LOGIN, credentials).then(res => res.data);

// -------- Common --------
export const logOut = () =>
  axiosInstance.post<{ messsage: string }>(AUTH_ROUTES.LOGOUT).then(res => res.data);

export const refreshTokenAPI = () =>
  axiosInstance.post(AUTH_ROUTES.REFRESH_TOKEN).then(res => res.data);

// -------- Forgot / Reset Password --------
export const forgotPasswordUser = (data: { email: string }) =>
  axiosInstance.post<{ message: string }>(AUTH_ROUTES.USER_FORGOT_PASSWORD, data).then(res => res.data);

export const resetPasswordUser = (data: ResetPassword) =>
  axiosInstance.post<{ message: string }>(AUTH_ROUTES.USER_RESET_PASSWORD, data).then(res => res.data);

export const resendOtpResetUser = (data: { email: string }) =>
  axiosInstance.post<{ message: string }>(AUTH_ROUTES.USER_RESEND_RESET_OTP, data).then(res => res.data);

export const forgotPasswordPsych = (data: { email: string }) =>
  axiosInstance.post<{ message: string }>(AUTH_ROUTES.PSYCH_FORGOT_PASSWORD, data).then(res => res.data);

export const resetPasswordPsych = (data: ResetPassword) =>
  axiosInstance.post<{ message: string }>(AUTH_ROUTES.PSYCH_RESET_PASSWORD, data).then(res => res.data);

export const resendOtpResetPsych = (data: { email: string }) =>
  axiosInstance.post<{ message: string }>(AUTH_ROUTES.PSYCH_RESEND_RESET_OTP, data).then(res => res.data);
