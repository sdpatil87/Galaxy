import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api.js";

const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, thunkAPI) => {
    try {
      const res = await api.post("/auth/login", credentials);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || { message: err.message },
      );
    }
  },
);

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token || null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      });
  },
});

export const { logout } = slice.actions;
export default slice.reducer;
