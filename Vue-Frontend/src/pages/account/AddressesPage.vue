<template>
  <div class="bg-white rounded-xl shadow-sm p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-bold text-gray-800">Saved Addresses</h2>
      <button @click="showForm = !showForm"
        class="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
        + Add Address
      </button>
    </div>

    <!-- Add form -->
    <div v-if="showForm" class="mb-6 p-5 border-2 border-blue-100 rounded-xl bg-blue-50/30">
      <h3 class="font-semibold text-gray-700 mb-4">New Address</h3>
      <div class="grid grid-cols-2 gap-3">
        <div><label class="label">Label (Home, Work...)</label><input v-model="form.label" class="input" placeholder="Home" /></div>
        <div><label class="label">Phone</label><input v-model="form.phone" class="input" placeholder="+1 555 0000" /></div>
        <div><label class="label">First Name</label><input v-model="form.first_name" class="input" /></div>
        <div><label class="label">Last Name</label><input v-model="form.last_name" class="input" /></div>
        <div class="col-span-2"><label class="label">Address Line 1</label><input v-model="form.address_line1" class="input" /></div>
        <div><label class="label">City</label><input v-model="form.city" class="input" /></div>
        <div><label class="label">State</label><input v-model="form.state" class="input" /></div>
        <div><label class="label">Postal Code</label><input v-model="form.postal_code" class="input" /></div>
        <div><label class="label">Country</label><input v-model="form.country" class="input" value="US" /></div>
        <div class="col-span-2">
          <label class="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
            <input type="checkbox" v-model="form.is_default" class="rounded text-blue-600" />
            Set as default address
          </label>
        </div>
      </div>
      <div class="flex gap-2 mt-4">
        <button @click="saveAddress" :disabled="saving"
          class="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium px-5 py-2 rounded-lg">
          {{ saving ? 'Saving...' : 'Save Address' }}
        </button>
        <button @click="showForm = false" class="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm px-5 py-2 rounded-lg">Cancel</button>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center py-8">
      <div class="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
    <div v-else-if="addresses.length === 0 && !showForm" class="text-center py-10 text-gray-400">
      No addresses saved yet.
    </div>
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div v-for="addr in addresses" :key="addr.id"
           class="border rounded-xl p-4 relative"
           :class="addr.is_default ? 'border-blue-400 bg-blue-50/30' : 'border-gray-200'">
        <div v-if="addr.is_default" class="absolute top-3 right-3 text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">Default</div>
        <p class="font-semibold text-sm text-gray-800 mb-1">{{ addr.label }}</p>
        <p class="text-sm text-gray-600">{{ addr.first_name }} {{ addr.last_name }}</p>
        <p class="text-sm text-gray-500">{{ addr.address_line1 }}</p>
        <p class="text-sm text-gray-500">{{ addr.city }}, {{ addr.state }} {{ addr.postal_code }}</p>
        <p class="text-sm text-gray-500">{{ addr.country }}</p>
        <button @click="deleteAddress(addr.id)" class="mt-3 text-xs text-red-500 hover:text-red-700">Remove</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const addresses = ref([])
const loading   = ref(false)
const saving    = ref(false)
const showForm  = ref(false)
const form = ref({ label:'Home', first_name:'', last_name:'', address_line1:'', city:'', state:'', postal_code:'', country:'US', phone:'', is_default:false })

async function loadAddresses() {
  loading.value = true
  try { const { data } = await axios.get('/api/addresses'); addresses.value = data } finally { loading.value = false }
}

async function saveAddress() {
  saving.value = true
  try {
    await axios.post('/api/addresses', form.value)
    await loadAddresses()
    showForm.value = false
    form.value = { label:'Home', first_name:'', last_name:'', address_line1:'', city:'', state:'', postal_code:'', country:'US', phone:'', is_default:false }
  } finally { saving.value = false }
}

async function deleteAddress(id) {
  await axios.delete(`/api/addresses/${id}`)
  await loadAddresses()
}

onMounted(loadAddresses)
</script>

<style scoped>
.label { @apply block text-xs font-medium text-gray-600 mb-1; }
.input { @apply w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none; }
</style>
