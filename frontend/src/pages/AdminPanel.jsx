import { useEffect, useState } from "react";
import api from "../services/api.js";
import { useSelector } from "react-redux";
import { showError, showSuccess } from "../utils/toast.js";

export default function AdminPanel() {
  const user = useSelector((s) => s.auth.user);
  const [orgs, setOrgs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrg, setSelectedOrg] = useState("");

  useEffect(() => {
    if (!user?.isSuperAdmin) {
      showError("You do not have permission to access this page");
      return;
    }
    (async () => {
      try {
        const res = await api.get("/organizations");
        setOrgs(res.data || []);
        if (res.data?.length > 0) {
          setSelectedOrg(res.data[0]._id);
        }
      } catch (err) {
        showError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  useEffect(() => {
    if (!selectedOrg) return;
    (async () => {
      try {
        const res = await api.get(`/users/organization/${selectedOrg}`);
        setUsers(res.data || []);
      } catch (err) {
        showError(err.response?.data?.message || err.message);
      }
    })();
  }, [selectedOrg]);

  if (!user?.isSuperAdmin) {
    return (
      <div className="mt-6">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
          <p className="text-red-600">Access Denied</p>
        </div>
      </div>
    );
  }

  if (loading) return <p>Loading admin panel...</p>;

  return (
    <div className="mt-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold">Global Admin Panel</h2>

        <div className="mt-4">
          <h3 className="font-medium">Select Organization</h3>
          <select
            value={selectedOrg}
            onChange={(e) => setSelectedOrg(e.target.value)}
            className="mt-2 block border border-slate-300 rounded px-3 py-2 w-full"
          >
            {orgs.map((org) => (
              <option key={org._id} value={org._id}>
                {org.name}
              </option>
            ))}
          </select>
        </div>

        {selectedOrg && (
          <div className="mt-6">
            <h3 className="font-medium">Users in Selected Organization</h3>
            {users.length === 0 ? (
              <p className="text-sm text-slate-500">No users found.</p>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Name</th>
                      <th className="text-left py-2">Email</th>
                      <th className="text-left py-2">Super Admin</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id} className="border-b hover:bg-slate-50">
                        <td className="py-2">{u.name || "—"}</td>
                        <td className="py-2">{u.email}</td>
                        <td className="py-2">
                          {u.isSuperAdmin ? "Yes" : "No"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 p-4 bg-slate-100 rounded">
          <h3 className="font-medium">Reports & Insights</h3>
          <p className="text-xs text-slate-600 mt-2">
            Total Organizations: {orgs.length}
          </p>
          {selectedOrg && (
            <p className="text-xs text-slate-600">
              Users in selected org: {users.length}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export async function loader() {
  try {
    const res = await api.get("/organizations");
    return { orgs: res.data };
  } catch (err) {
    console.error("failed to load organizations", err);
    return { orgs: [] };
  }
}
