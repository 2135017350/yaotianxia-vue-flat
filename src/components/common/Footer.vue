<template>
  <footer :class="['w-full border-t', isDark ? 'bg-brand-bg border-brand-border' : 'bg-gray-100 border-gray-200']">
    <div class="w-full px-6 lg:px-12 py-12">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- 公司信息 -->
        <div class="lg:col-span-1">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-white text-sm"
                 style="background: linear-gradient(135deg, #00D4FF, #0066FF);">药</div>
            <div>
              <div :class="['font-bold text-base', isDark ? 'text-white' : 'text-gray-900']">药天下科技</div>
              <div class="text-xs text-primary font-display">YAOTIANXIA TECH</div>
            </div>
          </div>
          <p :class="['text-sm leading-relaxed mb-4', isDark ? 'text-white/50' : 'text-gray-500']">
            北京药天下科技有限公司，专注医药管理软件14年，为医药行业提供一体化数字管理解决方案。
          </p>
          <div :class="['text-xs', isDark ? 'text-white/40' : 'text-gray-400']">旗下4家公司 · 客户遍布全国</div>
        </div>

        <!-- 核心产品 -->
        <div>
          <h4 :class="['font-semibold mb-4 text-sm', isDark ? 'text-white' : 'text-gray-900']">核心产品</h4>
          <ul class="space-y-2">
            <li v-for="item in products" :key="item.path">
              <RouterLink :to="item.path" :class="['text-sm transition-colors', isDark ? 'text-white/50 hover:text-primary' : 'text-gray-500 hover:text-blue-600']">
                {{ item.label }}
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- 解决方案 -->
        <div>
          <h4 :class="['font-semibold mb-4 text-sm', isDark ? 'text-white' : 'text-gray-900']">解决方案</h4>
          <ul class="space-y-2">
            <li v-for="item in solutions" :key="item.path">
              <RouterLink :to="item.path" :class="['text-sm transition-colors', isDark ? 'text-white/50 hover:text-primary' : 'text-gray-500 hover:text-blue-600']">
                {{ item.label }}
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- 联系方式 -->
        <div>
          <h4 :class="['font-semibold mb-4 text-sm', isDark ? 'text-white' : 'text-gray-900']">联系我们</h4>
          <ul class="space-y-3">
            <li class="flex items-start gap-2">
              <span class="text-primary mt-0.5">📞</span>
              <div>
                <div :class="['text-xs mb-0.5', isDark ? 'text-white/70' : 'text-gray-500']">服务热线</div>
                <a href="tel:4006635617" :class="['text-sm hover:text-primary transition-colors', isDark ? 'text-white' : 'text-gray-800']">400 663 5617</a>
              </div>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-primary mt-0.5">💬</span>
              <div>
                <div :class="['text-xs mb-0.5', isDark ? 'text-white/70' : 'text-gray-500']">销售咨询</div>
                <a href="tel:13503838711" :class="['text-sm hover:text-primary transition-colors', isDark ? 'text-white' : 'text-gray-800']">135-0383-8711</a>
              </div>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-primary mt-0.5">✉️</span>
              <div>
                <div :class="['text-xs mb-0.5', isDark ? 'text-white/70' : 'text-gray-500']">邮箱</div>
                <a href="mailto:1359629003@qq.com" :class="['text-sm hover:text-primary transition-colors', isDark ? 'text-white' : 'text-gray-800']">1359629003@qq.com</a>
              </div>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-primary mt-0.5">📍</span>
              <div>
                <div :class="['text-xs mb-0.5', isDark ? 'text-white/70' : 'text-gray-500']">地址</div>
                <div :class="['text-sm', isDark ? 'text-white/80' : 'text-gray-700']">北京市海淀区北太平庄路18号3层</div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <!-- 底部版权 -->
      <div :class="['border-t mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3', isDark ? 'border-white/10' : 'border-gray-300']">
        <div :class="['text-xs', isDark ? 'text-white/30' : 'text-gray-400']">
          © {{ new Date().getFullYear() }} 北京药天下科技有限公司 版权所有
        </div>
        <div class="flex items-center gap-4">
          <span :class="['text-xs', isDark ? 'text-white/30' : 'text-gray-400']">合作伙伴：</span>
          <span v-for="p in partners" :key="p" :class="['text-xs hover:text-primary/60 transition-colors cursor-default', isDark ? 'text-white/40' : 'text-gray-400']">{{ p }}</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useTheme } from '../../composables/useTheme'

const { theme } = useTheme()
const isDark = computed(() => theme.value === 'dark')

const products = [
  { label: '药天下ERP+WMS', path: '/products' },
  { label: '深度HIS医院管理', path: '/products' },
  { label: '智慧养老平台', path: '/products' },
  { label: '流通码中台系统', path: '/products' },
]

const solutions = [
  { label: '药品三方物流', path: '/solutions/logistics' },
  { label: '医药供应链', path: '/solutions/supply-chain' },
  { label: '智慧医疗', path: '/solutions/smart-medical' },
  { label: '医养结合系统', path: '/solutions/medical-care' },
  { label: '智慧养老', path: '/solutions/elder-care' },
  { label: 'WMS系统', path: '/solutions/wms' },
]

const partners = ['CIMC中集', '阿里健康', '京东健康', '中通医药']
</script>
