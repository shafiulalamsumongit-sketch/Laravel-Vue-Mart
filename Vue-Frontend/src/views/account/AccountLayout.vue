<template>
  <div class="account-page container">
    <div class="account-layout">
      <!-- Sidebar -->
      <aside class="account-sidebar">
        <div class="user-info">
          <div class="user-avatar-lg">{{ auth.user?.name?.charAt(0)?.toUpperCase() }}</div>
          <h3>{{ auth.user?.name }}</h3>
          <p>{{ auth.user?.email }}</p>
        </div>
        <nav class="account-nav">
          <RouterLink to="/account/profile" class="account-nav-link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Profile
          </RouterLink>
          <RouterLink to="/account/orders" class="account-nav-link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
            My Orders
          </RouterLink>
          <RouterLink to="/account/addresses" class="account-nav-link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            Addresses
          </RouterLink>
          <RouterLink to="/account/wishlist" class="account-nav-link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            Wishlist
          </RouterLink>
          <button class="account-nav-link logout-btn" @click="handleLogout">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Logout
          </button>
        </nav>
      </aside>

      <!-- Content -->
      <main class="account-content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

async function handleLogout() {
  await auth.logout()
  router.push({ name: 'home' })
}
</script>

<style scoped>
.container { max-width: 1200px; margin: 0 auto; padding: 2rem 1rem; }
.account-layout { display: grid; grid-template-columns: 260px 1fr; gap: 2rem; }
.account-sidebar { background: #fff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 1.5rem; height: fit-content; position: sticky; top: 80px; }
.user-info { text-align: center; padding-bottom: 1.5rem; border-bottom: 1px solid #f1f5f9; margin-bottom: 1rem; }
.user-avatar-lg { width: 64px; height: 64px; background: #4f46e5; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 700; margin: 0 auto 1rem; }
.user-info h3 { font-size: 1rem; font-weight: 700; color: #1e293b; margin: 0 0 .2rem; }
.user-info p { font-size: .8rem; color: #64748b; margin: 0; }
.account-nav { display: flex; flex-direction: column; gap: .25rem; }
.account-nav-link { display: flex; align-items: center; gap: .75rem; padding: .7rem .9rem; border-radius: 8px; color: #475569; text-decoration: none; font-size: .9rem; transition: all .15s; border: none; background: none; width: 100%; cursor: pointer; }
.account-nav-link:hover { background: #f8fafc; color: #1e293b; }
.account-nav-link.router-link-active { background: #f8f7ff; color: #4f46e5; font-weight: 600; }
.logout-btn { color: #ef4444; margin-top: .5rem; }
.logout-btn:hover { background: #fee2e2; }
.account-content { background: #fff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 2rem; min-height: 400px; }
@media (max-width: 768px) { .account-layout { grid-template-columns: 1fr; } .account-sidebar { position: static; } }
</style>
