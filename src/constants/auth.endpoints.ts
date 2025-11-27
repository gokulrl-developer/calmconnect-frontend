export const AUTH_ROUTES = {
  // -------- User Auth --------
  USER_GOOGLE_AUTH: "/user/social",
  USER_LOGIN: "/user/login",
  USER_SIGNUP: "/user/sign-up",
  USER_REGISTER: "/user/register",
  USER_RESEND_SIGNUP_OTP: "/user/resend-otp-signup",

  // Forgot / Reset Password (User)
  USER_FORGOT_PASSWORD: "/user/forgot-password",
  USER_RESET_PASSWORD: "/user/reset-password",
  USER_RESEND_RESET_OTP: "/user/resend-otp-reset",

  // -------- Psychologist Auth --------
  PSYCH_GOOGLE_AUTH: "/psychologist/social",
  PSYCH_LOGIN: "/psychologist/login",
  PSYCH_SIGNUP: "/psychologist/sign-up",
  PSYCH_REGISTER: "/psychologist/register",
  PSYCH_RESEND_SIGNUP_OTP: "/psychologist/resend-otp-signup",

  // Forgot / Reset Password (Psychologist)
  PSYCH_FORGOT_PASSWORD: "/psychologist/forgot-password",
  PSYCH_RESET_PASSWORD: "/psychologist/reset-password",
  PSYCH_RESEND_RESET_OTP: "/psych/resend-otp-reset",

  // -------- Admin Auth --------
  ADMIN_LOGIN: "/admin/login",

  // -------- Common --------
  LOGOUT: "/logout",
  REFRESH_TOKEN: "/refresh",
} as const;
