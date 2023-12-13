import { pool } from '../config/database.js';

export const getAllUsers = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM "GITHUBUSER"');
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
