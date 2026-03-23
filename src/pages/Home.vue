<template>
  <Layout>
    <!-- Hero Section -->
    <section class="relative min-h-screen flex items-center overflow-hidden"
             :style="isDark ? 'background: linear-gradient(135deg, #070E1A 0%, #0D1B2E 50%, #0F2040 100%)' : 'background: linear-gradient(135deg, #EBF8FF 0%, #DBEAFE 60%, #EDE9FE 100%)'">
      <!-- 背景装饰 -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute top-1/4 right-1/4 w-96 h-96 rounded-full opacity-10"
             style="background: radial-gradient(circle, #00D4FF, transparent); filter: blur(60px);"></div>
        <div class="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full opacity-8"
             style="background: radial-gradient(circle, #0066FF, transparent); filter: blur(40px);"></div>
        <!-- 网格线 -->
        <svg class="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#00D4FF" stroke-width="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)"/>
        </svg>
      </div>

      <div class="w-full px-6 lg:px-12 py-20 relative z-10">
        <div class="max-w-3xl">
          <!-- 标签 -->
          <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm mb-8"
               :style="isDark ? 'border-color: rgba(0,212,255,0.3); color: #00D4FF; background: rgba(0,212,255,0.08)' : 'border-color: rgba(0,100,200,0.3); color: #0066CC; background: rgba(0,100,200,0.06)'">
            <span class="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
            专注医药管理软件 14 年
          </div>

          <!-- 主标题 -->
          <h1 class="font-bold leading-tight mb-4">
            <span :class="['block text-5xl lg:text-7xl font-display', isDark ? 'text-white' : 'text-gray-900']">整合药品</span>
            <span class="block text-5xl lg:text-7xl font-display gradient-text">全产业链</span>
          </h1>
          <h2 :class="['text-2xl lg:text-3xl font-semibold mb-6', isDark ? 'text-white/80' : 'text-gray-700']">
            数智赋能医药未来
          </h2>
          <p :class="['text-base lg:text-lg leading-relaxed mb-10 max-w-xl', isDark ? 'text-white/60' : 'text-gray-600']">
            药天下科技为药品批发企业、连锁药店、中小型医院提供一体化数字管理解决方案，以「流通码」中台打通企业间信息孤岛，实现商流、物流、资金流、信息流、票据流「五流合一」。
          </p>

          <!-- CTA 按钮 -->
          <div class="flex flex-wrap gap-4">
            <RouterLink to="/contact" class="btn-primary text-base px-8 py-3.5">立即咨询 →</RouterLink>
            <RouterLink to="/products" class="btn-secondary text-base px-8 py-3.5">了解产品</RouterLink>
          </div>
        </div>

        <!-- 数据统计 -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
          <div v-for="stat in stats" :key="stat.label" class="text-center">
            <div class="text-4xl lg:text-5xl font-bold font-display gradient-text mb-1">
              {{ stat.value }}
            </div>
            <div :class="['text-sm', isDark ? 'text-white/50' : 'text-gray-500']">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 产品快速入口 -->
    <section :class="['w-full py-20 px-6 lg:px-12', isDark ? 'bg-brand-surface' : 'bg-white']">
      <div class="text-center mb-12">
        <div class="text-primary text-sm font-medium mb-2 tracking-wider uppercase">Core Products</div>
        <h2 :class="['text-3xl lg:text-4xl font-bold', isDark ? 'text-white' : 'text-gray-900']">核心产品体系</h2>
        <p :class="['mt-3 text-base max-w-2xl mx-auto', isDark ? 'text-white/60' : 'text-gray-500']">
          覆盖医药流通全链路，为不同规模企业提供专业化管理工具
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="product in coreProducts"
          :key="product.title"
          class="glass-card rounded-2xl p-6 cursor-pointer"
          @click="$router.push('/products')"
        >
          <div class="text-3xl mb-4">{{ product.icon }}</div>
          <h3 :class="['font-bold text-lg mb-2', isDark ? 'text-white' : 'text-gray-900']">{{ product.title }}</h3>
          <p :class="['text-sm leading-relaxed mb-4', isDark ? 'text-white/60' : 'text-gray-500']">{{ product.desc }}</p>
          <div class="flex flex-wrap gap-1.5">
            <span
              v-for="tag in product.tags"
              :key="tag"
              class="text-xs px-2 py-0.5 rounded-full"
              :style="isDark ? 'background: rgba(0,212,255,0.1); color: #00D4FF' : 'background: rgba(0,100,200,0.08); color: #0066CC'"
            >{{ tag }}</span>
          </div>
        </div>
      </div>

      <div class="text-center mt-10">
        <RouterLink to="/products" class="btn-primary px-8 py-3">查看全部产品</RouterLink>
      </div>
    </section>

    <!-- 五流合一 -->
    <section :class="['w-full py-20 px-6 lg:px-12', isDark ? 'bg-brand-bg' : 'bg-gray-50']">
      <div class="text-center mb-12">
        <div class="text-primary text-sm font-medium mb-2 tracking-wider uppercase">Five Flows</div>
        <h2 :class="['text-3xl lg:text-4xl font-bold', isDark ? 'text-white' : 'text-gray-900']">五流合一溯源管理</h2>
        <p :class="['mt-3 text-base max-w-2xl mx-auto', isDark ? 'text-white/60' : 'text-gray-500']">
          以「流通码」为核心，打通医药流通全链路数据，实现五流同步
        </p>
      </div>

      <div class="flex flex-wrap justify-center gap-4 lg:gap-8">
        <div
          v-for="flow in fiveFlows"
          :key="flow.name"
          class="glass-card rounded-2xl px-8 py-6 text-center min-w-32"
        >
          <div class="text-2xl mb-2">{{ flow.icon }}</div>
          <div :class="['font-bold text-lg', isDark ? 'text-white' : 'text-gray-900']">{{ flow.name }}</div>
          <div :class="['text-xs mt-1', isDark ? 'text-white/50' : 'text-gray-500']">{{ flow.sub }}</div>
        </div>
      </div>
    </section>

    <!-- 目标客户 -->
    <section :class="['w-full py-20 px-6 lg:px-12', isDark ? 'bg-brand-surface' : 'bg-white']">
      <div class="text-center mb-12">
        <div class="text-primary text-sm font-medium mb-2 tracking-wider uppercase">Target Clients</div>
        <h2 :class="['text-3xl lg:text-4xl font-bold', isDark ? 'text-white' : 'text-gray-900']">服务对象</h2>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div v-for="client in clients" :key="client.title" class="glass-card rounded-2xl p-8 text-center">
          <div class="text-4xl mb-4">{{ client.icon }}</div>
          <h3 :class="['font-bold text-xl mb-3', isDark ? 'text-white' : 'text-gray-900']">{{ client.title }}</h3>
          <p :class="['text-sm leading-relaxed', isDark ? 'text-white/60' : 'text-gray-500']">{{ client.desc }}</p>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section
      class="w-full py-20 px-6 lg:px-12 text-center"
      :style="isDark
        ? 'background: linear-gradient(135deg, #070E1A 0%, #0D1B2E 100%)'
        : 'background: linear-gradient(135deg, #EBF8FF 0%, #DBEAFE 60%, #EDE9FE 100%)'">
      
      <h2 :class="['text-3xl lg:text-4xl font-bold mb-4', isDark ? 'text-white' : 'text-gray-900']">准备好开始数字化转型了吗？</h2>
      <p :class="['text-lg mb-8 max-w-xl mx-auto', isDark ? 'text-white/60' : 'text-gray-600']">立即联系我们，获取专属解决方案和免费演示</p>
      <div class="flex flex-wrap gap-4 justify-center">
        <RouterLink to="/contact" class="btn-primary px-10 py-4 text-lg">免费咨询</RouterLink>
        <RouterLink to="/download" class="btn-secondary px-10 py-4 text-lg">试用下载</RouterLink>
      </div>
    </section>
  </Layout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import Layout from '../components/common/Layout.vue'
