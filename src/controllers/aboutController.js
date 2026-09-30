import pool from "../config/db.js";

export const getAbout = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM about ORDER BY created_at DESC LIMIT 1"
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "About content not found",
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch About content",
      error: error.message,
    });
  }
};

export const createAbout = async (req, res) => {
  try {
    const { title, description, profile_image } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: "Title and description are required",
      });
    }

    const result = await pool.query(
      `INSERT INTO about (title, description, profile_image)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [title, description, profile_image || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create About content",
      error: error.message,
    });
  }
};

export const updateAbout = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, profile_image } = req.body;

    const result = await pool.query(
      `UPDATE about
       SET title = $1,
           description = $2,
           profile_image = $3,
           updated_at = NOW()
       WHERE id = $4
       RETURNING *`,
      [title, description, profile_image || null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "About content not found",
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update About content",
      error: error.message,
    });
  }
};

export const deleteAbout = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM about WHERE id = $1 RETURNING id",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "About content not found",
      });
    }

    res.status(200).json({
      message: "About content deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete About content",
      error: error.message,
    });
  }
};