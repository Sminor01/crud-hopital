const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// GET all contracts with related data
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        c.*,
        e.last_name || ' ' || e.first_name || ' ' || COALESCE(e.middle_name, '') AS employee_full_name,
        d.departament_name,
        p.position_name
      FROM Contracts c
      JOIN Employees e ON c.employee_id = e.employee_id
      JOIN Departaments d ON c.departament_id = d.departament_id
      JOIN Positions p ON c.position_id = p.position_id
      ORDER BY c.start_date DESC
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET contract by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT 
        c.*,
        e.last_name || ' ' || e.first_name || ' ' || COALESCE(e.middle_name, '') AS employee_full_name,
        d.departament_name,
        p.position_name
      FROM Contracts c
      JOIN Employees e ON c.employee_id = e.employee_id
      JOIN Departaments d ON c.departament_id = d.departament_id
      JOIN Positions p ON c.position_id = p.position_id
      WHERE c.contract_id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Contract not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE contract
router.post('/', async (req, res) => {
  try {
    const { contract_number, start_date, end_date, contract_type, employee_id, departament_id, position_id } = req.body;
    const result = await pool.query(
      'INSERT INTO Contracts (contract_number, start_date, end_date, contract_type, employee_id, departament_id, position_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [contract_number, start_date, end_date, contract_type, employee_id, departament_id, position_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE contract
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { contract_number, start_date, end_date, contract_type, employee_id, departament_id, position_id } = req.body;
    const result = await pool.query(
      'UPDATE Contracts SET contract_number = $1, start_date = $2, end_date = $3, contract_type = $4, employee_id = $5, departament_id = $6, position_id = $7 WHERE contract_id = $8 RETURNING *',
      [contract_number, start_date, end_date, contract_type, employee_id, departament_id, position_id, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Contract not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE contract
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM Contracts WHERE contract_id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Contract not found' });
    }
    
    res.json({ message: 'Contract deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

