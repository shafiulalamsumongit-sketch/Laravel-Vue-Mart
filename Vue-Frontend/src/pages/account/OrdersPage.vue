<template>
  <div class="bg-white rounded-xl shadow-sm p-6">
    <h2 class="text-xl font-bold text-gray-800 mb-6">My Orders</h2>
    <div v-if="loading" class="flex justify-center py-8">
      <div class="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
    <div v-else-if="orders.length === 0" class="text-center py-12 text-gray-400">
      <p class="text-lg">No orders yet</p>
      <RouterLink to="/products" class="text-blue-600 hover:underline text-sm mt-2 block">Start shopping</RouterLink>
    </div>
    <div v-else class="space-y-4">
      <div v-for="order in orders" :key="order.id" class="border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors">
        <div class="flex items-center justify-between mb-3">
          <div>
            <span class="font-bold text-gray-800 text-sm">#{{ order.order_number }}</span>
            <span class="text-gray-400 text-xs ml-3">{{ formatDate(order.created_at) }}</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="px-2 py-1 text-xs rounded-full capitalize font-medium"
              :class="statusClass(order.status)">{{ order.status }}</span>
            <span class="font-bold text-gray-800">\${{ parseFloat(order.total).toFixed(2) }}</span>
          </div>
        </div>
        <div class="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <span>{{ order.items?.length || 0 }} item(s)</span>
          <span>•</span>
          <span class="capitalize">{{ order.payment_status }}</span>
        </div>
        <RouterLink :to="`/account/orders/${order.id}`" class="text-blue-600 text-sm hover:underline font-medium">
          View Details →
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import axios from 'axios'

const orders  = ref([])
const loading = ref(false)

function formatDate(d) { return new Date(d).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' }) }
function statusClass(s) {
  return {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  }[s] || 'bg-gray-100 text-gray-800'
}

onMounted(async () => {
  loading.value = true
  try {
    const { data } = await axios.get('/api/orders')
    orders.value = data.data
  } finally {
    loading.value = false
  }
})
</script>
