import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userDetailSchema } from "../validators/user.js";
import api from "../services/api.js";
import { showSuccess, showError } from "../utils/toast.js";
import { useEffect, useState } from "react";

export default function UserDetail() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset } = useForm({
    resolver: zodResolver(userDetailSchema),
  });

  useEffect(() => {
    let mounted = true;
    api
      .get(`/users/${id}`)
      .then((res) => {
        if (!mounted) return;
        reset(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
    return () => {
      mounted = false;
    };
  }, [id]);

  async function onSubmit(data) {
    try {
      await api.put(`/users/${id}`, data);
      showSuccess("Saved successfully.");
    } catch (err) {
      showError(err.response?.data?.message || err.message);
    }
  }

  if (loading) return <div>Loading…</div>;

  return (
    <div className="card max-w-lg">
      <h3 className="text-lg font-medium">Edit User</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-3 space-y-3">
        <div>
          <label className="block text-sm">Name</label>
          <input {...register("name")} className="input" />
        </div>
        <div>
          <label className="block text-sm">Email</label>
          <input {...register("email")} className="input" />
        </div>
        <div>
          <button className="btn-primary" type="submit">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

export async function loader({ params }) {
  const res = await api.get(`/users/${params.id}`);
  return { user: res.data };
}

export async function action({ request, params }) {
  const form = await request.formData();
  const data = Object.fromEntries(form);
  try {
    const parsed = userDetailSchema.parse(data);
    const res = await api.put(`/users/${params.id}`, parsed);
    showSuccess("Saved successfully.");
    return { success: true, data: res.data };
  } catch (err) {
    if (err.name === "ZodError") {
      showError("Validation failed.");
      return { error: err.errors };
    }
    const e = err.response?.data || { message: err.message };
    showError(e?.message || e);
    return { error: e };
  }
}
