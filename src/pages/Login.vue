<template>
  <Layout>
    <section class="min-h-screen flex items-center justify-center py-20 px-4">
      <div :class="['w-full max-w-md rounded-2xl shadow-2xl overflow-hidden', isDark ? 'bg-brand-surface border border-brand-border' : 'bg-white border border-gray-200']">
        <!-- 顶部 Tab -->
        <div :class="['flex border-b', isDark ? 'border-brand-border' : 'border-gray-200']">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            @click="activeTab = tab.key as 'login' | 'register'"
            :class="[
              'flex-1 py-4 text-sm font-medium transition-all',
              activeTab === tab.key
                ? (isDark ? 'text-primary border-b-2 border-primary' : 'text-blue-600 border-b-2 border-blue-600')
                : (isDark ? 'text-white/50 hover:text-white/80' : 'text-gray-400 hover:text-gray-600')
            ]"
          >{{ tab.label }}</button>
        </div>

        <div class="p-8">
          <!-- 登录表单 -->
          <div v-if="activeTab === 'login'">
            <h2 :class="['text-2xl font-bold mb-6', isDark ? 'text-white' : 'text-gray-900']">欢迎回来</h2>

            <!-- 登录方式切换 -->
            <div class="flex gap-2 mb-6">
              <button
                v-for="m in loginMethods"
                :key="m.key"
                @click="loginMethod = m.key as 'account' | 'wechat'"
                :class="[
                  'flex-1 py-2 rounded-lg text-sm font-medium transition-all border',
                  loginMethod === m.key
                    ? (isDark ? 'bg-primary/20 text-primary border-primary/50' : 'bg-blue-50 text-blue-600 border-blue-300')
                    : (isDark ? 'bg-white/5 text-white/50 border-white/10 hover:border-white/20' : 'bg-gray-50 text-gray-400 border-gray-200 hover:border-gray-300')
                ]"
              >{{ m.label }}</button>
            </div>

            <!-- 账号密码登录 -->
            <form v-if="loginMethod === 'account'" @submit.prevent="handleLogin" class="space-y-4">
              <div>
                <label :class="['block text-sm font-medium mb-1.5', isDark ? 'text-white/70' : 'text-gray-600']">邮箱 / 手机号</label>
                <input
                  v-model="loginForm.account"
                  type="text"
                  placeholder="请输入邮箱或手机号"
                  :class="inputClass"
                  required
                />
              </div>
              <div>
                <label :class="['block text-sm font-medium mb-1.5', isDark ? 'text-white/70' : 'text-gray-600']">密码</label>
                <input
                  v-model="loginForm.password"
                  type="password"
                  placeholder="请输入密码"
                  :class="inputClass"
                  required
                />
              </div>
              <!-- 图片验证码（前端Canvas生成） -->
              <div>
                <label :class="['block text-sm font-medium mb-1.5', isDark ? 'text-white/70' : 'text-gray-600']">验证码</label>
                <CaptchaCanvas
                  ref="loginCaptchaRef"
                  v-model="loginForm.captcha"
                  :input-class="inputClass"
                  placeholder="请输入验证码"
                />
              </div>
              <div v-if="loginError" class="text-red-400 text-sm py-2 px-3 rounded-lg bg-red-500/10">{{ loginError }}</div>
              <button type="submit" :disabled="loginLoading" :class="['w-full py-3 text-base font-medium rounded-lg transition-all', isDark ? 'bg-primary text-white hover:bg-primary/90 disabled:opacity-50' : 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50']">
                {{ loginLoading ? '登录中...' : '登录' }}
              </button>
            </form>

            <!-- 微信扫码登录 -->
            <div v-else class="text-center py-6">
              <div :class="['w-48 h-48 mx-auto rounded-xl flex flex-col items-center justify-center gap-3 border-2 border-dashed', isDark ? 'border-brand-border bg-white/5' : 'border-gray-300 bg-gray-50']">
                <svg class="w-12 h-12 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-7.062-6.122zm-3.74 2.632c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm3.814 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z"/>
                </svg>
                <p :class="['text-sm', isDark ? 'text-white/50' : 'text-gray-400']">微信扫码登录</p>
                <p :class="['text-xs', isDark ? 'text-white/30' : 'text-gray-300']">功能开发中</p>
              </div>
              <p :class="['mt-4 text-sm', isDark ? 'text-white/40' : 'text-gray-400']">微信扫码登录功能即将上线</p>
            </div>
          </div>

          <!-- 注册表单 -->
          <div v-else>
            <h2 :class="['text-2xl font-bold mb-6', isDark ? 'text-white' : 'text-gray-900']">创建账号</h2>

            <!-- 注册方式切换 -->
            <div class="flex gap-2 mb-6">
              <button
                v-for="m in registerMethods"
                :key="m.key"
                @click="registerType = m.key as 'email' | 'phone'"
                :class="[
                  'flex-1 py-2 rounded-lg text-sm font-medium transition-all border',
                  registerType === m.key
                    ? (isDark ? 'bg-primary/20 text-primary border-primary/50' : 'bg-blue-50 text-blue-600 border-blue-300')
                    : (isDark ? 'bg-white/5 text-white/50 border-white/10 hover:border-white/20' : 'bg-gray-50 text-gray-400 border-gray-200 hover:border-gray-300')
                ]"
              >{{ m.label }}</button>
            </div>

            <form @submit.prevent="handleRegister" class="space-y-4">
              <!-- 邮箱注册 -->
              <div v-if="registerType === 'email'">
                <label :class="['block text-sm font-medium mb-1.5', isDark ? 'text-white/70' : 'text-gray-600']">邮箱地址</label>
                <input
                  v-model="registerForm.email"
                  type="email"
                  placeholder="请输入邮箱地址"
                  :class="inputClass"
                  required
                />
              </div>
              <!-- 手机号注册 -->
              <div v-else>
                <label :class="['block text-sm font-medium mb-1.5', isDark ? 'text-white/70' : 'text-gray-600']">手机号码</label>
                <input
                  v-model="registerForm.phone"
                  type="tel"
                  placeholder="请输入手机号码"
                  :class="inputClass"
                  required
                />
              </div>
              <div>
                <label :class="['block text-sm font-medium mb-1.5', isDark ? 'text-white/70' : 'text-gray-600']">密码</label>
                <input
                  v-model="registerForm.password"
                  type="password"
                  placeholder="请设置密码（至少6位）"
                  :class="inputClass"
                  required
                />
              </div>
              <div>
                <label :class="['block text-sm font-medium mb-1.5', isDark ? 'text-white/70' : 'text-gray-600']">确认密码</label>
                <input
                  v-model="registerForm.confirmPassword"
                  type="password"
                  placeholder="请再次输入密码"
                  :class="inputClass"
                  required
                />
              </div>
              <!-- 图片验证码（前端Canvas生成） -->
              <div>
                <label :class="['block text-sm font-medium mb-1.5', isDark ? 'text-white/70' : 'text-gray-600']">验证码</label>
                <CaptchaCanvas
                  ref="registerCaptchaRef"
                  v-model="registerForm.captcha"
                  :input-class="inputClass"
                  placeholder="请输入验证码"
                />
              </div>
              <div v-if="registerError" class="text-red-400 text-sm py-2 px-3 rounded-lg bg-red-500/10">{{ registerError }}</div>
              <div v-if="registerSuccess" class="text-green-400 text-sm py-2 px-3 rounded-lg bg-green-500/10">{{ registerSuccess }}</div>
              <button type="submit" :disabled="registerLoading" :class="['w-full py-3 text-base font-medium rounded-lg transition-all', isDark ? 'bg-primary text-white hover:bg-primary/90 disabled:opacity-50' : 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50']">
                {{ registerLoading ? '注册中...' : '立即注册' }}
              </button>
            </form>
          </div>

          <!-- 底部切换 -->
          <p :class="['text-center text-sm mt-6', isDark ? 'text-white/40' : 'text-gray-400']">
            {{ activeTab === 'login' ? '还没有账号？' : '已有账号？' }}
            <button
              @click="activeTab = activeTab === 'login' ? 'register' : 'login'"
              :class="['ml-1 font-medium', isDark ? 'text-primary hover:text-primary/80' : 'text-blue-600 hover:text-blue-500']"
            >{{ activeTab === 'login' ? '立即注册' : '去登录' }}</button>
          </p>
        </div>
      </div>
    </section>
  </Layout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Layout from '../components/common/Layout.vue'
