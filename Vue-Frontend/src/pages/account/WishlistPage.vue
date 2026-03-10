<template>
  <div class="bg-white rounded-xl shadow-sm p-6">
    <h2 class="text-xl font-bold text-gray-800 mb-6">My Wishlist</h2>
    <div v-if="loading" class="flex justify-center py-8">
      <div class="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
    <div v-else-if="items.length === 0" class="text-center py-12 text-gray-400">
      <svg class="w-16 h-16 mx-auto mb-4 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
      </svg>
      <p class="text-lg font-medium">Your wishlist is empty</p>
      <RouterLink to="/products" class="text-blue-600 hover:underline text-sm mt-2 block">Browse products</RouterLink>
    </div>
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div v-for="product in items" :key="product.id"
           class="flex gap-4 border border-gray-100 rounded-xl p-4 hover:border-blue-200 transition-colors">
        <RouterLink :to="`/products/${product.slug}`" class="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden block">
          <img v-if="product.images?.[0]" :src="product.images[0]" :alt="product.name" class="w-full h-full object-cover"/>
          <div v-else class="w-full h-full flex items-center justify-center text-gray-300">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14"/></svg>
          </div>
        </RouterLink>
        <div class="flex-1 min-w-0">
          <RouterLink :to="`/products/${product.slug}`" class="font-medium text-gray-800 hover:text-blue-600 text-sm line-clamp-2 block">
            {{ product.name }}
          </RouterLink>
          <p class="text-blue-600 font-bold mt-1 text-sm">
            ${{ parseFloat(product.sale_price || product.price).toFixed(2) }}
          </p>
          <div class="flex gap-2 mt-2">
            <button @click="addToCart(product)"
              class="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition-colors">
              Add to Cart
            </button>
            <button @click="removeFromWishlist(product.id)"
              class="text-xs text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-3 py-1.5 rounded-lg transition-colors">
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useWishlistStore } from '@/stores/wishlist'
import { useCartStore } from '@/stores/cart'

const wishlistStore = useWishlistStore()
const cartStore     = useCartStore()
const items   = computed(() => wishlistStore.items)
const loading = computed(() => wishlistStore.loading)

async function removeFromWishlist(id) { await wishlistStore.toggle(id) }
async function addToCart(product) { await cartStore.addItem(product.id, 1) }

onMounted(() => wishlistStore.fetchWishlist())
</script>
