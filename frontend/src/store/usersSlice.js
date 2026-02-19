import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api.js";

const initialState = { list: [], loading: false, error: null, total: 0 };

export const fetchUsers = createAsyncThunk(
  "users/fetch",
  async (params, thunkAPI) => {
    try {
      const res = await api.get("/users", { params });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || { message: err.message },
      );
    }
  },
);

const slice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload || [];
        state.total = Array.isArray(action.payload) ? action.payload.length : 0;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      });
  },
});

export default slice.reducer;
