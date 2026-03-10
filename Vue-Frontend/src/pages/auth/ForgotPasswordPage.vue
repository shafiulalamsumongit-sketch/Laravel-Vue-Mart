<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
    <div class="max-w-md w-full">
      <div class="text-center mb-8">
        <RouterLink to="/" class="text-3xl font-extrabold text-blue-600">Vue<span class="text-gray-800">Mart</span></RouterLink>
        <h2 class="text-2xl font-bold text-gray-800 mt-4">Reset Password</h2>
        <p class="text-gray-500 mt-1">Enter your email to receive a reset link</p>
      </div>
      <div class="bg-white rounded-2xl shadow-sm p-8">
        <div v-if="sent" class="text-center py-4">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <p class="font-semibold text-gray-800">Check your email!</p>
          <p class="text-gray-500 text-sm mt-1">We sent a password reset link to {{ email }}</p>
        </div>
        <div v-else class="space-y-4">
          <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{{ error }}</div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input v-model="email" type="email" placeholder="you@example.com"
              class="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"/>
          </div>
          <button @click="submit" :disabled="loading"
            class="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors">
            {{ loading ? 'Sending...' : 'Send Reset Link' }}
          </button>
          <RouterLink to="/login" class="block text-center text-sm text-blue-600 hover:underline">Back to login</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import axios from 'axios'

const email   = ref('')
const loading = ref(false)
const sent    = ref(false)
const error   = ref('')

async function submit() {
  loading.value = true; error.value = ''
  try {
    await axios.post('/api/forgot-password', { email: email.value })
    sent.value = true
  } catch (e) {
    error.value = e.response?.data?.message || 'Something went wrong. Please try again.'
  } finally { loading.value = false }
}
</script>
