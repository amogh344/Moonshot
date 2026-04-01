import { useState, useEffect } from "react";
import { createProject, getProjects, deleteProject } from "./services/api";
import { Plus, Trash2, Folder } from "lucide-react";

function ProjectManager() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await getProjects();
        setProjects(res.data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load projects");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const refreshProjects = async () => {
    try {
      const res = await getProjects();
      setProjects(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to refresh projects");
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await createProject({ name });
      setName("");
      await refreshProjects();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create project");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await deleteProject(id);
        setProjects((prev) => prev.filter((p) => p._id !== id));
      } catch (err) {
        setError(err.response?.data?.error || "Failed to delete project");
        console.error(err);
      }
    }
  };

  if (loading) {
    return (
      <div className="mt-8 w-full max-w-lg text-center text-gray-500">
        Loading projects...
      </div>
    );
  }

  return (
    <div className="mt-8 w-full max-w-lg">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Folder className="text-blue-500" size={24} />
        My Projects
      </h3>

      {error && (
        <p className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <input
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New Project Name..."
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition shadow-md"
        >
          <Plus size={24} />
        </button>
      </form>

      <div className="space-y-3">
        {projects.length === 0 && (
          <p className="text-gray-400 italic">No projects yet...</p>
        )}

        {projects.map((p) => (
          <div
            key={p._id}
            className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition"
          >
            <div>
              <p className="font-medium text-gray-700">{p.name}</p>
              <p className="text-xs text-gray-400">
                {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : ""}
              </p>
            </div>

            <button
              onClick={() => handleDelete(p._id)}
              className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-full transition"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProjectManager;
