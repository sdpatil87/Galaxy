import { useEffect, useState } from "react";
import api from "../services/api.js";
import { useSelector } from "react-redux";
import { showError } from "../utils/toast.js";

export default function UserLogs() {
  const user = useSelector((s) => s.auth.user);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const params = {};
        if (filter) params.user = filter;
        const res = await api.get("/logs", { params });
        setLogs(res.data || []);
      } catch (err) {
        showError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [filter]);

  return (
    <div className="mt-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold">User Activity Logs</h2>
        <div className="mt-2">
          <input
            type="text"
            placeholder="Filter by user ID (admins only)"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full border border-slate-300 rounded px-3 py-2"
          />
        </div>
        {loading ? (
          <p>Loading logs...</p>
        ) : logs.length === 0 ? (
          <p className="text-sm text-slate-500">No logs found.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Timestamp</th>
                  <th className="text-left py-2">Type</th>
                  <th className="text-left py-2">Message</th>
                  <th className="text-left py-2">User</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, i) => (
                  <tr key={i} className="border-b hover:bg-slate-50">
                    <td className="py-2 text-xs text-slate-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-2 text-xs font-medium">{log.type}</td>
                    <td className="py-2 text-xs">{log.message}</td>
                    <td className="py-2 text-xs">{log.meta?.user || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export async function loader() {
  try {
    const res = await api.get("/logs");
    return { logs: res.data };
  } catch (err) {
    console.error("failed to load logs", err);
    return { logs: [] };
  }
}
