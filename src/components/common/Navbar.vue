<template>
  <nav
    :class="[
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      scrolled
        ? (isDark ? 'bg-brand-bg/95 backdrop-blur-md shadow-lg shadow-black/20' : 'bg-white/95 backdrop-blur-md shadow-lg shadow-black/10')
        : (isDark ? 'bg-transparent' : 'bg-white/80 backdrop-blur-sm')
    ]"
  >
    <div class="w-full px-6 lg:px-12">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <RouterLink to="/" class="flex items-center gap-3 flex-shrink-0">
          <div class="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-white text-sm"
               style="background: linear-gradient(135deg, #00D4FF, #0066FF);">药</div>
          <div>
            <div :class="['font-bold text-base leading-tight', isDark ? 'text-white' : 'text-gray-900']">药天下科技</div>
            <div class="text-xs text-primary font-display tracking-wider">YAOTIANXIA TECH</div>
          </div>
        </RouterLink>

        <!-- Desktop Nav -->
        <div class="hidden lg:flex items-center gap-1">

          <!-- 首页 -->
          <RouterLink
            to="/"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
              isDark ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
              isActive('/') ? (isDark ? 'text-primary bg-primary/10' : 'text-blue-600 bg-blue-50') : ''
            ]"
          >首页</RouterLink>

          <!-- 产品中心 -->
          <RouterLink
            to="/products"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
              isDark ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
              isActive('/products') ? (isDark ? 'text-primary bg-primary/10' : 'text-blue-600 bg-blue-50') : ''
            ]"
          >产品中心</RouterLink>

          <!-- 解决方案下拉（紧跟产品中心之后） -->
          <div class="relative" @mouseenter="openDropdown" @mouseleave="scheduleClose">
            <div class="flex items-center gap-1">
              <RouterLink
                to="/solutions"
                :class="[
                  'px-4 py-2 rounded-l-lg text-sm font-medium transition-all duration-200',
                  isDark
                    ? 'text-white/80 hover:text-white hover:bg-white/10'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
                  isActive('/solutions')
                    ? (isDark ? 'text-primary bg-primary/10' : 'text-blue-600 bg-blue-50')
                    : ''
                ]"
              >解决方案</RouterLink>
              <button
                :class="[
                  'px-1 py-2 rounded-r-lg text-sm transition-all duration-200',
                  isDark ? 'text-white/60 hover:text-white hover:bg-white/10' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100',
                  dropdownOpen ? 'rotate-180' : ''
                ]"
                style="transform-origin: center;"
                @click.prevent="toggleDropdown"
              >
                <svg class="w-3 h-3 transition-transform duration-200" :class="dropdownOpen ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            <!-- 下拉菜单 -->
            <Transition name="dropdown">
              <div
                v-if="dropdownOpen"
                :class="[
                  'absolute top-full left-0 mt-2 w-44 rounded-xl overflow-hidden shadow-2xl border',
                  isDark
                    ? 'bg-brand-surface border-brand-border'
                    : 'bg-white border-gray-200'
                ]"
                @mouseenter="cancelClose"
                @mouseleave="scheduleClose"
              >
                <RouterLink
                  v-for="sub in solutionSubItems"
                  :key="sub.path"
                  :to="sub.path"
                  :class="[
                    'block px-4 py-2.5 text-sm transition-all duration-150',
                    isDark
                      ? 'text-white/70 hover:text-primary hover:bg-primary/10'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  ]"
                  @click="dropdownOpen = false"
                >{{ sub.label }}</RouterLink>
              </div>
            </Transition>
          </div>

          <!-- 关于我们（带下拉菜单） -->
          <div class="relative" @mouseenter="openAboutDropdown" @mouseleave="scheduleAboutClose">
            <div class="flex items-center gap-0">
              <RouterLink
                to="/about"
                :class="[
                  'px-4 py-2 rounded-l-lg text-sm font-medium transition-all duration-200',
                  isDark ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
                  isActive('/about') ? (isDark ? 'text-primary bg-primary/10' : 'text-blue-600 bg-blue-50') : ''
                ]"
              >关于我们</RouterLink>
              <button
                :class="[
                  'px-1 py-2 rounded-r-lg text-sm transition-all duration-200',
                  isDark ? 'text-white/60 hover:text-white hover:bg-white/10' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100',
                ]"
                @click.prevent="toggleAboutDropdown"
              >
                <svg class="w-3 h-3 transition-transform duration-200" :class="aboutDropdownOpen ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            <!-- 关于我们下拉菜单 -->
            <Transition name="dropdown">
              <div
                v-if="aboutDropdownOpen"
                :class="[
                  'absolute top-full left-0 mt-2 w-40 rounded-xl overflow-hidden shadow-2xl border',
                  isDark ? 'bg-brand-surface border-brand-border' : 'bg-white border-gray-200'
                ]"
                @mouseenter="cancelAboutClose"
                @mouseleave="scheduleAboutClose"
              >
                <RouterLink
                  v-for="sub in aboutSubItems"
                  :key="sub.path"
                  :to="sub.path"
                  :class="[
                    'block px-4 py-2.5 text-sm transition-all duration-150',
                    isDark ? 'text-white/70 hover:text-primary hover:bg-primary/10' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  ]"
                  @click="aboutDropdownOpen = false"
                >{{ sub.label }}</RouterLink>
              </div>
            </Transition>
          </div>

          <!-- 合作伙伴 -->
          <RouterLink
            to="/partners"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
              isDark ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
              isActive('/partners') ? (isDark ? 'text-primary bg-primary/10' : 'text-blue-600 bg-blue-50') : ''
            ]"
          >合作伙伴</RouterLink>

          <!-- 寻千里马 -->
          <RouterLink
            to="/talent"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
              isDark ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
              isActive('/talent') ? (isDark ? 'text-primary bg-primary/10' : 'text-blue-600 bg-blue-50') : ''
            ]"
          >寻千里马</RouterLink>

          <!-- 试用下载（高亮） -->
          <RouterLink
            to="/download"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
              'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20',
              isActive('/download') ? 'bg-emerald-500/20 text-emerald-300' : ''
            ]"
          >试用下载</RouterLink>

        </div>

        <!-- Right Side -->
        <div class="hidden lg:flex items-center gap-3">
          <!-- 主题切换 -->
          <button
            @click="toggleTheme"
            :class="[
              'w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200',
              isDark ? 'bg-white/10 text-yellow-300 hover:bg-white/20' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            ]"
            :title="isDark ? '切换到白天模式' : '切换到夜间模式'"
          >
            <svg v-if="isDark" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"/>
            </svg>
            <svg v-else class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
            </svg>
          </button>

          <!-- 电话 -->
          <a href="tel:4006635617" :class="['flex items-center gap-1.5 text-sm', isDark ? 'text-white/70 hover:text-primary' : 'text-gray-600 hover:text-blue-600']">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
            </svg>
            400 663 5617
          </a>

          <!-- 免费咨询 -->
          <RouterLink to="/contact" class="btn-primary text-sm px-4 py-2">免费咨询</RouterLink>
        </div>

        <!-- Mobile Menu Button -->
        <button
          @click="mobileOpen = !mobileOpen"
          :class="['lg:hidden p-2 rounded-lg', isDark ? 'text-white' : 'text-gray-700']"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="!mobileOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <Transition name="mobile-menu">
      <div
        v-if="mobileOpen"
        :class="['lg:hidden border-t px-6 py-4', isDark ? 'bg-brand-surface border-brand-border' : 'bg-white border-gray-200']"
      >
        <div class="flex flex-col gap-1">
          <!-- 首页 -->
          <RouterLink to="/" :class="['px-4 py-2.5 rounded-lg text-sm font-medium', isDark ? 'text-white/80' : 'text-gray-700']" @click="mobileOpen = false">首页</RouterLink>
          <!-- 产品中心 -->
          <RouterLink to="/products" :class="['px-4 py-2.5 rounded-lg text-sm font-medium', isDark ? 'text-white/80' : 'text-gray-700']" @click="mobileOpen = false">产品中心</RouterLink>

          <!-- 解决方案 -->
          <div>
            <div class="flex items-center justify-between">
              <RouterLink
                to="/solutions"
                :class="['px-4 py-2.5 text-sm font-medium flex-1', isDark ? 'text-white/80' : 'text-gray-700']"
                @click="mobileOpen = false"
              >解决方案</RouterLink>
              <button
                @click="mobileSubOpen = !mobileSubOpen"
                :class="['p-2', isDark ? 'text-white/60' : 'text-gray-400']"
              >
                <svg class="w-4 h-4 transition-transform" :class="mobileSubOpen ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
            </div>
            <div v-if="mobileSubOpen" class="pl-4">
              <RouterLink
                v-for="sub in solutionSubItems"
                :key="sub.path"
                :to="sub.path"
                :class="['block px-4 py-2 text-sm', isDark ? 'text-white/60 hover:text-primary' : 'text-gray-500 hover:text-blue-600']"
                @click="mobileOpen = false"
              >{{ sub.label }}</RouterLink>
            </div>
          </div>

          <!-- 关于我们（移动端下拉） -->
          <div>
            <div class="flex items-center justify-between">
              <RouterLink
                to="/about"
                :class="['px-4 py-2.5 text-sm font-medium flex-1', isDark ? 'text-white/80' : 'text-gray-700']"
                @click="mobileOpen = false"
              >关于我们</RouterLink>
              <button
                @click="mobileAboutSubOpen = !mobileAboutSubOpen"
                :class="['p-2', isDark ? 'text-white/60' : 'text-gray-400']"
              >
                <svg class="w-4 h-4 transition-transform" :class="mobileAboutSubOpen ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
            </div>
            <div v-if="mobileAboutSubOpen" class="pl-4">
              <RouterLink
                v-for="sub in aboutSubItems"
                :key="sub.path"
                :to="sub.path"
                :class="['block px-4 py-2 text-sm', isDark ? 'text-white/60 hover:text-primary' : 'text-gray-500 hover:text-blue-600']"
                @click="mobileOpen = false"
              >{{ sub.label }}</RouterLink>
            </div>
          </div>
          <!-- 合作伙伴 -->
          <RouterLink to="/partners" :class="['px-4 py-2.5 rounded-lg text-sm font-medium', isDark ? 'text-white/80' : 'text-gray-700']" @click="mobileOpen = false">合作伙伴</RouterLink>
          <!-- 寻千里马 -->
          <RouterLink to="/talent" :class="['px-4 py-2.5 rounded-lg text-sm font-medium', isDark ? 'text-white/80' : 'text-gray-700']" @click="mobileOpen = false">寻千里马</RouterLink>
          <!-- 试用下载 -->
          <RouterLink to="/download" class="px-4 py-2.5 rounded-lg text-sm font-medium text-emerald-400 bg-emerald-500/10" @click="mobileOpen = false">试用下载</RouterLink>

          <div :class="['border-t my-2', isDark ? 'border-brand-border' : 'border-gray-200']"></div>
          <button
            @click="toggleTheme"
            :class="['px-4 py-2.5 text-sm text-left rounded-lg', isDark ? 'text-white/80' : 'text-gray-700']"
          >{{ isDark ? '☀️ 切换白天模式' : '🌙 切换夜间模式' }}</button>
          <RouterLink to="/contact" class="btn-primary text-center mt-2" @click="mobileOpen = false">免费咨询</RouterLink>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useTheme } from '../../composables/useTheme'

