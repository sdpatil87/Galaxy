import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../validators/auth.js";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/authSlice.js";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";
import { showSuccess, showError } from "../utils/toast.js";

export default function Login() {
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(loginSchema),
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector((s) => s.auth.loading);

  async function onSubmit(data) {
    const res = await dispatch(login(data));
    if (res.type === "auth/login/fulfilled") {
      navigate("/");
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12">
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <label className="block text-sm">Email</label>
            <input {...register("email")} className="w-full input" />
          </div>
          <div>
            <label className="block text-sm">Password</label>
            <input
              {...register("password")}
              type="password"
              className="w-full input"
            />
          </div>
          <div>
            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export async function action({ request }) {
  const form = await request.formData();
  const data = Object.fromEntries(form);
  try {
    const parsed = loginSchema.parse(data);
    const res = await api.post("/auth/login", parsed);
    // store token locally for non-Redux flows; app still uses Redux login thunk
    if (res.data?.token) localStorage.setItem("token", res.data.token);
    showSuccess("Signed in successfully.");
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
