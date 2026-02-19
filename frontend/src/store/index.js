import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice.js";
import usersReducer from "./usersSlice.js";
import projectsReducer from "./projectsSlice.js";
import attendanceReducer from "./attendanceSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    projects: projectsReducer,
    attendance: attendanceReducer,
  },
});