import CaptchaCanvas from '../components/common/CaptchaCanvas.vue'
import { useTheme } from '../composables/useTheme'
import { useAuth } from '../composables/useAuth'

const { theme } = useTheme()
const isDark = computed(() => theme.value === 'dark')
const router = useRouter()
const route = useRoute()
const { setAuth } = useAuth()

const activeTab = ref<'login' | 'register'>('login')
const loginMethod = ref<'account' | 'wechat'>('account')
const registerType = ref<'email' | 'phone'>('email')

const tabs = [
  { key: 'login', label: '登录' },
  { key: 'register', label: '注册' },
]
const loginMethods = [
  { key: 'account', label: '账号密码' },
  { key: 'wechat', label: '微信扫码' },
]
const registerMethods = [
  { key: 'email', label: '邮箱注册' },
  { key: 'phone', label: '手机号注册' },
]

// Canvas 验证码组件引用
const loginCaptchaRef = ref<InstanceType<typeof CaptchaCanvas> | null>(null)
const registerCaptchaRef = ref<InstanceType<typeof CaptchaCanvas> | null>(null)

const loginForm = ref({ account: '', password: '', captcha: '' })
const loginError = ref('')
const loginLoading = ref(false)

const registerForm = ref({ email: '', phone: '', password: '', confirmPassword: '', captcha: '' })
const registerError = ref('')
const registerSuccess = ref('')
const registerLoading = ref(false)

