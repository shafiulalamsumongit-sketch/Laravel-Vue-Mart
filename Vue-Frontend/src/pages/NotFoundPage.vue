<template>
  <div class="container mx-auto px-4 py-24 text-center">
    <h1 class="text-9xl font-black text-gray-200">404</h1>
    <h2 class="text-2xl font-bold text-gray-800 mt-4 mb-3">Page Not Found</h2>
    <p class="text-gray-500 mb-8">The page you're looking for doesn't exist.</p>
    <RouterLink to="/" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-full transition-colors">
      Go Home
    </RouterLink>
  </div>
</template>
<script setup>
import { RouterLink } from 'vue-router'
</script>
