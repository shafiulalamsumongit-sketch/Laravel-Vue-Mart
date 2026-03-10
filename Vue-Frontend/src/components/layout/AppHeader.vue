<template>
  <header class="bg-white shadow-sm sticky top-0 z-50">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between py-3 border-b border-gray-100">
        <RouterLink to="/" class="text-2xl font-extrabold text-blue-600 tracking-tight">
          Vue<span class="text-gray-800">Mart</span>
        </RouterLink>

        <!-- Search -->
        <form @submit.prevent="handleSearch" class="flex-1 max-w-xl mx-8">
          <div class="relative">
            <input v-model="searchQuery" type="text" placeholder="Search products..."
              class="w-full border border-gray-300 rounded-full py-2 pl-5 pr-12 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
            <button type="submit" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </button>
          </div>
        </form>

        <!-- Right actions -->
        <div class="flex items-center gap-5">
          <RouterLink v-if="isAuthenticated" to="/account/wishlist" class="text-gray-600 hover:text-red-500 transition-colors" title="Wishlist">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
          </RouterLink>

          <RouterLink to="/cart" class="relative text-gray-600 hover:text-blue-600 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
            <span v-if="cartCount > 0"
              class="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {{ cartCount > 99 ? '99+' : cartCount }}
            </span>
          </RouterLink>

          <!-- User dropdown -->
          <div v-if="isAuthenticated" class="relative" ref="userMenuRef">
            <button @click="showUserMenu = !showUserMenu" class="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600">
              <div class="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-sm">
                {{ userInitial }}
              </div>
            </button>
            <Transition name="dropdown">
              <div v-if="showUserMenu"
                class="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                <RouterLink to="/account" @click="showUserMenu = false" class="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">My Profile</RouterLink>
                <RouterLink to="/account/orders" @click="showUserMenu = false" class="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">My Orders</RouterLink>
                <RouterLink to="/account/wishlist" @click="showUserMenu = false" class="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">Wishlist</RouterLink>
                <hr class="my-1 border-gray-100">
                <button @click="handleLogout" class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Sign Out</button>
              </div>
            </Transition>
          </div>
          <div v-else class="flex items-center gap-3">
            <RouterLink to="/login" class="text-sm font-medium text-gray-700 hover:text-blue-600">Login</RouterLink>
            <RouterLink to="/register" class="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors">Sign Up</RouterLink>
          </div>
        </div>
      </div>

      <!-- Category nav -->
      <nav class="flex items-center gap-6 py-2 text-sm overflow-x-auto scrollbar-hide">
        <RouterLink to="/products" class="text-gray-600 hover:text-blue-600 whitespace-nowrap font-medium transition-colors">All Products</RouterLink>
        <RouterLink v-for="cat in categories" :key="cat.id"
          :to="`/categories/${cat.slug}`"
          class="text-gray-500 hover:text-blue-600 whitespace-nowrap transition-colors">
          {{ cat.name }}
        </RouterLink>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useProductStore } from '@/stores/products'

const router       = useRouter()
const authStore    = useAuthStore()
const cartStore    = useCartStore()
const productStore = useProductStore()

const searchQuery  = ref('')
const showUserMenu = ref(false)
const userMenuRef  = ref(null)

const isAuthenticated = computed(() => authStore.isAuthenticated)
const cartCount       = computed(() => cartStore.itemCount)
const categories      = computed(() => productStore.categories)
const userInitial     = computed(() => authStore.user?.name?.charAt(0).toUpperCase() || 'U')

function handleSearch() {
  if (searchQuery.value.trim()) {
    router.push({ name: 'search', query: { q: searchQuery.value.trim() } })
    searchQuery.value = ''
  }
}

async function handleLogout() {
  showUserMenu.value = false
  await authStore.logout()
  router.push('/')
}

function handleClickOutside(e) {
  if (userMenuRef.value && !userMenuRef.value.contains(e.target)) showUserMenu.value = false
}

onMounted(() => {
  productStore.fetchCategories()
  if (authStore.isAuthenticated) cartStore.fetchCart()
  document.addEventListener('click', handleClickOutside)
})
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>

<style scoped>
.dropdown-enter-active, .dropdown-leave-active { transition: all 0.15s ease; }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(-8px); }
</style>
