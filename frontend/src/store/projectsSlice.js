import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api.js";

const initialState = { list: [], loading: false, error: null };

export const fetchProjects = createAsyncThunk(
  "projects/fetch",
  async (params, thunkAPI) => {
    try {
      const res = await api.get("/tasks/projects", { params });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || { message: err.message },
      );
    }
  },
);

const slice = createSlice({
  name: "projects",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload || [];
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      });
  },
});

export default slice.reducer;
