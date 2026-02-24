import React from "react";
import Settings, { loader as settingsLoader } from "../pages/Settings.jsx";
import AdminPanel, {
  loader as adminPanelLoader,
} from "../pages/AdminPanel.jsx";
import UserLogs, { loader as logsLoader } from "../pages/UserLogs.jsx";

export const settingsRoutes = [
  {
    path: "settings",
    element: React.createElement(Settings),
    loader: settingsLoader,
  },
  {
    path: "logs",
    element: React.createElement(UserLogs),
    loader: logsLoader,
  },
  {
    path: "admin",
    element: React.createElement(AdminPanel),
    loader: adminPanelLoader,
  },
];

export default settingsRoutes;
