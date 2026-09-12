import { pool } from '../config/database.js';

export const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, username, avatarurl, githubid
      FROM "GITHUBUSER"
      ORDER BY id
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({
      error: 'Unable to retrieve users',
    });
  }
};
