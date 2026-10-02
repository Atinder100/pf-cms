import pool from "../config/db.js";

export const getProjects = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM projects ORDER BY created_at DESC"
    );

    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch projects",
      error: error.message,
    });
  }
};

export const createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      image,
      technologies,
      live_url,
      github_url,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: "Title and description are required",
      });
    }

    const result = await pool.query(
      `INSERT INTO projects
       (title, description, image, technologies, live_url, github_url)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        title,
        description,
        image || null,
        technologies || [],
        live_url || null,
        github_url || null,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create project",
      error: error.message,
    });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      image,
      technologies,
      live_url,
      github_url,
    } = req.body;

    const result = await pool.query(
      `UPDATE projects
       SET title = $1,
           description = $2,
           image = $3,
           technologies = $4,
           live_url = $5,
           github_url = $6,
           updated_at = NOW()
       WHERE id = $7
       RETURNING *`,
      [
        title,
        description,
        image || null,
        technologies || [],
        live_url || null,
        github_url || null,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update project",
      error: error.message,
    });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM projects WHERE id = $1 RETURNING id",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.status(200).json({
      message: "Project deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete project",
      error: error.message,
    });
  }
};