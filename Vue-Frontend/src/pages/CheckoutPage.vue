<template>
  <div class="container mx-auto px-4 py-8 max-w-5xl">
    <h1 class="text-2xl font-bold text-gray-800 mb-8">Checkout</h1>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Left: shipping + payment -->
      <div class="space-y-6">
        <!-- Shipping Address -->
        <div class="bg-white rounded-xl p-6 shadow-sm">
          <h2 class="font-bold text-lg text-gray-800 mb-4">Shipping Address</h2>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input v-model="form.shipping.first_name" class="input" placeholder="John" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input v-model="form.shipping.last_name" class="input" placeholder="Doe" />
            </div>
            <div class="col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input v-model="form.shipping.address_line1" class="input" placeholder="123 Main St" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input v-model="form.shipping.city" class="input" placeholder="New York" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">State</label>
              <input v-model="form.shipping.state" class="input" placeholder="NY" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
              <input v-model="form.shipping.postal_code" class="input" placeholder="10001" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <input v-model="form.shipping.country" class="input" placeholder="US" />
            </div>
          </div>
        </div>

        <!-- Payment -->
        <div class="bg-white rounded-xl p-6 shadow-sm">
          <h2 class="font-bold text-lg text-gray-800 mb-4">Payment</h2>
          <div v-if="paymentLoading" class="text-center py-4 text-gray-400">Loading payment form...</div>
          <div id="stripe-card-element" class="border border-gray-300 rounded-xl p-4 bg-gray-50"></div>
          <div v-if="paymentError" class="mt-3 text-red-600 text-sm">{{ paymentError }}</div>
        </div>

        <button @click="placeOrder" :disabled="processing || !canCheckout"
          class="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2">
          <svg v-if="processing" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          {{ processing ? 'Processing...' : `Pay $${formatPrice(total)}` }}
        </button>
      </div>

      <!-- Right: order summary -->
      <div>
        <div class="bg-white rounded-xl p-6 shadow-sm sticky top-24">
          <h2 class="font-bold text-lg text-gray-800 mb-4">Order Summary</h2>
          <div class="space-y-3 mb-4">
            <div v-for="item in items" :key="item.id" class="flex gap-3">
              <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <img v-if="item.product?.images?.[0]" :src="item.product.images[0]" class="w-full h-full object-cover rounded-lg"/>
                <svg v-else class="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-800 truncate">{{ item.product?.name }}</p>
                <p class="text-xs text-gray-400">Qty: {{ item.quantity }}</p>
              </div>
              <span class="text-sm font-semibold">\${{ formatPrice((item.product?.sale_price || item.product?.price) * item.quantity) }}</span>
            </div>
          </div>
          <hr class="border-gray-100 mb-3">
          <div class="space-y-2 text-sm">
            <div class="flex justify-between text-gray-600"><span>Subtotal</span><span>\${{ formatPrice(subtotal) }}</span></div>
            <div class="flex justify-between text-gray-600"><span>Tax</span><span>\${{ formatPrice(tax) }}</span></div>
            <div class="flex justify-between text-gray-600"><span>Shipping</span><span>{{ shipping===0?'FREE':'\$'+formatPrice(shipping) }}</span></div>
            <hr class="border-gray-100">
            <div class="flex justify-between font-bold text-lg text-gray-800"><span>Total</span><span>\${{ formatPrice(total) }}</span></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { loadStripe } from '@stripe/stripe-js'
import axios from 'axios'
import { useCartStore } from '@/stores/cart'

const router    = useRouter()
const cartStore = useCartStore()

const items    = computed(() => cartStore.items)
const subtotal = computed(() => cartStore.subtotal)
const tax      = computed(() => cartStore.tax)
const shipping = computed(() => cartStore.shipping)
const total    = computed(() => cartStore.total)

const form = ref({
  shipping: { first_name:'', last_name:'', address_line1:'', city:'', state:'', postal_code:'', country:'US' }
})

const processing    = ref(false)
const paymentError  = ref('')
const paymentLoading = ref(true)
const clientSecret  = ref('')
const orderId       = ref(null)
const canCheckout   = computed(() => form.value.shipping.first_name && form.value.shipping.address_line1)

let stripe, cardElement

function formatPrice(v) { return parseFloat(v || 0).toFixed(2) }

async function initStripe() {
  stripe = await loadStripe(import.meta.env.VITE_STRIPE_KEY || 'pk_test_placeholder')
  const elements = stripe.elements()
  cardElement = elements.create('card', {
    style: { base: { fontSize: '16px', color: '#374151', '::placeholder': { color: '#9ca3af' } } }
  })
  cardElement.mount('#stripe-card-element')
  paymentLoading.value = false
}

async function placeOrder() {
  processing.value = true
  paymentError.value = ''
  try {
    // Get payment intent
    const { data } = await axios.post('/api/checkout/intent', {
      shipping_address: form.value.shipping
    })
    clientSecret.value = data.client_secret
    orderId.value      = data.order_id

    // Confirm payment with Stripe
    const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret.value, {
      payment_method: { card: cardElement }
    })

    if (error) {
      paymentError.value = error.message
      return
    }

    if (paymentIntent.status === 'succeeded') {
      await axios.post('/api/checkout/complete', {
        payment_intent_id: paymentIntent.id,
        order_id: orderId.value
      })
      router.push({ name: 'checkout-success', query: { order: orderId.value } })
    }
  } catch (e) {
    paymentError.value = e.response?.data?.message || 'Payment failed. Please try again.'
  } finally {
    processing.value = false
  }
}

onMounted(async () => {
  await cartStore.fetchCart()
  await initStripe()
})
</script>

<style scoped>
.input {
  @apply w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none;
}
</style>
