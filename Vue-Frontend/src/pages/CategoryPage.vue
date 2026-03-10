<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="loading" class="flex justify-center py-16">
      <div class="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
    <div v-else>
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-800">{{ category?.name || 'Category' }}</h1>
        <p v-if="category?.description" class="text-gray-500 mt-2">{{ category.description }}</p>
      </div>
      <div v-if="products.length === 0" class="text-center py-16 text-gray-400">No products in this category yet.</div>
      <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <ProductCard v-for="p in products" :key="p.id" :product="p" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import ProductCard from '@/components/product/ProductCard.vue'

const route    = useRoute()
const category = ref(null)
const products = ref([])
const loading  = ref(false)

async function load() {
  loading.value = true
  try {
    const { data } = await axios.get(`/api/categories/${route.params.slug}/products`)
    category.value = data.category
    products.value = data.products.data
  } finally {
    loading.value = false
  }
}

watch(() => route.params.slug, load)
onMounted(load)
</script>
