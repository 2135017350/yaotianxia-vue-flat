<template>
  <Layout>
    <!-- Page Hero -->
    <section class="page-hero">
      <div class="w-full px-6 lg:px-12 py-16">
        <div :class="['text-sm font-medium mb-3 tracking-wider uppercase', isDark ? 'text-primary' : 'text-blue-600']">Products</div>
        <h1 :class="['text-4xl lg:text-5xl font-bold mb-4', isDark ? 'text-white' : 'text-gray-900']">产品中心</h1>
        <p :class="['text-lg max-w-2xl', isDark ? 'text-white/60' : 'text-gray-600']">
          覆盖医药流通全链路的专业管理软件，14年深耕行业，持续迭代进化
        </p>
      </div>
    </section>

    <!-- 核心产品 -->
    <section :class="['w-full py-20 px-6 lg:px-12', isDark ? 'bg-brand-surface' : 'bg-white']">
      <div class="text-center mb-12">
        <div :class="['text-sm font-medium mb-2 tracking-wider uppercase', isDark ? 'text-primary' : 'text-blue-600']">Core Products</div>
        <h2 :class="['text-3xl font-bold', isDark ? 'text-white' : 'text-gray-900']">四大核心产品</h2>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div v-for="product in coreProducts" :key="product.title" class="glass-card rounded-2xl p-8">
          <div class="flex items-start gap-4 mb-6">
            <div class="text-4xl">{{ product.icon }}</div>
            <div>
              <h3 :class="['font-bold text-xl mb-1', isDark ? 'text-white' : 'text-gray-900']">{{ product.title }}</h3>
              <div :class="['text-sm', isDark ? 'text-primary' : 'text-blue-600']">{{ product.sub }}</div>
            </div>
          </div>
          <p :class="['text-sm leading-relaxed mb-6', isDark ? 'text-white/60' : 'text-gray-600']">{{ product.desc }}</p>
          <div class="grid grid-cols-2 gap-2">
            <div
              v-for="feature in product.features"
              :key="feature"
              :class="['flex items-center gap-2 text-sm', isDark ? 'text-white/70' : 'text-gray-600']"
            >
              <span class="text-primary">✓</span>
              {{ feature }}
            </div>
          </div>
          <div class="mt-6 pt-6 border-t" :class="isDark ? 'border-white/10' : 'border-gray-100'">
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in product.tags"
                :key="tag"
                class="text-xs px-3 py-1 rounded-full"
                :style="isDark ? 'background: rgba(0,212,255,0.1); color: #00D4FF' : 'background: rgba(0,100,200,0.08); color: #0066CC'"
              >{{ tag }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 更多产品 -->
    <section :class="['w-full py-20 px-6 lg:px-12', isDark ? 'bg-brand-bg' : 'bg-gray-50']">
      <div class="text-center mb-12">
        <h2 :class="['text-3xl font-bold', isDark ? 'text-white' : 'text-gray-900']">更多产品</h2>
        <p :class="['mt-3', isDark ? 'text-white/60' : 'text-gray-500']">满足不同场景的专业化需求</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="p in moreProducts" :key="p.title" class="glass-card rounded-xl p-6">
          <div class="text-2xl mb-3">{{ p.icon }}</div>
          <h3 :class="['font-bold text-base mb-2', isDark ? 'text-white' : 'text-gray-900']">{{ p.title }}</h3>
          <p :class="['text-sm leading-relaxed', isDark ? 'text-white/60' : 'text-gray-500']">{{ p.desc }}</p>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="w-full py-16 px-6 lg:px-12 text-center"
             :style="isDark ? 'background: linear-gradient(135deg, #070E1A 0%, #0D1B2E 100%)' : 'background: linear-gradient(135deg, #EBF8FF 0%, #DBEAFE 60%, #EDE9FE 100%)'"  >
      <h2 class="text-2xl lg:text-3xl font-bold text-white mb-4">想了解更多产品详情？</h2>
      <p class="text-white/60 mb-8">联系我们获取专属演示和报价</p>
      <div class="flex flex-wrap gap-4 justify-center">
        <RouterLink to="/contact" class="btn-primary px-8 py-3">联系销售</RouterLink>
        <RouterLink to="/download" class="btn-secondary px-8 py-3">免费试用</RouterLink>
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

const coreProducts = [
  {
    icon: '💊',
    title: '药天下系列医药管理软件',
    sub: 'ERP + WMS 一体化解决方案',
    desc: '专为药品批发企业和连锁药店设计，覆盖采购、销售、库存、财务全流程管理，支持GSP合规要求，内置药品追溯功能，与国家药品监管平台无缝对接。',
    features: ['进销存一体化', 'GSP合规管理', '财务自动对账', '药品追溯上报', '多仓库管理', '批次效期管理', '连锁总部管控', '移动端支持'],
    tags: ['药品批发', '连锁药店', 'GSP合规', '药品追溯'],
  },
  {
    icon: '🏥',
    title: '深度HIS医院管理软件',
    sub: '中小型医院一体化管理系统',
    desc: '专为中小型医院、诊所、门诊部设计的医院信息管理系统，覆盖门诊挂号、电子病历、医嘱处理、药房管理、住院管理、财务结算等全流程业务。',
    features: ['门诊挂号收费', '电子病历', '医嘱处理', '药房管理', '住院管理', '检验检查', '财务结算', '统计报表'],
    tags: ['中小医院', '诊所', '门诊管理', '电子病历'],
  },
  {
    icon: '🏠',
    title: '智慧养老平台',
    sub: '机构+居家双模式养老管理',
    desc: '整合机构养老与居家养老服务，提供老人档案管理、健康监测、服务调度、家属互动等功能，打通医养结合全链路，助力养老机构数字化转型。',
    features: ['老人档案管理', '健康状态监测', '服务工单调度', '家属小程序', '床位管理', '费用结算', '政府数据上报', '医养结合'],
    tags: ['养老机构', '居家养老', '医养结合', '智慧养老'],
  },
  {
    icon: '🔗',
    title: '流通码中台系统',
    sub: '药品全链路追溯与五流合一',
    desc: '基于国家药品监督管理局药品追溯码体系，构建企业级数据中台，实现商流、物流、资金流、信息流、票据流五流同步，打通上下游数据孤岛。',
    features: ['追溯码管理', '五流数据同步', '上下游对接', '数据可视化', '合规报告', '异常预警', 'API开放接口', '多系统集成'],
    tags: ['药品追溯', '五流合一', '数据中台', '合规管理'],
  },
]

const moreProducts = [
  { icon: '🏪', title: '医疗器械管理系统', desc: '覆盖医疗器械经营全流程，支持二类三类器械的进销存和追溯管理' },
  { icon: '🛒', title: '医药电商平台', desc: '支持B2B/B2C医药电商运营，对接主流电商平台，实现线上线下一体化' },
  { icon: '🏛️', title: '医馆管理系统', desc: '专为中医馆、国医堂设计，支持中药饮片管理、名医坐诊、膏方定制' },
  { icon: '📱', title: '药店管家APP', desc: '药店老板专属移动管理工具，随时随地掌握门店经营数据' },
  { icon: '🏢', title: '药天下办公管理系统', desc: '企业内部OA办公系统，支持审批流程、任务管理、考勤打卡' },
  { icon: '📊', title: 'BI数据分析平台', desc: '多维度经营数据分析，可视化报表，助力管理层科学决策' },
]
</script>
