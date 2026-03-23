<template>
  <Layout>
    <!-- Hero -->
    <section :class="['w-full py-16 px-6 lg:px-12 relative overflow-hidden', isDark ? '' : '']"
             :style="isDark
               ? 'background: linear-gradient(135deg, #070E1A 0%, #0D1B2E 50%, #0F2040 100%)'
               : 'background: linear-gradient(135deg, #EBF8FF 0%, #DBEAFE 60%, #EDE9FE 100%)'">
      <div class="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div class="max-w-4xl">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 mb-4">
          <span class="text-primary text-xs tracking-widest uppercase">Document Center</span>
        </div>
        <h1 :class="['text-3xl lg:text-5xl font-black mb-4', isDark ? 'text-white' : 'text-gray-900']">
          文档下载中心
        </h1>
        <p :class="['text-base lg:text-lg max-w-2xl', isDark ? 'text-white/60' : 'text-gray-500']">
          提供合同模板、操作手册及产品演示视频，帮助您快速了解和使用药天下产品
        </p>
      </div>
    </section>

    <!-- 未登录提示 -->
    <section v-if="!isLoggedIn" class="py-24 px-6 lg:px-12 flex flex-col items-center justify-center text-center">
      <div :class="['glass-card p-12 max-w-md w-full', isDark ? '' : '']">
        <div class="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
             style="background: linear-gradient(135deg, rgba(0,212,255,0.15), rgba(0,102,255,0.15)); border: 1px solid rgba(0,212,255,0.3)">
          <svg class="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
          </svg>
        </div>
        <h2 :class="['text-2xl font-bold mb-3', isDark ? 'text-white' : 'text-gray-900']">需要登录后访问</h2>
        <p :class="['text-sm mb-8', isDark ? 'text-white/50' : 'text-gray-500']">
          文档下载中心仅对已注册用户开放，请先登录或注册账号
        </p>
        <div class="flex flex-col gap-3">
          <RouterLink to="/login" class="btn-primary text-center py-3">立即登录</RouterLink>
          <RouterLink to="/login?tab=register"
            :class="['py-3 rounded-lg text-sm font-medium border text-center transition-all', isDark ? 'border-white/20 text-white/70 hover:border-primary hover:text-primary' : 'border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-600']">
            注册新账号
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- 已登录：文档内容 -->
    <section v-else class="py-12 px-6 lg:px-12">
      <!-- 用户欢迎栏 -->
      <div :class="['flex items-center justify-between mb-8 p-4 rounded-xl border', isDark ? 'bg-primary/5 border-primary/20' : 'bg-blue-50 border-blue-200']">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"               style="background: linear-gradient(135deg, #00D4FF, #0066FF)">
            {{ currentUser?.username?.charAt(0)?.toUpperCase() || 'U' }}
          </div>
          <div>
            <div :class="['text-sm font-medium', isDark ? 'text-white' : 'text-gray-900']">
              欢迎，{{ currentUser?.username || '用户' }}
            </div>
            <div :class="['text-xs', isDark ? 'text-white/40' : 'text-gray-400']">您已登录，可下载所有文档</div>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <button v-if="isAdmin" @click="showUploadModal = true"
                  :class="['text-xs px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2', isDark ? 'bg-primary text-white hover:bg-primary-light' : 'bg-blue-600 text-white hover:bg-blue-700']">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
            </svg>
            上传文件
          </button>
          <div v-else :class="['text-xs px-3 py-1.5 rounded-lg border border-yellow-300 text-yellow-700', isDark ? 'bg-yellow-400/10 border-yellow-200 text-yellow-200' : 'bg-yellow-50']">仅管理员可新增/删除</div>
          <button @click="logout"
                  :class="['text-xs px-3 py-1.5 rounded-lg border transition-all', isDark ? 'border-white/20 text-white/50 hover:border-red-400 hover:text-red-400' : 'border-gray-300 text-gray-500 hover:border-red-400 hover:text-red-500']">
            退出登录
          </button>
        </div>
      </div>


      <!-- 分类标签 -->
      <div class="flex gap-2 mb-8 flex-wrap">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="activeTab = tab.key"
          :class="[
            'px-5 py-2 rounded-full text-sm font-medium transition-all duration-200',
            activeTab === tab.key
              ? 'bg-primary text-white shadow-lg shadow-primary/30'
              : (isDark ? 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700')
          ]"
        >
          {{ tab.label }}
          <span :class="['ml-1.5 text-xs px-1.5 py-0.5 rounded-full', activeTab === tab.key ? 'bg-white/20' : (isDark ? 'bg-white/10' : 'bg-gray-200')]">
            {{ tab.count }}
          </span>
        </button>
      </div>

      <!-- 合同文件列表 -->
      <div v-if="activeTab === 'contract'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div
          v-for="doc in displayContracts"
          :key="doc.name + doc.file"
          :class="['glass-card p-5 group cursor-pointer transition-all duration-300 hover:-translate-y-1', isDark ? '' : '']"
        >
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                 :style="`background: ${doc.color}15; border: 1px solid ${doc.color}30`">
              <svg class="w-6 h-6" :style="`color: ${doc.color}`" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <h3 :class="['font-semibold text-sm mb-1 truncate', isDark ? 'text-white' : 'text-gray-900']">{{ doc.name }}</h3>
              <p :class="['text-xs mb-3 line-clamp-2', isDark ? 'text-white/40' : 'text-gray-400']">{{ doc.desc }}</p>
              <div class="flex items-center justify-between">
                <span :class="['text-xs px-2 py-0.5 rounded-full', isDark ? 'bg-white/5 text-white/40' : 'bg-gray-100 text-gray-400']">
                  {{ doc.size }} · {{ doc.type }}
                </span>
                <div class="flex items-center gap-2">
                  <button
                    @click="downloadFile(doc)"
                    class="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-light transition-colors"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                    </svg>
                    下载
                  </button>
                  <button v-if="isAdmin && doc.uploaded" @click="deleteUploadedFile(doc)" class="text-xs px-2 py-0.5 rounded bg-red-100 text-red-600 hover:bg-red-200">删除</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 操作视频列表 -->
      <div v-if="activeTab === 'video'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div
          v-for="video in displayVideos"
          :key="video.name + video.file"
          :class="['glass-card overflow-hidden group cursor-pointer transition-all duration-300 hover:-translate-y-1']"
        >
          <!-- 视频封面 -->
          <div class="relative h-40 flex items-center justify-center"
               :style="`background: linear-gradient(135deg, ${video.color}20, ${video.color}08)`">
            <div class="w-14 h-14 rounded-full flex items-center justify-center border-2 transition-transform group-hover:scale-110"
                 :style="`background: ${video.color}20; border-color: ${video.color}50`">
              <svg class="w-7 h-7 ml-1" :style="`color: ${video.color}`" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
            <div class="absolute top-3 right-3">
              <span class="text-xs px-2 py-0.5 rounded-full text-white"
                    :style="`background: ${video.color}80`">{{ video.duration || '-' }}</span>
            </div>
          </div>
          <div class="p-4">
            <h3 :class="['font-semibold text-sm mb-1', isDark ? 'text-white' : 'text-gray-900']">{{ video.name }}</h3>
            <p :class="['text-xs mb-3', isDark ? 'text-white/40' : 'text-gray-400']">{{ video.desc }}</p>
            <div class="flex items-center justify-between">
              <span :class="['text-xs', isDark ? 'text-white/30' : 'text-gray-400']">{{ video.size }}</span>
              <div class="flex items-center gap-2">
                <button
                  @click="downloadFile(video)"
                  class="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-light transition-colors"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                  </svg>
                  下载
                </button>
                <button v-if="isAdmin && video.uploaded" @click="deleteUploadedFile(video)" class="text-xs px-2 py-0.5 rounded bg-red-100 text-red-600 hover:bg-red-200">删除</button>
              </div>
            </div>
          </div>
        </div>
      </div>


      <div v-if="showUploadModal && isAdmin" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" @click.self="showUploadModal = false">
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

            <div class="mt-3 text-left">
              <div class="flex items-center gap-2 text-sm font-medium mb-2">
                <span class="text-primary">上传类型：</span>
                <label class="inline-flex items-center gap-1 cursor-pointer">
                  <input type="radio" value="contract" v-model="uploadType" class="form-radio" /> 文件
                </label>
                <label class="inline-flex items-center gap-1 cursor-pointer">
                  <input type="radio" value="video" v-model="uploadType" class="form-radio" /> 视频
                </label>
              </div>
              <label class="text-sm text-gray-500 mb-1 block">描述（可选）</label>
              <textarea v-model="uploadDesc" rows="2" placeholder="请输入文件描述，上传后可在列表中查看"
                        :class="['w-full rounded-md border p-2 text-xs', isDark ? 'bg-black/20 border-white/20 text-white' : 'bg-white border-gray-300 text-gray-700']"></textarea>
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


      <!-- 提示：文件需放入 public/downloads 目录 -->
<!--      <div :class="['mt-10 p-4 rounded-xl border text-sm', isDark ? 'bg-yellow-500/5 border-yellow-500/20 text-yellow-400/70' : 'bg-yellow-50 border-yellow-200 text-yellow-700']">-->
<!--        <div class="flex items-start gap-2">-->
<!--          <svg class="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">-->
<!--            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>-->
<!--          </svg>-->
<!--          <span>如需更新文档或视频，请将文件放入 <code class="px-1 py-0.5 rounded text-xs font-mono" :class="isDark ? 'bg-white/10' : 'bg-yellow-100'">public/downloads/</code> 目录，并在本页面 <code class="px-1 py-0.5 rounded text-xs font-mono" :class="isDark ? 'bg-white/10' : 'bg-yellow-100'">src/pages/DocDownload.vue</code> 中更新文件列表。</span>-->
<!--        </div>-->
<!--      </div>-->
    </section>
  </Layout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import Layout from '../components/common/Layout.vue'
import { useTheme } from '../composables/useTheme'
import { useAuth } from '../composables/useAuth'

const { theme } = useTheme()
const isDark = computed(() => theme.value === 'dark')
const { isLoggedIn, user: currentUser, logout, token, getAuthHeaders } = useAuth()
const isAdmin = computed(() => currentUser?.value?.role === 'admin')

const activeTab = ref<'contract' | 'video'>('contract')
const uploadType = ref<'contract' | 'video'>('contract')
const uploadDesc = ref('')
const showUploadModal = ref(false)
const selectedFile = ref<File | null>(null)
const uploading = ref(false)
const uploadProgress = ref(0)
const isDragging = ref(false)
const fileInputElement = ref<HTMLInputElement | null>(null)

const uploadedContracts = ref<Array<any>>([])
const uploadedVideos = ref<Array<any>>([])

const defaultContracts = [
  {
    name: '药天下ERP软件服务合同',
    desc: '标准版软件服务协议，适用于药品批发企业ERP系统采购',
    size: '245KB',
    type: 'PDF',
    color: '#00D4FF',
    file: 'erp-service-contract.pdf',
  },
  {
    name: 'WMS仓储管理系统合同',
    desc: 'WMS仓储管理系统标准服务合同模板，含SLA条款',
    size: '198KB',
    type: 'PDF',
    color: '#00FF9D',
    file: 'wms-service-contract.pdf',
  },
  {
    name: '深度HIS医院管理系统合同',
    desc: '适用于中小型医院信息化建设的服务合同',
    size: '312KB',
    type: 'PDF',
    color: '#FFB347',
    file: 'his-service-contract.pdf',
  },
  {
    name: '智慧养老平台服务合同',
    desc: '养老机构数字化运营管理系统服务协议',
    size: '176KB',
    type: 'PDF',
    color: '#C084FC',
    file: 'elderly-service-contract.pdf',
  },
  {
    name: '流通码中台系统合同',
    desc: '药品流通码中台系统接入及服务合同模板',
    size: '224KB',
    type: 'PDF',
    color: '#F472B6',
    file: 'circulation-code-contract.pdf',
  },
  {
    name: '合作伙伴框架协议',
    desc: '事业合伙人合作框架协议，含分润及保密条款',
    size: '289KB',
    type: 'PDF',
    color: '#34D399',
    file: 'partner-framework-agreement.pdf',
  },
]

const defaultVideos = [
  {
    name: 'ERP系统快速入门教程',
    desc: '从安装到基础操作，30分钟掌握ERP核心功能',
    duration: '30:15',
    size: '256MB',
    color: '#00D4FF',
    file: 'erp-quickstart.mp4',
  },
  {
    name: 'WMS入库出库操作演示',
    desc: '详细演示WMS系统入库、出库、盘点全流程',
    duration: '22:40',
    size: '189MB',
    color: '#00FF9D',
    file: 'wms-inout-demo.mp4',
  },
  {
    name: 'HIS门诊挂号收费操作',
    desc: 'HIS系统门诊挂号、收费、退费完整操作流程',
    duration: '18:30',
    size: '145MB',
    color: '#FFB347',
    file: 'his-outpatient-demo.mp4',
  },
  {
    name: '流通码扫码操作指南',
    desc: '药品流通码扫码入库、出库及追溯查询操作',
    duration: '12:20',
    size: '98MB',
    color: '#C084FC',
    file: 'circulation-scan-guide.mp4',
  },
  {
    name: '智慧养老平台管理后台',
    desc: '养老平台管理后台配置、人员管理、报表查看',
    duration: '25:10',
    size: '210MB',
    color: '#F472B6',
    file: 'elderly-admin-demo.mp4',
  },
  {
    name: 'ERP财务报表生成教程',
    desc: '利润表、资产负债表、现金流量表生成与导出',
    duration: '15:45',
    size: '128MB',
    color: '#34D399',
    file: 'erp-finance-report.mp4',
  },
  {
    name: '系统权限配置与用户管理',
    desc: '多角色权限分配、用户新增、密码重置操作',
    duration: '10:30',
    size: '85MB',
    color: '#60A5FA',
    file: 'system-permission-config.mp4',
  },
  {
    name: '数据备份与恢复操作',
    desc: '系统数据定时备份配置及手动备份恢复操作',
    duration: '08:15',
    size: '67MB',
    color: '#FB923C',
    file: 'data-backup-restore.mp4',
  },
]

const displayContracts = computed(() => [...uploadedContracts.value, ...defaultContracts])
const displayVideos = computed(() => [...uploadedVideos.value, ...defaultVideos])

const tabs = computed<Array<{ key: 'contract' | 'video'; label: string; count: number }>>(() => [
  { key: 'contract', label: '合同文件', count: displayContracts.value.length },
  { key: 'video', label: '操作视频', count: displayVideos.value.length },
])

async function loadRemoteResources() {
  try {
    const res = await fetch('/api/uploads/list', {
      credentials: 'include',
    })
    const data = await res.json()
    if (!data.success) return
    uploadedContracts.value = data.data.filter((item: any) => item.type === 'contract').map((item: any) => ({
      id: item.id,
      name: item.name,
      desc: item.description,
      size: item.size || '未知',
      type: 'FILE',
      color: '#00D4FF',
      file: item.file_name,
      path: item.file_path,
      uploaded: true,
    }))
    uploadedVideos.value = data.data.filter((item: any) => item.type === 'video').map((item: any) => ({
      id: item.id,
      name: item.name,
      desc: item.description,
      size: item.size || '未知',
      color: '#00FF9D',
      file: item.file_name,
      path: item.file_path,
      duration: '-',
      uploaded: true,
    }))
  } catch (error) {
    console.warn('加载远程文档失败', error)
  }
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

function getDownloadLink(item: any) {
  if (item.path) return item.path
  return `/downloads/${item.file}`
}

function downloadFile(item: any) {
  const link = document.createElement('a')
  link.href = getDownloadLink(item)
  link.download = item.name || item.file || 'download'
  link.click()
}

function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    selectedFile.value = input.files[0]
    if (selectedFile.value.type.startsWith('video/')) uploadType.value = 'video'
  }
}

