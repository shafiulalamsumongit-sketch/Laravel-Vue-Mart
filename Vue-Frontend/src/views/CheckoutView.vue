<template>
  <div class="checkout-page container">
    <h1 class="page-title">Checkout</h1>

    <div class="checkout-layout">
      <!-- Left: Shipping + Payment -->
      <div class="checkout-form">
        <!-- Step 1: Shipping -->
        <section class="checkout-section">
          <h2 class="section-title"><span class="step-num">1</span> Shipping Address</h2>

          <div v-if="addresses.length > 0" class="saved-addresses">
            <div
              v-for="addr in addresses"
              :key="addr.id"
              class="address-option"
              :class="{ selected: selectedAddressId === addr.id }"
              @click="selectedAddressId = addr.id"
            >
              <div class="addr-radio"></div>
              <div>
                <p class="addr-name">{{ addr.full_name }}</p>
                <p class="addr-text">{{ addr.address_line1 }}, {{ addr.city }}, {{ addr.state }} {{ addr.zip_code }}</p>
              </div>
            </div>
          </div>

          <!-- New address form -->
          <div class="new-address-form">
            <h3 class="sub-title">New Address</h3>
            <div class="form-grid">
              <div class="form-group">
                <label>First Name *</label>
                <input v-model="form.first_name" type="text" class="form-input" />
              </div>
              <div class="form-group">
                <label>Last Name *</label>
                <input v-model="form.last_name" type="text" class="form-input" />
              </div>
              <div class="form-group full">
                <label>Address *</label>
                <input v-model="form.address_line1" type="text" class="form-input" />
              </div>
              <div class="form-group">
                <label>City *</label>
                <input v-model="form.city" type="text" class="form-input" />
              </div>
              <div class="form-group">
                <label>State *</label>
                <input v-model="form.state" type="text" class="form-input" />
              </div>
              <div class="form-group">
                <label>ZIP Code *</label>
                <input v-model="form.zip_code" type="text" class="form-input" />
              </div>
              <div class="form-group">
                <label>Country</label>
                <select v-model="form.country" class="form-input">
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="GB">United Kingdom</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        <!-- Step 2: Payment -->
        <section class="checkout-section">
          <h2 class="section-title"><span class="step-num">2</span> Payment</h2>
          <div class="stripe-element-wrap">
            <div id="card-element" class="stripe-card-element"></div>
            <div v-if="cardError" class="card-error">{{ cardError }}</div>
          </div>
          <div class="secure-badge">🔒 Secured by Stripe — Your card info is never stored on our servers</div>
        </section>
      </div>

      <!-- Right: Order Summary -->
      <div class="checkout-summary">
        <h2 class="summary-title">Your Order</h2>

        <div class="order-items">
          <div v-for="item in cart.items" :key="item.id" class="order-item">
            <div class="order-item-img">
              <img :src="item.product.primary_image || '/placeholder.jpg'" :alt="item.product.name" />
              <span class="item-qty-badge">{{ item.quantity }}</span>
            </div>
            <div class="order-item-info">
              <p class="order-item-name">{{ item.product.name }}</p>
            </div>
            <span class="order-item-price">${{ formatPrice(item.subtotal) }}</span>
          </div>
        </div>

        <div class="summary-rows">
          <div class="sum-row"><span>Subtotal</span><span>${{ formatPrice(cart.total) }}</span></div>
          <div class="sum-row"><span>Shipping</span><span>{{ cart.total >= 100 ? 'FREE' : '$9.99' }}</span></div>
          <div class="sum-row"><span>Tax (10%)</span><span>${{ formatPrice(cart.total * 0.1) }}</span></div>
          <div class="sum-divider"></div>
          <div class="sum-row total"><span>Total</span><span>${{ formatPrice(grandTotal) }}</span></div>
        </div>

        <button
          class="btn-pay"
          :disabled="paymentLoading"
          @click="handlePayment"
        >
          <span v-if="paymentLoading">Processing...</span>
          <span v-else>Pay ${{ formatPrice(grandTotal) }}</span>
        </button>

        <p v-if="paymentError" class="payment-error">{{ paymentError }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { loadStripe } from '@stripe/stripe-js'
import { useCartStore } from '@/stores/cart'
import api from '@/services/api'
import { useToast } from 'vue-toastification'

const router = useRouter()
const cart = useCartStore()
const toast = useToast()

const addresses = ref([])
const selectedAddressId = ref(null)
const paymentLoading = ref(false)
const paymentError = ref('')
const cardError = ref('')

const form = ref({
  first_name: '', last_name: '', address_line1: '',
  city: '', state: '', zip_code: '', country: 'US',
})

let stripe = null
let cardElement = null
let paymentIntentId = ref(null)

const shippingCost = computed(() => cart.total >= 100 ? 0 : 9.99)
const tax = computed(() => cart.total * 0.1)
const grandTotal = computed(() => cart.total + shippingCost.value + tax.value)

function formatPrice(p) { return parseFloat(p || 0).toFixed(2) }

async function initStripe() {
  stripe = await loadStripe(import.meta.env.VITE_STRIPE_KEY)
  const elements = stripe.elements()
  cardElement = elements.create('card', {
    style: {
      base: { fontSize: '16px', color: '#1e293b', '::placeholder': { color: '#94a3b8' } },
    },
  })
  cardElement.mount('#card-element')
  cardElement.on('change', ({ error }) => { cardError.value = error?.message || '' })
}

async function handlePayment() {
  paymentLoading.value = true
  paymentError.value = ''

  try {
    // Get or create payment intent
    const addressId = selectedAddressId.value || await saveAndGetAddressId()

    const intentResponse = await api.post('/checkout/intent', { shipping_address_id: addressId })
    const { client_secret, payment_intent_id } = intentResponse.data

    // Confirm payment with Stripe
    const { paymentIntent, error } = await stripe.confirmCardPayment(client_secret, {
      payment_method: { card: cardElement },
    })

    if (error) {
      paymentError.value = error.message
      return
    }

    if (paymentIntent.status === 'succeeded') {
      // Place order
      const orderResponse = await api.post('/checkout/place-order', {
        payment_intent_id: payment_intent_id,
        shipping_address_id: addressId,
      })

      await cart.fetchCart()
      toast.success('Order placed successfully!')
      router.push({ name: 'order-success', params: { id: orderResponse.data.order.id } })
    }
  } catch (error) {
    paymentError.value = error.response?.data?.message || 'Payment failed. Please try again.'
  } finally {
    paymentLoading.value = false
  }
}

async function saveAndGetAddressId() {
  const response = await api.post('/user/addresses', form.value)
  return response.data.id
}

onMounted(async () => {
  await initStripe()
  try {
    const response = await api.get('/user/addresses')
    addresses.value = response.data
    if (addresses.value.length > 0) {
      selectedAddressId.value = addresses.value[0].id
    }
  } catch {}
})
</script>

<style scoped>
.container { max-width: 1200px; margin: 0 auto; padding: 2rem 1rem; }
.page-title { font-size: 2rem; font-weight: 800; color: #1e293b; margin-bottom: 2rem; }
.checkout-layout { display: grid; grid-template-columns: 1fr 380px; gap: 2.5rem; }
.checkout-section { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 2rem; margin-bottom: 1.5rem; }
.section-title { display: flex; align-items: center; gap: .75rem; font-size: 1.15rem; font-weight: 700; color: #1e293b; margin: 0 0 1.5rem; }
.step-num { width: 28px; height: 28px; background: #4f46e5; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: .85rem; font-weight: 700; flex-shrink: 0; }
.address-option { display: flex; gap: 1rem; padding: 1rem; border: 1px solid #e2e8f0; border-radius: 8px; cursor: pointer; margin-bottom: .75rem; transition: all .15s; }
.address-option.selected { border-color: #4f46e5; background: #f8f7ff; }
.addr-radio { width: 18px; height: 18px; border-radius: 50%; border: 2px solid #e2e8f0; flex-shrink: 0; margin-top: 3px; transition: all .15s; }
.address-option.selected .addr-radio { border-color: #4f46e5; background: #4f46e5; }
.addr-name { font-weight: 600; margin: 0 0 .2rem; }
.addr-text { font-size: .85rem; color: #64748b; margin: 0; }
.sub-title { font-size: .95rem; font-weight: 600; color: #475569; margin: 1.25rem 0 1rem; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.form-group { display: flex; flex-direction: column; gap: .4rem; }
.form-group.full { grid-column: 1 / -1; }
.form-group label { font-size: .8rem; font-weight: 600; color: #475569; }
.form-input { padding: .6rem .85rem; border: 1px solid #e2e8f0; border-radius: 8px; font-size: .9rem; outline: none; }
.form-input:focus { border-color: #4f46e5; }
.stripe-card-element { padding: 1rem; border: 1px solid #e2e8f0; border-radius: 8px; }
.card-error { color: #ef4444; font-size: .85rem; margin-top: .5rem; }
.secure-badge { font-size: .8rem; color: #64748b; margin-top: 1rem; }
/* Summary */
.checkout-summary { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.5rem; height: fit-content; position: sticky; top: 80px; }
.summary-title { font-size: 1.15rem; font-weight: 700; color: #1e293b; margin: 0 0 1.5rem; }
.order-items { margin-bottom: 1.5rem; }
.order-item { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; }
.order-item-img { position: relative; width: 52px; height: 52px; flex-shrink: 0; }
.order-item-img img { width: 100%; height: 100%; object-fit: cover; border-radius: 8px; border: 1px solid #e2e8f0; }
.item-qty-badge { position: absolute; top: -6px; right: -6px; background: #4f46e5; color: #fff; font-size: .65rem; width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.order-item-info { flex: 1; }
.order-item-name { font-size: .85rem; font-weight: 500; color: #1e293b; margin: 0; line-height: 1.3; }
.order-item-price { font-weight: 600; font-size: .9rem; white-space: nowrap; }
.summary-rows { }
.sum-row { display: flex; justify-content: space-between; font-size: .9rem; color: #475569; margin-bottom: .75rem; }
.sum-divider { border: none; border-top: 1px solid #e2e8f0; margin: 1rem 0; }
.sum-row.total { font-size: 1.1rem; font-weight: 700; color: #1e293b; }
.btn-pay { width: 100%; background: #4f46e5; color: #fff; border: none; padding: 1rem; border-radius: 10px; font-size: 1rem; font-weight: 700; cursor: pointer; margin-top: 1rem; transition: background .2s; }
.btn-pay:hover:not(:disabled) { background: #4338ca; }
.btn-pay:disabled { opacity: .7; cursor: not-allowed; }
.payment-error { color: #ef4444; font-size: .85rem; text-align: center; margin-top: .75rem; }
@media (max-width: 900px) { .checkout-layout { grid-template-columns: 1fr; } .checkout-summary { position: static; } }
</style>
