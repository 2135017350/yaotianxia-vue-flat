<template>
  <Layout>
    <section class="page-hero">
      <div class="w-full px-6 lg:px-12 py-16">
        <div :class="['text-sm font-medium mb-3 tracking-wider uppercase', isDark ? 'text-primary' : 'text-blue-600']">Contact Us</div>
        <h1 :class="['text-4xl lg:text-5xl font-bold mb-4', isDark ? 'text-white' : 'text-gray-900']">联系我们</h1>
        <p :class="['text-lg max-w-2xl', isDark ? 'text-white/60' : 'text-gray-600']">
          专业顾问团队随时为您服务，欢迎来电咨询或留言
        </p>
      </div>
    </section>

    <section :class="['w-full py-20 px-6 lg:px-12', isDark ? 'bg-brand-surface' : 'bg-white']">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- 联系信息 -->
        <div>
          <h2 :class="['text-2xl font-bold mb-8', isDark ? 'text-white' : 'text-gray-900']">联系方式</h2>
          <div class="space-y-6">
            <div v-for="info in contactInfos" :key="info.label" class="flex items-start gap-4">
              <div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-xl"
                   style="background: rgba(0,212,255,0.1)">{{ info.icon }}</div>
              <div>
                <div :class="['text-sm mb-1', isDark ? 'text-white/50' : 'text-gray-400']">{{ info.label }}</div>
                <div :class="['font-medium text-base', isDark ? 'text-white' : 'text-gray-900']">{{ info.value }}</div>
                <div v-if="info.sub" :class="['text-sm mt-0.5', isDark ? 'text-white/50' : 'text-gray-500']">{{ info.sub }}</div>
              </div>
            </div>
          </div>

          <!-- 工作时间 -->
          <div class="mt-10 glass-card rounded-xl p-6">
            <h3 :class="['font-bold text-base mb-4', isDark ? 'text-white' : 'text-gray-900']">服务时间</h3>
            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span :class="isDark ? 'text-white/60' : 'text-gray-500'">周一至周五</span>
                <span :class="isDark ? 'text-white/80' : 'text-gray-700'">09:00 - 18:00</span>
              </div>
              <div class="flex justify-between text-sm">
                <span :class="isDark ? 'text-white/60' : 'text-gray-500'">周六至周日</span>
                <span :class="isDark ? 'text-white/80' : 'text-gray-700'">10:00 - 17:00</span>
              </div>
              <div class="flex justify-between text-sm">
                <span :class="isDark ? 'text-white/60' : 'text-gray-500'">售后支持</span>
                <span class="text-primary font-medium">7×24 小时</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 在线咨询表单 -->
        <div>
          <h2 :class="['text-2xl font-bold mb-8', isDark ? 'text-white' : 'text-gray-900']">在线咨询</h2>
          <div class="glass-card rounded-2xl p-8 space-y-5">
            <!-- 成功提示 -->
            <div v-if="submitted" :class="['p-4 rounded-lg text-sm flex items-center gap-3', isDark ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-green-50 text-green-600 border border-green-200']">
              <span class="text-lg">✓</span>
              <div>
                <div class="font-medium">提交成功！</div>
                <div class="text-xs opacity-80">感谢您的留言，我们会尽快与您联系。</div>
              </div>
            </div>

            <!-- 错误提示 -->
            <div v-if="errorMessage" :class="['p-4 rounded-lg text-sm flex items-center gap-3', isDark ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-red-50 text-red-600 border border-red-200']">
              <span class="text-lg">✕</span>
              <div>{{ errorMessage }}</div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label :class="['block text-sm mb-1.5 font-medium', isDark ? 'text-white/70' : 'text-gray-600']">您的姓名 <span class="text-red-500">*</span></label>
                <input
                  v-model="form.name"
                  type="text"
                  placeholder="请输入姓名"
                  :disabled="loading"
                  :class="['w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-colors', isDark ? 'bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-primary disabled:opacity-50' : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500 disabled:opacity-50']"
                />
              </div>
              <div>
                <label :class="['block text-sm mb-1.5 font-medium', isDark ? 'text-white/70' : 'text-gray-600']">电子邮箱 <span class="text-red-500">*</span></label>
                <input
                  v-model="form.email"
                  type="email"
                  placeholder="请输入邮箱"
                  :disabled="loading"
                  :class="['w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-colors', isDark ? 'bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-primary disabled:opacity-50' : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500 disabled:opacity-50']"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label :class="['block text-sm mb-1.5 font-medium', isDark ? 'text-white/70' : 'text-gray-600']">联系电话</label>
                <input
                  v-model="form.phone"
                  type="tel"
                  placeholder="请输入手机号"
                  :disabled="loading"
                  :class="['w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-colors', isDark ? 'bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-primary disabled:opacity-50' : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500 disabled:opacity-50']"
                />
              </div>
              <div>
                <label :class="['block text-sm mb-1.5 font-medium', isDark ? 'text-white/70' : 'text-gray-600']">公司名称</label>
                <input
                  v-model="form.company"
                  type="text"
                  placeholder="请输入公司名称"
                  :disabled="loading"
                  :class="['w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-colors', isDark ? 'bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-primary disabled:opacity-50' : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500 disabled:opacity-50']"
                />
              </div>
            </div>

            <div>
              <label :class="['block text-sm mb-1.5 font-medium', isDark ? 'text-white/70' : 'text-gray-600']">咨询主题 <span class="text-red-500">*</span></label>
              <input
                v-model="form.subject"
                type="text"
                placeholder="请输入咨询主题"
                :disabled="loading"
                :class="['w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-colors', isDark ? 'bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-primary disabled:opacity-50' : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500 disabled:opacity-50']"
              />
            </div>

            <div>
              <label :class="['block text-sm mb-1.5 font-medium', isDark ? 'text-white/70' : 'text-gray-600']">咨询内容 <span class="text-red-500">*</span></label>
              <textarea
                v-model="form.message"
                rows="4"
                placeholder="请详细描述您的需求或问题..."
                :disabled="loading"
                :class="['w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-colors resize-none', isDark ? 'bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-primary disabled:opacity-50' : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500 disabled:opacity-50']"
              ></textarea>
            </div>

            <button 
              type="button" 
              @click="handleSubmit"
              :disabled="loading || submitted" 
              class="btn-primary w-full py-3 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {{ loading ? '提交中...' : submitted ? '✓ 提交成功' : '提交咨询' }}
            </button>
          </div>
        </div>
      </div>
    </section>
  </Layout>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import Layout from '../components/common/Layout.vue'
