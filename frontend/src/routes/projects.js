import React from "react";
import Projects, { loader as projectsLoader } from "../pages/Projects.jsx";
import ProjectDetail, {
  loader as projectDetailLoader,
} from "../pages/ProjectDetail.jsx";

export const projectsRoutes = [
  {
    path: "projects",
    element: React.createElement(Projects),
    loader: projectsLoader,
  },
  {
    path: "projects/:id",
    element: React.createElement(ProjectDetail),
    loader: projectDetailLoader,
  },
];

export default projectsRoutes;
