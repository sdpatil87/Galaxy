import authRoute from "./auth.js";
import usersRoutes from "./users.js";
import projectsRoutes from "./projects.js";
import attendanceRoutes from "./attendance.js";
import React from "react";
import SwitchOrg, {
  loader as switchOrgLoader,
  action as switchOrgAction,
} from "../pages/SwitchOrg.jsx";
import MainLayout from "../layouts/MainLayout.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import { Navigate } from "react-router-dom";

const protectedChildren = [
  { index: true, element: React.createElement(Dashboard) },
  ...usersRoutes,
  ...projectsRoutes,
  ...attendanceRoutes,
  {
    path: "switch-org",
    element: React.createElement(SwitchOrg),
    loader: switchOrgLoader,
    action: switchOrgAction,
  },
];

export const routes = [
  authRoute,
  {
    path: "/",
    element: React.createElement(MainLayout),
    children: protectedChildren,
  },
];

export default routes;
