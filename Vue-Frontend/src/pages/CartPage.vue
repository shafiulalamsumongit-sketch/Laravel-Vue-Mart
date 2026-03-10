<template>
  <div class="container mx-auto px-4 py-8 max-w-6xl">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Shopping Cart</h1>

    <div v-if="loading" class="flex justify-center py-16">
      <div class="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>

    <div v-else-if="isEmpty" class="text-center py-24">
      <svg class="w-24 h-24 text-gray-200 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
      </svg>
      <h2 class="text-2xl font-semibold text-gray-400 mb-4">Your cart is empty</h2>
      <RouterLink to="/products" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-full transition-colors">
        Start Shopping
      </RouterLink>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Cart items -->
      <div class="lg:col-span-2 space-y-4">
        <div v-for="item in items" :key="item.id"
             class="bg-white rounded-xl p-4 flex gap-4 shadow-sm">
          <RouterLink :to="`/products/${item.product?.slug}`" class="flex-shrink-0">
            <div class="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
              <img v-if="item.product?.images?.[0]" :src="item.product.images[0]" :alt="item.product.name"
                   class="w-full h-full object-cover" />
              <div v-else class="w-full h-full flex items-center justify-center text-gray-300">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
            </div>
          </RouterLink>
          <div class="flex-1 min-w-0">
            <RouterLink :to="`/products/${item.product?.slug}`"
              class="font-semibold text-gray-800 hover:text-blue-600 transition-colors text-sm">
              {{ item.product?.name }}
            </RouterLink>
            <p class="text-blue-600 font-bold mt-1">\${{ formatPrice(item.product?.sale_price || item.product?.price) }}</p>
          </div>
          <div class="flex flex-col items-end gap-3">
            <button @click="removeItem(item.id)" class="text-gray-400 hover:text-red-500 transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
            <div class="flex items-center border border-gray-200 rounded-lg overflow-hidden">
              <button @click="updateQty(item, item.quantity - 1)"
                      class="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100">−</button>
              <span class="w-10 text-center text-sm font-medium">{{ item.quantity }}</span>
              <button @click="updateQty(item, item.quantity + 1)"
                      class="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100">+</button>
            </div>
            <p class="text-sm font-semibold text-gray-800">
              \${{ formatPrice((item.product?.sale_price || item.product?.price) * item.quantity) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Order summary -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-xl p-6 shadow-sm sticky top-24">
          <h2 class="font-bold text-lg text-gray-800 mb-4">Order Summary</h2>
          <div class="space-y-3 text-sm mb-6">
            <div class="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>\${{ formatPrice(subtotal) }}</span>
            </div>
            <div class="flex justify-between text-gray-600">
              <span>Tax (8%)</span>
              <span>\${{ formatPrice(tax) }}</span>
            </div>
            <div class="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span :class="shipping === 0 ? 'text-green-600 font-medium' : ''">
                {{ shipping === 0 ? 'FREE' : '\$' + formatPrice(shipping) }}
              </span>
            </div>
            <div v-if="shipping > 0" class="text-xs text-gray-400">
              Add \${{ formatPrice(50 - subtotal) }} more for free shipping
            </div>
            <hr class="border-gray-100">
            <div class="flex justify-between font-bold text-lg text-gray-800">
              <span>Total</span>
              <span>\${{ formatPrice(total) }}</span>
            </div>
          </div>
          <RouterLink v-if="isAuthenticated" to="/checkout"
            class="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center font-semibold py-3 rounded-xl transition-colors mb-3">
            Proceed to Checkout
          </RouterLink>
          <RouterLink v-else to="/login?redirect=/checkout"
            class="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center font-semibold py-3 rounded-xl transition-colors mb-3">
            Login to Checkout
          </RouterLink>
          <RouterLink to="/products"
            class="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-center font-medium py-3 rounded-xl transition-colors text-sm">
            Continue Shopping
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'

const cartStore = useCartStore()
const authStore = useAuthStore()

const items    = computed(() => cartStore.items)
const subtotal = computed(() => cartStore.subtotal)
const tax      = computed(() => cartStore.tax)
const shipping = computed(() => cartStore.shipping)
const total    = computed(() => cartStore.total)
const loading  = computed(() => cartStore.loading)
const isEmpty  = computed(() => cartStore.isEmpty)
const isAuthenticated = computed(() => authStore.isAuthenticated)

function formatPrice(v) { return parseFloat(v || 0).toFixed(2) }

async function updateQty(item, qty) {
  if (qty < 1) return removeItem(item.id)
  await cartStore.updateItem(item.id, qty)
}

async function removeItem(id) {
  await cartStore.removeItem(id)
}

onMounted(() => {
  if (isAuthenticated.value) cartStore.fetchCart()
})
</script>
