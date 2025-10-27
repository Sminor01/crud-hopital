import axios from 'axios'

const API_URL = 'http://localhost:3000/api'

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

const api = {
  // Departaments
  async getDepartaments() {
    const { data } = await apiClient.get('/departaments')
    return data
  },
  
  async getDepartament(id) {
    const { data } = await apiClient.get(`/departaments/${id}`)
    return data
  },
  
  async createDepartament(departament) {
    const { data } = await apiClient.post('/departaments', departament)
    return data
  },
  
  async updateDepartament(id, departament) {
    const { data } = await apiClient.put(`/departaments/${id}`, departament)
    return data
  },
  
  async deleteDepartament(id) {
    const { data } = await apiClient.delete(`/departaments/${id}`)
    return data
  },

  // Employees
  async getEmployees() {
    const { data } = await apiClient.get('/employees')
    return data
  },
  
  async getEmployee(id) {
    const { data } = await apiClient.get(`/employees/${id}`)
    return data
  },
  
  async createEmployee(employee) {
    const { data } = await apiClient.post('/employees', employee)
    return data
  },
  
  async updateEmployee(id, employee) {
    const { data } = await apiClient.put(`/employees/${id}`, employee)
    return data
  },
  
  async deleteEmployee(id) {
    const { data } = await apiClient.delete(`/employees/${id}`)
    return data
  },

  // Positions
  async getPositions() {
    const { data } = await apiClient.get('/positions')
    return data
  },
  
  async getPosition(id) {
    const { data } = await apiClient.get(`/positions/${id}`)
    return data
  },
  
  async createPosition(position) {
    const { data } = await apiClient.post('/positions', position)
    return data
  },
  
  async updatePosition(id, position) {
    const { data } = await apiClient.put(`/positions/${id}`, position)
    return data
  },
  
  async deletePosition(id) {
    const { data } = await apiClient.delete(`/positions/${id}`)
    return data
  },

  // Contracts
  async getContracts() {
    const { data } = await apiClient.get('/contracts')
    return data
  },
  
  async getContract(id) {
    const { data } = await apiClient.get(`/contracts/${id}`)
    return data
  },
  
  async createContract(contract) {
    const { data } = await apiClient.post('/contracts', contract)
    return data
  },
  
  async updateContract(id, contract) {
    const { data } = await apiClient.put(`/contracts/${id}`, contract)
    return data
  },
  
  async deleteContract(id) {
    const { data } = await apiClient.delete(`/contracts/${id}`)
    return data
  },

  // Reports
  async getEmployeesByDepartament() {
    const { data } = await apiClient.get('/reports/employees-by-departament')
    return data
  },
  
  async getPositionStatistics() {
    const { data } = await apiClient.get('/reports/position-statistics')
    return data
  },
  
  async getEmploymentHistory(employeeId) {
    const { data } = await apiClient.get(`/reports/employment-history/${employeeId}`)
    return data
  },
  
  async getActiveContractsByDepartment(departamentId) {
    const { data } = await apiClient.get(`/reports/active-contracts/${departamentId}`)
    return data
  }
}

export default api