function handleDrop(event: DragEvent) {
  isDragging.value = false
  if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
    selectedFile.value = event.dataTransfer.files[0]
    if (selectedFile.value.type.startsWith('video/')) uploadType.value = 'video'
  }
}

function triggerFileInput() {
  if (!isAdmin.value) return
  fileInputElement.value?.click()
}

async function deleteUploadedFile(item: any) {
  if (!isAdmin.value) return
  try {
    const headers = getAuthHeaders()
    const res = await fetch(`/api/uploads/${item.id}`, {
      method: 'DELETE',
      headers: headers as HeadersInit,
      credentials: 'include',
    })
    const data = await res.json()
    if (!data.success) throw new Error(data.message || '删除失败')
    await loadRemoteResources()
  } catch (error) {
    alert(`删除失败：${error instanceof Error ? error.message : '未知错误'}`)
  }
}

async function handleUpload() {
  if (!isAdmin.value) {
    alert('仅管理员可上传文件')
    return
  }
  if (!selectedFile.value) return

  uploading.value = true
  uploadProgress.value = 0

  const formData = new FormData()
  formData.append('file', selectedFile.value)
  formData.append('uploadType', uploadType.value)
  formData.append('description', uploadDesc.value || '')

  try {
      const headers = getAuthHeaders()
      console.log('[UPLOAD] 发送请求，Token:', token.value ? '存在' : '不存在', 'Headers:', headers)
      const response = await fetch('/api/upload', {
      method: 'POST',
      headers: headers as HeadersInit,
      body: formData,
      credentials: 'include',
    })
    const result = await response.json()
    if (!result.success) {
      alert(`上传失败：${result.message || '未知错误'}`)
      return
    }
    await loadRemoteResources()
    alert(`上传成功：${result.data.originalname}`)

    showUploadModal.value = false
    selectedFile.value = null
    uploadDesc.value = ''
    uploadType.value = 'contract'
    activeTab.value = uploadType.value
  } catch (error) {
    alert(`上传失败：${error instanceof Error ? error.message : '未知错误'}`)
  } finally {
    uploading.value = false
  }
}

onMounted(() => {
  loadRemoteResources()
})
</script>
