<template>
  <div class="contracts">
    <div class="card">
      <div class="header-actions">
        <h2>Управление договорами</h2>
        <button @click="openModal()" class="btn btn-primary">Добавить договор</button>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Номер</th>
              <th>Сотрудник</th>
              <th>Факультет</th>
              <th>Должность</th>
              <th>Тип</th>
              <th>Дата начала</th>
              <th>Дата окончания</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="contract in contracts" :key="contract.contract_id">
              <td>{{ contract.contract_number }}</td>
              <td>{{ contract.employee_full_name }}</td>
              <td>{{ contract.departament_name }}</td>
              <td>{{ contract.position_name }}</td>
              <td>{{ contract.contract_type }}</td>
              <td>{{ formatDate(contract.start_date) }}</td>
              <td>{{ formatDate(contract.end_date) || 'Не указана' }}</td>
              <td>
                <button @click="openModal(contract)" class="btn btn-secondary">Изменить</button>
                <button @click="deleteContract(contract.contract_id)" class="btn btn-danger">Удалить</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Modal v-if="showModal" @close="closeModal">
      <form @submit.prevent="saveContract">
        <h3>{{ editing ? 'Изменить' : 'Добавить' }} договор</h3>
        
        <div class="form-group">
          <label>Номер договора</label>
          <input v-model="form.contract_number" required>
        </div>
        
        <div class="form-group">
          <label>Сотрудник</label>
          <select v-model="form.employee_id" required>
            <option value="">Выберите сотрудника</option>
            <option v-for="employee in employees" :key="employee.employee_id" :value="employee.employee_id">
              {{ employee.last_name }} {{ employee.first_name }} {{ employee.middle_name || '' }}
            </option>
          </select>
        </div>
        
        <div class="form-group">
          <label>Факультет</label>
          <select v-model="form.departament_id" required>
            <option value="">Выберите факультет</option>
            <option v-for="departament in departaments" :key="departament.departament_id" :value="departament.departament_id">
              {{ departament.departament_name }}
            </option>
          </select>
        </div>
        
        <div class="form-group">
          <label>Должность</label>
          <select v-model="form.position_id" required>
            <option value="">Выберите должность</option>
            <option v-for="position in positions" :key="position.position_id" :value="position.position_id">
              {{ position.position_name }}
            </option>
          </select>
        </div>
        
        <div class="form-group">
          <label>Тип договора</label>
          <select v-model="form.contract_type" required>
            <option value="основной">Основной</option>
            <option value="по совместительству">По совместительству</option>
            <option value="временный">Временный</option>
          </select>
        </div>
        
        <div class="form-group">
          <label>Дата начала</label>
          <input v-model="form.start_date" type="date" required>
        </div>
        
        <div class="form-group">
          <label>Дата окончания</label>
          <input v-model="form.end_date" type="date">
        </div>
        
        <div class="form-actions">
          <button type="submit" class="btn btn-success">Сохранить</button>
          <button type="button" @click="closeModal" class="btn btn-secondary">Отмена</button>
        </div>
      </form>
    </Modal>
  </div>
</template>

<script>
import Modal from '../components/Modal.vue';
import api from '../services/api';

export default {
  name: 'Contracts',
  components: { Modal },
  data() {
    return {
      contracts: [],
      employees: [],
      departaments: [],
      positions: [],
      showModal: false,
      editing: false,
      form: {
        contract_id: null,
        contract_number: '',
        employee_id: '',
        departament_id: '',
        position_id: '',
        contract_type: 'основной',
        start_date: '',
        end_date: ''
      }
    }
  },
  async mounted() {
    await this.loadData()
  },
  methods: {
    async loadData() {
      this.contracts = await api.getContracts()
      this.employees = await api.getEmployees()
      this.departaments = await api.getDepartaments()
      this.positions = await api.getPositions()
    },
    openModal(contract = null) {
      this.editing = !!contract
      if (contract) {
        this.form = {
          contract_id: contract.contract_id,
          contract_number: contract.contract_number,
          employee_id: contract.employee_id,
          departament_id: contract.departament_id,
          position_id: contract.position_id,
          contract_type: contract.contract_type,
          start_date: contract.start_date,
          end_date: contract.end_date
        }
      } else {
        this.form = {
          contract_id: null,
          contract_number: '',
          employee_id: '',
          departament_id: '',
          position_id: '',
          contract_type: 'основной',
          start_date: '',
          end_date: ''
        }
      }
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
    },
    async saveContract() {
      try {
        if (this.editing) {
          await api.updateContract(this.form.contract_id, this.form)
        } else {
          await api.createContract(this.form)
        }
        await this.loadData()
        this.closeModal()
      } catch (error) {
        alert('Ошибка при сохранении: ' + error.message)
      }
    },
    async deleteContract(id) {
      if (confirm('Вы уверены, что хотите удалить этот договор?')) {
        try {
          await api.deleteContract(id)
          await this.loadData()
        } catch (error) {
          alert('Ошибка при удалении: ' + error.message)
        }
      }
    },
    formatDate(date) {
      if (!date) return ''
      return new Date(date).toLocaleDateString('ru-RU')
    }
  }
}
</script>

<style lang="scss" scoped>
.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  h2 {
    color: #667eea;
  }
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}
</style>

