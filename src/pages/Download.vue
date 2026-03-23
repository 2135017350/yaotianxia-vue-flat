<template>
  <Layout>
    <section class="page-hero">
      <div class="w-full px-6 lg:px-12 py-16">
        <div :class="['text-sm font-medium mb-3 tracking-wider uppercase', isDark ? 'text-primary' : 'text-blue-600']">Download</div>
        <h1 :class="['text-4xl lg:text-5xl font-bold mb-4', isDark ? 'text-white' : 'text-gray-900']">试用下载</h1>
        <p :class="['text-lg max-w-2xl', isDark ? 'text-white/60' : 'text-gray-600']">
          下载试用版，体验药天下全系产品，默认账号密码见各产品说明
        </p>
      </div>
    </section>

    <section :class="['w-full py-16 px-6 lg:px-12', isDark ? 'bg-brand-surface' : 'bg-white']">
      <!-- 未登录提示 -->
      <div v-if="requireLogin" :class="['rounded-2xl p-10 text-center mb-8 border', isDark ? 'bg-brand-bg border-brand-border' : 'bg-gray-50 border-gray-200']">
        <div class="text-5xl mb-4">🔒</div>
        <h3 :class="['text-xl font-bold mb-3', isDark ? 'text-white' : 'text-gray-900']">文档下载需要登录</h3>
        <p :class="['text-sm mb-6', isDark ? 'text-white/60' : 'text-gray-500']">请先登录您的账号，即可访问所有试用下载资源</p>
        <div class="flex gap-3 justify-center">
          <RouterLink to="/login?redirect=/download" class="btn-primary px-6 py-2.5">立即登录</RouterLink>
          <RouterLink to="/login?redirect=/download" :class="['px-6 py-2.5 rounded-lg text-sm font-medium border transition-all', isDark ? 'border-brand-border text-white/70 hover:border-primary hover:text-primary' : 'border-gray-300 text-gray-600 hover:border-blue-400 hover:text-blue-600']">注册账号</RouterLink>
        </div>
      </div>

      <!-- 已登录：使用说明 -->
      <template v-if="!requireLogin">
        <div class="glass-card rounded-xl p-5 mb-8 flex items-start gap-3">
          <span class="text-xl flex-shrink-0">ℹ️</span>
          <div :class="['text-sm leading-relaxed', isDark ? 'text-white/70' : 'text-gray-600']">
            <strong :class="isDark ? 'text-white' : 'text-gray-900'">使用说明：</strong>
            下载文件后请解压安装，使用各产品标注的账号密码登录体验。如遇问题请拨打服务热线
            <span class="text-primary font-medium">400 663 5617</span> 或联系销售
            <span class="text-primary font-medium">135-0383-8711</span>。
          </div>
          <div class="flex-shrink-0 ml-auto">
            <button v-if="isAdmin" @click="showUploadModal = true"
                    :class="['text-xs px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2', isDark ? 'bg-primary text-white hover:bg-primary-light' : 'bg-blue-600 text-white hover:bg-blue-700']">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
              </svg>
              上传文件
            </button>
            <div v-else class="text-xs px-3 py-2 rounded-lg border border-yellow-300 text-yellow-700 bg-yellow-50">仅管理员可新增/删除</div>
          </div>
        </div>

      <!-- 下载列表 -->
      <div class="space-y-4">
        <div
          v-for="group in downloadGroups"
          :key="group.title"
          class="glass-card rounded-xl overflow-hidden"
        >
          <!-- 分组标题 -->
          <div
            class="flex items-center justify-between px-6 py-4 cursor-pointer"
            :style="isDark ? 'background: rgba(0,212,255,0.05)' : 'background: rgba(0,100,200,0.04)'"
            @click="toggleGroup(group.title)"
          >
            <div class="flex items-center gap-3">
              <span class="text-xl">{{ group.icon }}</span>
              <div>
                <span :class="['font-bold text-base', isDark ? 'text-white' : 'text-gray-900']">{{ group.title }}</span>
                <span v-if="group.credential" :class="['ml-3 text-xs px-2 py-0.5 rounded', isDark ? 'bg-white/10 text-white/60' : 'bg-gray-100 text-gray-500']">
                  {{ group.credential }}
                </span>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span :class="['text-xs', isDark ? 'text-white/40' : 'text-gray-400']">{{ group.files.length }} 个文件</span>
              <span :class="['transition-transform text-sm', openGroups.includes(group.title) ? 'rotate-180' : '', isDark ? 'text-white/50' : 'text-gray-400']">▼</span>
            </div>
          </div>

          <!-- 文件列表 -->
          <div v-if="openGroups.includes(group.title)" class="divide-y" :class="isDark ? 'divide-white/5' : 'divide-gray-100'">
            <div
              v-for="file in group.files"
              :key="file.name"
              class="flex items-center justify-between px-6 py-3.5"
            >
              <div class="flex items-center gap-3 min-w-0">
                <span class="text-base flex-shrink-0">📄</span>
                <span :class="['text-sm truncate', isDark ? 'text-white/80' : 'text-gray-700']">{{ file.name }}</span>
              </div>
              <div class="flex items-center gap-2 flex-shrink-0 ml-4">
                <span :class="['text-xs', isDark ? 'text-white/40' : 'text-gray-400']">{{ file.size }}</span>
                <a
                  :href="'/downloads/' + file.name"
                  :download="file.name"
                  class="text-xs px-4 py-1.5 rounded-lg font-medium transition-all"
                  :style="isDark ? 'background: rgba(0,212,255,0.15); color: #00D4FF; border: 1px solid rgba(0,212,255,0.3)' : 'background: rgba(0,100,200,0.08); color: #0066CC; border: 1px solid rgba(0,100,200,0.2)'"
                >下载</a>
                <button v-if="isAdmin && file.id" @click="deleteFileFromGroup(group.title, file)" class="text-xs px-2 py-1 rounded bg-red-100 text-red-600 hover:bg-red-200">删除</button>
              </div>
            </div>
          </div>
        </div>
      </div>

        <!-- 上传弹窗 -->
        <div v-if="showUploadModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" @click.self="showUploadModal = false">
          <div :class="['w-full max-w-lg mx-4 rounded-2xl shadow-2xl', isDark ? 'bg-brand-surface border border-brand-border' : 'bg-white']">
            <!-- 头部 -->
            <div class="flex items-center justify-between px-6 py-4 border-b" :class="isDark ? 'border-white/10' : 'border-gray-200'">
              <h3 :class="['text-lg font-semibold', isDark ? 'text-white' : 'text-gray-900']">上传文件</h3>
              <button @click="showUploadModal = false" :class="['text-sm', isDark ? 'text-white/40 hover:text-white' : 'text-gray-400 hover:text-gray-600']">✕</button>
            </div>

            <!-- 内容 -->
            <div class="p-6">
              <!-- 拖拽上传区域 -->
              <div
                  ref="uploadArea"
                  :class="['border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer',
                isDark ? 'border-white/20 hover:border-primary hover:bg-primary/5' : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50']"
                  @dragover.prevent="isDragging = true"
                  @dragleave.prevent="isDragging = false"
                  @drop.prevent="handleDrop"
                  @click="triggerFileInput"
              >
                <input
                    ref="fileInputElement"
                    type="file"
                    class="hidden"
                    @change="handleFileSelect"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.mp4,.avi,.mov,.zip,.rar,.exe,.apk"
                />
                <svg class="w-12 h-12 mx-auto mb-3" :class="isDark ? 'text-white/30' : 'text-gray-300'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                </svg>
                <p :class="['text-sm mb-1', isDark ? 'text-white/60' : 'text-gray-600']">点击或拖拽文件到此处上传</p>
                <p :class="['text-xs', isDark ? 'text-white/30' : 'text-gray-400']">支持 PDF、Word、Excel、视频、压缩包等格式，最大 100MB</p>
              </div>

              <!-- 文件信息 -->
              <div v-if="selectedFile" :class="['mt-4 p-3 rounded-lg flex items-center justify-between', isDark ? 'bg-white/5' : 'bg-gray-50']">
                <div class="flex items-center gap-3 min-w-0">
                  <span class="text-xl">📄</span>
                  <div class="min-w-0">
                    <div :class="['text-sm font-medium truncate', isDark ? 'text-white' : 'text-gray-900']">{{ selectedFile.name }}</div>
                    <div :class="['text-xs', isDark ? 'text-white/40' : 'text-gray-400']">{{ formatFileSize(selectedFile.size) }}</div>
                  </div>
                </div>
                <button @click="selectedFile = null" :class="['text-sm', isDark ? 'text-white/40 hover:text-white' : 'text-gray-400 hover:text-gray-600']">✕</button>
              </div>

              <!-- 进度条 -->
              <div v-if="uploading" class="mt-4">
                <div class="flex items-center justify-between mb-2">
                  <span :class="['text-xs', isDark ? 'text-white/40' : 'text-gray-400']">上传中...</span>
                  <span :class="['text-xs', isDark ? 'text-white/40' : 'text-gray-400']">{{ uploadProgress }}%</span>
                </div>
                <div class="h-2 rounded-full overflow-hidden" :class="isDark ? 'bg-white/10' : 'bg-gray-200'">
                  <div class="h-full bg-primary transition-all duration-300" :style="{ width: uploadProgress + '%' }"></div>
                </div>
              </div>
            </div>

            <!-- 底部按钮 -->
            <div class="flex items-center justify-end gap-3 px-6 py-4 border-t" :class="isDark ? 'border-white/10' : 'border-gray-200'">
              <button @click="showUploadModal = false" :class="['px-4 py-2 rounded-lg text-sm font-medium transition-all', isDark ? 'bg-white/10 text-white/70 hover:bg-white/20' : 'bg-gray-100 text-gray-600 hover:bg-gray-200']">取消</button>
              <button @click="handleUpload" :disabled="!selectedFile || uploading"
                      :class="['px-6 py-2 rounded-lg text-sm font-medium transition-all',
                !selectedFile || uploading
                  ? 'opacity-50 cursor-not-allowed bg-gray-400 text-white'
                  : 'btn-primary']">
                {{ uploading ? '上传中...' : '立即上传' }}
              </button>
            </div>
          </div>
        </div>

      <!-- 联系 -->
      <div class="mt-10 text-center">
        <p :class="['text-sm mb-4', isDark ? 'text-white/50' : 'text-gray-500']">需要正式版授权或技术支持？</p>
        <RouterLink to="/contact" class="btn-primary px-8 py-3">联系我们</RouterLink>
      </div>



      </template>
    </section>
  </Layout>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import Layout from '../components/common/Layout.vue'
