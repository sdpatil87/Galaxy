import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects } from "../store/projectsSlice.js";
import FilterBar from "../components/FilterBar.jsx";
import api from "../services/api.js";
import { userFilterSchema } from "../validators/user.js";
import { Link } from "react-router-dom";

export default function Projects() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((s) => s.projects);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    dispatch(fetchProjects(filters));
  }, [dispatch, filters]);

  return (
    <div className="mt-6">
      <div className="card">
        <h2 className="text-lg font-semibold">Projects</h2>
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
                  <div className="font-medium">{p.name}</div>
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
  return { projects: res.data };
}
