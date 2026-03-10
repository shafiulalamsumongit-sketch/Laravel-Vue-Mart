<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">
        Search results for "<span class="text-blue-600">{{ query }}</span>"
      </h1>
      <p class="text-gray-500 text-sm mt-1">{{ pagination.total || 0 }} results</p>
    </div>
    <div v-if="loading" class="grid grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="i in 8" :key="i" class="bg-white rounded-xl aspect-square animate-pulse"></div>
    </div>
    <div v-else-if="products.length === 0" class="text-center py-24 text-gray-400">
      <p class="text-xl font-semibold">No results found</p>
      <RouterLink to="/products" class="text-blue-600 hover:underline mt-3 block">Browse all products</RouterLink>
    </div>
    <div v-else class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <ProductCard v-for="p in products" :key="p.id" :product="p" />
    </div>
  </div>
</template>

<script setup>
import { computed, watch, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useProductStore } from '@/stores/products'
import ProductCard from '@/components/product/ProductCard.vue'

const route        = useRoute()
const productStore = useProductStore()
const products     = computed(() => productStore.products)
const pagination   = computed(() => productStore.pagination)
const loading      = computed(() => productStore.loading)
const query        = computed(() => route.query.q || '')

watch(query, (q) => { if (q) productStore.search(q) })
onMounted(() => { if (query.value) productStore.search(query.value) })
</script>
