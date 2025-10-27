import { createRouter, createWebHistory } from 'vue-router'
import Contracts from '../views/Contracts.vue'
import Departaments from '../views/Departaments.vue'
import Employees from '../views/Employees.vue'
import Home from '../views/Home.vue'
import Positions from '../views/Positions.vue'
import Reports from '../views/Reports.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/departaments',
    name: 'Departaments',
    component: Departaments
  },
  {
    path: '/employees',
    name: 'Employees',
    component: Employees
  },
  {
    path: '/positions',
    name: 'Positions',
    component: Positions
  },
  {
    path: '/contracts',
    name: 'Contracts',
    component: Contracts
  },
  {
    path: '/reports',
    name: 'Reports',
    component: Reports
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

