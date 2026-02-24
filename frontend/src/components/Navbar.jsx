import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice.js";

export default function Navbar() {
  const token = useSelector((s) => s.auth.token);
  const dispatch = useDispatch();
  const nav = useNavigate();

  function doLogout() {
    dispatch(logout());
    nav("/login");
  }

  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="app-container flex items-center justify-between py-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-lg font-bold text-slate-900">
            Galaxy
          </Link>
          {token && (
            <div className="flex items-center gap-4">
              <Link
                to="/users"
                className="text-sm text-slate-600 hover:text-slate-900"
              >
                Users
              </Link>
              <Link
                to="/projects"
                className="text-sm text-slate-600 hover:text-slate-900"
              >
                Projects
              </Link>
              <Link
                to="/tasks/pending"
                className="text-sm text-slate-600 hover:text-slate-900"
              >
                Pending Tasks
              </Link>
              <Link
                to="/attendance"
                className="text-sm text-slate-600 hover:text-slate-900"
              >
                Attendance
              </Link>
              <Link
                to="/switch-org"
                className="text-sm text-slate-600 hover:text-slate-900"
              >
                Organizations
              </Link>
              <Link
                to="/settings"
                className="text-sm text-slate-600 hover:text-slate-900"
              >
                Settings
              </Link>
              <Link
                to="/logs"
                className="text-sm text-slate-600 hover:text-slate-900"
              >
                Activity
              </Link>
              <Link
                to="/admin"
                className="text-sm text-slate-600 hover:text-slate-900"
              >
                Admin
              </Link>
            </div>
          )}
        </div>
        <div>
          {token ? (
            <button
              className="inline-flex items-center px-3 py-2 border rounded border-slate-300 text-slate-700"
              onClick={doLogout}
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
