import pool from "../config/db.js";

export const getTestimonials = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM testimonials ORDER BY created_at DESC"
    );

    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch testimonials",
      error: error.message,
    });
  }
};

export const createTestimonial = async (req, res) => {
  try {
    const { name, role, message, image } = req.body;

    if (!name || !message) {
      return res.status(400).json({
        message: "Name and message are required",
      });
    }

    const result = await pool.query(
      `INSERT INTO testimonials
       (name, role, message, image)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, role || null, message, image || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create testimonial",
      error: error.message,
    });
  }
};

export const updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, message, image } = req.body;

    const result = await pool.query(
      `UPDATE testimonials
       SET name = $1,
           role = $2,
           message = $3,
           image = $4,
           updated_at = NOW()
       WHERE id = $5
       RETURNING *`,
      [name, role || null, message, image || null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Testimonial not found",
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update testimonial",
      error: error.message,
    });
  }
};

export const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM testimonials WHERE id = $1 RETURNING id",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Testimonial not found",
      });
    }

    res.status(200).json({
      message: "Testimonial deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete testimonial",
      error: error.message,
    });
  }
};