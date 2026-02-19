import React from "react";
import Login, { action as loginAction } from "../pages/Login.jsx";

export default {
  path: "/login",
  element: React.createElement(Login),
  action: loginAction,
};
