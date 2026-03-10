import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useProductStore = defineStore('products', () => {
  const products      = ref([])
  const product       = ref(null)
  const featured      = ref([])
  const relatedProducts = ref([])
  const categories    = ref([])
  const pagination    = ref({})
  const loading       = ref(false)
  const filters       = ref({ category: '', min_price: '', max_price: '', sort_by: 'created_at', sort_dir: 'desc', in_stock: false })

  async function fetchProducts(params = {}) {
    loading.value = true
    try {
      const { data } = await axios.get('/api/products', { params: { ...filters.value, ...params } })
      products.value  = data.data
      pagination.value = { current_page: data.current_page, last_page: data.last_page, total: data.total }
    } finally {
      loading.value = false
    }
  }

  async function fetchFeatured() {
    const { data } = await axios.get('/api/products/featured')
    featured.value = data
  }

  async function fetchProduct(slug) {
    loading.value = true
    try {
      const { data } = await axios.get(`/api/products/${slug}`)
      product.value         = data.product
      relatedProducts.value = data.related
    } finally {
      loading.value = false
    }
  }

  async function fetchCategories() {
    const { data } = await axios.get('/api/categories')
    categories.value = data
  }

  async function search(query) {
    loading.value = true
    try {
      const { data } = await axios.get('/api/products/search', { params: { q: query } })
      products.value   = data.data
      pagination.value = { current_page: data.current_page, last_page: data.last_page, total: data.total }
    } finally {
      loading.value = false
    }
  }

  return { products, product, featured, relatedProducts, categories, pagination, loading, filters,
           fetchProducts, fetchFeatured, fetchProduct, fetchCategories, search }
})
