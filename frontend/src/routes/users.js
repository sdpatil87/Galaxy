import React from "react";
import Users, { loader as usersLoader } from "../pages/Users.jsx";
import UserDetail, {
  loader as userDetailLoader,
  action as userDetailAction,
} from "../pages/UserDetail.jsx";

export const usersRoutes = [
  { path: "users", element: React.createElement(Users), loader: usersLoader },
  {
    path: "users/:id",
    element: React.createElement(UserDetail),
    loader: userDetailLoader,
    action: userDetailAction,
  },
];

export default usersRoutes;