import { useTheme } from '../composables/useTheme'
import { useAuth } from '../composables/useAuth'

const { theme } = useTheme()
const isDark = computed(() => theme.value === 'dark')
const { isLoggedIn, user } = useAuth()
const isAdmin = computed(() => user?.value?.role === 'admin' || user?.value?.username?.toLowerCase?.() === 'admin')

// 文档下载需要登录
const requireLogin = ref(false)
onMounted(() => {
  // 检查是否需要登录（如果后端有配置则需要登录，否则不强制）
  // 当前配置：文档下载需要登录
  requireLogin.value = !isLoggedIn.value
  loadDownloadGroups()
})

const openGroups = ref<string[]>([])
function toggleGroup(title: string) {
  const idx = openGroups.value.indexOf(title)
  if (idx >= 0) openGroups.value.splice(idx, 1)
  else openGroups.value.push(title)
}

async function deleteFileFromGroup(groupTitle: string, file: any) {
  if (!isAdmin.value) return
  if (file.id) {
    try {
      const res = await fetch(`/api/uploads/${file.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('ytx_token')}` },
        credentials: 'include',
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.message || '删除失败')
      await loadDownloadGroups()
      return
    } catch (error) {
      alert(`删除失败：${error instanceof Error ? error.message : '未知错误'}`)
      return
    }
  }

  const group = downloadGroups.value.find((g: any) => g.title === groupTitle)
  if (!group) return
  group.files = group.files.filter((f: any) => f.name !== file.name)
  saveDownloadGroups()
}

