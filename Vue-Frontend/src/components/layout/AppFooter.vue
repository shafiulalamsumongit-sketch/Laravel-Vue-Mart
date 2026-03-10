<template>
  <footer class="bg-gray-900 text-gray-300 mt-16">
    <div class="container mx-auto px-4 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div>
          <h3 class="text-white text-xl font-extrabold mb-3">Vue<span class="text-blue-400">Mart</span></h3>
          <p class="text-sm text-gray-400 leading-relaxed">Your one-stop shop for premium products. Quality guaranteed, delivered fast.</p>
        </div>
        <div>
          <h4 class="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Shop</h4>
          <ul class="space-y-2 text-sm">
            <li><RouterLink to="/products" class="hover:text-white transition-colors">All Products</RouterLink></li>
            <li><RouterLink to="/products?featured=1" class="hover:text-white transition-colors">Featured</RouterLink></li>
            <li><RouterLink to="/products?in_stock=1" class="hover:text-white transition-colors">In Stock</RouterLink></li>
          </ul>
        </div>
        <div>
          <h4 class="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Account</h4>
          <ul class="space-y-2 text-sm">
            <li><RouterLink to="/account" class="hover:text-white transition-colors">My Profile</RouterLink></li>
            <li><RouterLink to="/account/orders" class="hover:text-white transition-colors">My Orders</RouterLink></li>
            <li><RouterLink to="/account/wishlist" class="hover:text-white transition-colors">Wishlist</RouterLink></li>
          </ul>
        </div>
        <div>
          <h4 class="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Support</h4>
          <ul class="space-y-2 text-sm">
            <li><a href="#" class="hover:text-white transition-colors">FAQ</a></li>
            <li><a href="#" class="hover:text-white transition-colors">Shipping Info</a></li>
            <li><a href="#" class="hover:text-white transition-colors">Returns</a></li>
            <li><a href="#" class="hover:text-white transition-colors">Contact Us</a></li>
          </ul>
        </div>
      </div>
      <div class="border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
        <p>© {{ new Date().getFullYear() }} VueMart. All rights reserved.</p>
        <div class="flex items-center gap-4">
          <span>Powered by Vue 3 + Laravel 11</span>
          <span>•</span>
          <span>Secured by Stripe</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>
