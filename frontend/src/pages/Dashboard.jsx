import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Dashboard() {
  const token = useSelector((s) => s.auth.token);

  if (!token) {
    return (
      <div className="mt-6">
        <div className="card">
          <h2 className="text-lg font-semibold">Dashboard</h2>
          <p className="mt-2 text-sm text-slate-600">
            Please log in to access the dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Welcome to Galaxy</h1>
        <p className="text-sm text-slate-600 mt-1">
          Manage your organization, users, projects, and attendance.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/users"
          className="card hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div className="text-sm font-medium text-slate-500">Users</div>
          <div className="text-2xl font-bold mt-2">→</div>
          <p className="text-xs text-slate-600 mt-2">Manage user accounts</p>
        </Link>

        <Link
          to="/projects"
          className="card hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div className="text-sm font-medium text-slate-500">Projects</div>
          <div className="text-2xl font-bold mt-2">→</div>
          <p className="text-xs text-slate-600 mt-2">View all projects</p>
        </Link>

        <Link
          to="/attendance"
          className="card hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div className="text-sm font-medium text-slate-500">Attendance</div>
          <div className="text-2xl font-bold mt-2">→</div>
          <p className="text-xs text-slate-600 mt-2">Check attendance logs</p>
        </Link>

        <Link
          to="/switch-org"
          className="card hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div className="text-sm font-medium text-slate-500">
            Organizations
          </div>
          <div className="text-2xl font-bold mt-2">→</div>
          <p className="text-xs text-slate-600 mt-2">Switch organization</p>
        </Link>
      </div>
    </div>
  );
}
