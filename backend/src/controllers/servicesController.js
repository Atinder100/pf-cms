import pool from "../config/db.js";

export const getServices = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM services ORDER BY created_at DESC"
    );

    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch services",
      error: error.message,
    });
  }
};

export const createService = async (req, res) => {
  try {
    const { title, description, icon } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: "Title and description are required",
      });
    }

    const result = await pool.query(
      `INSERT INTO services
       (title, description, icon)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [title, description, icon || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create service",
      error: error.message,
    });
  }
};

export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, icon } = req.body;

    const result = await pool.query(
      `UPDATE services
       SET title = $1,
           description = $2,
           icon = $3,
           updated_at = NOW()
       WHERE id = $4
       RETURNING *`,
      [title, description, icon || null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update service",
      error: error.message,
    });
  }
};

export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM services WHERE id = $1 RETURNING id",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    res.status(200).json({
      message: "Service deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete service",
      error: error.message,
    });
  }
};