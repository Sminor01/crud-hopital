<template>
  <div class="departaments">
    <div class="card">
      <div class="header-actions">
        <h2>Управление факультетами</h2>
        <button @click="openModal()" class="btn btn-primary">Добавить факультет</button>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Наименование</th>
              <th>Адрес корпуса</th>
              <th>Телефон</th>
              <th>Email</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="departament in departaments" :key="departament.departament_id">
              <td>{{ departament.departament_id }}</td>
              <td>{{ departament.departament_name }}</td>
              <td>{{ departament.building_address }}</td>
              <td>{{ departament.phone }}</td>
              <td>{{ departament.email }}</td>
              <td>
                <button @click="openModal(departament)" class="btn btn-secondary">Изменить</button>
                <button @click="deleteDepartament(departament.departament_id)" class="btn btn-danger">Удалить</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Modal v-if="showModal" @close="closeModal">
      <form @submit.prevent="saveDepartament">
        <h3>{{ editing ? 'Изменить' : 'Добавить' }} факультет</h3>
        
        <div class="form-group">
          <label>Наименование</label>
          <input v-model="form.departament_name" required>
        </div>
        
        <div class="form-group">
          <label>Адрес корпуса</label>
          <input v-model="form.building_address">
        </div>
        
        <div class="form-group">
          <label>Телефон</label>
          <input v-model="form.phone">
        </div>
        
        <div class="form-group">
          <label>Email</label>
          <input v-model="form.email" type="email">
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
  name: 'Departaments',
  components: { Modal },
  data() {
    return {
      departaments: [],
      showModal: false,
      editing: false,
      form: {
        departament_id: null,
        departament_name: '',
        building_address: '',
        phone: '',
        email: ''
      }
    }
  },
  async mounted() {
    await this.loadDepartaments()
  },
  methods: {
    async loadDepartaments() {
      this.departaments = await api.getDepartaments()
    },
    openModal(departament = null) {
      this.editing = !!departament
      if (departament) {
        this.form = { ...departament }
      } else {
        this.form = {
          departament_id: null,
          departament_name: '',
          building_address: '',
          phone: '',
          email: ''
        }
      }
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
      this.form = {
        departament_id: null,
        departament_name: '',
        building_address: '',
        phone: '',
        email: ''
      }
    },
    async saveDepartament() {
      try {
        if (this.editing) {
          await api.updateDepartament(this.form.departament_id, this.form)
        } else {
          await api.createDepartament(this.form)
        }
        await this.loadDepartaments()
        this.closeModal()
      } catch (error) {
        alert('Ошибка при сохранении: ' + error.message)
      }
    },
    async deleteDepartament(id) {
      if (confirm('Вы уверены, что хотите удалить этот факультет?')) {
        try {
          await api.deleteDepartament(id)
          await this.loadDepartaments()
        } catch (error) {
          alert('Ошибка при удалении: ' + error.message)
        }
      }
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

