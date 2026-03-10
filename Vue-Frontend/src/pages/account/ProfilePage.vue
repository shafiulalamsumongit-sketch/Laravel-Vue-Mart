<template>
  <div class="bg-white rounded-xl shadow-sm p-6">
    <h2 class="text-xl font-bold text-gray-800 mb-6">My Profile</h2>
    <div v-if="success" class="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">Profile updated!</div>
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
        <input v-model="form.name" class="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"/>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input v-model="form.email" type="email" class="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"/>
      </div>
      <button @click="save" :disabled="saving" class="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors">
        {{ saving ? 'Saving...' : 'Save Changes' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const user      = computed(() => authStore.user)
const form      = ref({ name: '', email: '' })
const saving    = ref(false)
const success   = ref(false)

async function save() {
  saving.value = true
  success.value = false
  try {
    await authStore.updateProfile(form.value)
    success.value = true
    setTimeout(() => success.value = false, 3000)
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  if (user.value) {
    form.value = { name: user.value.name, email: user.value.email }
  }
})
</script>
