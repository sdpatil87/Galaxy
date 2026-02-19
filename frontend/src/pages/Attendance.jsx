import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAttendance } from "../store/attendanceSlice.js";
import FilterBar from "../components/FilterBar.jsx";
import api from "../services/api.js";
import { userFilterSchema } from "../validators/user.js";

export default function Attendance() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((s) => s.attendance);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    dispatch(fetchAttendance(filters));
  }, [dispatch, filters]);

  return (
    <div className="mt-6">
      <div className="card">
        <h2 className="text-lg font-semibold">Attendance</h2>
        <FilterBar onFilter={(f) => setFilters(f)} />
        <div className="mt-4">
          {loading ? (
            <p>Loading…</p>
          ) : list.length === 0 ? (
            <div className="text-sm text-slate-500">No attendance records.</div>
          ) : (
            <div className="space-y-2">
              {list.map((a) => (
                <div key={a._id} className="p-2 border rounded">
                  <div className="font-medium">{a.user}</div>
                  <div className="text-sm text-slate-500">
                    {new Date(a.date).toLocaleDateString()}
                  </div>
                </div>
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
  } catch (e) {}
  const res = await api.get("/attendance", { params });
  return { attendance: res.data };
}
