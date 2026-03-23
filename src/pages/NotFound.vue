<template>
  <Layout>
    <div class="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
      <div class="text-8xl font-bold gradient-text mb-4">404</div>
      <h1 :class="['text-2xl font-bold mb-3', isDark ? 'text-white' : 'text-gray-900']">页面不存在</h1>
      <p :class="['text-base mb-8', isDark ? 'text-white/50' : 'text-gray-500']">您访问的页面已移动或不存在</p>
      <RouterLink to="/" class="btn-primary px-8 py-3">返回首页</RouterLink>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import Layout from '../components/common/Layout.vue'
import { useTheme } from '../composables/useTheme'
const { theme } = useTheme()
const isDark = computed(() => theme.value === 'dark')
</script>
