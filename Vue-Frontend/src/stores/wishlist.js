import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useWishlistStore = defineStore('wishlist', () => {
  const items   = ref([])
  const loading = ref(false)

  const itemIds = computed(() => items.value.map(p => p.id))
  const isWishlisted = (productId) => itemIds.value.includes(productId)

  async function fetchWishlist() {
    loading.value = true
    try {
      const { data } = await axios.get('/api/wishlist')
      items.value = data
    } finally {
      loading.value = false
    }
  }

  async function toggle(productId) {
    const { data } = await axios.post(`/api/wishlist/${productId}`)
    if (data.added) {
      // optimistic: we'll refetch
    } else {
      items.value = items.value.filter(p => p.id !== productId)
    }
    await fetchWishlist()
    return data
  }

  return { items, loading, itemIds, isWishlisted, fetchWishlist, toggle }
})
