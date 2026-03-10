<template>
  <div v-if="loading" class="container mx-auto px-4 py-12 flex justify-center">
    <div class="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
  <div v-else-if="product" class="container mx-auto px-4 py-8">
    <nav class="text-sm text-gray-500 mb-6">
      <RouterLink to="/" class="hover:text-blue-600">Home</RouterLink> /
      <RouterLink :to="`/categories/${product.category?.slug}`" class="hover:text-blue-600 mx-1">{{ product.category?.name }}</RouterLink> /
      <span class="text-gray-800">{{ product.name }}</span>
    </nav>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
      <!-- Image gallery -->
      <div>
        <div class="aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-4">
          <img v-if="product.images?.[0]" :src="product.images[selectedImage]" :alt="product.name"
               class="w-full h-full object-cover"/>
          <div v-else class="w-full h-full flex items-center justify-center text-gray-300">
            <svg class="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
        </div>
        <div v-if="product.images?.length > 1" class="flex gap-3 overflow-x-auto">
          <button v-for="(img, i) in product.images" :key="i" @click="selectedImage = i"
                  class="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-colors"
                  :class="selectedImage === i ? 'border-blue-600' : 'border-transparent'">
            <img :src="img" :alt="`Product image ${i+1}`" class="w-full h-full object-cover"/>
          </button>
        </div>
      </div>
      <!-- Product info -->
      <div>
        <p class="text-sm text-blue-600 font-medium uppercase tracking-wide mb-2">{{ product.category?.name }}</p>
        <h1 class="text-3xl font-extrabold text-gray-800 mb-4">{{ product.name }}</h1>
        <div class="flex items-center gap-3 mb-4">
          <div class="flex">
            <svg v-for="i in 5" :key="i" class="w-5 h-5"
                 :class="i <= Math.round(product.reviews_avg_rating || 0) ? 'text-yellow-400' : 'text-gray-200'"
                 fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
          </div>
          <span class="text-gray-500 text-sm">{{ product.reviews_count || 0 }} reviews</span>
        </div>
        <div class="flex items-baseline gap-3 mb-6">
          <span v-if="product.sale_price" class="text-4xl font-black text-red-600">\${{ formatPrice(product.sale_price) }}</span>
          <span v-if="product.sale_price" class="text-xl text-gray-400 line-through">\${{ formatPrice(product.price) }}</span>
          <span v-else class="text-4xl font-black text-gray-800">\${{ formatPrice(product.price) }}</span>
          <span v-if="product.sale_price" class="bg-red-100 text-red-700 text-sm font-bold px-2 py-1 rounded">
            {{ Math.round((1 - product.sale_price / product.price) * 100) }}% OFF
          </span>
        </div>
        <p class="text-gray-600 leading-relaxed mb-6">{{ product.short_description || product.description }}</p>
        <!-- Stock -->
        <div class="flex items-center gap-2 mb-6">
          <div class="w-2 h-2 rounded-full" :class="product.stock > 0 ? 'bg-green-500' : 'bg-red-500'"></div>
          <span class="text-sm font-medium" :class="product.stock > 0 ? 'text-green-700' : 'text-red-700'">
            {{ product.stock > 0 ? `${product.stock} in stock` : 'Out of stock' }}
          </span>
        </div>
        <!-- Quantity + CTA -->
        <div class="flex items-center gap-4 mb-4">
          <div class="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
            <button @click="qty > 1 && qty--" class="w-12 h-12 flex items-center justify-center text-xl font-bold text-gray-600 hover:bg-gray-100">−</button>
            <span class="w-12 text-center font-semibold">{{ qty }}</span>
            <button @click="qty++" class="w-12 h-12 flex items-center justify-center text-xl font-bold text-gray-600 hover:bg-gray-100">+</button>
          </div>
          <button @click="addToCart" :disabled="product.stock === 0 || adding"
            class="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-4 px-8 rounded-xl transition-colors text-lg">
            {{ adding ? 'Adding...' : 'Add to Cart' }}
          </button>
        </div>
        <div v-if="addedMessage" class="text-green-600 text-sm font-medium flex items-center gap-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          {{ addedMessage }}
        </div>
      </div>
    </div>

    <!-- Description -->
    <div class="bg-white rounded-2xl p-8 shadow-sm mb-8">
      <h2 class="text-xl font-bold text-gray-800 mb-4">Product Description</h2>
      <p class="text-gray-600 leading-relaxed whitespace-pre-line">{{ product.description }}</p>
    </div>

    <!-- Related products -->
    <div v-if="related.length > 0">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">Related Products</h2>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <ProductCard v-for="p in related" :key="p.id" :product="p" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useProductStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import ProductCard from '@/components/product/ProductCard.vue'
import { useRouter } from 'vue-router'

const route        = useRoute()
const router       = useRouter()
const productStore = useProductStore()
const cartStore    = useCartStore()
const authStore    = useAuthStore()

const product      = computed(() => productStore.product)
const related      = computed(() => productStore.relatedProducts)
const loading      = computed(() => productStore.loading)

const selectedImage = ref(0)
const qty           = ref(1)
const adding        = ref(false)
const addedMessage  = ref('')

function formatPrice(v) { return parseFloat(v || 0).toFixed(2) }

async function addToCart() {
  if (!authStore.isAuthenticated) {
    router.push({ name: 'login', query: { redirect: route.fullPath } })
    return
  }
  adding.value = true
  try {
    await cartStore.addItem(product.value.id, qty.value)
    addedMessage.value = `${qty.value} item(s) added to cart!`
    setTimeout(() => addedMessage.value = '', 3000)
  } finally {
    adding.value = false
  }
}

async function loadProduct() {
  await productStore.fetchProduct(route.params.slug)
  selectedImage.value = 0
  qty.value = 1
}

watch(() => route.params.slug, loadProduct)
onMounted(loadProduct)
</script>
