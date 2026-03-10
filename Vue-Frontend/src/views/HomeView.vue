<template>
  <div class="home">
    <!-- Hero -->
    <section class="hero">
      <div class="hero-content">
        <span class="hero-badge">New Collection 2024</span>
        <h1 class="hero-title">Discover Amazing<br><span class="hero-accent">Products</span></h1>
        <p class="hero-subtitle">Shop the latest trends with fast shipping, easy returns, and secure payments powered by Stripe.</p>
        <div class="hero-actions">
          <RouterLink to="/products" class="btn-hero-primary">Shop Now</RouterLink>
          <RouterLink to="/categories/electronics" class="btn-hero-secondary">Electronics →</RouterLink>
        </div>
        <div class="hero-stats">
          <div class="stat"><span class="stat-num">10k+</span><span class="stat-label">Products</span></div>
          <div class="stat-divider"></div>
          <div class="stat"><span class="stat-num">50k+</span><span class="stat-label">Customers</span></div>
          <div class="stat-divider"></div>
          <div class="stat"><span class="stat-num">99%</span><span class="stat-label">Satisfaction</span></div>
        </div>
      </div>
      <div class="hero-visual">
        <div class="hero-blob"></div>
        <div class="hero-image-placeholder">
          <svg width="200" height="200" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="40" fill="#e0e7ff"/>
            <path d="M30 65 L50 30 L70 65 Z" fill="#4f46e5" opacity=".7"/>
            <circle cx="50" cy="52" r="12" fill="#4f46e5"/>
          </svg>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="features container">
      <div class="feature-card" v-for="f in features" :key="f.title">
        <div class="feature-icon">{{ f.icon }}</div>
        <h3>{{ f.title }}</h3>
        <p>{{ f.desc }}</p>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="section container">
      <div class="section-header">
        <h2 class="section-title">Featured Products</h2>
        <RouterLink to="/products" class="see-all">See all →</RouterLink>
      </div>
      <div v-if="products.loading" class="products-grid">
        <div v-for="i in 4" :key="i" class="product-skeleton"></div>
      </div>
      <div v-else class="products-grid">
        <ProductCard v-for="product in products.featuredProducts" :key="product.id" :product="product" />
      </div>
    </section>

    <!-- Categories -->
    <section class="section container">
      <div class="section-header">
        <h2 class="section-title">Shop by Category</h2>
      </div>
      <div class="categories-grid">
        <RouterLink
          v-for="cat in products.categories"
          :key="cat.id"
          :to="`/categories/${cat.slug}`"
          class="category-card"
        >
          <div class="category-icon">🛍️</div>
          <span>{{ cat.name }}</span>
        </RouterLink>
      </div>
    </section>

    <!-- Banner -->
    <section class="promo-banner container">
      <div class="promo-content">
        <span class="promo-label">Limited Time Offer</span>
        <h2>Free shipping on orders over $100</h2>
        <p>Use code <strong>FREESHIP</strong> at checkout</p>
        <RouterLink to="/products" class="btn-hero-primary">Shop Now</RouterLink>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useProductStore } from '@/stores/products'
import ProductCard from '@/components/product/ProductCard.vue'

const products = useProductStore()

const features = [
  { icon: '🚚', title: 'Free Shipping', desc: 'Free on all orders over $100' },
  { icon: '🔒', title: 'Secure Payment', desc: 'Powered by Stripe' },
  { icon: '↩️', title: 'Easy Returns', desc: '30-day return policy' },
  { icon: '💬', title: '24/7 Support', desc: 'Always here to help' },
]

onMounted(() => {
  products.fetchFeaturedProducts()
  products.fetchCategories()
})
</script>

<style scoped>
.home { overflow-x: hidden; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
.hero { display: grid; grid-template-columns: 1fr 1fr; align-items: center; gap: 3rem; padding: 5rem 6rem; background: linear-gradient(135deg, #fafafe 0%, #f0f0ff 100%); min-height: 560px; }
.hero-badge { display: inline-block; background: #e0e7ff; color: #4f46e5; padding: .35rem .9rem; border-radius: 20px; font-size: .8rem; font-weight: 600; margin-bottom: 1rem; }
.hero-title { font-size: 3.5rem; font-weight: 800; color: #1e293b; line-height: 1.1; margin: 0 0 1rem; }
.hero-accent { color: #4f46e5; }
.hero-subtitle { font-size: 1.1rem; color: #64748b; margin-bottom: 2rem; line-height: 1.6; }
.hero-actions { display: flex; gap: 1rem; margin-bottom: 2.5rem; }
.btn-hero-primary { background: #4f46e5; color: #fff; padding: .85rem 2rem; border-radius: 10px; text-decoration: none; font-weight: 600; transition: background .2s, transform .2s; }
.btn-hero-primary:hover { background: #4338ca; transform: translateY(-2px); }
.btn-hero-secondary { color: #4f46e5; padding: .85rem 1.5rem; border-radius: 10px; text-decoration: none; font-weight: 600; border: 2px solid #e0e7ff; }
.btn-hero-secondary:hover { background: #e0e7ff; }
.hero-stats { display: flex; gap: 2rem; align-items: center; }
.stat { text-align: center; }
.stat-num { display: block; font-size: 1.5rem; font-weight: 800; color: #1e293b; }
.stat-label { font-size: .8rem; color: #94a3b8; }
.stat-divider { width: 1px; height: 40px; background: #e2e8f0; }
.hero-visual { display: flex; justify-content: center; align-items: center; }
.hero-image-placeholder { background: #e0e7ff; border-radius: 24px; padding: 3rem; }
.features { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; padding: 3rem 1rem; }
.feature-card { text-align: center; padding: 2rem 1rem; }
.feature-icon { font-size: 2.5rem; margin-bottom: .75rem; }
.feature-card h3 { font-size: 1rem; font-weight: 700; color: #1e293b; margin: 0 0 .35rem; }
.feature-card p { font-size: .85rem; color: #94a3b8; margin: 0; }
.section { padding: 3rem 1rem; }
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
.section-title { font-size: 1.75rem; font-weight: 800; color: #1e293b; margin: 0; }
.see-all { color: #4f46e5; text-decoration: none; font-weight: 600; font-size: .9rem; }
.products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1.5rem; }
.product-skeleton { background: #f1f5f9; border-radius: 12px; aspect-ratio: .8; animation: pulse 1.5s infinite; }
@keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:.5 } }
.categories-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 1rem; }
.category-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.5rem 1rem; text-align: center; text-decoration: none; color: #1e293b; transition: all .2s; }
.category-card:hover { border-color: #4f46e5; background: #f8f7ff; }
.category-icon { font-size: 2rem; margin-bottom: .5rem; }
.category-card span { font-size: .85rem; font-weight: 600; }
.promo-banner { margin: 2rem 1rem 4rem; background: linear-gradient(135deg, #4f46e5, #7c3aed); border-radius: 20px; padding: 4rem; color: #fff; }
.promo-label { display: inline-block; background: rgba(255,255,255,.2); padding: .3rem .8rem; border-radius: 20px; font-size: .8rem; margin-bottom: 1rem; }
.promo-banner h2 { font-size: 2rem; font-weight: 800; margin: 0 0 .5rem; }
.promo-banner p { opacity: .85; margin-bottom: 1.5rem; }
@media (max-width: 768px) {
  .hero { grid-template-columns: 1fr; padding: 3rem 1.5rem; }
  .hero-visual { display: none; }
  .hero-title { font-size: 2.5rem; }
  .features { grid-template-columns: repeat(2, 1fr); }
}
</style>
