<template>
  <Teleport to="body">
    <Transition name="drawer">
      <div v-if="open" class="cart-drawer">
        <div class="drawer-header">
          <h3>Shopping Cart <span class="count">({{ cart.itemCount }})</span></h3>
          <button class="close-btn" @click="open = false">×</button>
        </div>

        <div v-if="cart.isEmpty" class="drawer-empty">
          <p>Your cart is empty</p>
          <RouterLink to="/products" class="btn-browse" @click="open = false">Browse Products</RouterLink>
        </div>

        <div v-else class="drawer-items">
          <div v-for="item in cart.items" :key="item.id" class="drawer-item">
            <img :src="item.product.primary_image || '/placeholder.jpg'" :alt="item.product.name" />
            <div class="item-details">
              <p class="item-name">{{ item.product.name }}</p>
              <p class="item-price">${{ formatPrice(item.price) }}</p>
              <div class="item-qty">
                <button @click="cart.updateItem(item.id, item.quantity - 1)" :disabled="item.quantity <= 1">−</button>
                <span>{{ item.quantity }}</span>
                <button @click="cart.updateItem(item.id, item.quantity + 1)">+</button>
              </div>
            </div>
            <button class="remove" @click="cart.removeItem(item.id)">×</button>
          </div>
        </div>

        <div v-if="!cart.isEmpty" class="drawer-footer">
          <div class="drawer-total">
            <span>Total</span>
            <span>${{ formatPrice(cart.total) }}</span>
          </div>
          <RouterLink to="/cart" class="btn-view-cart" @click="open = false">View Cart</RouterLink>
          <RouterLink to="/checkout" class="btn-checkout" @click="open = false">Checkout →</RouterLink>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'
import { useCartStore } from '@/stores/cart'
const cart = useCartStore()
const open = ref(false)
function formatPrice(p) { return parseFloat(p||0).toFixed(2) }

// Expose to parent via provide/inject - for now, toggled by global event
defineExpose({ open })
</script>

<style scoped>
.cart-drawer { position: fixed; top: 0; right: 0; height: 100vh; width: 380px; background: #fff; box-shadow: -10px 0 40px rgba(0,0,0,.15); z-index: 200; display: flex; flex-direction: column; }
.drawer-header { display: flex; justify-content: space-between; align-items: center; padding: 1.25rem 1.5rem; border-bottom: 1px solid #e2e8f0; }
.drawer-header h3 { font-size: 1.05rem; font-weight: 700; color: #1e293b; margin: 0; }
.count { color: #4f46e5; }
.close-btn { background: none; border: none; font-size: 1.75rem; cursor: pointer; color: #94a3b8; line-height: 1; }
.drawer-empty { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; color: #94a3b8; }
.btn-browse { color: #4f46e5; text-decoration: none; font-weight: 600; }
.drawer-items { flex: 1; overflow-y: auto; padding: 1rem 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
.drawer-item { display: flex; gap: 1rem; align-items: flex-start; }
.drawer-item img { width: 60px; height: 60px; object-fit: cover; border-radius: 8px; border: 1px solid #e2e8f0; flex-shrink: 0; }
.item-details { flex: 1; }
.item-name { font-size: .85rem; font-weight: 600; color: #1e293b; margin: 0 0 .3rem; line-height: 1.3; }
.item-price { font-size: .85rem; color: #4f46e5; font-weight: 600; margin: 0 0 .5rem; }
.item-qty { display: flex; align-items: center; border: 1px solid #e2e8f0; border-radius: 6px; overflow: hidden; width: fit-content; }
.item-qty button { padding: .25rem .6rem; background: #f8fafc; border: none; cursor: pointer; font-size: .9rem; }
.item-qty button:disabled { opacity: .4; cursor: not-allowed; }
.item-qty span { padding: .25rem .6rem; font-size: .85rem; font-weight: 600; }
.remove { background: none; border: none; font-size: 1.25rem; cursor: pointer; color: #94a3b8; align-self: center; }
.remove:hover { color: #ef4444; }
.drawer-footer { padding: 1.25rem 1.5rem; border-top: 1px solid #e2e8f0; display: flex; flex-direction: column; gap: .75rem; }
.drawer-total { display: flex; justify-content: space-between; font-weight: 700; font-size: 1rem; }
.btn-view-cart { text-align: center; padding: .75rem; border: 1px solid #4f46e5; border-radius: 8px; color: #4f46e5; text-decoration: none; font-weight: 600; }
.btn-checkout { text-align: center; padding: .75rem; background: #4f46e5; border-radius: 8px; color: #fff; text-decoration: none; font-weight: 600; }
.drawer-enter-active, .drawer-leave-active { transition: transform .3s ease; }
.drawer-enter-from, .drawer-leave-to { transform: translateX(100%); }
</style>
