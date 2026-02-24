import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects } from "../store/projectsSlice.js";
import FilterBar from "../components/FilterBar.jsx";
import api from "../services/api.js";
import { userFilterSchema } from "../validators/user.js";
import { Link, useLoaderData } from "react-router-dom";
import { showError } from "../utils/toast.js";

export default function Projects() {
  const dispatch = useDispatch();
  const loaderData = useLoaderData();
  const { list, loading } = useSelector((s) => s.projects);
  const [filters, setFilters] = useState(loaderData?.params || {});
  const [pendingCounts, setPendingCounts] = useState({}); // projectId -> count

  const loadProjects = () => {
    dispatch(fetchProjects(filters))
      .unwrap()
      .catch((err) => {
        showError(err.message || "Failed to load projects");
      });
  };

  // seed redux store if loader provided projects
  useEffect(() => {
    if (loaderData?.projects) {
      dispatch({
        type: fetchProjects.fulfilled.type,
        payload: loaderData.projects,
      });
    }
    loadProjects();
  }, [dispatch, filters, loaderData]);

  // whenever project list changes, fetch pending counts per project
  useEffect(() => {
    if (!list || list.length === 0) return;
    const loads = list.map((p) =>
      api
        .get(`/tasks/projects/${p._id}`)
        .then((res) => ({
          id: p._id,
          count: res.data.tasks.filter((t) => t.status !== "done").length,
        }))
        .catch(() => ({ id: p._id, count: 0 })),
    );
    Promise.all(loads).then((results) => {
      const map = {};
      results.forEach((r) => (map[r.id] = r.count));
      setPendingCounts(map);
    });
  }, [list]);

  return (
    <div className="mt-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Projects</h2>
          <button
            className="text-sm text-slate-600 hover:text-slate-900"
            onClick={loadProjects}
          >
            refresh
          </button>
        </div>
        <FilterBar onFilter={(f) => setFilters(f)} />
        <div className="mt-4">
          {loading ? (
            <p>Loading…</p>
          ) : list.length === 0 ? (
            <div className="text-sm text-slate-500">No projects found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {list.map((p) => (
                <Link
                  key={p._id}
                  to={`/projects/${p._id}`}
                  className="block p-3 border rounded hover:shadow"
                >
                  <div className="font-medium flex items-center gap-2">
                    {p.name}
                    {pendingCounts[p._id] > 0 && (
                      <span className="text-xs bg-yellow-200 text-yellow-800 px-1 rounded">
                        {pendingCounts[p._id]} pending
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-slate-500">
                    {p.organization || "—"}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export async function loader({ request }) {
  const url = new URL(request.url);
  const params = Object.fromEntries(url.searchParams.entries());
  try {
    userFilterSchema.parse(params);
  } catch (e) {
    // ignore parsing errors
  }
  const res = await api.get("/tasks/projects", { params });
  return { projects: res.data, params };
}