const { theme, toggleTheme } = useTheme()
const isDark = computed(() => theme.value === 'dark')
const route = useRoute()

const scrolled = ref(false)
const dropdownOpen = ref(false)
const aboutDropdownOpen = ref(false)
const mobileOpen = ref(false)
const mobileSubOpen = ref(false)
const mobileAboutSubOpen = ref(false)
let closeTimer: ReturnType<typeof setTimeout> | null = null
let aboutCloseTimer: ReturnType<typeof setTimeout> | null = null

const aboutSubItems = [
  { label: '企业动态', path: '/news' },
  { label: '联系我们', path: '/contact' },
  { label: '文档下载', path: '/doc-download' },
  { label: '申请试用', path: '/trial-apply' },
  { label: '项目报备', path: '/project-report' },
]

const solutionSubItems = [
  { label: '药品三方物流', path: '/solutions/logistics' },
  { label: '医药供应链', path: '/solutions/supply-chain' },
  { label: '智慧医疗', path: '/solutions/smart-medical' },
  { label: '医养结合系统', path: '/solutions/medical-care' },
  { label: '智慧养老', path: '/solutions/elder-care' },
  { label: 'WMS系统', path: '/solutions/wms' },
]

function isActive(path: string) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

function openDropdown() {
  if (closeTimer) clearTimeout(closeTimer)
  dropdownOpen.value = true
}
function scheduleClose() {
  closeTimer = setTimeout(() => { dropdownOpen.value = false }, 300)
}
function cancelClose() {
  if (closeTimer) clearTimeout(closeTimer)
}
function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value
}

function openAboutDropdown() {
  if (aboutCloseTimer) clearTimeout(aboutCloseTimer)
  aboutDropdownOpen.value = true
}
function scheduleAboutClose() {
  aboutCloseTimer = setTimeout(() => { aboutDropdownOpen.value = false }, 300)
}
function cancelAboutClose() {
  if (aboutCloseTimer) clearTimeout(aboutCloseTimer)
}
function toggleAboutDropdown() {
  aboutDropdownOpen.value = !aboutDropdownOpen.value
}

function handleScroll() {
  scrolled.value = window.scrollY > 20
}

onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<style scoped>
.dropdown-enter-active, .dropdown-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.dropdown-enter-from, .dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.mobile-menu-enter-active, .mobile-menu-leave-active {
  transition: opacity 0.2s ease, max-height 0.3s ease;
  overflow: hidden;
  max-height: 500px;
}
.mobile-menu-enter-from, .mobile-menu-leave-to {
  opacity: 0;
  max-height: 0;
}
</style>
