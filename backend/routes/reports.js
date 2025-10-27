const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Report 1: Список сотрудников по факультетам (Employees by Department)
router.get('/employees-by-departament', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        d.departament_name,
        e.employee_id,
        e.last_name || ' ' || e.first_name || ' ' || COALESCE(e.middle_name, '') AS employee_full_name,
        p.position_name,
        c.contract_type,
        c.contract_number,
        CASE 
          WHEN c.end_date IS NULL OR c.end_date >= CURRENT_DATE THEN 'Активен'
          ELSE 'Истек'
        END AS contract_status
      FROM Departaments d
      LEFT JOIN Contracts c ON d.departament_id = c.departament_id
      LEFT JOIN Employees e ON c.employee_id = e.employee_id
      LEFT JOIN Positions p ON c.position_id = p.position_id
      WHERE c.contract_id IS NOT NULL
      ORDER BY d.departament_name, e.last_name
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Report 2: Статистика по должностям (Position Statistics)
router.get('/position-statistics', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.position_name,
        p.salary_range,
        COUNT(DISTINCT c.employee_id) AS employee_count,
        COUNT(c.contract_id) AS total_contracts,
        COUNT(CASE WHEN c.end_date IS NULL OR c.end_date >= CURRENT_DATE THEN 1 END) AS active_contracts
      FROM Positions p
      LEFT JOIN Contracts c ON p.position_id = c.position_id
      GROUP BY p.position_id, p.position_name, p.salary_range
      ORDER BY active_contracts DESC
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Report 3: История трудоустройства сотрудника (Employee Employment History)
router.get('/employment-history/:employeeId', async (req, res) => {
  try {
    const { employeeId } = req.params;
    const result = await pool.query(`
      SELECT 
        h.history_id,
        h.start_date,
        h.end_date,
        h.status,
        d.departament_name,
        p.position_name,
        e.last_name || ' ' || e.first_name || ' ' || COALESCE(e.middle_name, '') AS employee_full_name
      FROM EmploymentHistory h
      JOIN Employees e ON h.employee_id = e.employee_id
      JOIN Departaments d ON h.departament_id = d.departament_id
      JOIN Positions p ON h.position_id = p.position_id
      WHERE h.employee_id = $1
      ORDER BY h.start_date DESC
    `, [employeeId]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Report 4: Действующие договоры на факультете (Active Contracts by Department)
router.get('/active-contracts/:departamentId', async (req, res) => {
  try {
    const { departamentId } = req.params;
    const result = await pool.query(`
      SELECT 
        c.contract_id,
        c.contract_number,
        e.last_name || ' ' || e.first_name || ' ' || COALESCE(e.middle_name, '') AS employee_full_name,
        d.departament_name,
        p.position_name,
        c.contract_type,
        c.start_date,
        c.end_date,
        e.phone,
        e.email
      FROM Contracts c
      JOIN Employees e ON c.employee_id = e.employee_id
      JOIN Departaments d ON c.departament_id = d.departament_id
      JOIN Positions p ON c.position_id = p.position_id
      WHERE d.departament_id = $1 
        AND (c.end_date IS NULL OR c.end_date >= CURRENT_DATE)
      ORDER BY p.position_name, e.last_name
    `, [departamentId]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

