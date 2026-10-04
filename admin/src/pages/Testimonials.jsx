
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";

function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);

  const [form, setForm] = useState({
    name: "",
    role: "",
    message: "",
    image: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/testimonials`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTestimonials(response.data);
    } catch (error) {
      console.error("Failed to fetch testimonials:", error);
      setMessage("Failed to load testimonials");
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
      const testimonialData = {
        name: form.name,
        role: form.role || null,
        message: form.message,
        image: form.image || null,
      };

      if (editingId) {
        await axios.put(
          `${API_URL}/api/testimonials/${editingId}`,
          testimonialData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setMessage("Testimonial updated successfully");
      } else {
        await axios.post(
          `${API_URL}/api/testimonials`,
          testimonialData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setMessage("Testimonial created successfully");
      }

      resetForm();
      fetchTestimonials();
    } catch (error) {
      console.error("Failed to save testimonial:", error);

      setMessage(
        error.response?.data?.message ||
          "Failed to save testimonial"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (testimonial) => {
    setForm({
      name: testimonial.name || "",
      role: testimonial.role || "",
      message: testimonial.message || "",
      image: testimonial.image || "",
    });

    setImageFile(null);
    setEditingId(testimonial.id);
    setMessage("");
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this testimonial?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await axios.delete(
        `${API_URL}/api/testimonials/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Testimonial deleted successfully");
      fetchTestimonials();
    } catch (error) {
      console.error("Failed to delete testimonial:", error);

      setMessage(
        error.response?.data?.message ||
          "Failed to delete testimonial"
      );
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      role: "",
      message: "",
      image: "",
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
        <p className="text-sm text-slate-500">
          Loading Testimonials...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Testimonials
        </h1>

        <p className="mt-2 text-slate-500">
          Manage testimonials displayed on your portfolio.
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
              ? "Edit Testimonial"
              : "Add Testimonial"}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {editingId
              ? "Update the selected testimonial."
              : "Add a new testimonial to your portfolio."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {/* Name + Role */}
          <div className="grid gap-6 md:grid-cols-2">
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
                placeholder="e.g. John Doe"
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
                placeholder="e.g. Client, CEO, Developer"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </div>
          </div>

          {/* Message */}
          <div>
            <label
              htmlFor="message"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Message
            </label>

            <textarea
              id="message"
              name="message"
              value={form.message}
              onChange={handleChange}
              rows="6"
              required
              placeholder="Write the testimonial message..."
              className="w-full resize-y rounded-lg border border-slate-300 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          {/* Image */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Testimonial Image
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
                {uploadingImage
                  ? "Uploading..."
                  : "Upload Image"}
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
                    alt="Testimonial"
                    className="h-32 w-32 rounded-full object-cover"
                  />
                </div>
              </div>
            )}
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
                ? "Update Testimonial"
                : "Add Testimonial"}
            </button>
          </div>
        </form>
      </div>

      {/* Existing Testimonials */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Existing Testimonials
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Testimonials currently stored in your portfolio.
          </p>
        </div>

        {testimonials.length === 0 ? (
          <div className="px-6 py-10 text-center">
            <p className="text-sm text-slate-500">
              No testimonials found.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-semibold">Image</th>
                  <th className="px-6 py-4 font-semibold">Name</th>
                  <th className="px-6 py-4 font-semibold">Role</th>
                  <th className="px-6 py-4 font-semibold">
                    Message
                  </th>
                  <th className="px-6 py-4 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {testimonials.map((testimonial) => (
                  <tr
                    key={testimonial.id}
                    className="transition hover:bg-slate-50"
                  >
                    {/* Image */}
                    <td className="px-6 py-4">
                      {testimonial.image ? (
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="h-14 w-14 rounded-full border border-slate-200 object-cover"
                        />
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>

                    {/* Name */}
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {testimonial.name}
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4 text-slate-600">
                      {testimonial.role || "-"}
                    </td>

                    {/* Message */}
                    <td className="max-w-md px-6 py-4 text-slate-600">
                      <p className="line-clamp-3">
                        {testimonial.message}
                      </p>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() =>
                            handleEdit(testimonial)
                          }
                          className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(testimonial.id)
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

export default Testimonials;
