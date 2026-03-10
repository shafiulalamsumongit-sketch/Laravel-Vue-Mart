import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import { useCartStore } from './cart'

export const useAuthStore = defineStore('auth', () => {
  const user  = ref(null)
  const token = ref(localStorage.getItem('auth_token'))

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  async function initAuth() {
    if (token.value) {
      try {
        const { data } = await axios.get('/api/user')
        user.value = data
      } catch {
        logout()
      }
    }
  }

  async function login(credentials) {
    const { data } = await axios.post('/api/login', credentials)
    token.value = data.access_token
    user.value  = data.user
    localStorage.setItem('auth_token', data.access_token)
    // Load cart after login
    const cartStore = useCartStore()
    await cartStore.fetchCart()
    return data
  }

  async function register(payload) {
    const { data } = await axios.post('/api/register', payload)
    token.value = data.access_token
    user.value  = data.user
    localStorage.setItem('auth_token', data.access_token)
    return data
  }

  async function logout() {
    try { await axios.post('/api/logout') } catch {}
    token.value = null
    user.value  = null
    localStorage.removeItem('auth_token')
    const cartStore = useCartStore()
    cartStore.items = []
  }

  async function updateProfile(payload) {
    const { data } = await axios.put('/api/user', payload)
    user.value = data
    return data
  }

  return { user, token, isAuthenticated, isAdmin, initAuth, login, register, logout, updateProfile }
})
