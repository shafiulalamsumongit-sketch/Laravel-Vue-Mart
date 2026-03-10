import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useCartStore = defineStore('cart', () => {
  const items    = ref([])
  const subtotal = ref(0)
  const tax      = ref(0)
  const shipping = ref(0)
  const total    = ref(0)
  const loading  = ref(false)

  const itemCount = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0))
  const isEmpty   = computed(() => items.value.length === 0)

  async function fetchCart() {
    loading.value = true
    try {
      const { data } = await axios.get('/api/cart')
      items.value    = data.items
      subtotal.value = data.subtotal
      tax.value      = data.tax
      shipping.value = data.shipping
      total.value    = data.total
    } finally {
      loading.value = false
    }
  }

  async function addItem(productId, quantity = 1, attributes = null) {
    const { data } = await axios.post('/api/cart', { product_id: productId, quantity, attributes })
    await fetchCart()
    return data
  }

  async function updateItem(cartItemId, quantity) {
    await axios.put(`/api/cart/${cartItemId}`, { quantity })
    await fetchCart()
  }

  async function removeItem(cartItemId) {
    await axios.delete(`/api/cart/${cartItemId}`)
    await fetchCart()
  }

  async function clearCart() {
    await axios.delete('/api/cart')
    items.value = []
    subtotal.value = tax.value = shipping.value = total.value = 0
  }

  return { items, subtotal, tax, shipping, total, itemCount, isEmpty, loading,
           fetchCart, addItem, updateItem, removeItem, clearCart }
})
