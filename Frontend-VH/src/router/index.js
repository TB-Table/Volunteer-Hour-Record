// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/Home.vue'
import Record from '../views/Record.vue'
import Profile from '../views/Profile.vue'

const routes = [
  {
    path: '/',
    component: Home
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