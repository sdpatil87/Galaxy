import { useEffect, useState } from "react";
import api from "../services/api.js";
import { useSelector } from "react-redux";
import { showSuccess, showError } from "../utils/toast.js";

export default function Settings() {
  const user = useSelector((s) => s.auth.user);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const res = await api.get(`/users/${user.id}/settings`);
        setSettings(res.data || {});
      } catch (err) {
        showError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put(`/users/${user.id}/settings`, settings);
      showSuccess("Settings saved");
    } catch (err) {
      showError(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="mt-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold">User Settings</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium">Theme</label>
              <select
                value={settings.theme || "light"}
                onChange={(e) =>
                  setSettings({ ...settings, theme: e.target.value })
                }
                className="mt-1 block border border-slate-300 rounded px-3 py-2 w-full"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.notifications ?? true}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      notifications: e.target.checked,
                    })
                  }
                  className="mr-2"
                />
                <span className="text-sm">Enable Notifications</span>
              </label>
            </div>
            <button
              disabled={saving}
              onClick={handleSave}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export async function loader() {
  try {
    // fetch current user's settings (will be authenticated via interceptor)
    const res = await api.get("/users/me/settings");
    return { settings: res.data };
  } catch (err) {
    console.error("failed to load settings", err);
    return { settings: {} };
  }
}
