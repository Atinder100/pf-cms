
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";

function About() {
  const [about, setAbout] = useState({
    id: null,
    title: "",
    description: "",
    profile_image: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/about`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAbout(response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        setMessage("No About content found. You can create it below.");
      } else {
        console.error("Failed to fetch About:", error);
        setMessage("Failed to load About data");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setAbout({
      ...about,
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

      setAbout({
        ...about,
        profile_image: response.data.media.url,
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
      let response;

      if (about.id) {
        response = await axios.put(
          `${API_URL}/api/about/${about.id}`,
          {
            title: about.title,
            description: about.description,
            profile_image: about.profile_image,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setAbout(response.data);
        setMessage("About updated successfully");
      } else {
        response = await axios.post(
          `${API_URL}/api/about`,
          {
            title: about.title,
            description: about.description,
            profile_image: about.profile_image,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setAbout(response.data);
        setMessage("About created successfully");
      }
    } catch (error) {
      console.error("Failed to save About:", error);

      setMessage(
        error.response?.data?.message || "Failed to save About"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-slate-500">Loading About...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          About
        </h1>

        <p className="mt-2 text-slate-500">
          Manage your portfolio introduction and profile information.
        </p>
      </div>

      {/* Message */}
      {message && (
        <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
          {message}
        </div>
      )}

      {/* Main Card */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-lg font-semibold text-slate-900">
            About Information
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Update the content displayed in your portfolio.
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
              value={about.title}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              placeholder="Enter your About title"
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
              value={about.description}
              onChange={handleChange}
              rows="7"
              required
              className="w-full resize-y rounded-lg border border-slate-300 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              placeholder="Write your About description..."
            />
          </div>

          {/* Profile Image */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Profile Image
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

            {/* Current Image */}
            {about.profile_image && (
              <div className="mt-5">
                <p className="mb-3 text-sm font-medium text-slate-700">
                  Current Image
                </p>

                <div className="inline-block overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
                  <img
                    src={about.profile_image}
                    alt="Profile"
                    className="h-40 w-40 rounded-lg object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="flex justify-end border-t border-slate-200 pt-6">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : about.id
                ? "Update About"
                : "Create About"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default About;
