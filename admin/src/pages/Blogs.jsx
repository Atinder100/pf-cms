
import { useEffect, useState } from "react";
import axios from "axios";

function Blogs() {
  const [blogs, setBlogs] = useState([]);

  const [form, setForm] = useState({
    title: "",
    content: "",
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
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/blogs",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBlogs(response.data);
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
      setMessage("Failed to load blogs");
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
      const blogData = {
        title: form.title,
        content: form.content,
        image: form.image || null,
      };

      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/blogs/${editingId}`,
          blogData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setMessage("Blog updated successfully");
      } else {
        await axios.post(
          "http://localhost:5000/api/blogs",
          blogData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setMessage("Blog created successfully");
      }

      resetForm();
      fetchBlogs();
    } catch (error) {
      console.error("Failed to save blog:", error);

      setMessage(
        error.response?.data?.message || "Failed to save blog"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (blog) => {
    setForm({
      title: blog.title || "",
      content: blog.content || "",
      image: blog.image || "",
    });

    setImageFile(null);
    setEditingId(blog.id);
    setMessage("");
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this blog?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:5000/api/blogs/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Blog deleted successfully");
      fetchBlogs();
    } catch (error) {
      console.error("Failed to delete blog:", error);

      setMessage(
        error.response?.data?.message || "Failed to delete blog"
      );
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      content: "",
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
        <p className="text-sm text-slate-500">Loading Blogs...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Blogs
        </h1>

        <p className="mt-2 text-slate-500">
          Create and manage the blog posts displayed on your portfolio.
        </p>
      </div>

      {/* Message */}
      {message && (
        <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
          {message}
        </div>
      )}

      {/* Blog Form */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-lg font-semibold text-slate-900">
            {editingId ? "Edit Blog" : "Add Blog"}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {editingId
              ? "Update the selected blog post."
              : "Create a new blog post for your portfolio."}
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
              placeholder="Enter blog title"
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          {/* Content */}
          <div>
            <label
              htmlFor="content"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Content
            </label>

            <textarea
              id="content"
              name="content"
              value={form.content}
              onChange={handleChange}
              rows="10"
              required
              placeholder="Write your blog content..."
              className="w-full resize-y rounded-lg border border-slate-300 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          {/* Image */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Blog Image
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
                    alt="Blog"
                    className="h-40 w-64 rounded-lg object-cover"
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
                ? "Update Blog"
                : "Add Blog"}
            </button>
          </div>
        </form>
      </div>

      {/* Existing Blogs */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Existing Blogs
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Blog posts currently stored in your portfolio.
          </p>
        </div>

        {blogs.length === 0 ? (
          <div className="px-6 py-10 text-center">
            <p className="text-sm text-slate-500">
              No blogs found.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-semibold">
                    Image
                  </th>
                  <th className="px-6 py-4 font-semibold">
                    Title
                  </th>
                  <th className="px-6 py-4 font-semibold">
                    Content
                  </th>
                  <th className="px-6 py-4 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {blogs.map((blog) => (
                  <tr
                    key={blog.id}
                    className="transition hover:bg-slate-50"
                  >
                    {/* Image */}
                    <td className="px-6 py-4">
                      {blog.image ? (
                        <img
                          src={blog.image}
                          alt={blog.title}
                          className="h-16 w-24 rounded-lg border border-slate-200 object-cover"
                        />
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>

                    {/* Title */}
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {blog.title}
                    </td>

                    {/* Content */}
                    <td className="max-w-xl px-6 py-4 text-slate-600">
                      <p className="line-clamp-4">
                        {blog.content}
                      </p>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(blog)}
                          className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(blog.id)}
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

export default Blogs;

