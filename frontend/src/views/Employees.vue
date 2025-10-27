<template>
  <div class="employees">
    <div class="card">
      <div class="header-actions">
        <h2>Управление сотрудниками</h2>
        <button @click="openModal()" class="btn btn-primary">Добавить сотрудника</button>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>ФИО</th>
              <th>Дата рождения</th>
              <th>Телефон</th>
              <th>Email</th>
              <th>Образование</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="employee in employees" :key="employee.employee_id">
              <td>{{ employee.employee_id }}</td>
              <td>{{ getFullName(employee) }}</td>
              <td>{{ formatDate(employee.birth_date) }}</td>
              <td>{{ employee.phone }}</td>
              <td>{{ employee.email }}</td>
              <td>{{ employee.education }}</td>
              <td>
                <button @click="openModal(employee)" class="btn btn-secondary">Изменить</button>
                <button @click="deleteEmployee(employee.employee_id)" class="btn btn-danger">Удалить</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Modal v-if="showModal" @close="closeModal">
      <form @submit.prevent="saveEmployee">
        <h3>{{ editing ? 'Изменить' : 'Добавить' }} сотрудника</h3>
        
        <div class="form-group">
          <label>Фамилия</label>
          <input v-model="form.last_name" required>
        </div>
        
        <div class="form-group">
          <label>Имя</label>
          <input v-model="form.first_name" required>
        </div>
        
        <div class="form-group">
          <label>Отчество</label>
          <input v-model="form.middle_name">
        </div>
        
        <div class="form-group">
          <label>Дата рождения</label>
          <input v-model="form.birth_date" type="date" required>
        </div>
        
        <div class="form-group">
          <label>Телефон</label>
          <input v-model="form.phone">
        </div>
        
        <div class="form-group">
          <label>Email</label>
          <input v-model="form.email" type="email">
        </div>
        
        <div class="form-group">
          <label>Образование</label>
          <input v-model="form.education">
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
  name: 'Employees',
  components: { Modal },
  data() {
    return {
      employees: [],
      showModal: false,
      editing: false,
      form: {
        employee_id: null,
        last_name: '',
        first_name: '',
        middle_name: '',
        birth_date: '',
        phone: '',
        email: '',
        education: ''
      }
    }
  },
  async mounted() {
    await this.loadEmployees()
  },
  methods: {
    async loadEmployees() {
      this.employees = await api.getEmployees()
    },
    openModal(employee = null) {
      this.editing = !!employee
      if (employee) {
        this.form = { ...employee }
      } else {
        this.form = {
          employee_id: null,
          last_name: '',
          first_name: '',
          middle_name: '',
          birth_date: '',
          phone: '',
          email: '',
          education: ''
        }
      }
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
    },
    async saveEmployee() {
      try {
        if (this.editing) {
          await api.updateEmployee(this.form.employee_id, this.form)
        } else {
          await api.createEmployee(this.form)
        }
        await this.loadEmployees()
        this.closeModal()
      } catch (error) {
        alert('Ошибка при сохранении: ' + error.message)
      }
    },
    async deleteEmployee(id) {
      if (confirm('Вы уверены, что хотите удалить этого сотрудника?')) {
        try {
          await api.deleteEmployee(id)
          await this.loadEmployees()
        } catch (error) {
          alert('Ошибка при удалении: ' + error.message)
        }
      }
    },
    getFullName(employee) {
      return `${employee.last_name} ${employee.first_name} ${employee.middle_name || ''}`.trim()
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

