
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";

function Experience() {
  const [experiences, setExperiences] = useState([]);

  const [form, setForm] = useState({
    company: "",
    role: "",
    description: "",
    start_date: "",
    end_date: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    fetchExperience();
  }, []);

  const fetchExperience = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/experience`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setExperiences(response.data);
    } catch (error) {
      console.error("Failed to fetch experience:", error);
      setMessage("Failed to load experience");
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setMessage("");

    try {
      const experienceData = {
        company: form.company,
        role: form.role,
        description: form.description,
        start_date: form.start_date || null,
        end_date: form.end_date || null,
      };

      if (editingId) {
        await axios.put(
          `${API_URL}/api/experience/${editingId}`,
          experienceData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setMessage("Experience updated successfully");
      } else {
        await axios.post(
          `${API_URL}/api/experience`,
          experienceData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setMessage("Experience created successfully");
      }

      resetForm();
      fetchExperience();
    } catch (error) {
      console.error("Failed to save experience:", error);

      setMessage(
        error.response?.data?.message ||
          "Failed to save experience"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (experience) => {
    setForm({
      company: experience.company || "",
      role: experience.role || "",
      description: experience.description || "",
      start_date: experience.start_date
        ? experience.start_date.substring(0, 10)
        : "",
      end_date: experience.end_date
        ? experience.end_date.substring(0, 10)
        : "",
    });

    setEditingId(experience.id);
    setMessage("");
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this experience?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await axios.delete(
        `${API_URL}/api/experience/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Experience deleted successfully");
      fetchExperience();
    } catch (error) {
      console.error("Failed to delete experience:", error);

      setMessage(
        error.response?.data?.message ||
          "Failed to delete experience"
      );
    }
  };

  const resetForm = () => {
    setForm({
      company: "",
      role: "",
      description: "",
      start_date: "",
      end_date: "",
    });

    setEditingId(null);
  };

  const handleCancel = () => {
    resetForm();
    setMessage("");
  };

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-slate-500">
          Loading Experience...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Experience
        </h1>

        <p className="mt-2 text-slate-500">
          Manage your professional experience and career timeline.
        </p>
      </div>

      {/* Message */}
      {message && (
        <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
          {message}
        </div>
      )}

      {/* Form */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-lg font-semibold text-slate-900">
            {editingId
              ? "Edit Experience"
              : "Add Experience"}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {editingId
              ? "Update the selected experience."
              : "Add a new position to your professional timeline."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {/* Company + Role */}
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="company"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Company
              </label>

              <input
                id="company"
                type="text"
                name="company"
                value={form.company}
                onChange={handleChange}
                required
                placeholder="e.g. Labmentix"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </div>

            <div>
              <label
                htmlFor="role"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Role
              </label>

              <input
                id="role"
                type="text"
                name="role"
                value={form.role}
                onChange={handleChange}
                required
                placeholder="e.g. Full Stack Developer Intern"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </div>
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
              placeholder="Describe your responsibilities, work, and achievements..."
              className="w-full resize-y rounded-lg border border-slate-300 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          {/* Dates */}
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="start_date"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Start Date
              </label>

              <input
                id="start_date"
                type="date"
                name="start_date"
                value={form.start_date}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </div>

            <div>
              <label
                htmlFor="end_date"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                End Date
              </label>

              <input
                id="end_date"
                type="date"
                name="end_date"
                value={form.end_date}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />

              <p className="mt-1.5 text-xs text-slate-400">
                Leave empty if this position is current.
              </p>
            </div>
          </div>

          {/* Buttons */}
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
                ? "Update Experience"
                : "Add Experience"}
            </button>
          </div>
        </form>
      </div>

      {/* Existing Experience */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Existing Experience
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Experience entries currently stored in your portfolio.
          </p>
        </div>

        {experiences.length === 0 ? (
          <div className="px-6 py-10 text-center">
            <p className="text-sm text-slate-500">
              No experience found.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-semibold">
                    Company
                  </th>
                  <th className="px-6 py-4 font-semibold">
                    Role
                  </th>
                  <th className="px-6 py-4 font-semibold">
                    Description
                  </th>
                  <th className="px-6 py-4 font-semibold">
                    Start Date
                  </th>
                  <th className="px-6 py-4 font-semibold">
                    End Date
                  </th>
                  <th className="px-6 py-4 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {experiences.map((experience) => (
                  <tr
                    key={experience.id}
                    className="transition hover:bg-slate-50"
                  >
                    {/* Company */}
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {experience.company}
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4 text-slate-700">
                      {experience.role}
                    </td>

                    {/* Description */}
                    <td className="max-w-md px-6 py-4 text-slate-600">
                      <p className="line-clamp-3">
                        {experience.description}
                      </p>
                    </td>

                    {/* Start Date */}
                    <td className="px-6 py-4 text-slate-600">
                      {experience.start_date
                        ? experience.start_date.substring(0, 10)
                        : "-"}
                    </td>

                    {/* End Date */}
                    <td className="px-6 py-4">
                      {experience.end_date ? (
                        <span className="text-slate-600">
                          {experience.end_date.substring(0, 10)}
                        </span>
                      ) : (
                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                          Present
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() =>
                            handleEdit(experience)
                          }
                          className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(experience.id)
                          }
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

export default Experience;
