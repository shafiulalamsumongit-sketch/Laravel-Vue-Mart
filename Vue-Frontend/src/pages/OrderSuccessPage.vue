<template>
  <div class="container mx-auto px-4 py-24 text-center max-w-lg">
    <div class="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
      <svg class="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
      </svg>
    </div>
    <h1 class="text-3xl font-bold text-gray-800 mb-3">Order Placed!</h1>
    <p class="text-gray-500 mb-8">Thank you for your purchase. Your order has been confirmed and is being processed.</p>
    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <RouterLink to="/account/orders" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
        View Orders
      </RouterLink>
      <RouterLink to="/products" class="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-xl transition-colors">
        Continue Shopping
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>
