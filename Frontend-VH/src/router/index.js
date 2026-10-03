// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

import Dashboard from '../views/Dashboard.vue'
import Record from '../views/Record.vue'
import Profile from '../views/Profile.vue'

const routes = [
  {
    path: '/',
    component: Dashboard
  },
  {
    path: '/Profile',
    component: Profile
  },
  {
    path: '/Record',
    component: Record
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router