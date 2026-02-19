import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../store/usersSlice.js";
import FilterBar from "../components/FilterBar.jsx";
import { Link } from "react-router-dom";
import api from "../services/api.js";
import { userFilterSchema } from "../validators/user.js";

export default function Users() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((s) => s.users);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    dispatch(fetchUsers(filters));
  }, [dispatch, filters]);

  return (
    <div className="mt-6">
      <div className="card">
        <h2 className="text-lg font-semibold">Users</h2>
        <FilterBar onFilter={(f) => setFilters(f)} />
        <div className="mt-4">
          {loading ? (
            <p>Loading…</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {list.map((u) => (
                <Link
                  key={u._id}
                  to={`/users/${u._id}`}
                  className="block p-3 border rounded hover:shadow"
                >
                  <div className="font-medium">{u.email || u.name}</div>
                  <div className="text-sm text-slate-500">
                    {u.currentOrg || "—"}
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
    // ignore and let API handle filtering, but return a clean params object
  }
  const res = await api.get("/users", { params });
  return { users: res.data };
}
