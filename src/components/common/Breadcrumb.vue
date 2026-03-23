<template>
  <nav class="flex items-center gap-2 text-sm mb-6 flex-wrap">
    <template v-for="(item, index) in items" :key="index">
      <RouterLink
        :to="item.path || '#'"
        :class="[
          'transition-colors',
          index === items.length - 1
            ? 'text-primary font-medium cursor-default pointer-events-none'
            : (isDark ? 'text-white/50 hover:text-white/80' : 'text-gray-400 hover:text-gray-600')
        ]"
      >{{ item.label }}</RouterLink>
      <span
        v-if="index < items.length - 1"
        :class="['mx-1', isDark ? 'text-white/30' : 'text-gray-300']"
      >›</span>
    </template>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useTheme } from '../../composables/useTheme'

defineProps<{
  items: Array<{ label: string; path?: string }>
}>()

const { theme } = useTheme()
const isDark = computed(() => theme.value === 'dark')
</script>
