<template>
  <div class="reports">
    <div class="card">
      <h2>Отчеты</h2>
      
      <div class="report-section">
        <h3>1. Список сотрудников по факультетам</h3>
        <button @click="loadReport1" class="btn btn-primary">Загрузить отчет</button>
        
        <div v-if="report1Data.length > 0" class="table-container mt-3">
          <table>
            <thead>
              <tr>
                <th>Факультет</th>
                <th>Сотрудник</th>
                <th>Должность</th>
                <th>Тип договора</th>
                <th>Номер договора</th>
                <th>Статус</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, idx) in report1Data" :key="idx">
                <td>{{ row.departament_name }}</td>
                <td>{{ row.employee_full_name }}</td>
                <td>{{ row.position_name }}</td>
                <td>{{ row.contract_type }}</td>
                <td>{{ row.contract_number }}</td>
                <td>
                  <span :class="row.contract_status === 'Активен' ? 'badge-success' : 'badge-danger'">
                    {{ row.contract_status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="report-section">
        <h3>2. Статистика по должностям</h3>
        <button @click="loadReport2" class="btn btn-primary">Загрузить отчет</button>
        
        <div v-if="report2Data.length > 0" class="table-container mt-3">
          <table>
            <thead>
              <tr>
                <th>Должность</th>
                <th>Диапазон ЗП</th>
                <th>Кол-во сотрудников</th>
                <th>Всего договоров</th>
                <th>Активных договоров</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in report2Data" :key="row.position_name">
                <td>{{ row.position_name }}</td>
                <td>{{ row.salary_range }}</td>
                <td>{{ row.employee_count }}</td>
                <td>{{ row.total_contracts }}</td>
                <td>{{ row.active_contracts }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="report-section">
        <h3>3. История трудоустройства сотрудника</h3>
        <div class="form-group">
          <label>Выберите сотрудника</label>
          <select v-model="selectedEmployeeId">
            <option value="">Выберите сотрудника</option>
            <option v-for="employee in employees" :key="employee.employee_id" :value="employee.employee_id">
              {{ employee.last_name }} {{ employee.first_name }} {{ employee.middle_name || '' }}
            </option>
          </select>
        </div>
        <button @click="loadReport3" :disabled="!selectedEmployeeId" class="btn btn-primary">Загрузить отчет</button>
        
        <div v-if="report3Data.length > 0" class="table-container mt-3">
          <table>
            <thead>
              <tr>
                <th>Начало</th>
                <th>Окончание</th>
                <th>Факультет</th>
                <th>Должность</th>
                <th>Статус</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in report3Data" :key="row.history_id">
                <td>{{ formatDate(row.start_date) }}</td>
                <td>{{ formatDate(row.end_date) || 'По настоящее время' }}</td>
                <td>{{ row.departament_name }}</td>
                <td>{{ row.position_name }}</td>
                <td>{{ row.status }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="report-section">
        <h3>4. Действующие договоры на факультете</h3>
        <div class="form-group">
          <label>Выберите факультет</label>
          <select v-model="selectedDepartamentId">
            <option value="">Выберите факультет</option>
            <option v-for="departament in departaments" :key="departament.departament_id" :value="departament.departament_id">
              {{ departament.departament_name }}
            </option>
          </select>
        </div>
        <button @click="loadReport4" :disabled="!selectedDepartamentId" class="btn btn-primary">Загрузить отчет</button>
        
        <div v-if="report4Data.length > 0" class="table-container mt-3">
          <table>
            <thead>
              <tr>
                <th>Номер договора</th>
                <th>Сотрудник</th>
                <th>Должность</th>
                <th>Тип</th>
                <th>Начало</th>
                <th>Окончание</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in report4Data" :key="row.contract_id">
                <td>{{ row.contract_number }}</td>
                <td>{{ row.employee_full_name }}</td>
                <td>{{ row.position_name }}</td>
                <td>{{ row.contract_type }}</td>
                <td>{{ formatDate(row.start_date) }}</td>
                <td>{{ formatDate(row.end_date) || 'Не указана' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../services/api';

export default {
  name: 'Reports',
  data() {
    return {
      report1Data: [],
      report2Data: [],
      report3Data: [],
      report4Data: [],
      employees: [],
      departaments: [],
      selectedEmployeeId: '',
      selectedDepartamentId: ''
    }
  },
  async mounted() {
    this.employees = await api.getEmployees()
    this.departaments = await api.getDepartaments()
  },
  methods: {
    async loadReport1() {
      this.report1Data = await api.getEmployeesByDepartament()
    },
    async loadReport2() {
      this.report2Data = await api.getPositionStatistics()
    },
    async loadReport3() {
      if (!this.selectedEmployeeId) return
      this.report3Data = await api.getEmploymentHistory(this.selectedEmployeeId)
    },
    async loadReport4() {
      if (!this.selectedDepartamentId) return
      this.report4Data = await api.getActiveContractsByDepartment(this.selectedDepartamentId)
    },
    formatDate(date) {
      if (!date) return ''
      return new Date(date).toLocaleDateString('ru-RU')
    }
  }
}
</script>

<style lang="scss" scoped>
.report-section {
  margin: 3rem 0;
  padding: 2rem;
  background: #f7fafc;
  border-radius: 8px;

  h3 {
    color: #667eea;
    margin-bottom: 1rem;
  }

  .form-group {
    max-width: 400px;
  }
}

.badge-success {
  background: #48bb78;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.875rem;
}

.badge-danger {
  background: #f56565;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.875rem;
}

.mt-3 {
  margin-top: 1.5rem;
}
</style>

