const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// GET all departaments
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Departaments ORDER BY departament_name');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET departament by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM Departaments WHERE departament_id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Departament not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE departament
router.post('/', async (req, res) => {
  try {
    const { departament_name, building_address, phone, email } = req.body;
    const result = await pool.query(
      'INSERT INTO Departaments (departament_name, building_address, phone, email) VALUES ($1, $2, $3, $4) RETURNING *',
      [departament_name, building_address, phone, email]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE departament
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { departament_name, building_address, phone, email } = req.body;
    const result = await pool.query(
      'UPDATE Departaments SET departament_name = $1, building_address = $2, phone = $3, email = $4 WHERE departament_id = $5 RETURNING *',
      [departament_name, building_address, phone, email, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Departament not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE departament
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM Departaments WHERE departament_id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Departament not found' });
    }
    
    res.json({ message: 'Departament deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

