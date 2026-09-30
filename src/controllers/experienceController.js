import pool from "../config/db.js";

export const getExperience = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM experience ORDER BY start_date DESC"
    );

    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch experience",
      error: error.message,
    });
  }
};

export const createExperience = async (req, res) => {
  try {
    const {
      company,
      role,
      description,
      start_date,
      end_date,
    } = req.body;

    if (!company || !role || !description) {
      return res.status(400).json({
        message: "Company, role, and description are required",
      });
    }

    const result = await pool.query(
      `INSERT INTO experience
       (company, role, description, start_date, end_date)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        company,
        role,
        description,
        start_date || null,
        end_date || null,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create experience",
      error: error.message,
    });
  }
};

export const updateExperience = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      company,
      role,
      description,
      start_date,
      end_date,
    } = req.body;

    const result = await pool.query(
      `UPDATE experience
       SET company = $1,
           role = $2,
           description = $3,
           start_date = $4,
           end_date = $5,
           updated_at = NOW()
       WHERE id = $6
       RETURNING *`,
      [
        company,
        role,
        description,
        start_date || null,
        end_date || null,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Experience not found",
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update experience",
      error: error.message,
    });
  }
};

export const deleteExperience = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM experience WHERE id = $1 RETURNING id",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Experience not found",
      });
    }

    res.status(200).json({
      message: "Experience deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete experience",
      error: error.message,
    });
  }
};