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
          <form class="glass-card rounded-2xl p-8 space-y-5" @submit.prevent="handleSubmit">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label :class="['block text-sm mb-1.5', isDark ? 'text-white/70' : 'text-gray-600']">您的姓名 *</label>
                <input
                  v-model="form.name"
                  type="text"
                  placeholder="请输入姓名"
                  required
                  :class="['w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-colors', isDark ? 'bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-primary' : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500']"
                />
              </div>
              <div>
                <label :class="['block text-sm mb-1.5', isDark ? 'text-white/70' : 'text-gray-600']">联系电话 *</label>
                <input
                  v-model="form.phone"
                  type="tel"
                  placeholder="请输入手机号"
                  required
                  :class="['w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-colors', isDark ? 'bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-primary' : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500']"
                />
              </div>
            </div>
            <div>
              <label :class="['block text-sm mb-1.5', isDark ? 'text-white/70' : 'text-gray-600']">公司名称</label>
              <input
                v-model="form.company"
                type="text"
                placeholder="请输入公司名称"
                :class="['w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-colors', isDark ? 'bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-primary' : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500']"
              />
            </div>
            <div>
              <label :class="['block text-sm mb-1.5', isDark ? 'text-white/70' : 'text-gray-600']">感兴趣的产品</label>
              <select
                v-model="form.product"
                :class="['w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-colors', isDark ? 'bg-white/5 border border-white/10 text-white focus:border-primary' : 'bg-gray-50 border border-gray-200 text-gray-900 focus:border-blue-500']"
              >
                <option value="">请选择产品</option>
                <option value="erp">药天下ERP+WMS</option>
                <option value="his">深度HIS系统</option>
                <option value="elder">智慧养老平台</option>
                <option value="code">流通码中台</option>
                <option value="other">其他产品</option>
              </select>
            </div>
            <div>
              <label :class="['block text-sm mb-1.5', isDark ? 'text-white/70' : 'text-gray-600']">咨询内容</label>
              <textarea
                v-model="form.message"
                rows="4"
                placeholder="请描述您的需求或问题..."
                :class="['w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-colors resize-none', isDark ? 'bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-primary' : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500']"
              ></textarea>
            </div>
            <button type="submit" class="btn-primary w-full py-3 text-base">
              {{ submitted ? '✓ 提交成功，我们将尽快联系您' : '提交咨询' }}
            </button>
          </form>
        </div>
      </div>
    </section>
  </Layout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import Layout from '../components/common/Layout.vue'
import { useTheme } from '../composables/useTheme'

const { theme } = useTheme()
const isDark = computed(() => theme.value === 'dark')

const submitted = ref(false)
const form = ref({ name: '', phone: '', company: '', product: '', message: '' })

function handleSubmit() {
  submitted.value = true
  setTimeout(() => { submitted.value = false }, 5000)
}

const contactInfos = [
  { icon: '📞', label: '服务热线', value: '400 663 5617', sub: '工作日 09:00-18:00' },
  { icon: '💼', label: '销售咨询', value: '135-0383-8711', sub: '产品购买与方案咨询' },
  { icon: '🤝', label: '伙伴合作', value: '199-1314-0899', sub: '渠道代理与生态合作' },
  { icon: '📧', label: '电子邮箱', value: '1359629003@qq.com', sub: '商务合作与技术支持' },
  { icon: '📍', label: '公司地址', value: '北京市海淀区北太平庄路18号3层', sub: '北京总部' },
]
</script>
