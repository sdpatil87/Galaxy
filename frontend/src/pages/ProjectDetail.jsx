import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api.js";

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    api
      .get(`/tasks/projects/${id}`)
      .then((res) => setProject(res.data))
      .catch(() => {});
  }, [id]);

  if (!project) return <div>Loading…</div>;

  return (
    <div className="card">
      <h3 className="text-lg font-medium">{project.name}</h3>
      <p className="text-sm text-slate-600 mt-2">
        Organization: {project.organization}
      </p>
      <div className="mt-4">
        <h4 className="font-semibold">Tasks</h4>
        <ul className="mt-2 space-y-2">
          {project.tasks?.map((t) => (
            <li key={t._id} className="p-2 border rounded">
              {t.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export async function loader({ params }) {
  const res = await api.get(`/tasks/projects/${params.id}`);
  return { project: res.data };
}
