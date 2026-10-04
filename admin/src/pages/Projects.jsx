
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";

function Projects() {
  const [projects, setProjects] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    image: "",
    technologies: "",
    live_url: "",
    github_url: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/projects`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProjects(response.data);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      setMessage("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUpload = async () => {
    if (!imageFile) {
      setMessage("Please select an image first");
      return;
    }

    setUploadingImage(true);
    setMessage("");

    try {
      const formData = new FormData();

      formData.append("image", imageFile);

      const response = await axios.post(
        `${API_URL}/upload/image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setForm({
        ...form,
        image: response.data.media.url,
      });

      setMessage("Image uploaded successfully");
      setImageFile(null);
    } catch (error) {
      console.error("Failed to upload image:", error);

      setMessage(
        error.response?.data?.message || "Failed to upload image"
      );
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setMessage("");

    try {
      const projectData = {
        title: form.title,
        description: form.description,
        image: form.image || null,
        technologies: form.technologies
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item !== ""),
        live_url: form.live_url || null,
        github_url: form.github_url || null,
      };

      if (editingId) {
        await axios.put(
          `${API_URL}/api/projects/${editingId}`,
          projectData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setMessage("Project updated successfully");
      } else {
        await axios.post(
          `${API_URL}/api/projects`,
          projectData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setMessage("Project created successfully");
      }

      resetForm();
      fetchProjects();
    } catch (error) {
      console.error("Failed to save project:", error);

      setMessage(
        error.response?.data?.message || "Failed to save project"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (project) => {
    setForm({
      title: project.title || "",
      description: project.description || "",
      image: project.image || "",
      technologies: Array.isArray(project.technologies)
        ? project.technologies.join(", ")
        : "",
      live_url: project.live_url || "",
      github_url: project.github_url || "",
    });

    setImageFile(null);
    setEditingId(project.id);
    setMessage("");
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await axios.delete(
        `${API_URL}/api/projects/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Project deleted successfully");
      fetchProjects();
    } catch (error) {
      console.error("Failed to delete project:", error);

      setMessage(
        error.response?.data?.message || "Failed to delete project"
      );
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      image: "",
      technologies: "",
      live_url: "",
      github_url: "",
    });

    setImageFile(null);
    setEditingId(null);
  };

  const handleCancel = () => {
    resetForm();
    setMessage("");
  };

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-slate-500">Loading Projects...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Projects
        </h1>
        <p className="mt-2 text-slate-500">
          Add, edit, and manage the projects displayed in your portfolio.
        </p>
      </div>

      {/* Message */}
      {message && (
        <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
          {message}
        </div>
      )}

      {/* Project Form */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-lg font-semibold text-slate-900">
            {editingId ? "Edit Project" : "Add Project"}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {editingId
              ? "Update the selected project."
              : "Add a new project to your portfolio."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Title
            </label>

            <input
              id="title"
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="e.g. Portfolio CMS"
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Description
            </label>

            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="6"
              required
              placeholder="Describe your project..."
              className="w-full resize-y rounded-lg border border-slate-300 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          {/* Image */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Project Image
            </label>

            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-slate-800"
              />

              {imageFile && (
                <p className="mt-3 text-sm text-slate-500">
                  Selected: {imageFile.name}
                </p>
              )}

              <button
                type="button"
                onClick={handleImageUpload}
                disabled={uploadingImage || !imageFile}
                className="mt-4 rounded-lg bg-slate-700 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {uploadingImage ? "Uploading..." : "Upload Image"}
              </button>
            </div>

            {form.image && (
              <div className="mt-5">
                <p className="mb-3 text-sm font-medium text-slate-700">
                  Current Image
                </p>

                <div className="inline-block overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
                  <img
                    src={form.image}
                    alt="Project"
                    className="h-40 w-64 rounded-lg object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Technologies */}
          <div>
            <label
              htmlFor="technologies"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Technologies
            </label>

            <input
              id="technologies"
              type="text"
              name="technologies"
              value={form.technologies}
              onChange={handleChange}
              placeholder="React, Node.js, PostgreSQL"
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />

            <p className="mt-1.5 text-xs text-slate-400">
              Separate technologies using commas.
            </p>
          </div>

          {/* URLs */}
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="live_url"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Live URL
              </label>

              <input
                id="live_url"
                type="text"
                name="live_url"
                value={form.live_url}
                onChange={handleChange}
                placeholder="https://example.com"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </div>

            <div>
              <label
                htmlFor="github_url"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                GitHub URL
              </label>

              <input
                id="github_url"
                type="text"
                name="github_url"
                value={form.github_url}
                onChange={handleChange}
                placeholder="https://github.com/username/project"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </div>
          </div>

          {/* Form Buttons */}
          <div className="flex justify-end gap-3 border-t border-slate-200 pt-6">
            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : editingId
                ? "Update Project"
                : "Add Project"}
            </button>
          </div>
        </form>
      </div>

      {/* Existing Projects */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Existing Projects
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Projects currently stored in your portfolio.
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="px-6 py-10 text-center">
            <p className="text-sm text-slate-500">
              No projects found.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-semibold">Image</th>
                  <th className="px-6 py-4 font-semibold">Title</th>
                  <th className="px-6 py-4 font-semibold">
                    Description
                  </th>
                  <th className="px-6 py-4 font-semibold">
                    Technologies
                  </th>
                  <th className="px-6 py-4 font-semibold">Live URL</th>
                  <th className="px-6 py-4 font-semibold">
                    GitHub URL
                  </th>
                  <th className="px-6 py-4 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {projects.map((project) => (
                  <tr
                    key={project.id}
                    className="transition hover:bg-slate-50"
                  >
                    {/* Image */}
                    <td className="px-6 py-4">
                      {project.image ? (
                        <img
                          src={project.image}
                          alt={project.title}
                          className="h-16 w-24 rounded-lg border border-slate-200 object-cover"
                        />
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>

                    {/* Title */}
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {project.title}
                    </td>

                    {/* Description */}
                    <td className="max-w-xs px-6 py-4 text-slate-600">
                      <p className="line-clamp-3">
                        {project.description}
                      </p>
                    </td>

                    {/* Technologies */}
                    <td className="px-6 py-4">
                      {Array.isArray(project.technologies) &&
                      project.technologies.length > 0 ? (
                        <div className="flex max-w-xs flex-wrap gap-1.5">
                          {project.technologies.map((technology, index) => (
                            <span
                              key={index}
                              className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
                            >
                              {technology}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>

                    {/* Live URL */}
                    <td className="px-6 py-4">
                      {project.live_url ? (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noreferrer"
                          className="font-medium text-slate-700 hover:text-slate-900 hover:underline"
                        >
                          View
                        </a>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>

                    {/* GitHub URL */}
                    <td className="px-6 py-4">
                      {project.github_url ? (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noreferrer"
                          className="font-medium text-slate-700 hover:text-slate-900 hover:underline"
                        >
                          GitHub
                        </a>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(project)}
                          className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(project.id)}
                          className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
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

export default Projects;
