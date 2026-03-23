<template>
  <RouterView />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useTheme } from './composables/useTheme'
import { useAuth } from './composables/useAuth'

// 初始化主题
useTheme()

// 初始化登录状态（token + 用户信息）
const { initAuth } = useAuth()
initAuth().catch(() => {})
</script>
