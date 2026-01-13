
export interface ILoginCredentials{
    email:string;
    password:string
}

export interface IUserLoginResponse{
   user:{ firstName:string;
    lastName:string;
    userId:string
   },
    message:string;
}
export interface IPsychologistLoginResponse{
   psych:{ firstName:string;
    lastName:string;
    isVerified:boolean;
    psychId:string;
   },
   message:string
}
export interface IAdminLoginResponse{
    success:boolean;
    message:string;

}

export interface ISignupCredentials {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface IRegisterPayload {
  email: string;
  otp: string;
}

export interface ISignupResponse {
  message: string;
}

export interface IRegisterResponse {
  message: string;
}
export interface ResetPassword{
  email:string,
  otp:string,
  password:string
}
