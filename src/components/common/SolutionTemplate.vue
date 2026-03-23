<template>
  <Layout>
    <!-- Page Hero -->
    <section class="page-hero">
      <div class="w-full px-6 lg:px-12 py-16">
        <!-- 面包屑 -->
        <nav class="flex items-center gap-2 text-sm mb-6">
          <RouterLink to="/" :class="isDark ? 'text-white/50 hover:text-white/80' : 'text-gray-400 hover:text-gray-600'">首页</RouterLink>
          <span :class="isDark ? 'text-white/30' : 'text-gray-300'">›</span>
          <RouterLink to="/solutions" :class="isDark ? 'text-white/50 hover:text-white/80' : 'text-gray-400 hover:text-gray-600'">解决方案</RouterLink>
          <span :class="isDark ? 'text-white/30' : 'text-gray-300'">›</span>
          <span class="text-primary font-medium">{{ title }}</span>
        </nav>

        <div :class="['text-sm font-medium mb-3 tracking-wider uppercase', isDark ? 'text-primary' : 'text-blue-600']">{{ enTitle }}</div>
        <h1 :class="['text-4xl lg:text-5xl font-bold mb-4', isDark ? 'text-white' : 'text-gray-900']">{{ title }}</h1>
        <p :class="['text-lg max-w-2xl', isDark ? 'text-white/60' : 'text-gray-600']">{{ subtitle }}</p>
      </div>
    </section>

    <!-- 方案概述 -->
    <section :class="['w-full py-20 px-6 lg:px-12', isDark ? 'bg-brand-surface' : 'bg-white']">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 :class="['text-2xl lg:text-3xl font-bold mb-4', isDark ? 'text-white' : 'text-gray-900']">方案概述</h2>
          <p :class="['text-base leading-relaxed mb-6', isDark ? 'text-white/70' : 'text-gray-600']">{{ overview }}</p>
          <div class="flex flex-wrap gap-3">
            <span
              v-for="tag in tags"
              :key="tag"
              class="text-sm px-4 py-1.5 rounded-full"
              :style="isDark ? 'background: rgba(0,212,255,0.1); color: #00D4FF; border: 1px solid rgba(0,212,255,0.2)' : 'background: rgba(0,100,200,0.08); color: #0066CC; border: 1px solid rgba(0,100,200,0.2)'"
            >{{ tag }}</span>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div v-for="stat in stats" :key="stat.label" class="glass-card rounded-xl p-6 text-center">
            <div class="text-3xl font-bold gradient-text mb-1">{{ stat.value }}</div>
            <div :class="['text-sm', isDark ? 'text-white/60' : 'text-gray-500']">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 核心功能 -->
    <section :class="['w-full py-20 px-6 lg:px-12', isDark ? 'bg-brand-bg' : 'bg-gray-50']">
      <div class="text-center mb-12">
        <h2 :class="['text-3xl font-bold', isDark ? 'text-white' : 'text-gray-900']">核心功能</h2>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="feature in features" :key="feature.title" class="glass-card rounded-xl p-6">
          <div class="text-2xl mb-3">{{ feature.icon }}</div>
          <h3 :class="['font-bold text-base mb-2', isDark ? 'text-white' : 'text-gray-900']">{{ feature.title }}</h3>
          <p :class="['text-sm leading-relaxed', isDark ? 'text-white/60' : 'text-gray-500']">{{ feature.desc }}</p>
        </div>
      </div>
    </section>

    <!-- 方案优势 -->
    <section :class="['w-full py-20 px-6 lg:px-12', isDark ? 'bg-brand-surface' : 'bg-white']">
      <div class="text-center mb-12">
        <h2 :class="['text-3xl font-bold', isDark ? 'text-white' : 'text-gray-900']">方案优势</h2>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-for="adv in advantages" :key="adv.title" class="flex items-start gap-4">
          <div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-xl"
               style="background: rgba(0,212,255,0.1)">{{ adv.icon }}</div>
          <div>
            <h3 :class="['font-bold text-base mb-1', isDark ? 'text-white' : 'text-gray-900']">{{ adv.title }}</h3>
            <p :class="['text-sm leading-relaxed', isDark ? 'text-white/60' : 'text-gray-500']">{{ adv.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="w-full py-16 px-6 lg:px-12 text-center"
             style="background: linear-gradient(135deg, #070E1A 0%, #0D1B2E 100%)">
      <h2 class="text-2xl lg:text-3xl font-bold text-white mb-4">了解{{ title }}方案详情</h2>
      <p class="text-white/60 mb-8">专业顾问为您提供定制化解决方案</p>
      <div class="flex flex-wrap gap-4 justify-center">
        <RouterLink to="/contact" class="btn-primary px-8 py-3">免费咨询</RouterLink>
        <RouterLink to="/solutions" class="btn-secondary px-8 py-3">返回解决方案</RouterLink>
      </div>
    </section>
  </Layout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import Layout from './Layout.vue'
import { useTheme } from '../../composables/useTheme'

defineProps<{
  title: string
  enTitle: string
  subtitle: string
  overview: string
  tags: string[]
  stats: Array<{ value: string; label: string }>
  features: Array<{ icon: string; title: string; desc: string }>
  advantages: Array<{ icon: string; title: string; desc: string }>
}>()

const { theme } = useTheme()
const isDark = computed(() => theme.value === 'dark')
</script>
