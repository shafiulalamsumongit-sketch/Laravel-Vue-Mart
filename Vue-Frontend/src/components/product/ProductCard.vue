<template>
  <div class="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col">
    <RouterLink :to="`/products/${product.slug}`" class="block relative overflow-hidden aspect-square bg-gray-100">
      <img v-if="product.images?.[0]" :src="product.images[0]" :alt="product.name"
           class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      <div v-else class="w-full h-full flex items-center justify-center text-gray-300">
        <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
      </div>
      <div class="absolute top-3 left-3 flex flex-col gap-1">
        <span v-if="product.sale_price" class="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">SALE</span>
        <span v-if="product.stock === 0" class="bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded-full">SOLD OUT</span>
      </div>
    </RouterLink>
    <div class="p-4 flex-1 flex flex-col">
      <p v-if="product.category" class="text-xs text-blue-600 font-medium uppercase tracking-wide mb-1">{{ product.category.name }}</p>
      <RouterLink :to="`/products/${product.slug}`"
        class="font-semibold text-gray-800 hover:text-blue-600 transition-colors text-sm leading-snug mb-2 line-clamp-2">
        {{ product.name }}
      </RouterLink>
      <div v-if="product.reviews_avg_rating" class="flex items-center gap-1 mb-2">
        <div class="flex">
          <svg v-for="i in 5" :key="i" class="w-3 h-3"
               :class="i <= Math.round(product.reviews_avg_rating) ? 'text-yellow-400' : 'text-gray-200'"
               fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
        </div>
        <span class="text-xs text-gray-500">({{ product.reviews_count || 0 }})</span>
      </div>
      <div class="mt-auto flex items-center justify-between">
        <div>
          <span v-if="product.sale_price" class="font-bold text-red-600 text-lg">\${{ formatPrice(product.sale_price) }}</span>
          <span v-if="product.sale_price" class="text-gray-400 text-sm line-through ml-1">\${{ formatPrice(product.price) }}</span>
          <span v-else class="font-bold text-gray-800 text-lg">\${{ formatPrice(product.price) }}</span>
        </div>
        <button @click="addToCart" :disabled="product.stock === 0 || adding"
          class="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors">
          {{ adding ? 'Adding...' : 'Add to Cart' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'

const props = defineProps({ product: { type: Object, required: true } })
const cartStore = useCartStore()
const authStore = useAuthStore()
const router    = useRouter()
const adding    = ref(false)

const isAuthenticated = computed(() => authStore.isAuthenticated)

function formatPrice(price) {
  return parseFloat(price).toFixed(2)
}

async function addToCart() {
  if (!isAuthenticated.value) {
    router.push({ name: 'login', query: { redirect: `/products/${props.product.slug}` } })
    return
  }
  adding.value = true
  try {
    await cartStore.addItem(props.product.id, 1)
  } finally {
    adding.value = false
  }
}
</script>
