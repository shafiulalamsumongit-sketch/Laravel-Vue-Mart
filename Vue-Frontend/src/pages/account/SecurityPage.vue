<template>
  <div class="bg-white rounded-xl shadow-sm p-6">
    <h2 class="text-xl font-bold text-gray-800 mb-6">Security Settings</h2>
    <div v-if="success" class="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
      Password updated successfully!
    </div>
    <div v-if="error" class="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{{ error }}</div>
    <div class="max-w-md space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
        <input v-model="form.current_password" type="password"
          class="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"/>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
        <input v-model="form.password" type="password"
          class="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"/>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
        <input v-model="form.password_confirmation" type="password"
          class="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"/>
      </div>
      <button @click="changePassword" :disabled="saving"
        class="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors">
        {{ saving ? 'Updating...' : 'Update Password' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const form    = ref({ current_password:'', password:'', password_confirmation:'' })
const saving  = ref(false)
const success = ref(false)
const error   = ref('')

async function changePassword() {
  saving.value = true; error.value = ''; success.value = false
  try {
    await axios.put('/api/user/password', form.value)
    success.value = true
    form.value = { current_password:'', password:'', password_confirmation:'' }
    setTimeout(() => success.value = false, 4000)
  } catch (e) {
    error.value = e.response?.data?.message || 'Failed to update password.'
  } finally { saving.value = false }
}
</script>
