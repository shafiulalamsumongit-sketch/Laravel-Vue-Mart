<template>
  <div v-if="products.loading" class="container loading-state">
    <div class="skeleton-detail"></div>
  </div>
  <div v-else-if="!product" class="container not-found">
    <h2>Product not found</h2>
    <RouterLink to="/products">← Back to products</RouterLink>
  </div>
  <div v-else class="product-detail container">
    <nav class="breadcrumb">
      <RouterLink to="/">Home</RouterLink> /
      <RouterLink to="/products">Products</RouterLink> /
      <RouterLink :to="`/categories/${product.category?.slug}`">{{ product.category?.name }}</RouterLink> /
      <span>{{ product.name }}</span>
    </nav>

    <div class="detail-layout">
      <!-- Images -->
      <div class="images-section">
        <div class="main-image">
          <img :src="selectedImage || product.primary_image || '/placeholder.jpg'" :alt="product.name" />
          <div v-if="product.discount_percent" class="discount-tag">-{{ product.discount_percent }}% OFF</div>
        </div>
        <div class="image-thumbs" v-if="product.images?.length > 1">
          <div
            v-for="img in product.images"
            :key="img.id"
            class="thumb"
            :class="{ active: selectedImage === img.url }"
            @click="selectedImage = img.url"
          >
            <img :src="img.url" :alt="img.alt_text" />
          </div>
        </div>
      </div>

      <!-- Info -->
      <div class="info-section">
        <span class="product-category-label">{{ product.category?.name }}</span>
        <h1 class="product-name">{{ product.name }}</h1>

        <div class="rating-row">
          <div class="stars">
            <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= Math.round(product.rating) }">★</span>
          </div>
          <span class="rating-text">{{ product.rating }} ({{ product.reviews_count }} reviews)</span>
        </div>

        <div class="price-block">
          <span class="price-main">${{ formatPrice(product.sale_price || product.price) }}</span>
          <span v-if="product.sale_price" class="price-crossed">${{ formatPrice(product.price) }}</span>
        </div>

        <p class="product-desc">{{ product.short_description }}</p>

        <!-- Variants -->
        <div v-if="product.variants?.length" class="variants-section">
          <div v-for="group in variantGroups" :key="group.name" class="variant-group">
            <label class="variant-label">{{ group.name }}</label>
            <div class="variant-options">
              <button
                v-for="v in group.variants"
                :key="v.id"
                class="variant-btn"
                :class="{ active: selectedVariants[group.name]?.id === v.id }"
                @click="selectedVariants[group.name] = v"
              >{{ v.value }}</button>
            </div>
          </div>
        </div>

        <!-- Quantity -->
        <div class="quantity-row">
          <label class="variant-label">Quantity</label>
          <div class="quantity-control">
            <button @click="quantity = Math.max(1, quantity - 1)">−</button>
            <span>{{ quantity }}</span>
            <button @click="quantity = Math.min(product.stock_quantity, quantity + 1)">+</button>
          </div>
          <span class="stock-text" :class="{ 'text-danger': product.stock_quantity < 10 }">
            {{ product.in_stock ? `${product.stock_quantity} in stock` : 'Out of stock' }}
          </span>
        </div>

        <!-- Actions -->
        <div class="action-row">
          <button
            class="btn-add-cart"
            :disabled="!product.in_stock || cartLoading"
            @click="handleAddToCart"
          >
            <span v-if="cartLoading">Adding...</span>
            <span v-else>Add to Cart</span>
          </button>
          <button class="btn-wishlist" @click="toggleWishlist">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" :fill="inWishlist ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </button>
        </div>

        <!-- Meta -->
        <div class="product-meta">
          <div class="meta-item"><span>SKU:</span> {{ product.sku }}</div>
          <div class="meta-item"><span>Category:</span> {{ product.category?.name }}</div>
        </div>
      </div>
    </div>

    <!-- Description Tabs -->
    <div class="tabs-section">
      <div class="tab-headers">
        <button v-for="tab in tabs" :key="tab" class="tab-btn" :class="{ active: activeTab === tab }" @click="activeTab = tab">
          {{ tab }}
        </button>
      </div>
      <div class="tab-content">
        <div v-if="activeTab === 'Description'">
          <p>{{ product.description }}</p>
        </div>
        <div v-else-if="activeTab === 'Reviews'">
          <div v-if="!product.reviews?.length" class="no-reviews">No reviews yet. Be the first!</div>
          <div v-for="review in product.reviews" :key="review.id" class="review-card">
            <div class="review-header">
              <strong>{{ review.user.name }}</strong>
              <div class="stars small">
                <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= review.rating }">★</span>
              </div>
            </div>
            <p>{{ review.body }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const products = useProductStore()
const cart = useCartStore()
const auth = useAuthStore()

const product = computed(() => products.product)
const selectedImage = ref(null)
const quantity = ref(1)
const selectedVariants = ref({})
const inWishlist = ref(false)
const cartLoading = ref(false)
const activeTab = ref('Description')
const tabs = ['Description', 'Reviews']

const variantGroups = computed(() => {
  if (!product.value?.variants) return []
  const groups = {}
  product.value.variants.forEach(v => {
    if (!groups[v.name]) groups[v.name] = { name: v.name, variants: [] }
    groups[v.name].variants.push(v)
  })
  return Object.values(groups)
})

async function handleAddToCart() {
  if (!auth.isAuthenticated) { router.push({ name: 'login' }); return }
  cartLoading.value = true
  const variantId = Object.values(selectedVariants.value)[0]?.id || null
  await cart.addItem(product.value.id, quantity.value, variantId)
  cartLoading.value = false
}

function toggleWishlist() {
  if (!auth.isAuthenticated) { router.push({ name: 'login' }); return }
  inWishlist.value = !inWishlist.value
}

function formatPrice(p) { return parseFloat(p).toFixed(2) }

onMounted(() => products.fetchProduct(route.params.slug))
</script>

<style scoped>
.container { max-width: 1200px; margin: 0 auto; padding: 2rem 1rem; }
.breadcrumb { font-size: .85rem; color: #94a3b8; margin-bottom: 2rem; }
.breadcrumb a { color: #4f46e5; text-decoration: none; }
.breadcrumb span { color: #1e293b; }
.detail-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; margin-bottom: 4rem; }
.main-image { position: relative; aspect-ratio: 1; border-radius: 16px; overflow: hidden; background: #f8fafc; }
.main-image img { width: 100%; height: 100%; object-fit: cover; }
.discount-tag { position: absolute; top: 1rem; left: 1rem; background: #ef4444; color: #fff; padding: .3rem .7rem; border-radius: 6px; font-size: .8rem; font-weight: 700; }
.image-thumbs { display: flex; gap: .75rem; margin-top: 1rem; }
.thumb { width: 72px; height: 72px; border-radius: 8px; overflow: hidden; cursor: pointer; border: 2px solid transparent; }
.thumb.active { border-color: #4f46e5; }
.thumb img { width: 100%; height: 100%; object-fit: cover; }
.product-category-label { font-size: .8rem; color: #4f46e5; font-weight: 600; text-transform: uppercase; letter-spacing: .06em; }
.product-name { font-size: 2rem; font-weight: 800; color: #1e293b; margin: .5rem 0 1rem; line-height: 1.2; }
.rating-row { display: flex; align-items: center; gap: .5rem; margin-bottom: 1.5rem; }
.stars { display: flex; gap: 1px; }
.star { color: #e2e8f0; font-size: 1rem; }
.star.filled { color: #f59e0b; }
.stars.small .star { font-size: .85rem; }
.rating-text { font-size: .85rem; color: #64748b; }
.price-block { display: flex; align-items: center; gap: .75rem; margin-bottom: 1.5rem; }
.price-main { font-size: 2rem; font-weight: 800; color: #1e293b; }
.price-crossed { font-size: 1.1rem; color: #94a3b8; text-decoration: line-through; }
.product-desc { color: #64748b; line-height: 1.7; margin-bottom: 1.5rem; }
.variants-section { margin-bottom: 1.5rem; }
.variant-group { margin-bottom: 1rem; }
.variant-label { display: block; font-size: .8rem; font-weight: 600; color: #475569; text-transform: uppercase; margin-bottom: .5rem; }
.variant-options { display: flex; gap: .5rem; flex-wrap: wrap; }
.variant-btn { padding: .4rem .9rem; border: 1px solid #e2e8f0; border-radius: 6px; background: #fff; cursor: pointer; font-size: .9rem; transition: all .15s; }
.variant-btn.active { background: #4f46e5; border-color: #4f46e5; color: #fff; }
.quantity-row { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
.quantity-control { display: flex; align-items: center; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; }
.quantity-control button { padding: .5rem 1rem; background: #f8fafc; border: none; cursor: pointer; font-size: 1.1rem; }
.quantity-control span { padding: .5rem 1.25rem; font-weight: 600; }
.stock-text { font-size: .85rem; color: #64748b; }
.text-danger { color: #ef4444; }
.action-row { display: flex; gap: 1rem; margin-bottom: 1.5rem; }
.btn-add-cart { flex: 1; background: #4f46e5; color: #fff; border: none; padding: 1rem; border-radius: 10px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: background .2s; }
.btn-add-cart:hover:not(:disabled) { background: #4338ca; }
.btn-add-cart:disabled { opacity: .6; cursor: not-allowed; }
.btn-wishlist { width: 50px; height: 50px; border: 1px solid #e2e8f0; background: #fff; border-radius: 10px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #475569; transition: all .15s; }
.btn-wishlist:hover { border-color: #ef4444; color: #ef4444; }
.product-meta { border-top: 1px solid #f1f5f9; padding-top: 1rem; }
.meta-item { font-size: .85rem; color: #64748b; margin-bottom: .25rem; }
.meta-item span { font-weight: 600; color: #475569; }
.tabs-section { border-top: 1px solid #e2e8f0; }
.tab-headers { display: flex; gap: 0; border-bottom: 1px solid #e2e8f0; }
.tab-btn { padding: 1rem 1.5rem; border: none; background: none; cursor: pointer; font-size: .95rem; color: #64748b; border-bottom: 2px solid transparent; margin-bottom: -1px; transition: color .15s; }
.tab-btn.active { color: #4f46e5; border-bottom-color: #4f46e5; }
.tab-content { padding: 2rem 0; color: #475569; line-height: 1.7; }
.review-card { padding: 1rem 0; border-bottom: 1px solid #f1f5f9; }
.review-header { display: flex; align-items: center; gap: 1rem; margin-bottom: .5rem; }
.no-reviews { color: #94a3b8; }
@media (max-width: 768px) { .detail-layout { grid-template-columns: 1fr; gap: 2rem; } }
</style>
