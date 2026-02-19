import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api.js";

const initialState = { list: [], summary: null, loading: false, error: null };

export const fetchAttendance = createAsyncThunk(
  "attendance/fetch",
  async (params, thunkAPI) => {
    try {
      const res = await api.get("/attendance", { params });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || { message: err.message },
      );
    }
  },
);

export const fetchAttendanceSummary = createAsyncThunk(
  "attendance/summary",
  async (params, thunkAPI) => {
    try {
      const res = await api.get("/attendance/summary", { params });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || { message: err.message },
      );
    }
  },
);

const slice = createSlice({
  name: "attendance",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload || [];
      })
      .addCase(fetchAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      })
      .addCase(fetchAttendanceSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendanceSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload;
      })
      .addCase(fetchAttendanceSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      });
  },
});

export default slice.reducer;