const showUploadModal = ref(false)
const selectedFile = ref<File | null>(null)
const uploading = ref(false)
const uploadProgress = ref(0)
const isDragging = ref(false)
const fileInputElement = ref<HTMLInputElement | null>(null)


const defaultDownloadGroups = [
  {
    icon: '💊',
    title: '药天下药品批发版（分享云部署）',
    credential: '账密：admin，123',
    files: [{ name: '药天下分享版-fenxiaoban.zip', size: '13.11MB' }],
  },
  {
    icon: '🏪',
    title: '药天下药品批发版（云部署）',
    credential: '账密：管理员\\123',
    files: [{ name: '批零云部署.zip', size: '13.11MB' }],
  },
  {
    icon: '🏥',
    title: '药天下医疗器械管理系统（云部署）',
    credential: '账密：管理员\\123456',
    files: [{ name: 'demo-器械试用.zip', size: '13.11MB' }],
  },
  {
    icon: '🏨',
    title: '深度医疗管理系统（HIS）',
    credential: '账密：admin\\123456',
    files: [{ name: 'his_setup(6.0.0.124).rar', size: '16.03MB' }],
  },
  {
    icon: '🏛️',
    title: '深度诊所管理系统',
    credential: '账密：admin\\123456',
    files: [{ name: 'his_setup_mzl(6.0.0.124).rar', size: '16.03MB' }],
  },
  {
    icon: '🏢',
    title: '深度中医馆管理系统',
    credential: '账密：admin\\123456',
    files: [{ name: 'his_setup_zyg(6.0.0.124).rar', size: '16.03MB' }],
  },
  {
    icon: '📦',
    title: '药天下批发版2020.02.26（支持批发和零售）',
    credential: '账密：管理员\\123456',
    files: [{ name: 'ytx_setup6i.rar', size: '32.39MB' }],
  },
  {
    icon: '👴',
    title: '老板助手（对应药天下批发诊所费、总部版单件）',
    credential: '账密：提供手机号后，由需要生成',
    files: [{ name: '老板助手DbSync-2.1.0.17.rar', size: '4.09MB' }],
  },
  {
    icon: '🔧',
    title: '药天下连锁安装包（账号：管理员\\密码：123）',
    credential: '',
    files: [
      { name: 'ytx_client_setup(3.2019.8.30).rar', size: '14.6MB' },
      { name: 'ytx_server_setup(3.2019.8.30).rar', size: '12.53MB' },
    ],
  },
  {
    icon: '🏢',
    title: '药天下办公室管理系统',
    credential: '账密：管理员\\123',
    files: [{ name: 'ytx_nz_setup.rar', size: '13.54MB' }],
  },
  {
    icon: '🩺',
    title: '药天下医疗器械管理系统',
    credential: '账密：管理员\\123',
    files: [{ name: 'ytx_qk_setup.rar', size: '14.87MB' }],
  },
  {
    icon: '📱',
    title: '药天下配套安全手机助手（安装后，右上角配置药天下数据库、药天下操作员ID登录）',
    credential: '',
    files: [
      { name: '给啊书里面.apk', size: '9.89MB' },
      { name: '给啊书批零.apk', size: '9.77MB' },
      { name: 'client.rar', size: '42.63MB' },
    ],
  },
  {
    icon: '💊',
    title: '远程带方（处方登录账密：system\\11111，处方带模账密 001\\001）',
    credential: '',
    files: [
      { name: '处方带服务器server_setup.exe', size: '3.12MB' },
      { name: '处方遗忘client_setup.exe', size: '8.23MB' },
    ],
  },
  {
    icon: '💊',
    title: '药天下分享版',
    credential: '账密：admin\\密码123',
    files: [
      { name: 'ytx_ltj(2025.04.01).rar', size: '83.99MB' },
      { name: 'ytx_setup6i.rar', size: '32.39MB' },
      { name: 'ytx_ltj(3.0.0.39)试用版.exe', size: '48.01MB' },
    ],
  },
  {
    icon: '🏠',
    title: '深度养老管理系统',
    credential: '账密：admin\\123456',
    files: [{ name: 'his_setup(5.0.0.100).rar', size: '9.71MB' }],
  },
  {
    icon: '💳',
    title: '药加出（账户：001，密码：123）业务类收款确认、付款申请继发',
    credential: '',
    files: [{ name: 'yaojiaoyou_setup.exe', size: '5.01MB' }],
  },
  {
    icon: '📱',
    title: '九康医药APP',
    credential: '',
    files: [{ name: 'H5S0C9151_20230404133750.apk', size: '9.99MB' }],
  },
  {
    icon: '📱',
    title: '药管控APP',
    credential: '',
    files: [
      { name: '药管控.apk', size: '18.57MB' },
      { name: 'Mic_PACS操作手册(核磁医学影像报告与辅辅管道管理系统).doc', size: '5.63MB' },
      { name: '一站式检验管理系统 Net+案例.pptx', size: '14.91MB' },
    ],
  },
]

