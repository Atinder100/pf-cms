import supabase from "../config/supabase.js";
import pool from "../config/db.js";

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No image file uploaded",
      });
    }

    const file = req.file;

    const fileName = `${Date.now()}-${file.originalname}`;

    // Upload image to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("media")
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (uploadError) {
      return res.status(500).json({
        message: "Failed to upload image",
        error: uploadError.message,
      });
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from("media")
      .getPublicUrl(fileName);

    const imageUrl = publicUrlData.publicUrl;

    // Save metadata in PostgreSQL
    const result = await pool.query(
      `
      INSERT INTO media
      (filename, original_name, mime_type, size, url)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [
        fileName,
        file.originalname,
        file.mimetype,
        file.size,
        imageUrl,
      ]
    );

    return res.status(201).json({
      message: "Image uploaded successfully",
      media: result.rows[0],
    });
  } catch (error) {
    console.error("Upload error:", error);

    return res.status(500).json({
      message: "Upload failed",
      error: error.message,
    });
  }
};

export default uploadImage;