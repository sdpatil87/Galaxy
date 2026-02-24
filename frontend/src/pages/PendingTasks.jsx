import { useEffect, useState } from "react";
import { useLocation, useLoaderData, useNavigate } from "react-router-dom";
import api from "../services/api.js";
import { showSuccess, showError } from "../utils/toast.js";

export default function PendingTasks() {
  const loaderData = useLoaderData();
  const location = useLocation();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState(loaderData?.tasks || []);
  const [loading, setLoading] = useState(!loaderData);
  const [updating, setUpdating] = useState(false);
  const [projectFilter, setProjectFilter] = useState(loaderData?.project || "");
  const [availableProjects, setAvailableProjects] = useState([]);

  const load = async () => {
    setLoading(true);
    try {
      const params = { status: "todo" };
      if (projectFilter) params.project = projectFilter;
      const res = await api.get("/tasks", { params });
      const data = res.data || [];
      setTasks(data);
      // build project list for filter dropdown
      const projects = [];
      data.forEach((t) => {
        if (
          t.project &&
          t.project._id &&
          !projects.find((p) => p._id === t.project._id)
        ) {
          projects.push(t.project);
        }
      });
      setAvailableProjects(projects);
    } catch (err) {
      console.error("failed to load pending tasks", err);
      showError(err.response?.data?.message || err.message || err);
    } finally {
      setLoading(false);
    }
  };

  // reload when filter or url search changes (so back/forward works)
  useEffect(() => {
    load();
  }, [projectFilter, location.search]);

  // keep URL in sync with filter
  useEffect(() => {
    const params = new URLSearchParams();
    if (projectFilter) params.set("project", projectFilter);
    navigate({ search: params.toString() }, { replace: true });
  }, [projectFilter, navigate]);

  const markDone = async (id) => {
    setUpdating(true);
    try {
      await api.put(`/tasks/${id}`, { status: "done" });
      showSuccess("Task marked done");
      await load();
    } catch (err) {
      console.error("failed to update task", err);
      showError(err.response?.data?.message || err.message || err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="mt-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Pending Tasks</h2>
          <button
            className="text-sm text-slate-600 hover:text-slate-900"
            onClick={load}
            disabled={loading}
          >
            refresh
          </button>
        </div>
        <div className="mt-2">
          <label className="text-sm">Filter by project:&nbsp;</label>
          <select
            className="border rounded p-1 text-sm"
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
          >
            <option value="">(all)</option>
            {availableProjects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        {loading ? (
          <p>Loading…</p>
        ) : tasks.length === 0 ? (
          <div className="text-sm text-slate-500">No pending tasks.</div>
        ) : (
          <ul className="space-y-2 mt-4">
            {tasks.map((t) => (
              <li
                key={t._id}
                className="p-2 border rounded flex justify-between items-center"
              >
                <div>
                  <Link
                    to={`/projects/${t.project?._id}`}
                    className="font-medium"
                  >
                    {t.name}
                  </Link>
                  {t.project?.name && (
                    <div className="text-xs text-slate-500">
                      project: {t.project.name}
                    </div>
                  )}
                  {t.assignedTo?.name && (
                    <div className="text-xs text-slate-500">
                      assigned to: {t.assignedTo.name}
                    </div>
                  )}
                </div>
                <button
                  disabled={updating}
                  className="text-sm text-blue-600 hover:underline"
                  onClick={() => markDone(t._id)}
                >
                  complete
                </button>
              </li>
            ))}
          </ul>
        )}
        {updating && <div className="text-xs text-slate-500">updating…</div>}
      </div>
    </div>
  );
}

export async function loader({ request }) {
  const url = new URL(request.url);
  const params = { status: "todo" };
  const project = url.searchParams.get("project");
  if (project) params.project = project;
  const res = await api.get("/tasks", { params });
  return { tasks: res.data, project: project || "", params };
}
