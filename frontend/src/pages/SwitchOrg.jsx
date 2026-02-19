import { useEffect, useState } from "react";
import api from "../services/api.js";
import { showSuccess, showError } from "../utils/toast.js";

export default function SwitchOrg() {
  const [orgs, setOrgs] = useState([]);

  useEffect(() => {
    api
      .get("/organizations")
      .then((res) => setOrgs(res.data))
      .catch(() => {});
  }, []);

  async function change(orgId) {
    try {
      await api.post("/auth/switch-org", { orgId });
      showSuccess("Organization switched.");
      window.location.reload();
    } catch (err) {
      showError(err.response?.data?.message || err.message);
    }
  }

  return (
    <div className="card max-w-md">
      <h3 className="text-lg font-medium">Switch Organization</h3>
      <div className="mt-3 space-y-2">
        {orgs.map((o) => (
          <div key={o._id} className="flex items-center justify-between">
            <div>{o.name}</div>
            <button className="btn-primary" onClick={() => change(o._id)}>
              Switch
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export async function loader() {
  const res = await api.get("/organizations");
  return { orgs: res.data };
}

export async function action({ request }) {
  const form = await request.formData();
  const { orgId } = Object.fromEntries(form);
  try {
    const res = await api.post("/auth/switch-org", { orgId });
    showSuccess("Organization switched.");
    return { success: true, data: res.data };
  } catch (err) {
    const e = err.response?.data || { message: err.message };
    showError(e?.message || e);
    return { error: e };
  }
}