import { useTheme } from '../composables/useTheme'

const { theme } = useTheme()
const isDark = computed(() => theme.value === 'dark')

const submitted = ref(false)
const loading = ref(false)
const errorMessage = ref('')
const form = ref({
  name: '',
  email: '',
  phone: '',
  company: '',
  subject: '',
  message: ''
})

onMounted(() => {
  console.log('[DEBUG] 联系我们页面已加载')
})

async function handleSubmit() {
  console.log('[DEBUG] handleSubmit 被触发')
  
  // 基本验证
  if (!form.value.name || !form.value.email || !form.value.subject || !form.value.message) {
    errorMessage.value = '请填写所有必填项'
    console.warn('[DEBUG] 验证失败: 必填项缺失')
    return
  }

  // 邮箱格式验证
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(form.value.email)) {
    errorMessage.value = '请输入有效的邮箱地址'
    console.warn('[DEBUG] 验证失败: 邮箱格式错误')
    return
  }

  loading.value = true
  errorMessage.value = ''

  console.log('[DEBUG] 准备提交留言:', JSON.parse(JSON.stringify(form.value)))
  
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: form.value.name,
        email: form.value.email,
        phone: form.value.phone || undefined,
        company: form.value.company || undefined,
        subject: form.value.subject,
        message: form.value.message,
      }),
      credentials: 'include',
    })

    console.log('[DEBUG] 收到响应状态:', response.status, response.statusText)
    const data = await response.json()
    console.log('[DEBUG] 响应数据:', data)

    if (!data.success) {
      errorMessage.value = data.message || '提交失败，请稍后重试'
      return
    }

    submitted.value = true
    form.value = {
      name: '',
      email: '',
      phone: '',
      company: '',
      subject: '',
      message: ''
    }
    
    // 5秒后隐藏成功提示
    setTimeout(() => { submitted.value = false }, 5000)
  } catch (error) {
    console.error('[DEBUG] 提交过程中发生错误:', error)
    errorMessage.value = error instanceof Error ? error.message : '网络错误，请稍后重试'
  } finally {
    loading.value = false
  }
}

const contactInfos = [
  { icon: '📞', label: '服务热线', value: '400 663 5617', sub: '工作日 09:00-18:00' },
  { icon: '💼', label: '销售咨询', value: '135-0383-8711', sub: '产品购买与方案咨询' },
  { icon: '🤝', label: '伙伴合作', value: '199-1314-0899', sub: '渠道代理与生态合作' },
  { icon: '📧', label: '电子邮箱', value: '1359629003@qq.com', sub: '商务合作与技术支持' },
  { icon: '📍', label: '公司地址', value: '北京市海淀区北太平庄路18号3层', sub: '北京总部' },
]
</script>
