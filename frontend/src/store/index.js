import { createStore } from 'vuex'
import api from '../services/api'

export default createStore({
  state: {
    departaments: [],
    employees: [],
    positions: [],
    contracts: []
  },
  mutations: {
    SET_DEPARTAMENTS(state, departaments) {
      state.departaments = departaments
    },
    SET_EMPLOYEES(state, employees) {
      state.employees = employees
    },
    SET_POSITIONS(state, positions) {
      state.positions = positions
    },
    SET_CONTRACTS(state, contracts) {
      state.contracts = contracts
    }
  },
  actions: {
    async fetchDepartaments({ commit }) {
      const data = await api.getDepartaments()
      commit('SET_DEPARTAMENTS', data)
    },
    async fetchEmployees({ commit }) {
      const data = await api.getEmployees()
      commit('SET_EMPLOYEES', data)
    },
    async fetchPositions({ commit }) {
      const data = await api.getPositions()
      commit('SET_POSITIONS', data)
    },
    async fetchContracts({ commit }) {
      const data = await api.getContracts()
      commit('SET_CONTRACTS', data)
    }
  }
})