import { useTheme } from '../composables/useTheme'

const { theme } = useTheme()
const isDark = computed(() => theme.value === 'dark')

const stats = [
  { value: '14+', label: '年专注医药软件' },
  { value: '4', label: '家旗下公司' },
  { value: '19+', label: '省市覆盖' },
  { value: '1000+', label: '家企业客户' },
]

const coreProducts = [
  {
    icon: '💊',
    title: '药天下ERP+WMS',
    desc: '覆盖药品批发全流程，支持GSP合规管理，实现进销存一体化',
    tags: ['批发管理', 'GSP合规', '库存管理'],
  },
  {
    icon: '🏥',
    title: '深度HIS系统',
    desc: '适用于中小型医院的一体化管理系统，门诊、住院、药房全覆盖',
    tags: ['门诊管理', '住院管理', '电子病历'],
  },
  {
    icon: '🏠',
    title: '智慧养老平台',
    desc: '机构养老+居家养老双模式，打通医养结合全链路服务',
    tags: ['机构养老', '居家养老', '医养结合'],
  },
  {
    icon: '🔗',
    title: '流通码中台',
    desc: '基于国家药品追溯码，实现药品全链路溯源和五流合一管理',
    tags: ['药品追溯', '五流合一', '数据中台'],
  },
]

const fiveFlows = [
  { icon: '🛒', name: '商流', sub: '订单交易' },
  { icon: '🚚', name: '物流', sub: '配送追踪' },
  { icon: '💰', name: '资金流', sub: '结算支付' },
  { icon: '📊', name: '信息流', sub: '数据共享' },
  { icon: '🧾', name: '票据流', sub: '发票管理' },
]

const clients = [
  {
    icon: '🏭',
    title: '药品批发企业',
    desc: '提供完整的GSP合规管理、进销存一体化、财务对账等功能，满足批发企业全流程管理需求',
  },
  {
    icon: '💊',
    title: '连锁药店',
    desc: '支持总部统一管控、门店分散经营，实现库存共享、价格统一、会员互通的连锁管理模式',
  },
  {
    icon: '🏥',
    title: '中小型医院',
    desc: '提供门诊、住院、药房、财务一体化管理，帮助医院提升运营效率，降低管理成本',
  },
]
</script>
