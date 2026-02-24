import React from "react";
import PendingTasks, {
  loader as pendingLoader,
} from "../pages/PendingTasks.jsx";

export const tasksRoutes = [
  {
    path: "tasks/pending",
    element: React.createElement(PendingTasks),
    loader: pendingLoader,
  },
];

export default tasksRoutes;
