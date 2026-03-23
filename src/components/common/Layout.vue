<template>
  <div :class="['min-h-screen flex flex-col', isDark ? 'bg-brand-bg' : 'bg-gray-50']">
    <Navbar />
    <main class="flex-1 pt-16">
      <slot />
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Navbar from './Navbar.vue'
import Footer from './Footer.vue'
import { useTheme } from '../../composables/useTheme'

const { theme } = useTheme()
const isDark = computed(() => theme.value === 'dark')
</script>
