import { createAsyncThunk } from "@reduxjs/toolkit";
import { setError, setSuccess } from "../statusSlice";
import { handleApiError } from "../../services/axiosInstance";
import {toast} from "sonner"
import {
  loginUser,
  loginPsychologist,
  loginAdmin,
  signupPsychologist,
  registerPsychologist,
  resendPsychologistOtp,
  resendUserOtp,
  registerUser,
  signupUser,
  googleAuthPsychologist,
  googleAuthUser
  
} from "../../services/authService";

import type {
  ILoginCredentials,
  IUserLoginResponse,
  IPsychologistLoginResponse,
  IAdminLoginResponse,
  IRegisterResponse,
  IRegisterPayload,
  ISignupCredentials,
  ISignupResponse
} from "../../services/authService"
console.log("thunk imported")

export const loginUserAsync = createAsyncThunk<
  IUserLoginResponse,
  ILoginCredentials,
  { rejectValue: string }
>(
  "auth/loginUser",
  async (credentials, thunkAPI) => {
    try {
      const data = await loginUser(credentials);
      toast.success("logged in successfully")
      thunkAPI.dispatch(setSuccess("User login successful"));
      return data;
    } catch (err) {
      handleApiError(err);
      const errorMessage =
        err instanceof Error ? err.message : "User login failed";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const loginPsychologistAsync = createAsyncThunk<
  IPsychologistLoginResponse,
  ILoginCredentials,
  { rejectValue: string }
>(
  "auth/loginPsychologist",
  async (credentials, thunkAPI) => {
    try {
      const data = await loginPsychologist(credentials);
      thunkAPI.dispatch(setSuccess("Psychologist login successful"));
      return data;
    } catch (err) {
      handleApiError(err);
      const errorMessage =
        err instanceof Error ? err.message : "Psychologist login failed";
      thunkAPI.dispatch(setError(errorMessage));
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const loginAdminAsync = createAsyncThunk<
  IAdminLoginResponse,
  ILoginCredentials,
  { rejectValue: string }
>(
  "auth/loginAdmin",
  async (credentials, thunkAPI) => {
    try {
      const data = await loginAdmin(credentials);
      thunkAPI.dispatch(setSuccess("Admin login successful"));
      return data;
    } catch (err) {
            handleApiError(err);
      const errorMessage =
        err instanceof Error ? err.message : "Admin login failed";
      thunkAPI.dispatch(setError(errorMessage));
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const signupUserAsync = createAsyncThunk<
  ISignupResponse,
  ISignupCredentials,
  { rejectValue: string }
>("auth/signupUser", async (credentials, thunkAPI) => {
  try {
    const data = await signupUser(credentials);
    console.log(data)
    thunkAPI.dispatch(setSuccess(data.message));
    return data;
  } catch (err) {
      handleApiError(err);
    const errorMessage = err instanceof Error ? err.message : "User signup failed";
    thunkAPI.dispatch(setError(errorMessage));
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

export const registerUserAsync = createAsyncThunk<
  IRegisterResponse,
  IRegisterPayload,
  { rejectValue: string }
>("auth/registerUser", async (payload, thunkAPI) => {
  try {
    const data = await registerUser(payload);
    thunkAPI.dispatch(setSuccess(data.message));
    return data;
  } catch (err) {
          handleApiError(err);
    const errorMessage = err instanceof Error ? err.message : "User registration failed";
    thunkAPI.dispatch(setError(errorMessage));
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

export const resendUserOtpAsync = createAsyncThunk<
  ISignupResponse,
  {email:string},
  { rejectValue: string }
>("auth/resendUserOtp", async (credentials, thunkAPI) => {
  try {
    console.log(credentials)
    const data = await resendUserOtp(credentials);
    thunkAPI.dispatch(setSuccess(data.message));
    return data;
  } catch (err) {
          handleApiError(err);
    const errorMessage = err instanceof Error ? err.message : "User resend OTP failed";
    thunkAPI.dispatch(setError(errorMessage));
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

// ===== PSYCHOLOGIST SIGNUP =====
export const signupPsychologistAsync = createAsyncThunk<
  ISignupResponse,
  ISignupCredentials,
  { rejectValue: string }
>("auth/signupPsychologist", async (credentials, thunkAPI) => {
  try {
    const data = await signupPsychologist(credentials);
    thunkAPI.dispatch(setSuccess(data.message));
    return data;
  } catch (err) {
          handleApiError(err);
    const errorMessage = err instanceof Error ? err.message : "Psychologist signup failed";
    thunkAPI.dispatch(setError(errorMessage));
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

export const registerPsychologistAsync = createAsyncThunk<
  IRegisterResponse,
  IRegisterPayload,
  { rejectValue: string }
>("auth/registerPsychologist", async (payload, thunkAPI) => {
  try {
    const data = await registerPsychologist(payload);
    thunkAPI.dispatch(setSuccess(data.message));
    return data;
  } catch (err) {
          handleApiError(err);
    const errorMessage = err instanceof Error ? err.message : "Psychologist registration failed";
    thunkAPI.dispatch(setError(errorMessage));
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

export const resendPsychologistOtpAsync = createAsyncThunk<
  ISignupResponse,
  {email:string},
  { rejectValue: string }
>("auth/resendPsychologistOtp", async (credentials, thunkAPI) => {
  try {
    const data = await resendPsychologistOtp(credentials);
    thunkAPI.dispatch(setSuccess(data.message));
    return data;
  } catch (err) {
          handleApiError(err);
    const errorMessage = err instanceof Error ? err.message : "Psychologist resend OTP failed";
    thunkAPI.dispatch(setError(errorMessage));
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

export const googleAuthUserThunk = createAsyncThunk<
  IUserLoginResponse,
  {code:string},
  { rejectValue: string }
>(
  "auth/googleAuthUser",
  async (credentials, thunkAPI) => {
    try {
      const data = await googleAuthUser(credentials);
      console.log(data)
      thunkAPI.dispatch(setSuccess("Verification successful"));
      return data;
    } catch (err) {
      handleApiError(err);
      const errorMessage =
        err instanceof Error ? err.message : "Verification failed";
      thunkAPI.dispatch(setError(errorMessage));
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const googleAuthPsyThunk = createAsyncThunk<
  IPsychologistLoginResponse,
  {code:string},
  { rejectValue: string }
>(
  "auth/googleAuthPsy",
  async (credentials, thunkAPI) => {
    try {
      const data = await googleAuthPsychologist(credentials);
      
      return data;
    } catch (err) {
      handleApiError(err);
      const errorMessage =
        err instanceof Error ? err.message : "Psychologist login failed";
      thunkAPI.dispatch(setError(errorMessage));
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);