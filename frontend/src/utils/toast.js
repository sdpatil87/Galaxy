import toast from "react-hot-toast";
import Messages from "../utils/messages.js";

export function showSuccess(msg) {
  toast.success(msg || Messages.SUCCESS.SAVED);
}

export function showError(err) {
  if (!err) return toast.error(Messages.ERROR.GENERIC);
  if (typeof err === "string") return toast.error(err);
  if (err.message) return toast.error(err.message);
  if (err?.message?.toString) return toast.error(err.message.toString());
  toast.error(Messages.ERROR.GENERIC);
}

export default { showSuccess, showError };
