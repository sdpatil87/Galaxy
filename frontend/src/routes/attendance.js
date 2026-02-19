import React from "react";
import Attendance, {
  loader as attendanceLoader,
} from "../pages/Attendance.jsx";
import AttendanceSummary, {
  loader as attendanceSummaryLoader,
} from "../pages/AttendanceSummary.jsx";

export const attendanceRoutes = [
  {
    path: "attendance",
    element: React.createElement(Attendance),
    loader: attendanceLoader,
  },
  {
    path: "attendance/summary",
    element: React.createElement(AttendanceSummary),
    loader: attendanceSummaryLoader,
  },
];

export default attendanceRoutes;
