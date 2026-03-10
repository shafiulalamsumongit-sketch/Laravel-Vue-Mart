<template>
  <div>
    <h2 class="page-title">My Orders</h2>

    <div v-if="loading" class="loading">Loading orders...</div>

    <div v-else-if="!orders.length" class="empty">
      <p>You haven't placed any orders yet.</p>
      <RouterLink to="/products" class="btn-shop">Start Shopping</RouterLink>
    </div>

    <div v-else class="orders-list">
      <div v-for="order in orders" :key="order.id" class="order-card">
        <div class="order-header">
          <div>
            <p class="order-number">{{ order.order_number }}</p>
            <p class="order-date">{{ formatDate(order.created_at) }}</p>
          </div>
          <div class="order-status-wrap">
            <span class="status-badge" :class="`status-${order.status}`">{{ ucFirst(order.status) }}</span>
            <p class="order-total">${{ formatPrice(order.total) }}</p>
          </div>
        </div>

        <div class="order-items-preview">
          <div v-for="item in order.items?.slice(0,3)" :key="item.id" class="preview-item">
            <img :src="item.product?.primary_image || '/placeholder.jpg'" :alt="item.name" />
          </div>
          <span v-if="order.items?.length > 3" class="more-items">+{{ order.items.length - 3 }} more</span>
        </div>

        <div class="order-footer">
          <RouterLink :to="`/account/orders/${order.id}`" class="btn-view">View Order Details →</RouterLink>
          <button v-if="['pending','processing'].includes(order.status)" class="btn-cancel" @click="cancelOrder(order)">
            Cancel Order
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import { useToast } from 'vue-toastification'

const toast = useToast()
const orders = ref([])
const loading = ref(true)

async function fetchOrders() {
  try {
    const response = await api.get('/orders')
    orders.value = response.data.data || response.data
  } catch {}
  finally { loading.value = false }
}

async function cancelOrder(order) {
  if (!confirm('Are you sure you want to cancel this order?')) return
  try {
    await api.post(`/orders/${order.id}/cancel`)
    order.status = 'cancelled'
    toast.success('Order cancelled successfully')
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to cancel order')
  }
}

function formatDate(d) { return new Date(d).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' }) }
function formatPrice(p) { return parseFloat(p).toFixed(2) }
function ucFirst(s) { return s.charAt(0).toUpperCase() + s.slice(1) }

onMounted(fetchOrders)
</script>

<style scoped>
.page-title { font-size: 1.5rem; font-weight: 700; color: #1e293b; margin: 0 0 1.5rem; }
.loading, .empty { text-align: center; padding: 3rem; color: #94a3b8; }
.btn-shop { display: inline-block; background: #4f46e5; color: #fff; padding: .75rem 1.5rem; border-radius: 8px; text-decoration: none; margin-top: 1rem; }
.order-card { border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.25rem; margin-bottom: 1rem; }
.order-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; }
.order-number { font-weight: 700; color: #1e293b; margin: 0 0 .2rem; }
.order-date { font-size: .8rem; color: #94a3b8; margin: 0; }
.order-status-wrap { text-align: right; }
.status-badge { display: inline-block; padding: .25rem .75rem; border-radius: 20px; font-size: .75rem; font-weight: 600; margin-bottom: .3rem; }
.status-pending    { background: #fef3c7; color: #d97706; }
.status-processing { background: #dbeafe; color: #2563eb; }
.status-shipped    { background: #e0e7ff; color: #4f46e5; }
.status-delivered  { background: #d1fae5; color: #059669; }
.status-cancelled  { background: #fee2e2; color: #dc2626; }
.order-total { font-size: 1rem; font-weight: 700; color: #1e293b; margin: 0; }
.order-items-preview { display: flex; gap: .5rem; align-items: center; margin-bottom: 1rem; }
.preview-item { width: 44px; height: 44px; border-radius: 6px; overflow: hidden; border: 1px solid #e2e8f0; }
.preview-item img { width: 100%; height: 100%; object-fit: cover; }
.more-items { font-size: .8rem; color: #94a3b8; }
.order-footer { display: flex; gap: 1rem; align-items: center; }
.btn-view { color: #4f46e5; text-decoration: none; font-size: .9rem; font-weight: 600; }
.btn-cancel { background: none; border: 1px solid #e2e8f0; padding: .4rem .9rem; border-radius: 6px; font-size: .85rem; color: #ef4444; cursor: pointer; }
.btn-cancel:hover { background: #fee2e2; }
</style>
