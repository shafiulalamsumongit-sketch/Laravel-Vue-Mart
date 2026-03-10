<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex gap-8">
      <!-- Sidebar filters -->
      <aside class="w-64 flex-shrink-0 hidden lg:block">
        <div class="bg-white rounded-xl p-5 shadow-sm sticky top-24 space-y-6">
          <h3 class="font-bold text-gray-800">Filters</h3>
          <div>
            <h4 class="text-sm font-semibold text-gray-700 mb-3">Category</h4>
            <div class="space-y-2">
              <label class="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-blue-600">
                <input type="radio" name="category" value="" v-model="filters.category" @change="applyFilters" class="text-blue-600"> All
              </label>
              <label v-for="cat in categories" :key="cat.id"
                     class="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-blue-600">
                <input type="radio" name="category" :value="cat.slug" v-model="filters.category" @change="applyFilters" class="text-blue-600">
                {{ cat.name }}
              </label>
            </div>
          </div>
          <div>
            <h4 class="text-sm font-semibold text-gray-700 mb-3">Price Range</h4>
            <div class="flex gap-2">
              <input v-model="filters.min_price" type="number" placeholder="Min" @change="applyFilters"
                     class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none"/>
              <input v-model="filters.max_price" type="number" placeholder="Max" @change="applyFilters"
                     class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none"/>
            </div>
          </div>
          <div>
            <label class="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input type="checkbox" v-model="filters.in_stock" @change="applyFilters" class="text-blue-600 rounded"/>
              In Stock Only
            </label>
          </div>
          <button @click="resetFilters" class="w-full text-sm text-gray-500 hover:text-gray-700 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
            Reset Filters
          </button>
        </div>
      </aside>

      <!-- Products grid -->
      <div class="flex-1">
        <div class="flex items-center justify-between mb-6">
          <p class="text-gray-500 text-sm">{{ pagination.total || 0 }} products found</p>
          <select v-model="filters.sort_by" @change="applyFilters"
                  class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none">
            <option value="created_at">Newest First</option>
            <option value="price">Price: Low to High</option>
            <option value="name">Name A-Z</option>
            <option value="reviews_avg_rating">Top Rated</option>
          </select>
        </div>

        <div v-if="loading" class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div v-for="i in 8" :key="i" class="bg-white rounded-xl aspect-square animate-pulse"></div>
        </div>
        <div v-else-if="products.length === 0" class="text-center py-24 text-gray-400">
          <p class="text-xl font-semibold">No products found</p>
          <p class="mt-2">Try adjusting your filters</p>
        </div>
        <div v-else class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <ProductCard v-for="product in products" :key="product.id" :product="product" />
        </div>

        <!-- Pagination -->
        <div v-if="pagination.last_page > 1" class="flex justify-center gap-2 mt-8">
          <button v-for="page in pagination.last_page" :key="page" @click="goToPage(page)"
            class="w-10 h-10 rounded-lg text-sm font-medium transition-colors"
            :class="page === pagination.current_page ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border'">
            {{ page }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive } from 'vue'
import { useProductStore } from '@/stores/products'
import ProductCard from '@/components/product/ProductCard.vue'

const productStore = useProductStore()
const products     = computed(() => productStore.products)
const categories   = computed(() => productStore.categories)
const pagination   = computed(() => productStore.pagination)
const loading      = computed(() => productStore.loading)

const filters = reactive({ category: '', min_price: '', max_price: '', sort_by: 'created_at', sort_dir: 'desc', in_stock: false })

function applyFilters() { productStore.fetchProducts(filters) }
function resetFilters() {
  Object.assign(filters, { category: '', min_price: '', max_price: '', sort_by: 'created_at', sort_dir: 'desc', in_stock: false })
  applyFilters()
}
function goToPage(page) { productStore.fetchProducts({ ...filters, page }) }

onMounted(() => {
  productStore.fetchCategories()
  productStore.fetchProducts()
})
</script>
