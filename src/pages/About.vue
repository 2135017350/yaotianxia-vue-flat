<template>
  <Layout>
    <section class="page-hero">
      <div class="w-full px-6 lg:px-12 py-16">
        <div :class="['text-sm font-medium mb-3 tracking-wider uppercase', isDark ? 'text-primary' : 'text-blue-600']">About Us</div>
        <h1 :class="['text-4xl lg:text-5xl font-bold mb-4', isDark ? 'text-white' : 'text-gray-900']">关于我们</h1>
        <p :class="['text-lg max-w-2xl', isDark ? 'text-white/60' : 'text-gray-600']">
          北京药天下科技有限公司，专注医药管理软件14年，以技术创新驱动医药行业数字化转型
        </p>
      </div>
    </section>

    <!-- 公司简介 -->
    <section :class="['w-full py-20 px-6 lg:px-12', isDark ? 'bg-brand-surface' : 'bg-white']">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 :class="['text-3xl font-bold mb-6', isDark ? 'text-white' : 'text-gray-900']">公司简介</h2>
          <p :class="['text-base leading-relaxed mb-4', isDark ? 'text-white/70' : 'text-gray-600']">
            北京药天下科技有限公司成立于2010年，是一家专注于医药行业管理软件研发的高新技术企业。公司总部位于北京市海淀区，旗下拥有4家子公司，业务覆盖全国19个省市。
          </p>
          <p :class="['text-base leading-relaxed mb-6', isDark ? 'text-white/70' : 'text-gray-600']">
            经过14年的深耕积累，药天下已形成以「药天下ERP+WMS」「深度HIS」「智慧养老」「流通码中台」为核心的完整产品体系，服务超过1000家医药企业和医疗机构。公司以「五流合一」为核心理念，致力于打通医药流通全链路数据，助力医药行业数字化转型。
          </p>
          <div class="grid grid-cols-2 gap-4">
            <div v-for="stat in stats" :key="stat.label" class="glass-card rounded-xl p-4 text-center">
              <div class="text-2xl font-bold gradient-text mb-1">{{ stat.value }}</div>
              <div :class="['text-xs', isDark ? 'text-white/60' : 'text-gray-500']">{{ stat.label }}</div>
            </div>
          </div>
        </div>
        <div class="space-y-4">
          <div v-for="value in coreValues" :key="value.title" class="glass-card rounded-xl p-6 flex items-start gap-4">
            <div class="text-2xl flex-shrink-0">{{ value.icon }}</div>
            <div>
              <h3 :class="['font-bold text-base mb-1', isDark ? 'text-white' : 'text-gray-900']">{{ value.title }}</h3>
              <p :class="['text-sm leading-relaxed', isDark ? 'text-white/60' : 'text-gray-500']">{{ value.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 发展历程 -->
    <section :class="['w-full py-20 px-6 lg:px-12', isDark ? 'bg-brand-bg' : 'bg-gray-50']">
      <div class="text-center mb-12">
        <div :class="['text-sm font-medium mb-2 tracking-wider uppercase', isDark ? 'text-primary' : 'text-blue-600']">Timeline</div>
        <h2 :class="['text-3xl font-bold', isDark ? 'text-white' : 'text-gray-900']">发展历程</h2>
      </div>
      <div class="relative max-w-3xl mx-auto">
        <!-- 时间轴线 -->
        <div class="absolute left-8 top-0 bottom-0 w-px" :style="isDark ? 'background: rgba(0,212,255,0.2)' : 'background: rgba(0,100,200,0.15)'"></div>
        <div class="space-y-8">
          <div v-for="item in timeline" :key="item.year" class="flex items-start gap-6 pl-20 relative">
            <!-- 年份圆点 -->
            <div class="absolute left-4 top-1 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                 style="background: linear-gradient(135deg, #00D4FF, #0066FF); color: white; transform: translateX(-50%)">
              {{ item.year.slice(2) }}
            </div>
            <div class="glass-card rounded-xl p-5 flex-1">
              <div :class="['text-sm font-medium mb-1', isDark ? 'text-primary' : 'text-blue-600']">{{ item.year }}</div>
              <h3 :class="['font-bold text-base mb-1', isDark ? 'text-white' : 'text-gray-900']">{{ item.title }}</h3>
              <p :class="['text-sm', isDark ? 'text-white/60' : 'text-gray-500']">{{ item.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 荣誉资质 -->
    <section :class="['w-full py-20 px-6 lg:px-12', isDark ? 'bg-brand-surface' : 'bg-white']">
      <div class="text-center mb-12">
        <h2 :class="['text-3xl font-bold', isDark ? 'text-white' : 'text-gray-900']">荣誉资质</h2>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div v-for="honor in honors" :key="honor" class="glass-card rounded-xl p-4 text-center">
          <div class="text-2xl mb-2">🏆</div>
          <div :class="['text-sm font-medium', isDark ? 'text-white/80' : 'text-gray-700']">{{ honor }}</div>
        </div>
      </div>
    </section>
  </Layout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Layout from '../components/common/Layout.vue'
import { useTheme } from '../composables/useTheme'

const { theme } = useTheme()
const isDark = computed(() => theme.value === 'dark')

const stats = [
  { value: '14+', label: '年行业深耕' },
  { value: '4', label: '家旗下公司' },
  { value: '19+', label: '省市覆盖' },
  { value: '1000+', label: '家企业客户' },
]

const coreValues = [
  { icon: '🎯', title: '专注医药', desc: '14年只做医药行业，深度理解行业需求，持续打磨产品细节' },
  { icon: '💡', title: '技术创新', desc: '持续投入研发，以云计算、大数据、AI技术驱动产品迭代升级' },
  { icon: '🤝', title: '客户成功', desc: '以客户成功为核心，提供全生命周期的服务支持' },
  { icon: '🌐', title: '生态共建', desc: '与阿里健康、京东健康等头部平台深度合作，共建医药数字生态' },
]

const timeline = [
  { year: '2010', title: '公司成立', desc: '北京药天下科技有限公司在北京海淀区正式成立，开始专注医药管理软件研发' },
  { year: '2013', title: '药天下ERP发布', desc: '推出药天下系列医药管理软件第一版，正式进入药品批发市场' },
  { year: '2016', title: '深度HIS上线', desc: '深度HIS医院管理软件正式发布，开始服务中小型医院和诊所' },
  { year: '2018', title: '流通码中台', desc: '响应国家药品追溯政策，推出流通码中台系统，实现五流合一管理' },
  { year: '2020', title: '智慧养老平台', desc: '智慧养老平台正式发布，进入医养结合赛道，服务养老机构' },
  { year: '2022', title: '战略合作升级', desc: '与CIMC中集、阿里健康、京东健康、中通医药建立深度战略合作' },
  { year: '2024', title: '全面数智化升级', desc: '产品全面融入AI技术，推出智能补货、数据分析等新功能，服务超1000家客户' },
]

const honors = [
  '国家高新技术企业',
  '软件企业认定',
  'ISO9001质量认证',
  '双软认定企业',
  '医药信息化优秀服务商',
  '北京市科技型中小企业',
  'GSP合规认证',
  '知识产权管理体系认证',
]
</script>
