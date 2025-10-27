const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// GET all positions
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Positions ORDER BY position_name');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET position by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM Positions WHERE position_id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Position not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE position
router.post('/', async (req, res) => {
  try {
    const { position_name, salary_range, responsibilities } = req.body;
    const result = await pool.query(
      'INSERT INTO Positions (position_name, salary_range, responsibilities) VALUES ($1, $2, $3) RETURNING *',
      [position_name, salary_range, responsibilities]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE position
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { position_name, salary_range, responsibilities } = req.body;
    const result = await pool.query(
      'UPDATE Positions SET position_name = $1, salary_range = $2, responsibilities = $3 WHERE position_id = $4 RETURNING *',
      [position_name, salary_range, responsibilities, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Position not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE position
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM Positions WHERE position_id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Position not found' });
    }
    
    res.json({ message: 'Position deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

