<template>
  <div class="bg-white rounded-xl shadow-sm p-6">
    <div class="flex items-center gap-3 mb-6">
      <RouterLink to="/account/orders" class="text-gray-400 hover:text-gray-600">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
      </RouterLink>
      <h2 class="text-xl font-bold text-gray-800">Order #{{ order?.order_number }}</h2>
    </div>

    <div v-if="loading" class="flex justify-center py-8">
      <div class="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
    <div v-else-if="order" class="space-y-6">
      <!-- Status banner -->
      <div class="flex items-center justify-between p-4 rounded-xl"
        :class="statusBg(order.status)">
        <div>
          <p class="font-semibold capitalize">{{ order.status }}</p>
          <p class="text-sm opacity-75">{{ formatDate(order.created_at) }}</p>
        </div>
        <span class="text-2xl">{{ statusEmoji(order.status) }}</span>
      </div>

      <!-- Items -->
      <div>
        <h3 class="font-semibold text-gray-700 mb-3">Items Ordered</h3>
        <div class="space-y-3">
          <div v-for="item in order.items" :key="item.id"
               class="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0">
            <div class="w-14 h-14 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center">
              <img v-if="item.product_image" :src="item.product_image" class="w-full h-full object-cover rounded-lg"/>
              <svg v-else class="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
            </div>
            <div class="flex-1">
              <p class="font-medium text-sm text-gray-800">{{ item.product_name }}</p>
              <p class="text-xs text-gray-400">Qty: {{ item.quantity }} × ${{ parseFloat(item.price).toFixed(2) }}</p>
            </div>
            <span class="font-semibold text-sm">${{ parseFloat(item.subtotal).toFixed(2) }}</span>
          </div>
        </div>
      </div>

      <!-- Totals + Address -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <h3 class="font-semibold text-gray-700 mb-3">Order Summary</h3>
          <div class="space-y-2 text-sm text-gray-600">
            <div class="flex justify-between"><span>Subtotal</span><span>${{ parseFloat(order.subtotal).toFixed(2) }}</span></div>
            <div class="flex justify-between"><span>Tax</span><span>${{ parseFloat(order.tax).toFixed(2) }}</span></div>
            <div class="flex justify-between"><span>Shipping</span><span>{{ order.shipping == 0 ? 'FREE' : '$' + parseFloat(order.shipping).toFixed(2) }}</span></div>
            <div class="flex justify-between font-bold text-gray-800 text-base pt-2 border-t mt-2"><span>Total</span><span>${{ parseFloat(order.total).toFixed(2) }}</span></div>
          </div>
        </div>
        <div v-if="order.shipping_address">
          <h3 class="font-semibold text-gray-700 mb-3">Shipping To</h3>
          <div class="text-sm text-gray-600 space-y-1">
            <p class="font-medium text-gray-800">{{ order.shipping_address.first_name }} {{ order.shipping_address.last_name }}</p>
            <p>{{ order.shipping_address.address_line1 }}</p>
            <p>{{ order.shipping_address.city }}, {{ order.shipping_address.state }} {{ order.shipping_address.postal_code }}</p>
          </div>
        </div>
      </div>

      <!-- Cancel -->
      <div v-if="['pending','processing'].includes(order.status)">
        <button @click="cancelOrder" :disabled="cancelling"
          class="text-sm text-red-600 hover:text-red-800 border border-red-200 hover:border-red-400 px-4 py-2 rounded-lg transition-colors">
          {{ cancelling ? 'Cancelling...' : 'Cancel Order' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import axios from 'axios'

const route     = useRoute()
const order     = ref(null)
const loading   = ref(false)
const cancelling = ref(false)

function formatDate(d) { return new Date(d).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' }) }
function statusBg(s) {
  return { pending:'bg-yellow-50 text-yellow-800', processing:'bg-blue-50 text-blue-800',
           shipped:'bg-purple-50 text-purple-800', delivered:'bg-green-50 text-green-800',
           cancelled:'bg-red-50 text-red-800' }[s] || 'bg-gray-50 text-gray-800'
}
function statusEmoji(s) {
  return { pending:'⏳', processing:'🔄', shipped:'🚚', delivered:'✅', cancelled:'❌' }[s] || '📦'
}

async function cancelOrder() {
  cancelling.value = true
  try {
    const { data } = await axios.post(`/api/orders/${order.value.id}/cancel`)
    order.value = data.order
  } finally { cancelling.value = false }
}

onMounted(async () => {
  loading.value = true
  try { const { data } = await axios.get(`/api/orders/${route.params.id}`); order.value = data }
  finally { loading.value = false }
})
</script>
