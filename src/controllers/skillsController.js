import pool from "../config/db.js";

export const getSkills = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM skills ORDER BY created_at DESC"
    );

    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch skills",
      error: error.message,
    });
  }
};

export const createSkill = async (req, res) => {
  try {
    const { name, category, proficiency, icon } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Skill name is required",
      });
    }

    const result = await pool.query(
      `INSERT INTO skills (name, category, proficiency, icon)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, category || null, proficiency || null, icon || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create skill",
      error: error.message,
    });
  }
};

export const updateSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, proficiency, icon } = req.body;

    const result = await pool.query(
      `UPDATE skills
       SET name = $1,
           category = $2,
           proficiency = $3,
           icon = $4,
           updated_at = NOW()
       WHERE id = $5
       RETURNING *`,
      [name, category || null, proficiency || null, icon || null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Skill not found",
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update skill",
      error: error.message,
    });
  }
};

export const deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM skills WHERE id = $1 RETURNING id",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Skill not found",
      });
    }

    res.status(200).json({
      message: "Skill deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete skill",
      error: error.message,
    });
  }
};