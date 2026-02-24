import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api.js";
import { showSuccess, showError } from "../utils/toast.js";

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    api
      .get(`/tasks/projects/${id}`)
      .then((res) => setProject(res.data))
      .catch(() => {});
  }, [id]);

  // update a task's status and refresh project details
  const changeTaskStatus = async (taskId, status) => {
    try {
      setUpdating(true);
      await api.put(`/tasks/${taskId}`, { status });
      showSuccess("Task updated");
      const res = await api.get(`/tasks/projects/${id}`);
      setProject(res.data);
    } catch (err) {
      console.error("unable to update task", err);
      showError(err.response?.data?.message || err.message || err);
    } finally {
      setUpdating(false);
    }
  };

  if (!project) return <div>Loading…</div>;

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
      <h3 className="text-lg font-medium">{project.name}</h3>
      <p className="text-sm text-slate-600 mt-2">
        Organization: {project.organization}
      </p>
      <div className="mt-4">
        <h4 className="font-semibold">Tasks</h4>
        <ul className="mt-2 space-y-2">
          {project.tasks?.map((t) => (
            <li
              key={t._id}
              className="p-2 border rounded flex justify-between items-center"
            >
              <div>
                <div>{t.name}</div>
                {t.assignedTo?.name && (
                  <div className="text-xs text-slate-500">
                    assigned: {t.assignedTo.name}
                  </div>
                )}
                <div className="text-xs text-slate-500">
                  status: {t.status || "todo"}
                </div>
              </div>
              {t.status !== "done" && (
                <button
                  disabled={updating}
                  className="text-sm text-blue-600 hover:underline"
                  onClick={() => changeTaskStatus(t._id, "done")}
                >
                  complete
                </button>
              )}
            </li>
          ))}
        </ul>
        {updating && <div className="text-xs text-slate-500">updating…</div>}
      </div>
    </div>
  );
}

export async function loader({ params }) {
  const res = await api.get(`/tasks/projects/${params.id}`);
  return { project: res.data };
}