const downloadGroups = ref<any[]>([])

function saveDownloadGroups() {
  localStorage.setItem('download-groups', JSON.stringify(downloadGroups.value))
}

async function loadDownloadGroups() {
  try {
    const res = await fetch('/api/uploads/list', { credentials: 'include' })
    const data = await res.json()
    if (data.success) {
      const resources = data.data
      const adminGroup = {
        icon: '🛠️',
        title: '管理员上传资源',
        credential: '管理员可新增/删除',
        files: resources.map((item: any) => ({ name: item.name, size: item.size || '未知', id: item.id })),
      }
      downloadGroups.value = [adminGroup, ...defaultDownloadGroups]
      return
    }
  } catch (error) {
    console.warn('加载后端资源失败', error)
  }

  const saved = localStorage.getItem('download-groups')
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed)) downloadGroups.value = parsed
      return
    } catch {
      // ignore parse errors
    }
  }

  downloadGroups.value = [...defaultDownloadGroups]
}

function triggerFileInput() {
  fileInputElement.value?.click()
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    selectedFile.value = input.files[0]
  }
}

function handleDrop(event: DragEvent) {
  isDragging.value = false
  if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
    selectedFile.value = event.dataTransfer.files[0]
  }
}

async function handleUpload() {
  if (!isAdmin.value) {
    alert('仅管理员可上传试用资源')
    return
  }
  if (!selectedFile.value) return

  uploading.value = true
  uploadProgress.value = 0

  const formData = new FormData()
  formData.append('file', selectedFile.value)
  formData.append('uploadType', 'contract')
  formData.append('description', '管理员上传试用资源')

  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
      headers: { Authorization: `Bearer ${localStorage.getItem('ytx_token')}` },
      credentials: 'include',
    })
    const result = await response.json()
    if (!result.success) {
      alert(`上传失败：${result.message || '未知错误'}`)
      return
    }
    await loadDownloadGroups()
    alert(`上传成功：${selectedFile.value.name}`)
    showUploadModal.value = false
    selectedFile.value = null
  } catch (error) {
    alert(`上传失败：${error instanceof Error ? error.message : '未知错误'}`)
  } finally {
    uploading.value = false
  }
}

</script>
