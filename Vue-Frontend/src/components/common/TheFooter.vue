<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-grid">
        <div class="footer-brand">
          <RouterLink to="/" class="brand-link">Vue<span>Shop</span></RouterLink>
          <p>Your one-stop shop for everything you need. Fast shipping, easy returns, secure payments.</p>
          <div class="social-links">
            <a href="#" class="social-link">Twitter</a>
            <a href="#" class="social-link">Facebook</a>
            <a href="#" class="social-link">Instagram</a>
          </div>
        </div>
        <div class="footer-col">
          <h4>Shop</h4>
          <RouterLink to="/products">All Products</RouterLink>
          <RouterLink to="/categories/electronics">Electronics</RouterLink>
          <RouterLink to="/categories/clothing">Clothing</RouterLink>
          <RouterLink to="/categories/books">Books</RouterLink>
        </div>
        <div class="footer-col">
          <h4>Account</h4>
          <RouterLink to="/account/profile">My Profile</RouterLink>
          <RouterLink to="/account/orders">My Orders</RouterLink>
          <RouterLink to="/account/wishlist">Wishlist</RouterLink>
          <RouterLink to="/account/addresses">Addresses</RouterLink>
        </div>
        <div class="footer-col">
          <h4>Support</h4>
          <a href="#">Help Center</a>
          <a href="#">Contact Us</a>
          <a href="#">Returns Policy</a>
          <a href="#">Privacy Policy</a>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© {{ year }} VueShop. Built with Vue.js 3 + Laravel 11.</p>
        <div class="payment-methods">
          <span>Payments secured by</span>
          <strong>Stripe</strong>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
const year = new Date().getFullYear()
</script>

<style scoped>
.footer { background: #1e293b; color: #94a3b8; margin-top: 4rem; }
.footer-container { max-width: 1200px; margin: 0 auto; padding: 3rem 1rem 1.5rem; }
.footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 2rem; margin-bottom: 3rem; }
.brand-link { font-size: 1.4rem; font-weight: 800; color: #fff; text-decoration: none; display: inline-block; margin-bottom: .75rem; }
.brand-link span { color: #818cf8; }
.footer-brand p { font-size: .85rem; line-height: 1.6; margin: 0 0 1rem; }
.social-links { display: flex; gap: .75rem; }
.social-link { font-size: .8rem; color: #64748b; text-decoration: none; }
.social-link:hover { color: #818cf8; }
.footer-col h4 { color: #fff; font-size: .9rem; font-weight: 600; margin: 0 0 1rem; }
.footer-col a { display: block; color: #64748b; text-decoration: none; font-size: .85rem; margin-bottom: .5rem; }
.footer-col a:hover { color: #94a3b8; }
.footer-bottom { border-top: 1px solid #334155; padding-top: 1.5rem; display: flex; justify-content: space-between; align-items: center; font-size: .8rem; flex-wrap: wrap; gap: 1rem; }
.payment-methods { display: flex; align-items: center; gap: .5rem; }
.payment-methods strong { color: #818cf8; }
@media (max-width: 768px) { .footer-grid { grid-template-columns: 1fr 1fr; } }
</style>
