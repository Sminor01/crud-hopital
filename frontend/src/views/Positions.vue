<template>
  <div class="positions">
    <div class="card">
      <div class="header-actions">
        <h2>Управление должностями</h2>
        <button @click="openModal()" class="btn btn-primary">Добавить должность</button>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Наименование</th>
              <th>Диапазон ЗП</th>
              <th>Обязанности</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="position in positions" :key="position.position_id">
              <td>{{ position.position_id }}</td>
              <td>{{ position.position_name }}</td>
              <td>{{ position.salary_range }}</td>
              <td>{{ truncateText(position.responsibilities, 50) }}</td>
              <td>
                <button @click="openModal(position)" class="btn btn-secondary">Изменить</button>
                <button @click="deletePosition(position.position_id)" class="btn btn-danger">Удалить</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Modal v-if="showModal" @close="closeModal">
      <form @submit.prevent="savePosition">
        <h3>{{ editing ? 'Изменить' : 'Добавить' }} должность</h3>
        
        <div class="form-group">
          <label>Наименование</label>
          <input v-model="form.position_name" required>
        </div>
        
        <div class="form-group">
          <label>Диапазон зарплаты</label>
          <input v-model="form.salary_range" placeholder="80000-120000">
        </div>
        
        <div class="form-group">
          <label>Обязанности</label>
          <textarea v-model="form.responsibilities"></textarea>
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
  name: 'Positions',
  components: { Modal },
  data() {
    return {
      positions: [],
      showModal: false,
      editing: false,
      form: {
        position_id: null,
        position_name: '',
        salary_range: '',
        responsibilities: ''
      }
    }
  },
  async mounted() {
    await this.loadPositions()
  },
  methods: {
    async loadPositions() {
      this.positions = await api.getPositions()
    },
    openModal(position = null) {
      this.editing = !!position
      if (position) {
        this.form = { ...position }
      } else {
        this.form = {
          position_id: null,
          position_name: '',
          salary_range: '',
          responsibilities: ''
        }
      }
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
    },
    async savePosition() {
      try {
        if (this.editing) {
          await api.updatePosition(this.form.position_id, this.form)
        } else {
          await api.createPosition(this.form)
        }
        await this.loadPositions()
        this.closeModal()
      } catch (error) {
        alert('Ошибка при сохранении: ' + error.message)
      }
    },
    async deletePosition(id) {
      if (confirm('Вы уверены, что хотите удалить эту должность?')) {
        try {
          await api.deletePosition(id)
          await this.loadPositions()
        } catch (error) {
          alert('Ошибка при удалении: ' + error.message)
        }
      }
    },
    truncateText(text, length) {
      if (!text) return ''
      return text.length > length ? text.substring(0, length) + '...' : text
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

