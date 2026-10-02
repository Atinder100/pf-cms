
import { useEffect, useState } from "react";
import axios from "axios";

function Skills() {
  const [skills, setSkills] = useState([]);
  const [form, setForm] = useState({
    name: "",
    category: "",
    proficiency: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/skills",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSkills(response.data);
    } catch (error) {
      console.error("Failed to fetch skills:", error);
      setMessage("Failed to load skills");
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
      let response;

      if (editingId) {
        response = await axios.put(
          `http://localhost:5000/api/skills/${editingId}`,
          form,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setMessage("Skill updated successfully");
      } else {
        response = await axios.post(
          "http://localhost:5000/api/skills",
          form,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setMessage("Skill created successfully");
      }

      setForm({
        name: "",
        category: "",
        proficiency: "",
      });

      setEditingId(null);

      fetchSkills();
    } catch (error) {
      console.error("Failed to save skill:", error);

      setMessage(
        error.response?.data?.message || "Failed to save skill"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (skill) => {
    setForm({
      name: skill.name || "",
      category: skill.category || "",
      proficiency: skill.proficiency || "",
    });

    setEditingId(skill.id);
    setMessage("");
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this skill?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:5000/api/skills/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Skill deleted successfully");
      fetchSkills();
    } catch (error) {
      console.error("Failed to delete skill:", error);

      setMessage(
        error.response?.data?.message || "Failed to delete skill"
      );
    }
  };

  const handleCancel = () => {
    setForm({
      name: "",
      category: "",
      proficiency: "",
    });

    setEditingId(null);
    setMessage("");
  };

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-slate-500">Loading Skills...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Skills
        </h1>

        <p className="mt-2 text-slate-500">
          Manage your technical skills and proficiency levels.
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
            {editingId ? "Edit Skill" : "Add Skill"}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {editingId
              ? "Update the selected skill."
              : "Add a new skill to your portfolio."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Name
              </label>

              <input
                id="name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="e.g. React"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Category
              </label>

              <input
                id="category"
                type="text"
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="e.g. Frontend"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </div>

            {/* Proficiency */}
            <div>
              <label
                htmlFor="proficiency"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Proficiency
              </label>

              <input
                id="proficiency"
                type="number"
                min="0"
                max="100"
                name="proficiency"
                value={form.proficiency}
                onChange={handleChange}
                placeholder="0 - 100"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />

              <p className="mt-1.5 text-xs text-slate-400">
                Enter a value between 0 and 100.
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
                ? "Update Skill"
                : "Add Skill"}
            </button>
          </div>
        </form>
      </div>

      {/* Skills Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Existing Skills
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Skills currently stored in your portfolio.
          </p>
        </div>

        {skills.length === 0 ? (
          <div className="px-6 py-10 text-center">
            <p className="text-sm text-slate-500">
              No skills found.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-semibold">Name</th>
                  <th className="px-6 py-4 font-semibold">Category</th>
                  <th className="px-6 py-4 font-semibold">
                    Proficiency
                  </th>
                  <th className="px-6 py-4 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {skills.map((skill) => (
                  <tr
                    key={skill.id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {skill.name}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {skill.category || "-"}
                    </td>

                    <td className="px-6 py-4">
                      {skill.proficiency ? (
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-200">
                            <div
                              className="h-full rounded-full bg-slate-800"
                              style={{
                                width: `${skill.proficiency}%`,
                              }}
                            />
                          </div>

                          <span className="text-xs font-medium text-slate-600">
                            {skill.proficiency}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(skill)}
                          className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(skill.id)}
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

export default Skills;

