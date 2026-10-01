import { useEffect, useState } from "react";
import axios from "axios";

function Skills() {
  const [skills, setSkills] = useState([]);
  const [form, setForm] = useState({
    name: "",
    category: "",
    proficiency: "",
    icon: "",
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
        icon: "",
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
      icon: skill.icon || "",
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
      icon: "",
    });

    setEditingId(null);
    setMessage("");
  };

  if (loading) {
    return <p>Loading Skills...</p>;
  }

  return (
    <div>
      <h1>Skills</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <br />
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label>Category</label>
          <br />
          <input
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
          />
        </div>

        <br />

        <div>
          <label>Proficiency</label>
          <br />
          <input
            type="text"
            name="proficiency"
            value={form.proficiency}
            onChange={handleChange}
          />
        </div>

        <br />

        <div>
          <label>Icon</label>
          <br />
          <input
            type="text"
            name="icon"
            value={form.icon}
            onChange={handleChange}
          />
        </div>

        <br />

        <button type="submit" disabled={saving}>
          {saving
            ? "Saving..."
            : editingId
            ? "Update Skill"
            : "Add Skill"}
        </button>

        {editingId && (
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        )}
      </form>

      {message && <p>{message}</p>}

      <hr />

      <h2>Existing Skills</h2>

      {skills.length === 0 ? (
        <p>No skills found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Proficiency</th>
              <th>Icon</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {skills.map((skill) => (
              <tr key={skill.id}>
                <td>{skill.name}</td>
                <td>{skill.category || "-"}</td>
                <td>{skill.proficiency || "-"}</td>
                <td>{skill.icon || "-"}</td>
                <td>
                  <button onClick={() => handleEdit(skill)}>
                    Edit
                  </button>

                  <button onClick={() => handleDelete(skill.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Skills;