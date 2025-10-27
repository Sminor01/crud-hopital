const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pool = require('./config/database');

// Import routes
const departamentsRouter = require('./routes/departaments');
const employeesRouter = require('./routes/employees');
const positionsRouter = require('./routes/positions');
const contractsRouter = require('./routes/contracts');
const reportsRouter = require('./routes/reports');

const app = express();
const PORT = process.env.SERVER_PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/departaments', departamentsRouter);
app.use('/api/employees', employeesRouter);
app.use('/api/positions', positionsRouter);
app.use('/api/contracts', contractsRouter);
app.use('/api/reports', reportsRouter);

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT NOW()');
    res.json({ 
      status: 'OK', 
      message: 'Database connection successful',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      message: 'Database connection failed',
      error: error.message 
    });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Faculty Staff Management API',
    version: '1.0.0',
    endpoints: {
      departaments: '/api/departaments',
      employees: '/api/employees',
      positions: '/api/positions',
      contracts: '/api/contracts',
      reports: '/api/reports'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