const inputClass = computed(() => [
  'w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-all border',
  isDark.value
    ? 'bg-white/5 border-brand-border text-white placeholder-white/30 focus:border-primary focus:bg-white/10'
    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white'
])

const API_BASE = (import.meta.env.VITE_API_URL as string) || '/api'

async function handleLogin() {
  loginError.value = ''

  // 前端Canvas验证码校验
  if (!loginCaptchaRef.value?.validate(loginForm.value.captcha)) {
    loginError.value = '验证码错误，请重新输入'
    loginCaptchaRef.value?.refresh()
    loginForm.value.captcha = ''
    return
  }

  loginLoading.value = true
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        account: loginForm.value.account,
        password: loginForm.value.password,
      }),
    })
    const data = await res.json()
    if (data.success) {
      setAuth(data.token, data.user)
      const redirect = (route.query.redirect as string) || '/'
      router.push(redirect)
    } else {
      loginError.value = data.message || '登录失败，请重试'
      loginCaptchaRef.value?.refresh()
      loginForm.value.captcha = ''
    }
  } catch {
    loginError.value = '无法连接到服务器，请确认后端服务已启动（node server/index.js）'
    loginCaptchaRef.value?.refresh()
    loginForm.value.captcha = ''
  } finally {
    loginLoading.value = false
  }
}

async function handleRegister() {
  registerError.value = ''
  registerSuccess.value = ''

  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    registerError.value = '两次密码不一致'
    return
  }
  if (registerForm.value.password.length < 6) {
    registerError.value = '密码至少6位'
    return
  }

  // 前端Canvas验证码校验
  if (!registerCaptchaRef.value?.validate(registerForm.value.captcha)) {
    registerError.value = '验证码错误，请重新输入'
    registerCaptchaRef.value?.refresh()
    registerForm.value.captcha = ''
    return
  }

  registerLoading.value = true
  try {
    const body = {
      type: registerType.value,
      email: registerType.value === 'email' ? registerForm.value.email : undefined,
      phone: registerType.value === 'phone' ? registerForm.value.phone : undefined,
      password: registerForm.value.password,
    }
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body),
    })
    const data = await res.json()
    if (data.success) {
      registerSuccess.value = '注册成功！正在跳转...'
      setAuth(data.token, data.user)
      setTimeout(() => {
        const redirect = (route.query.redirect as string) || '/'
        router.push(redirect)
      }, 1500)
    } else {
      registerError.value = data.message || '注册失败，请重试'
      registerCaptchaRef.value?.refresh()
      registerForm.value.captcha = ''
    }
  } catch {
    registerError.value = '无法连接到服务器，请确认后端服务已启动（node server/index.js）'
    registerCaptchaRef.value?.refresh()
    registerForm.value.captcha = ''
  } finally {
    registerLoading.value = false
  }
}
</script>
