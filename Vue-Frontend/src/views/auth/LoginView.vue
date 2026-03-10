<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-header">
        <RouterLink to="/" class="brand">Vue<span>Shop</span></RouterLink>
        <h1>Welcome back</h1>
        <p>Sign in to your account</p>
      </div>

      <form @submit.prevent="handleLogin" class="auth-form">
        <div class="form-group">
          <label>Email Address</label>
          <input v-model="form.email" type="email" class="form-input" required placeholder="you@example.com" />
        </div>
        <div class="form-group">
          <label>
            Password
            <RouterLink to="/forgot-password" class="forgot-link">Forgot password?</RouterLink>
          </label>
          <input v-model="form.password" type="password" class="form-input" required placeholder="••••••••" />
        </div>

        <p v-if="error" class="form-error">{{ error }}</p>

        <button type="submit" class="btn-submit" :disabled="auth.loading">
          {{ auth.loading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>

      <p class="auth-footer">
        Don't have an account? <RouterLink to="/register">Create one →</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const cart = useCartStore()
const error = ref('')
const form = ref({ email: '', password: '' })

async function handleLogin() {
  error.value = ''
  const result = await auth.login(form.value)
  if (result.success) {
    await cart.fetchCart()
    router.push(route.query.redirect || { name: 'home' })
  } else {
    error.value = result.message
  }
}
</script>

<style scoped>
.auth-page { min-height: calc(100vh - 140px); display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #fafafe, #f0f0ff); padding: 2rem; }
.auth-card { background: #fff; border-radius: 16px; padding: 2.5rem; width: 100%; max-width: 440px; box-shadow: 0 10px 40px rgba(0,0,0,.08); }
.auth-header { text-align: center; margin-bottom: 2rem; }
.brand { font-size: 1.75rem; font-weight: 800; color: #1e293b; text-decoration: none; display: inline-block; margin-bottom: 1.5rem; }
.brand span { color: #4f46e5; }
.auth-header h1 { font-size: 1.5rem; font-weight: 700; color: #1e293b; margin: 0 0 .35rem; }
.auth-header p { color: #64748b; margin: 0; }
.auth-form { display: flex; flex-direction: column; gap: 1.25rem; }
.form-group { display: flex; flex-direction: column; gap: .4rem; }
.form-group label { font-size: .85rem; font-weight: 600; color: #475569; display: flex; justify-content: space-between; }
.forgot-link { color: #4f46e5; text-decoration: none; font-weight: 400; }
.form-input { padding: .7rem 1rem; border: 1px solid #e2e8f0; border-radius: 8px; font-size: .95rem; outline: none; transition: border .15s; }
.form-input:focus { border-color: #4f46e5; }
.form-error { color: #ef4444; font-size: .85rem; margin: 0; }
.btn-submit { background: #4f46e5; color: #fff; padding: .9rem; border: none; border-radius: 10px; font-size: 1rem; font-weight: 600; cursor: pointer; margin-top: .5rem; }
.btn-submit:hover:not(:disabled) { background: #4338ca; }
.btn-submit:disabled { opacity: .7; cursor: not-allowed; }
.auth-footer { text-align: center; margin: 1.5rem 0 0; font-size: .9rem; color: #64748b; }
.auth-footer a { color: #4f46e5; text-decoration: none; font-weight: 600; }
</style>
