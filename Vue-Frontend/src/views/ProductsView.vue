<template>
  <div class="products-page container">
    <div class="page-header">
      <h1>All Products</h1>
      <p>{{ pagination?.total || 0 }} products found</p>
    </div>

    <div class="page-layout">
      <!-- Filters Sidebar -->
      <aside class="filters-sidebar">
        <h3>Filters</h3>

        <div class="filter-group">
          <label class="filter-label">Category</label>
          <select v-model="filters.category" class="filter-select" @change="applyFilters">
            <option value="">All Categories</option>
            <option v-for="cat in products.categories" :key="cat.id" :value="cat.slug">
              {{ cat.name }}
            </option>
          </select>
        </div>

        <div class="filter-group">
          <label class="filter-label">Price Range</label>
          <div class="price-inputs">
            <input v-model="filters.min_price" type="number" placeholder="Min $" class="filter-input" @change="applyFilters" />
            <span>—</span>
            <input v-model="filters.max_price" type="number" placeholder="Max $" class="filter-input" @change="applyFilters" />
          </div>
        </div>

        <div class="filter-group">
          <label class="filter-label">Sort By</label>
          <select v-model="filters.sort" class="filter-select" @change="applyFilters">
            <option value="created_at">Newest First</option>
            <option value="price">Price: Low to High</option>
            <option value="rating">Best Rated</option>
          </select>
        </div>

        <button class="btn-clear-filters" @click="clearFilters">Clear Filters</button>
      </aside>

      <!-- Products Grid -->
      <div class="products-area">
        <div v-if="products.loading" class="products-grid">
          <div v-for="i in 8" :key="i" class="product-skeleton"></div>
        </div>
        <div v-else-if="products.products.length === 0" class="empty-state">
          <p>No products found matching your filters.</p>
          <button @click="clearFilters" class="btn-primary">Clear Filters</button>
        </div>
        <div v-else class="products-grid">
          <ProductCard v-for="product in products.products" :key="product.id" :product="product" />
        </div>

        <!-- Pagination -->
        <div v-if="pagination && pagination.last_page > 1" class="pagination">
          <button
            v-for="page in pagination.last_page"
            :key="page"
            class="page-btn"
            :class="{ active: page === pagination.current_page }"
            @click="goToPage(page)"
          >{{ page }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProductStore } from '@/stores/products'
import ProductCard from '@/components/product/ProductCard.vue'

const products = useProductStore()
const pagination = computed(() => products.pagination)
const filters = ref({ category: '', min_price: '', max_price: '', sort: 'created_at', direction: 'desc' })

function applyFilters() {
  products.filters = { ...filters.value }
  products.fetchProducts({ page: 1 })
}

function clearFilters() {
  filters.value = { category: '', min_price: '', max_price: '', sort: 'created_at', direction: 'desc' }
  applyFilters()
}

function goToPage(page) {
  products.fetchProducts({ page })
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  products.fetchProducts()
  products.fetchCategories()
})
</script>

<style scoped>
.products-page { padding: 2rem 1rem; }
.page-header { margin-bottom: 2rem; }
.page-header h1 { font-size: 2rem; font-weight: 800; color: #1e293b; margin: 0 0 .25rem; }
.page-header p { color: #64748b; margin: 0; }
.page-layout { display: grid; grid-template-columns: 240px 1fr; gap: 2rem; }
.filters-sidebar { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.5rem; height: fit-content; position: sticky; top: 80px; }
.filters-sidebar h3 { font-size: 1rem; font-weight: 700; color: #1e293b; margin: 0 0 1.5rem; }
.filter-group { margin-bottom: 1.5rem; }
.filter-label { display: block; font-size: .8rem; font-weight: 600; color: #475569; text-transform: uppercase; letter-spacing: .05em; margin-bottom: .5rem; }
.filter-select, .filter-input { width: 100%; padding: .5rem .75rem; border: 1px solid #e2e8f0; border-radius: 8px; font-size: .9rem; outline: none; }
.filter-select:focus, .filter-input:focus { border-color: #4f46e5; }
.price-inputs { display: flex; gap: .5rem; align-items: center; }
.price-inputs span { color: #94a3b8; }
.price-inputs .filter-input { flex: 1; }
.btn-clear-filters { width: 100%; padding: .65rem; background: #f1f5f9; border: none; border-radius: 8px; font-size: .9rem; cursor: pointer; color: #475569; }
.btn-clear-filters:hover { background: #e2e8f0; }
.products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1.5rem; }
.product-skeleton { background: #f1f5f9; border-radius: 12px; aspect-ratio: .85; animation: pulse 1.5s infinite; }
@keyframes pulse { 0%,100%{opacity:1}50%{opacity:.5} }
.empty-state { text-align: center; padding: 4rem; color: #94a3b8; }
.btn-primary { background: #4f46e5; color: #fff; padding: .75rem 1.5rem; border: none; border-radius: 8px; cursor: pointer; margin-top: 1rem; }
.pagination { display: flex; gap: .5rem; justify-content: center; margin-top: 2.5rem; flex-wrap: wrap; }
.page-btn { width: 40px; height: 40px; border: 1px solid #e2e8f0; background: #fff; border-radius: 8px; cursor: pointer; font-size: .9rem; transition: all .15s; }
.page-btn:hover, .page-btn.active { background: #4f46e5; border-color: #4f46e5; color: #fff; }
@media (max-width: 768px) { .page-layout { grid-template-columns: 1fr; } .filters-sidebar { position: static; } }
</style>
