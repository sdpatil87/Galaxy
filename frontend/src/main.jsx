import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./store/index.js";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import React from "react";

import routes from "./routes/index.js";

function RequireAuth({ children }) {
  // useSelector must be used inside a component under Provider; we'll read token from store
  const token = store.getState().auth?.token || localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

const protectedWrapper = (elem) => React.createElement(RequireAuth, {}, elem);

// Wrap protected routes' root element with RequireAuth
const wrappedRoutes = routes.map((r) => {
  if (r.path === "/") {
    return { ...r, element: protectedWrapper(r.element) };
  }
  return r;
});

const router = createBrowserRouter(wrappedRoutes);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
);
