import { useEffect, useState } from "react";
import axios from "axios";

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
        "http://localhost:5000/api/projects",
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
        "http://localhost:5000/upload/image",
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
          `http://localhost:5000/api/projects/${editingId}`,
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
          "http://localhost:5000/api/projects",
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
        `http://localhost:5000/api/projects/${id}`,
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
    return <p>Loading Projects...</p>;
  }

  return (
    <div>
      <h1>Projects</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <br />

          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label>Description</label>
          <br />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="6"
            required
          />
        </div>

        <br />

        <div>
          <label>Project Image</label>
          <br />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
          />

          <br />
          <br />

          <button
            type="button"
            onClick={handleImageUpload}
            disabled={uploadingImage || !imageFile}
          >
            {uploadingImage ? "Uploading..." : "Upload Image"}
          </button>

          {form.image && (
            <div>
              <br />

              <p>Current Image:</p>

              <img
                src={form.image}
                alt="Project"
                width="200"
              />
            </div>
          )}
        </div>

        <br />

        <div>
          <label>Technologies</label>
          <br />

          <input
            type="text"
            name="technologies"
            value={form.technologies}
            onChange={handleChange}
            placeholder="React, Node.js, PostgreSQL"
          />
        </div>

        <br />

        <div>
          <label>Live URL</label>
          <br />

          <input
            type="text"
            name="live_url"
            value={form.live_url}
            onChange={handleChange}
          />
        </div>

        <br />

        <div>
          <label>GitHub URL</label>
          <br />

          <input
            type="text"
            name="github_url"
            value={form.github_url}
            onChange={handleChange}
          />
        </div>

        <br />

        <button type="submit" disabled={saving}>
          {saving
            ? "Saving..."
            : editingId
            ? "Update Project"
            : "Add Project"}
        </button>

        {editingId && (
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        )}
      </form>

      {message && <p>{message}</p>}

      <hr />

      <h2>Existing Projects</h2>

      {projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Description</th>
              <th>Technologies</th>
              <th>Live URL</th>
              <th>GitHub URL</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {projects.map((project) => (
              <tr key={project.id}>
                <td>
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      width="100"
                    />
                  ) : (
                    "-"
                  )}
                </td>

                <td>{project.title}</td>

                <td>{project.description}</td>

                <td>
                  {Array.isArray(project.technologies)
                    ? project.technologies.join(", ")
                    : "-"}
                </td>

                <td>{project.live_url || "-"}</td>

                <td>{project.github_url || "-"}</td>

                <td>
                  <button onClick={() => handleEdit(project)}>
                    Edit
                  </button>

                  <button onClick={() => handleDelete(project.id)}>
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

export default Projects;