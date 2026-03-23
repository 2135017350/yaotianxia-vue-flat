<template>
  <Layout>
    <section class="page-hero">
      <div class="w-full px-6 lg:px-12 py-16">
        <div :class="['text-sm font-medium mb-3 tracking-wider uppercase', isDark ? 'text-primary' : 'text-blue-600']">Solutions</div>
        <h1 :class="['text-4xl lg:text-5xl font-bold mb-4', isDark ? 'text-white' : 'text-gray-900']">解决方案</h1>
        <p :class="['text-lg max-w-2xl', isDark ? 'text-white/60' : 'text-gray-600']">
          针对医药行业不同细分场景，提供专业化、定制化的数字管理解决方案
        </p>
      </div>
    </section>

    <!-- 五流合一 -->
    <section :class="['w-full py-20 px-6 lg:px-12', isDark ? 'bg-brand-surface' : 'bg-white']">
      <div class="text-center mb-12">
        <div :class="['text-sm font-medium mb-2 tracking-wider uppercase', isDark ? 'text-primary' : 'text-blue-600']">Core Concept</div>
        <h2 :class="['text-3xl font-bold', isDark ? 'text-white' : 'text-gray-900']">五流合一核心理念</h2>
        <p :class="['mt-3 max-w-2xl mx-auto', isDark ? 'text-white/60' : 'text-gray-500']">
          以「流通码」为核心纽带，打通医药流通全链路数据，实现五流同步管理
        </p>
      </div>
      <div class="flex flex-wrap justify-center gap-4 lg:gap-6">
        <div v-for="flow in fiveFlows" :key="flow.name" class="glass-card rounded-2xl px-8 py-6 text-center min-w-36">
          <div class="text-3xl mb-3">{{ flow.icon }}</div>
          <div :class="['font-bold text-xl', isDark ? 'text-white' : 'text-gray-900']">{{ flow.name }}</div>
          <div :class="['text-sm mt-1', isDark ? 'text-white/50' : 'text-gray-500']">{{ flow.sub }}</div>
        </div>
      </div>
    </section>

    <!-- 六大解决方案 -->
    <section :class="['w-full py-20 px-6 lg:px-12', isDark ? 'bg-brand-bg' : 'bg-gray-50']">
      <div class="text-center mb-12">
        <div :class="['text-sm font-medium mb-2 tracking-wider uppercase', isDark ? 'text-primary' : 'text-blue-600']">Six Solutions</div>
        <h2 :class="['text-3xl font-bold', isDark ? 'text-white' : 'text-gray-900']">六大专业解决方案</h2>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <RouterLink
          v-for="solution in solutions"
          :key="solution.path"
          :to="solution.path"
          class="glass-card rounded-2xl p-8 block group"
        >
          <div class="text-3xl mb-4">{{ solution.icon }}</div>
          <h3 :class="['font-bold text-xl mb-3 group-hover:text-primary transition-colors', isDark ? 'text-white' : 'text-gray-900']">
            {{ solution.title }}
          </h3>
          <p :class="['text-sm leading-relaxed mb-4', isDark ? 'text-white/60' : 'text-gray-500']">{{ solution.desc }}</p>
          <div class="flex flex-wrap gap-2 mb-4">
            <span
              v-for="tag in solution.tags"
              :key="tag"
              class="text-xs px-2 py-0.5 rounded-full"
              :style="isDark ? 'background: rgba(0,212,255,0.1); color: #00D4FF' : 'background: rgba(0,100,200,0.08); color: #0066CC'"
            >{{ tag }}</span>
          </div>
          <div :class="['text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all', isDark ? 'text-primary' : 'text-blue-600']">
            了解详情 <span>→</span>
          </div>
        </RouterLink>
      </div>
    </section>

    <!-- CTA -->
    <section class="w-full py-16 px-6 lg:px-12 text-center"
             :style="isDark ? 'background: linear-gradient(135deg, #070E1A 0%, #0D1B2E 100%)' : 'background: linear-gradient(135deg, #EBF8FF 0%, #DBEAFE 60%, #EDE9FE 100%)'"  >
      <h2 class="text-2xl lg:text-3xl font-bold text-white mb-4">找到适合您的解决方案</h2>
      <p class="text-white/60 mb-8">专业顾问为您分析需求，定制最优方案</p>
      <RouterLink to="/contact" class="btn-primary px-10 py-4">免费咨询</RouterLink>
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

const fiveFlows = [
  { icon: '🛒', name: '商流', sub: '订单交易管理' },
  { icon: '🚚', name: '物流', sub: '配送追踪管理' },
  { icon: '💰', name: '资金流', sub: '结算支付管理' },
  { icon: '📊', name: '信息流', sub: '数据共享管理' },
  { icon: '🧾', name: '票据流', sub: '发票管理' },
]

const solutions = [
  {
    icon: '🚛',
    title: '药品三方物流',
    path: '/solutions/logistics',
    desc: '为药品第三方物流企业提供专业的仓储配送管理系统，支持温控管理、GSP合规、多客户管理等核心需求',
    tags: ['三方物流', '仓储管理', 'GSP合规'],
  },
  {
    icon: '🔄',
    title: '医药供应链',
    path: '/solutions/supply-chain',
    desc: '打通医药供应链上下游，实现采购、库存、配送、结算全链路数字化管理，降低运营成本',
    tags: ['供应链', '采购管理', '库存优化'],
  },
  {
    icon: '🏥',
    title: '智慧医疗',
    path: '/solutions/smart-medical',
    desc: '为中小型医院、诊所提供一体化HIS系统，覆盖门诊、住院、药房、检验等全业务场景',
    tags: ['HIS系统', '门诊管理', '电子病历'],
  },
  {
    icon: '🤝',
    title: '医养结合系统',
    path: '/solutions/medical-care',
    desc: '整合医疗与养老服务，实现健康档案共享、慢病管理、远程医疗等医养结合核心功能',
    tags: ['医养结合', '健康档案', '慢病管理'],
  },
  {
    icon: '🏠',
    title: '智慧养老',
    path: '/solutions/elder-care',
    desc: '机构养老与居家养老双模式并行，提供全方位老人服务管理，助力养老机构数字化升级',
    tags: ['机构养老', '居家养老', '智慧养老'],
  },
  {
    icon: '📦',
    title: 'WMS系统',
    path: '/solutions/wms',
    desc: '专业仓储管理系统，支持多温区、多货主、批次效期管理，提升仓储作业效率',
    tags: ['仓储管理', '批次管理', '效期预警'],
  },
]
</script>
