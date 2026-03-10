<template>
  <div class="cart-page container">
    <h1 class="page-title">Shopping Cart</h1>

    <div v-if="cart.isEmpty" class="empty-cart">
      <div class="empty-icon">🛒</div>
      <h2>Your cart is empty</h2>
      <p>Looks like you haven't added anything to your cart yet.</p>
      <RouterLink to="/products" class="btn-primary">Continue Shopping</RouterLink>
    </div>

    <div v-else class="cart-layout">
      <!-- Cart Items -->
      <div class="cart-items">
        <div class="cart-header">
          <span>Product</span>
          <span>Price</span>
          <span>Quantity</span>
          <span>Total</span>
          <span></span>
        </div>

        <div v-for="item in cart.items" :key="item.id" class="cart-item">
          <div class="item-product">
            <RouterLink :to="`/products/${item.product.slug}`">
              <img :src="item.product.primary_image || '/placeholder.jpg'" :alt="item.product.name" class="item-image" />
            </RouterLink>
            <div>
              <RouterLink :to="`/products/${item.product.slug}`" class="item-name">{{ item.product.name }}</RouterLink>
              <p class="item-sku">SKU: {{ item.product.sku }}</p>
            </div>
          </div>
          <div class="item-price">${{ formatPrice(item.price) }}</div>
          <div class="item-qty">
            <div class="qty-control">
              <button @click="updateQty(item, item.quantity - 1)" :disabled="item.quantity <= 1">−</button>
              <span>{{ item.quantity }}</span>
              <button @click="updateQty(item, item.quantity + 1)">+</button>
            </div>
          </div>
          <div class="item-total">${{ formatPrice(item.subtotal) }}</div>
          <button class="remove-btn" @click="cart.removeItem(item.id)" title="Remove">×</button>
        </div>

        <div class="cart-footer">
          <button class="btn-clear" @click="cart.clearCart">Clear Cart</button>
          <RouterLink to="/products" class="btn-continue">← Continue Shopping</RouterLink>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="order-summary">
        <h2>Order Summary</h2>
        <div class="summary-row">
          <span>Subtotal</span>
          <span>${{ formatPrice(cart.total) }}</span>
        </div>
        <div class="summary-row">
          <span>Shipping</span>
          <span :class="{ 'text-success': cart.total >= 100 }">
            {{ cart.total >= 100 ? 'FREE' : '$9.99' }}
          </span>
        </div>
        <div class="summary-row">
          <span>Tax (10%)</span>
          <span>${{ formatPrice(cart.total * 0.1) }}</span>
        </div>
        <div class="summary-divider"></div>
        <div class="summary-row total-row">
          <span>Total</span>
          <span>${{ formatPrice(grandTotal) }}</span>
        </div>

        <div v-if="cart.total < 100" class="free-shipping-hint">
          Add ${{ formatPrice(100 - cart.total) }} more for free shipping!
        </div>

        <RouterLink to="/checkout" class="btn-checkout">Proceed to Checkout →</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCartStore } from '@/stores/cart'

const cart = useCartStore()

const shippingCost = computed(() => cart.total >= 100 ? 0 : 9.99)
const tax = computed(() => cart.total * 0.1)
const grandTotal = computed(() => cart.total + shippingCost.value + tax.value)

function formatPrice(p) { return parseFloat(p || 0).toFixed(2) }

function updateQty(item, newQty) {
  if (newQty < 1) return
  cart.updateItem(item.id, newQty)
}
</script>

<style scoped>
.container { max-width: 1200px; margin: 0 auto; padding: 2rem 1rem; }
.page-title { font-size: 2rem; font-weight: 800; color: #1e293b; margin-bottom: 2rem; }
.empty-cart { text-align: center; padding: 5rem 2rem; }
.empty-icon { font-size: 5rem; margin-bottom: 1rem; }
.empty-cart h2 { font-size: 1.5rem; color: #1e293b; margin-bottom: .5rem; }
.empty-cart p { color: #64748b; margin-bottom: 2rem; }
.btn-primary { background: #4f46e5; color: #fff; padding: .85rem 2rem; border-radius: 10px; text-decoration: none; font-weight: 600; display: inline-block; }
.cart-layout { display: grid; grid-template-columns: 1fr 360px; gap: 2rem; }
.cart-items { background: #fff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; }
.cart-header { display: grid; grid-template-columns: 3fr 1fr 1.5fr 1fr .5fr; gap: 1rem; padding: 1rem 1.5rem; background: #f8fafc; font-size: .8rem; font-weight: 600; text-transform: uppercase; color: #64748b; letter-spacing: .05em; }
.cart-item { display: grid; grid-template-columns: 3fr 1fr 1.5fr 1fr .5fr; gap: 1rem; padding: 1.25rem 1.5rem; border-top: 1px solid #f1f5f9; align-items: center; }
.item-product { display: flex; gap: 1rem; align-items: center; }
.item-image { width: 64px; height: 64px; object-fit: cover; border-radius: 8px; border: 1px solid #e2e8f0; flex-shrink: 0; }
.item-name { font-weight: 600; color: #1e293b; text-decoration: none; font-size: .95rem; line-height: 1.3; }
.item-name:hover { color: #4f46e5; }
.item-sku { font-size: .75rem; color: #94a3b8; margin: .2rem 0 0; }
.item-price, .item-total { font-weight: 600; color: #1e293b; }
.qty-control { display: flex; align-items: center; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; width: fit-content; }
.qty-control button { padding: .35rem .75rem; background: #f8fafc; border: none; cursor: pointer; font-size: 1rem; }
.qty-control button:disabled { opacity: .4; cursor: not-allowed; }
.qty-control span { padding: .35rem .9rem; font-weight: 600; min-width: 30px; text-align: center; }
.remove-btn { background: none; border: none; color: #94a3b8; font-size: 1.5rem; cursor: pointer; padding: .2rem .4rem; border-radius: 4px; line-height: 1; }
.remove-btn:hover { color: #ef4444; background: #fee2e2; }
.cart-footer { display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.5rem; border-top: 1px solid #f1f5f9; }
.btn-clear { background: none; border: 1px solid #e2e8f0; padding: .5rem 1rem; border-radius: 6px; cursor: pointer; font-size: .85rem; color: #64748b; }
.btn-continue { color: #4f46e5; text-decoration: none; font-size: .9rem; }
.order-summary { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.5rem; height: fit-content; }
.order-summary h2 { font-size: 1.25rem; font-weight: 700; color: #1e293b; margin: 0 0 1.5rem; }
.summary-row { display: flex; justify-content: space-between; margin-bottom: .85rem; font-size: .95rem; color: #475569; }
.text-success { color: #059669; font-weight: 600; }
.summary-divider { border: none; border-top: 1px solid #e2e8f0; margin: 1rem 0; }
.total-row { font-size: 1.15rem; font-weight: 700; color: #1e293b; }
.free-shipping-hint { background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: .75rem; font-size: .8rem; color: #92400e; margin-bottom: 1rem; text-align: center; }
.btn-checkout { display: block; background: #4f46e5; color: #fff; text-align: center; padding: 1rem; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 1rem; margin-top: 1rem; transition: background .2s; }
.btn-checkout:hover { background: #4338ca; }
@media (max-width: 900px) { .cart-layout { grid-template-columns: 1fr; } .cart-header { display: none; } .cart-item { grid-template-columns: 1fr; } }
</style>
