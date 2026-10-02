
import { useEffect, useState } from "react";
import axios from "axios";

function Services() {
  const [services, setServices] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/services",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setServices(response.data);
    } catch (error) {
      console.error("Failed to fetch services:", error);
      setMessage("Failed to load services");
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
      const serviceData = {
        title: form.title,
        description: form.description,
      };

      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/services/${editingId}`,
          serviceData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setMessage("Service updated successfully");
      } else {
        await axios.post(
          "http://localhost:5000/api/services",
          serviceData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setMessage("Service created successfully");
      }

      resetForm();
      fetchServices();
    } catch (error) {
      console.error("Failed to save service:", error);

      setMessage(
        error.response?.data?.message ||
          "Failed to save service"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (service) => {
    setForm({
      title: service.title || "",
      description: service.description || "",
    });

    setEditingId(service.id);
    setMessage("");
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this service?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:5000/api/services/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Service deleted successfully");
      fetchServices();
    } catch (error) {
      console.error("Failed to delete service:", error);

      setMessage(
        error.response?.data?.message ||
          "Failed to delete service"
      );
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
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
          Loading Services...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Services
        </h1>

        <p className="mt-2 text-slate-500">
          Manage the services displayed on your portfolio.
        </p>
      </div>

      {/* Message */}
      {message && (
        <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
          {message}
        </div>
      )}

      {/* Service Form */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-lg font-semibold text-slate-900">
            {editingId ? "Edit Service" : "Add Service"}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {editingId
              ? "Update the selected service."
              : "Add a new service to your portfolio."}
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
              placeholder="e.g. Web Development"
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
              rows="7"
              required
              placeholder="Describe the service..."
              className="w-full resize-y rounded-lg border border-slate-300 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
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
                ? "Update Service"
                : "Add Service"}
            </button>
          </div>
        </form>
      </div>

      {/* Existing Services */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Existing Services
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Services currently stored in your portfolio.
          </p>
        </div>

        {services.length === 0 ? (
          <div className="px-6 py-10 text-center">
            <p className="text-sm text-slate-500">
              No services found.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-semibold">
                    Title
                  </th>

                  <th className="px-6 py-4 font-semibold">
                    Description
                  </th>

                  <th className="px-6 py-4 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {services.map((service) => (
                  <tr
                    key={service.id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {service.title}
                    </td>

                    <td className="max-w-xl px-6 py-4 text-slate-600">
                      <p className="line-clamp-3">
                        {service.description}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(service)}
                          className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(service.id)
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

export default Services;

