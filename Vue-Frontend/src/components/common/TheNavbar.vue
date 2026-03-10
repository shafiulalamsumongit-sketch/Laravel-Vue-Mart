<template>
  <nav class="navbar">
    <div class="container">
      <RouterLink to="/" class="navbar-brand">
        <span class="brand-text">Vue<span class="brand-accent">Shop</span></span>
      </RouterLink>

      <!-- Search Bar -->
      <div class="search-bar">
        <form @submit.prevent="handleSearch">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search products..."
            class="search-input"
          />
          <button type="submit" class="search-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          </button>
        </form>
      </div>

      <!-- Nav Actions -->
      <div class="nav-actions">
        <!-- Wishlist -->
        <RouterLink v-if="auth.isAuthenticated" to="/account/wishlist" class="nav-icon-btn" title="Wishlist">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </RouterLink>

        <!-- Cart -->
        <button class="nav-icon-btn cart-btn" @click="cartDrawerOpen = !cartDrawerOpen" title="Cart">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          <span v-if="cart.itemCount > 0" class="cart-badge">{{ cart.itemCount }}</span>
        </button>

        <!-- User Menu -->
        <div v-if="auth.isAuthenticated" class="user-menu" ref="userMenuRef">
          <button class="nav-icon-btn" @click="userMenuOpen = !userMenuOpen">
            <div class="user-avatar">{{ userInitial }}</div>
          </button>
          <div v-if="userMenuOpen" class="dropdown-menu">
            <RouterLink to="/account/profile" class="dropdown-item" @click="userMenuOpen = false">My Account</RouterLink>
            <RouterLink to="/account/orders" class="dropdown-item" @click="userMenuOpen = false">Orders</RouterLink>
            <RouterLink to="/account/wishlist" class="dropdown-item" @click="userMenuOpen = false">Wishlist</RouterLink>
            <hr class="dropdown-divider" />
            <button class="dropdown-item text-danger" @click="handleLogout">Logout</button>
          </div>
        </div>
        <div v-else class="auth-links">
          <RouterLink to="/login" class="btn-ghost">Login</RouterLink>
          <RouterLink to="/register" class="btn-primary-sm">Register</RouterLink>
        </div>
      </div>
    </div>

    <!-- Category Nav -->
    <div class="category-nav">
      <div class="container">
        <RouterLink to="/products" class="cat-link">All Products</RouterLink>
        <RouterLink
          v-for="cat in products.categories"
          :key="cat.id"
          :to="`/categories/${cat.slug}`"
          class="cat-link"
        >{{ cat.name }}</RouterLink>
      </div>
    </div>
  </nav>

  <!-- Cart Drawer Overlay -->
  <Teleport to="body">
    <div v-if="cartDrawerOpen" class="drawer-overlay" @click="cartDrawerOpen = false" />
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useProductStore } from '@/stores/products'

const router = useRouter()
const auth = useAuthStore()
const cart = useCartStore()
const products = useProductStore()

const searchQuery = ref('')
const userMenuOpen = ref(false)
const cartDrawerOpen = ref(false)
const userMenuRef = ref(null)

const userInitial = computed(() => auth.user?.name?.charAt(0)?.toUpperCase() || 'U')

// Provide cartDrawerOpen to CartDrawer via provide/inject or global state
// For simplicity we use a global event
const emit = defineEmits(['toggle-cart'])

function handleSearch() {
  if (searchQuery.value.trim()) {
    router.push({ name: 'search', query: { q: searchQuery.value } })
    searchQuery.value = ''
  }
}

async function handleLogout() {
  userMenuOpen.value = false
  await auth.logout()
  router.push({ name: 'home' })
}

function handleClickOutside(e) {
  if (userMenuRef.value && !userMenuRef.value.contains(e.target)) {
    userMenuOpen.value = false
  }
}

onMounted(() => {
  products.fetchCategories()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>

<style scoped>
.navbar { background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,.1); position: sticky; top: 0; z-index: 100; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; display: flex; align-items: center; gap: 1.5rem; height: 64px; }
.navbar-brand { text-decoration: none; }
.brand-text { font-size: 1.4rem; font-weight: 800; color: #1e293b; }
.brand-accent { color: #4f46e5; }
.search-bar { flex: 1; max-width: 400px; }
.search-bar form { display: flex; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; }
.search-input { flex: 1; padding: .5rem .75rem; border: none; outline: none; font-size: .9rem; }
.search-btn { padding: .5rem .75rem; background: #4f46e5; color: #fff; border: none; cursor: pointer; }
.nav-actions { display: flex; align-items: center; gap: .5rem; margin-left: auto; }
.nav-icon-btn { background: none; border: none; cursor: pointer; padding: .4rem; border-radius: 8px; color: #475569; position: relative; display: flex; align-items: center; justify-content: center; transition: background .15s; }
.nav-icon-btn:hover { background: #f1f5f9; }
.cart-badge { position: absolute; top: -4px; right: -4px; background: #4f46e5; color: #fff; font-size: .65rem; width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.user-avatar { width: 32px; height: 32px; background: #4f46e5; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: .85rem; font-weight: 600; }
.user-menu { position: relative; }
.dropdown-menu { position: absolute; top: calc(100% + 8px); right: 0; background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; box-shadow: 0 10px 25px rgba(0,0,0,.1); min-width: 180px; z-index: 200; overflow: hidden; }
.dropdown-item { display: block; padding: .65rem 1rem; color: #475569; text-decoration: none; font-size: .9rem; background: none; border: none; width: 100%; text-align: left; cursor: pointer; transition: background .15s; }
.dropdown-item:hover { background: #f8fafc; }
.dropdown-divider { margin: .25rem 0; border: none; border-top: 1px solid #e2e8f0; }
.auth-links { display: flex; gap: .5rem; align-items: center; }
.btn-ghost { padding: .4rem .75rem; color: #475569; text-decoration: none; font-size: .9rem; border-radius: 6px; }
.btn-ghost:hover { background: #f1f5f9; }
.btn-primary-sm { padding: .4rem .9rem; background: #4f46e5; color: #fff; text-decoration: none; font-size: .9rem; border-radius: 6px; font-weight: 500; }
.category-nav { border-top: 1px solid #f1f5f9; background: #fafafe; }
.category-nav .container { height: 40px; gap: 0; }
.cat-link { padding: 0 1rem; color: #64748b; text-decoration: none; font-size: .85rem; height: 40px; display: flex; align-items: center; transition: color .15s; white-space: nowrap; }
.cat-link:hover, .cat-link.router-link-active { color: #4f46e5; }
.drawer-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.3); z-index: 150; }
</style>
