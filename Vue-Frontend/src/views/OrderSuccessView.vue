<template>
  <div class="success-page container">
    <div class="success-card">
      <div class="success-icon">✅</div>
      <h1>Order Confirmed!</h1>
      <p class="order-num">Order #{{ orderId }}</p>
      <p class="message">Thank you for your purchase. You'll receive a confirmation email shortly.</p>
      <div class="actions">
        <RouterLink :to="`/account/orders/${orderId}`" class="btn-primary">View Order Details</RouterLink>
        <RouterLink to="/products" class="btn-secondary">Continue Shopping</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()
const orderId = route.params.id
</script>

<style scoped>
.container { max-width: 600px; margin: 4rem auto; padding: 0 1rem; }
.success-card { background: #fff; border-radius: 16px; padding: 3rem; text-align: center; border: 1px solid #e2e8f0; box-shadow: 0 10px 30px rgba(0,0,0,.05); }
.success-icon { font-size: 4rem; margin-bottom: 1rem; }
h1 { font-size: 2rem; font-weight: 800; color: #1e293b; margin: 0 0 .5rem; }
.order-num { color: #4f46e5; font-weight: 600; margin: 0 0 1rem; }
.message { color: #64748b; margin: 0 0 2rem; line-height: 1.6; }
.actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
.btn-primary { background: #4f46e5; color: #fff; padding: .85rem 1.75rem; border-radius: 10px; text-decoration: none; font-weight: 600; }
.btn-secondary { border: 1px solid #e2e8f0; color: #475569; padding: .85rem 1.75rem; border-radius: 10px; text-decoration: none; font-weight: 600; }
</style>
