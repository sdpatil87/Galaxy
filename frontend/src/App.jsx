import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Users from "./pages/Users.jsx";
import MainLayout from "./layouts/MainLayout.jsx";
import UserDetail from "./pages/UserDetail.jsx";
import Projects from "./pages/Projects.jsx";
import ProjectDetail from "./pages/ProjectDetail.jsx";
import Attendance from "./pages/Attendance.jsx";
import AttendanceSummary from "./pages/AttendanceSummary.jsx";
import SwitchOrg from "./pages/SwitchOrg.jsx";
import "./index.css";
import { useSelector } from "react-redux";

function RequireAuth({ children }) {
  const token = useSelector((s) => s.auth.token);
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/users"
          element={
            <RequireAuth>
              <Users />
            </RequireAuth>
          }
        />
        <Route
          path="/users/:id"
          element={
            <RequireAuth>
              <UserDetail />
            </RequireAuth>
          }
        />
        <Route
          path="/projects"
          element={
            <RequireAuth>
              <Projects />
            </RequireAuth>
          }
        />
        <Route
          path="/projects/:id"
          element={
            <RequireAuth>
              <ProjectDetail />
            </RequireAuth>
          }
        />
        <Route
          path="/attendance"
          element={
            <RequireAuth>
              <Attendance />
            </RequireAuth>
          }
        />
        <Route
          path="/attendance/summary"
          element={
            <RequireAuth>
              <AttendanceSummary />
            </RequireAuth>
          }
        />
        <Route
          path="/switch-org"
          element={
            <RequireAuth>
              <SwitchOrg />
            </RequireAuth>
          }
        />
      </Routes>
    </MainLayout>
  );
}

export default App;
