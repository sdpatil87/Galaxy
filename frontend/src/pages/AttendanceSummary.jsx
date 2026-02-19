import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAttendanceSummary } from "../store/attendanceSlice.js";
import api from "../services/api.js";

export default function AttendanceSummary() {
  const dispatch = useDispatch();
  const { summary, loading } = useSelector((s) => s.attendance);

  useEffect(() => {
    dispatch(fetchAttendanceSummary({}));
  }, [dispatch]);

  if (loading) return <div>Loading…</div>;

  return (
    <div className="card">
      <h3 className="text-lg font-medium">Attendance Summary</h3>
      <pre className="mt-3 text-sm">{JSON.stringify(summary, null, 2)}</pre>
    </div>
  );
}

export async function loader() {
  const res = await api.get("/attendance/summary");
  return { summary: res.data };
}
