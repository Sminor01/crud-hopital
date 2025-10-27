<template>
  <div class="home">
    <div class="card">
      <h2>Добро пожаловать в Информационную систему учета сотрудников факультета</h2>
      
      <div class="stats-grid">
        <div class="stat-card">
          <h3>Факультеты</h3>
          <p class="stat-number">{{ stats.departaments }}</p>
        </div>
        <div class="stat-card">
          <h3>Сотрудники</h3>
          <p class="stat-number">{{ stats.employees }}</p>
        </div>
        <div class="stat-card">
          <h3>Должности</h3>
          <p class="stat-number">{{ stats.positions }}</p>
        </div>
        <div class="stat-card">
          <h3>Договоры</h3>
          <p class="stat-number">{{ stats.contracts }}</p>
        </div>
      </div>

      <div class="info-section">
        <h3>Описание системы</h3>
        <p>Система предназначена для управления и учета персонала факультета университета. Позволяет:</p>
        <ul>
          <li>Управлять информацией о факультетах и их сотрудниках</li>
          <li>Вести учет должностей и трудовых договоров</li>
          <li>Отслеживать историю трудоустройства</li>
          <li>Генерировать различные отчеты</li>
        </ul>
      </div>

      <div class="info-section">
        <h3>База данных</h3>
        <p>Система использует PostgreSQL базу данных с 5 основными сущностями:</p>
        <ul>
          <li><strong>Departaments</strong> - Факультеты</li>
          <li><strong>Employees</strong> - Сотрудники</li>
          <li><strong>Positions</strong> - Должности</li>
          <li><strong>Contracts</strong> - Трудовые договоры</li>
          <li><strong>EmploymentHistory</strong> - История трудоустройства</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../services/api';

export default {
  name: 'Home',
  data() {
    return {
      stats: {
        departaments: 0,
        employees: 0,
        positions: 0,
        contracts: 0
      }
    }
  },
  async mounted() {
    try {
      const [departaments, employees, positions, contracts] = await Promise.all([
        api.getDepartaments(),
        api.getEmployees(),
        api.getPositions(),
        api.getContracts()
      ])
      
      this.stats = {
        departaments: departaments.length,
        employees: employees.length,
        positions: positions.length,
        contracts: contracts.length
      }
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }
}
</script>

<style lang="scss" scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.stat-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);

  h3 {
    font-size: 0.95rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
    opacity: 0.9;
  }

  .stat-number {
    font-size: 2.5rem;
    font-weight: 700;
    margin: 0;
  }
}

.info-section {
  margin-top: 2rem;
  padding: 1.5rem;
  background: #f7fafc;
  border-radius: 8px;

  h3 {
    color: #667eea;
    margin-bottom: 1rem;
  }

  ul {
    margin-left: 1.5rem;
    margin-top: 0.5rem;

    li {
      margin: 0.5rem 0;
    }
  }
}
</style>

