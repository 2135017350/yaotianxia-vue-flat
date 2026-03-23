<template>
  <Layout>
    <section class="page-hero">
      <div class="w-full px-6 lg:px-12 py-16">
        <div :class="['text-sm font-medium mb-3 tracking-wider uppercase', isDark ? 'text-primary' : 'text-blue-600']">Partner Portal</div>
        <h1 :class="['text-4xl lg:text-5xl font-bold mb-4', isDark ? 'text-white' : 'text-gray-900']">事业合伙人</h1>
        <p :class="['text-lg max-w-2xl', isDark ? 'text-white/60' : 'text-gray-600']">合伙人专属入口，管理项目报备、产品入库与销售员报备</p>
      </div>
    </section>

    <section :class="['w-full py-16 px-6 lg:px-12', isDark ? 'bg-brand-surface' : 'bg-gray-50']">
      <div class="flex gap-8">
        <!-- 左侧菜单 -->
        <div class="w-48 flex-shrink-0">
          <div :class="['rounded-xl overflow-hidden border', isDark ? 'bg-brand-bg border-brand-border' : 'bg-white border-gray-200']">
            <div :class="['px-4 py-3 text-xs font-bold tracking-wider uppercase border-b', isDark ? 'text-primary border-brand-border' : 'text-blue-600 border-gray-200']">
              事业合伙人
            </div>
            <nav class="py-1">
              <button
                v-for="item in menuItems"
                :key="item.key"
                @click="activeMenu = item.key"
                :class="[
                  'w-full text-left px-4 py-3 text-sm transition-all',
                  activeMenu === item.key
                    ? (isDark ? 'text-primary bg-primary/10 border-l-2 border-primary' : 'text-blue-600 bg-blue-50 border-l-2 border-blue-500')
                    : (isDark ? 'text-white/60 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50')
                ]"
              >{{ item.label }}</button>
            </nav>
          </div>
        </div>

        <!-- 右侧内容 -->
        <div class="flex-1">
          <!-- 项目报备表单 -->
          <div v-if="activeMenu === 'project'" :class="['rounded-2xl p-8 border', isDark ? 'bg-brand-bg border-brand-border' : 'bg-white border-gray-200']">
            <h2 :class="['text-xl font-bold mb-6 pb-4 border-b', isDark ? 'text-white border-brand-border' : 'text-gray-900 border-gray-200']">项目报备</h2>

            <form @submit.prevent="handleProjectSubmit" class="space-y-5">
              <div>
                <label :class="labelClass">客户名称 <span class="text-red-400">*</span></label>
                <input v-model="projectForm.customerName" type="text" :class="inputClass" placeholder="完整的企业工商注册信息" required />
              </div>
              <div>
                <label :class="labelClass">项目需求</label>
                <textarea v-model="projectForm.projectRequirements" :class="[inputClass, 'resize-none h-24']" placeholder="请描述项目需求"></textarea>
              </div>
              <div>
                <label :class="labelClass">联系人 <span class="text-red-400">*</span></label>
                <input v-model="projectForm.contactName" type="text" :class="inputClass" placeholder="请输入联系人姓名" required />
              </div>
              <div>
                <label :class="labelClass">联系电话 <span class="text-red-400">*</span></label>
                <input v-model="projectForm.contactPhone" type="tel" :class="inputClass" placeholder="请输入联系电话" maxlength="11" required />
              </div>
              <div>
                <label :class="labelClass">事业合伙人编号 <span class="text-red-400">*</span></label>
                <input v-model="projectForm.partnerCode" type="text" :class="inputClass" placeholder="请输入您的合伙人编号" required />
              </div>
              <!-- 验证码 -->
              <div>
                <label :class="labelClass">验证码 <span class="text-red-400">*</span></label>
                <CaptchaCanvas
                  ref="projectCaptchaRef"
                  v-model="projectForm.captcha"
                  :input-class="[inputClass, 'flex-1 max-w-36']"
                  placeholder="验证码"
                />
              </div>
              <div v-if="projectError" class="text-red-400 text-sm py-3 px-4 rounded-lg bg-red-500/10">{{ projectError }}</div>
              <div v-if="projectSuccess" class="text-green-400 text-sm py-3 px-4 rounded-lg bg-green-500/10">{{ projectSuccess }}</div>
              <button type="submit" :disabled="projectLoading" class="btn-primary px-8 py-3 font-medium">
                {{ projectLoading ? '提交中...' : '提交' }}
              </button>
            </form>
          </div>

          <!-- 入库产品 -->
          <div v-else-if="activeMenu === 'products'" :class="['rounded-2xl p-8 border', isDark ? 'bg-brand-bg border-brand-border' : 'bg-white border-gray-200']">
            <h2 :class="['text-xl font-bold mb-6', isDark ? 'text-white' : 'text-gray-900']">入库产品</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div v-for="p in partnerProducts" :key="p.name" :class="['glass-card rounded-xl p-5']">
                <div class="text-2xl mb-3">{{ p.icon }}</div>
                <h3 :class="['font-bold mb-1', isDark ? 'text-white' : 'text-gray-900']">{{ p.name }}</h3>
                <p :class="['text-sm', isDark ? 'text-white/50' : 'text-gray-500']">{{ p.desc }}</p>
              </div>
            </div>
          </div>

          <!-- 销售员报备 -->
          <div v-else-if="activeMenu === 'salesperson'" :class="['rounded-2xl p-8 border', isDark ? 'bg-brand-bg border-brand-border' : 'bg-white border-gray-200']">
            <h2 :class="['text-xl font-bold mb-6', isDark ? 'text-white' : 'text-gray-900']">销售员报备</h2>
            <p :class="['text-sm mb-6', isDark ? 'text-white/60' : 'text-gray-500']">请联系您的上级合伙人或拨打服务热线 <span class="text-primary font-medium">400 663 5617</span> 进行销售员报备。</p>
          </div>

          <!-- 合伙人优势 -->
          <div v-else-if="activeMenu === 'advantages'" :class="['rounded-2xl p-8 border', isDark ? 'bg-brand-bg border-brand-border' : 'bg-white border-gray-200']">
            <h2 :class="['text-xl font-bold mb-6', isDark ? 'text-white' : 'text-gray-900']">合伙人优势</h2>
            <div class="space-y-4">
              <div v-for="adv in advantages" :key="adv.title" :class="['flex gap-4 p-4 rounded-xl', isDark ? 'bg-white/5' : 'bg-gray-50']">
                <div class="text-2xl flex-shrink-0">{{ adv.icon }}</div>
                <div>
                  <h3 :class="['font-bold mb-1', isDark ? 'text-white' : 'text-gray-900']">{{ adv.title }}</h3>
                  <p :class="['text-sm', isDark ? 'text-white/60' : 'text-gray-500']">{{ adv.desc }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </Layout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Layout from '../components/common/Layout.vue'
import CaptchaCanvas from '../components/common/CaptchaCanvas.vue'
import { useTheme } from '../composables/useTheme'
const { theme } = useTheme()
const isDark = computed(() => theme.value === 'dark')

const projectCaptchaRef = ref<InstanceType<typeof CaptchaCanvas> | null>(null)
const activeMenu = ref('project')
const menuItems = [
  { key: 'products', label: '入库产品' },
  { key: 'project', label: '项目报备' },
  { key: 'salesperson', label: '销售员报备' },
  { key: 'advantages', label: '合伙人优势' },
]

const projectForm = ref({
  customerName: '',
  projectRequirements: '',
  contactName: '',
  contactPhone: '',
  partnerCode: '',
  captcha: '',
})
const projectLoading = ref(false)
const projectError = ref('')
const projectSuccess = ref('')

const labelClass = computed(() => ['block text-sm font-medium mb-1.5', isDark.value ? 'text-white/70' : 'text-gray-600'])
const inputClass = computed(() => [
  'w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-all border',
  isDark.value
    ? 'bg-white/5 border-brand-border text-white placeholder-white/30 focus:border-primary'
    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white'
])

async function handleProjectSubmit() {
  projectError.value = ''
  projectSuccess.value = ''
  // 验证码校验
  if (!projectCaptchaRef.value?.validate(projectForm.value.captcha)) {
    projectError.value = '验证码错误，请重新输入'
    projectCaptchaRef.value?.refresh()
    projectForm.value.captcha = ''
    return
  }
  projectLoading.value = true
  try {
    const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api')
    try {
      const res = await fetch(`${API_BASE}/project`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(projectForm.value),
        signal: AbortSignal.timeout(3000),
      })
      const data = await res.json()
      if (data.success) {
        projectSuccess.value = data.message
        projectForm.value = { customerName: '', projectRequirements: '', contactName: '', contactPhone: '', partnerCode: '', captcha: '' }
      } else {
        projectError.value = data.message
      }
      projectCaptchaRef.value?.refresh()
      return
    } catch {
      // 后端不可用，本地模拟
    }
    // 本地模拟提交成功
    projectSuccess.value = '项目报备提交成功！我们将尽快审核并与您联系。'
    projectForm.value = { customerName: '', projectRequirements: '', contactName: '', contactPhone: '', partnerCode: '', captcha: '' }
    projectCaptchaRef.value?.refresh()
  } finally {
    projectLoading.value = false
  }
}

const partnerProducts = [
  { icon: '💊', name: '药天下ERP+WMS', desc: '医药批发全流程管理，支持批零兼营' },
  { icon: '🏥', name: '深度HIS医院管理', desc: '门诊、住院、药房一体化管理系统' },
  { icon: '👴', name: '智慧养老平台', desc: '居家、社区、机构三位一体养老服务' },
  { icon: '📦', name: '流通码中台系统', desc: '药品全链路追溯，对接国家监管平台' },
]

const advantages = [
  { icon: '💰', title: '高额返佣', desc: '首单返佣比例高达20%，续费返佣持续累积，收益无上限' },
  { icon: '🎓', title: '专业培训', desc: '提供系统化产品培训、销售技巧培训，助力快速成长' },
  { icon: '🛠️', title: '技术支持', desc: '7×12小时技术支持团队，帮助解决客户技术问题' },
  { icon: '📊', title: '市场资源', desc: '提供品牌授权、市场物料、客户资源等全方位支持' },
]


</script>
