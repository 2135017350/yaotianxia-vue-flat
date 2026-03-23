<template>
  <Layout>
    <section class="page-hero">
      <div class="w-full px-6 lg:px-12 py-16">
        <div :class="['text-sm font-medium mb-3 tracking-wider uppercase', isDark ? 'text-primary' : 'text-blue-600']">News</div>
        <h1 :class="['text-4xl lg:text-5xl font-bold mb-4', isDark ? 'text-white' : 'text-gray-900']">企业动态</h1>
        <p :class="['text-lg max-w-2xl', isDark ? 'text-white/60' : 'text-gray-600']">了解药天下科技最新动态、产品更新与行业资讯</p>
      </div>
    </section>

    <section :class="['w-full py-16 px-6 lg:px-12', isDark ? 'bg-brand-surface' : 'bg-white']">
      <!-- 加载状态 -->
      <div v-if="loading" class="text-center py-20">
        <div :class="['text-lg', isDark ? 'text-white/50' : 'text-gray-400']">加载中...</div>
      </div>

      <!-- 动态列表 -->
      <div v-else-if="newsList.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="item in newsList"
          :key="item.id"
          :class="['glass-card rounded-xl p-6 cursor-pointer transition-all hover:-translate-y-1', isDark ? 'hover:border-primary/30' : 'hover:shadow-lg hover:border-blue-200']"
        >
          <div :class="['text-xs font-medium mb-3 px-2 py-1 rounded inline-block', isDark ? 'bg-primary/10 text-primary' : 'bg-blue-50 text-blue-600']">
            {{ item.category }}
          </div>
          <h3 :class="['text-lg font-bold mb-3 leading-snug', isDark ? 'text-white' : 'text-gray-900']">{{ item.title }}</h3>
          <p :class="['text-sm leading-relaxed mb-4 line-clamp-3', isDark ? 'text-white/60' : 'text-gray-500']">{{ item.summary }}</p>
          <div :class="['text-xs', isDark ? 'text-white/30' : 'text-gray-400']">
            {{ formatDate(item.published_at) }}
          </div>
        </div>
      </div>

      <!-- 无数据（后端未连接时的静态展示） -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="item in staticNews"
          :key="item.id"
          :class="['glass-card rounded-xl p-6 transition-all hover:-translate-y-1', isDark ? 'hover:border-primary/30' : 'hover:shadow-lg']"
        >
          <div :class="['text-xs font-medium mb-3 px-2 py-1 rounded inline-block', isDark ? 'bg-primary/10 text-primary' : 'bg-blue-50 text-blue-600']">
            {{ item.category }}
          </div>
          <h3 :class="['text-lg font-bold mb-3 leading-snug', isDark ? 'text-white' : 'text-gray-900']">{{ item.title }}</h3>
          <p :class="['text-sm leading-relaxed mb-4', isDark ? 'text-white/60' : 'text-gray-500']">{{ item.summary }}</p>
          <div :class="['text-xs', isDark ? 'text-white/30' : 'text-gray-400']">{{ item.date }}</div>
        </div>
      </div>
    </section>
  </Layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Layout from '../components/common/Layout.vue'
import { useTheme } from '../composables/useTheme'
import { useAuth } from '../composables/useAuth'

const { theme } = useTheme()
const isDark = computed(() => theme.value === 'dark')
const { API_BASE } = useAuth()

const loading = ref(false)
const newsList = ref<any[]>([])

const staticNews = [
  {
    id: 1,
    title: '药天下科技荣获2024年度医药行业优秀软件奖',
    summary: '北京药天下科技有限公司凭借在医药管理软件领域14年的深耕，荣获2024年度医药行业优秀软件奖，彰显了公司在医药数字化领域的领先地位。',
    category: '企业动态',
    date: '2024-12-15',
  },
  {
    id: 2,
    title: '药天下ERP+WMS系统完成重大版本升级',
    summary: '药天下ERP+WMS系统发布6.0版本，新增AI智能预警、云端数据同步等核心功能，全面提升医药企业数字化管理效率，助力客户降本增效。',
    category: '产品动态',
    date: '2024-11-20',
  },
  {
    id: 3,
    title: '深度HIS医院管理系统成功落地全国50家医疗机构',
    summary: '深度HIS系统凭借稳定性高、功能全面的优势，已成功为全国50家医疗机构提供数字化管理服务，用户满意度持续保持行业领先水平。',
    category: '企业动态',
    date: '2024-10-10',
  },
  {
    id: 4,
    title: '智慧养老平台完成新一轮功能迭代',
    summary: '药天下智慧养老平台新增健康档案管理、远程医疗对接、家属实时查看等功能，进一步完善养老服务数字化体系，提升老年人生活品质。',
    category: '产品动态',
    date: '2024-09-05',
  },
  {
    id: 5,
    title: '流通码中台系统助力医药追溯体系建设',
    summary: '药天下流通码中台系统已与多家医药流通企业完成对接，实现药品全链路追溯，有效保障药品安全，助力国家医药监管政策落地执行。',
    category: '行业资讯',
    date: '2024-08-18',
  },
  {
    id: 6,
    title: '药天下科技参加2024中国医药信息化大会',
    summary: '药天下科技受邀参加2024中国医药信息化大会，展示了公司在医药ERP、HIS、智慧养老等领域的最新成果，获得业界广泛关注。',
    category: '企业动态',
    date: '2024-07-22',
  },
]

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
}

onMounted(async () => {
  loading.value = true
  try {
    const res = await fetch(`${API_BASE}/news`)
    const data = await res.json()
    if (data.success && data.data.length > 0) {
      newsList.value = data.data
    }
  } catch {
    // 后端不可用时使用静态数据
  } finally {
    loading.value = false
  }
})
</script>
