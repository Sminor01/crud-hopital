const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// GET all employees
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Employees ORDER BY last_name, first_name');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET employee by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM Employees WHERE employee_id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE employee
router.post('/', async (req, res) => {
  try {
    const { last_name, first_name, middle_name, birth_date, phone, email, education } = req.body;
    const result = await pool.query(
      'INSERT INTO Employees (last_name, first_name, middle_name, birth_date, phone, email, education) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [last_name, first_name, middle_name, birth_date, phone, email, education]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE employee
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { last_name, first_name, middle_name, birth_date, phone, email, education } = req.body;
    const result = await pool.query(
      'UPDATE Employees SET last_name = $1, first_name = $2, middle_name = $3, birth_date = $4, phone = $5, email = $6, education = $7 WHERE employee_id = $8 RETURNING *',
      [last_name, first_name, middle_name, birth_date, phone, email, education, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE employee
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM Employees WHERE employee_id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

