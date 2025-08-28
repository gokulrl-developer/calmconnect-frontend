import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface statusInitialState{
  error:null|string;
  success:null|string;
}

const initialState:statusInitialState={
  error:null,
  success:null
}

const statusSlice = createSlice({
  name: "status",
  initialState,
  reducers: {
    setError: (state, action:PayloadAction<string | null>) => { 
      state.error = action.payload;
     },
    setSuccess: (state, action:PayloadAction<string | null>) => { state.success = action.payload; },
    clearError: (state) => { state.error = null; },
    clearSuccess: (state) => { state.success = null; },
  }
});

export const { setError, setSuccess, clearError, clearSuccess } = statusSlice.actions;
export default statusSlice.reducer;
