<template>
  <div>
    <!-- Hero -->
    <section class="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-24">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
          Shop the Future,<br><span class="text-blue-200">Today.</span>
        </h1>
        <p class="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Discover thousands of products with unbeatable prices. Fast shipping, easy returns.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <RouterLink to="/products"
            class="bg-white text-blue-700 font-bold px-8 py-4 rounded-full text-lg hover:bg-blue-50 transition-colors shadow-lg">
            Shop Now
          </RouterLink>
          <RouterLink to="/products?featured=1"
            class="border-2 border-white text-white font-bold px-8 py-4 rounded-full text-lg hover:bg-white hover:text-blue-700 transition-colors">
            View Featured
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Categories -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-gray-800 mb-8 text-center">Shop by Category</h2>
        <div v-if="loading" class="flex justify-center py-8">
          <div class="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <RouterLink v-for="cat in categories" :key="cat.id" :to="`/categories/${cat.slug}`"
            class="group flex flex-col items-center p-6 rounded-xl bg-gray-50 hover:bg-blue-50 hover:shadow-md transition-all duration-300 text-center">
            <div class="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-600 transition-colors">
              <svg class="w-7 h-7 text-blue-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
            </div>
            <span class="font-semibold text-gray-800 group-hover:text-blue-700 text-sm">{{ cat.name }}</span>
            <span class="text-xs text-gray-400 mt-1">{{ cat.products_count }} products</span>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="py-16 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-3xl font-bold text-gray-800">Featured Products</h2>
          <RouterLink to="/products?featured=1" class="text-blue-600 hover:underline font-medium flex items-center gap-1">
            View All
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </RouterLink>
        </div>
        <div v-if="featuredLoading" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div v-for="i in 8" :key="i" class="bg-white rounded-xl aspect-square animate-pulse"></div>
        </div>
        <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <ProductCard v-for="product in featured" :key="product.id" :product="product" />
        </div>
      </div>
    </section>

    <!-- Value propositions -->
    <section class="py-12 bg-white border-t border-gray-100">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div v-for="vp in valueProps" :key="vp.title" class="flex flex-col items-center gap-3">
            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center" v-html="vp.icon"></div>
            <h3 class="font-semibold text-gray-800">{{ vp.title }}</h3>
            <p class="text-sm text-gray-500">{{ vp.desc }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useProductStore } from '@/stores/products'
import ProductCard from '@/components/product/ProductCard.vue'

const productStore = useProductStore()

const categories     = computed(() => productStore.categories)
const featured       = computed(() => productStore.featured)
const loading        = computed(() => productStore.loading)
const featuredLoading = computed(() => productStore.loading)

const valueProps = [
  { title: 'Free Shipping', desc: 'On orders over $50', icon: '<svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8l1 12a2 2 0 002 2h8a2 2 0 002-2L19 8"/></svg>' },
  { title: 'Secure Payment', desc: 'Powered by Stripe', icon: '<svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>' },
  { title: 'Easy Returns', desc: '30-day return policy', icon: '<svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>' },
  { title: '24/7 Support', desc: 'We are always here', icon: '<svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"/></svg>' },
]

onMounted(() => {
  productStore.fetchCategories()
  productStore.fetchFeatured()
})
</script>
