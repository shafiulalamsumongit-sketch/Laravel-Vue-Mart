import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  // Main layout routes
  {
    path: '/',
    component: () => import('@/components/layout/MainLayout.vue'),
    children: [
      { path: '',           name: 'home',     component: () => import('@/pages/HomePage.vue') },
      { path: 'products',   name: 'products', component: () => import('@/pages/ProductsPage.vue') },
      { path: 'products/:slug', name: 'product', component: () => import('@/pages/ProductDetailPage.vue') },
      { path: 'categories/:slug', name: 'category', component: () => import('@/pages/CategoryPage.vue') },
      { path: 'search',     name: 'search',   component: () => import('@/pages/SearchPage.vue') },
      { path: 'cart',       name: 'cart',     component: () => import('@/pages/CartPage.vue') },
      {
        path: 'checkout',
        name: 'checkout',
        component: () => import('@/pages/CheckoutPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'checkout/success',
        name: 'checkout-success',
        component: () => import('@/pages/OrderSuccessPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'account',
        component: () => import('@/pages/account/AccountLayout.vue'),
        meta: { requiresAuth: true },
        children: [
          { path: '',        name: 'account',          component: () => import('@/pages/account/ProfilePage.vue') },
          { path: 'orders',  name: 'account-orders',   component: () => import('@/pages/account/OrdersPage.vue') },
          { path: 'orders/:id', name: 'account-order', component: () => import('@/pages/account/OrderDetailPage.vue') },
          { path: 'wishlist',name: 'account-wishlist',  component: () => import('@/pages/account/WishlistPage.vue') },
          { path: 'addresses',name:'account-addresses', component: () => import('@/pages/account/AddressesPage.vue') },
          { path: 'security',name: 'account-security',  component: () => import('@/pages/account/SecurityPage.vue') },
        ]
      },
    ]
  },
  // Auth routes (no main layout)
  { path: '/login',    name: 'login',    component: () => import('@/pages/auth/LoginPage.vue'),    meta: { guest: true } },
  { path: '/register', name: 'register', component: () => import('@/pages/auth/RegisterPage.vue'), meta: { guest: true } },
  { path: '/forgot-password', name: 'forgot-password', component: () => import('@/pages/auth/ForgotPasswordPage.vue') },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/pages/NotFoundPage.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  }
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else if (to.meta.guest && authStore.isAuthenticated) {
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router
