<template>
  <div class="container mx-auto px-4 py-8 max-w-5xl">
    <div class="flex gap-8">
      <aside class="w-64 flex-shrink-0">
        <div class="bg-white rounded-xl shadow-sm p-4">
          <div class="text-center p-4 mb-2 border-b border-gray-100">
            <div class="w-16 h-16 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-2">
              {{ userInitial }}
            </div>
            <p class="font-semibold text-gray-800">{{ user?.name }}</p>
            <p class="text-xs text-gray-400">{{ user?.email }}</p>
          </div>
          <nav class="space-y-1 mt-2">
            <RouterLink v-for="item in menuItems" :key="item.to" :to="item.to"
              class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 transition-colors"
              :class="{ 'bg-blue-50 text-blue-700 font-medium': $route.path === item.to }">
              <span class="text-base">{{ item.icon }}</span>
              {{ item.label }}
            </RouterLink>
          </nav>
        </div>
      </aside>
      <main class="flex-1">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore   = useAuthStore()
const user        = computed(() => authStore.user)
const userInitial = computed(() => user.value?.name?.charAt(0).toUpperCase() || 'U')

const menuItems = [
  { to: '/account',           icon: '👤', label: 'My Profile' },
  { to: '/account/orders',    icon: '📦', label: 'My Orders' },
  { to: '/account/wishlist',  icon: '❤️', label: 'Wishlist' },
  { to: '/account/addresses', icon: '📍', label: 'Addresses' },
  { to: '/account/security',  icon: '🔒', label: 'Security' },
]
</script>
