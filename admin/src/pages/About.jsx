import { useEffect, useState } from "react";
import axios from "axios";

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
        "http://localhost:5000/api/about",
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
        "http://localhost:5000/upload/image",
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
          `http://localhost:5000/api/about/${about.id}`,
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
          "http://localhost:5000/api/about",
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
    return <p>Loading About...</p>;
  }

  return (
    <div>
      <h1>About</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <br />

          <input
            type="text"
            name="title"
            value={about.title}
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
            value={about.description}
            onChange={handleChange}
            rows="6"
            required
          />
        </div>

        <br />

        <div>
          <label>Profile Image</label>
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

          {about.profile_image && (
            <div>
              <br />

              <p>Current Image:</p>

              <img
                src={about.profile_image}
                alt="Profile"
                width="150"
              />
            </div>
          )}
        </div>

        <br />

        <button type="submit" disabled={saving}>
          {saving
            ? "Saving..."
            : about.id
            ? "Update About"
            : "Create About"}
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default About;