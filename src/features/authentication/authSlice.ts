import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  loginUserAsync,
  loginPsychologistAsync,
  loginAdminAsync,
  googleAuthUserThunk,
  googleAuthPsyThunk,
} from "./authThunk";

const initialState: IAuthState = {
  role: null,
  firstName: null,
  lastName: null,
  isAuthenticated: false,
  isVerified: false,
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setRole: (state, action: PayloadAction<string>) => {
      state.role = action.payload;
    },
    removeRole: (state) => {
      state.role = null;
    },
    setVerification: (state, action: PayloadAction<boolean>) => {
      state.isVerified = action.payload;
    },
    logout: (state) => {
      state.role = null;
      state.firstName = null;
      state.lastName = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUserAsync.fulfilled, (state, action) => {
        state.firstName = action.payload.user.firstName;
        state.lastName = action.payload.user.lastName;
        state.role = "user";
        state.isAuthenticated = true;
      })
      .addCase(loginPsychologistAsync.fulfilled, (state, action) => {
        state.firstName = action.payload.psych.firstName;
        state.lastName = action.payload.psych.lastName;
        state.role = "psychologist";
        state.isAuthenticated = true;
        state.isVerified = action.payload.psych.isVerified;
      })
      .addCase(loginAdminAsync.fulfilled, (state) => {
        state.role = "admin";
        state.isAuthenticated = true;
      })
      .addCase(googleAuthUserThunk.fulfilled, (state, action) => {
        state.firstName = action.payload.user.firstName;
        state.lastName = action.payload.user.lastName;
        state.role = "user";
        state.isAuthenticated = true;
      })
      .addCase(googleAuthPsyThunk.fulfilled, (state, action) => {
        state.firstName = action.payload.psych.firstName;
        state.lastName = action.payload.psych.lastName;
        state.role = "psychologist";
        state.isAuthenticated = true;
        state.isVerified = action.payload.psych.isVerified;
      });
  },
});

export const { setRole, removeRole, logout, setVerification } =
  authSlice.actions;

export default authSlice.reducer;

export interface IAuthState {
  role: string | null;
  firstName: string | null;
  lastName: string | null;
  isAuthenticated: boolean;
  isVerified: boolean;
}
