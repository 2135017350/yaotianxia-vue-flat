<template>
  <Layout>
    <section class="page-hero">
      <div class="w-full px-6 lg:px-12 py-16">
        <div :class="['text-sm font-medium mb-3 tracking-wider uppercase', isDark ? 'text-primary' : 'text-blue-600']">Partners</div>
        <h1 :class="['text-4xl lg:text-5xl font-bold mb-4', isDark ? 'text-white' : 'text-gray-900']">合作伙伴</h1>
        <p :class="['text-lg max-w-2xl', isDark ? 'text-white/60' : 'text-gray-600']">
          与行业头部企业深度合作，共建医药数字化生态，为客户提供更完整的解决方案
        </p>
      </div>
    </section>

    <!-- 诚征合作 -->
    <section :class="['w-full py-20 px-6 lg:px-12', isDark ? 'bg-brand-surface' : 'bg-white']">
      <div class="text-center mb-12">
        <h2 :class="['text-3xl font-bold mb-2', isDark ? 'text-white' : 'text-gray-900']">诚征合作</h2>
        <div class="flex items-center justify-center gap-2 mb-2">
          <span :class="['text-sm', isDark ? 'text-white/50' : 'text-gray-400']">互利共赢</span>
        </div>
        <div class="w-10 h-0.5 bg-yellow-400 mx-auto"></div>
      </div>

      <div class="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        <!-- 左侧两个理念 -->
        <div class="space-y-8">
          <div v-for="item in cooperationValues.slice(0, 2)" :key="item.num" class="flex items-start gap-4">
            <div class="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                 style="background: linear-gradient(135deg, #00D4FF, #0066CC)">{{ item.num }}</div>
            <div>
              <h4 :class="['font-bold text-sm mb-1', isDark ? 'text-primary' : 'text-blue-600']">{{ item.title }}</h4>
              <p :class="['text-xs leading-relaxed', isDark ? 'text-white/60' : 'text-gray-500']">{{ item.desc }}</p>
            </div>
          </div>
        </div>

        <!-- 中间图片 -->
        <div class="flex justify-center">
          <div class="w-48 h-48 rounded-2xl overflow-hidden shadow-lg"
               :style="isDark ? 'background: rgba(0,212,255,0.08); border: 1px solid rgba(0,212,255,0.2)' : 'background: #f0f4ff; border: 1px solid #dbeafe'">
            <div class="w-full h-full flex items-center justify-center text-7xl">🤝</div>
          </div>
        </div>

        <!-- 右侧两个理念 -->
        <div class="space-y-8">
          <div v-for="item in cooperationValues.slice(2, 4)" :key="item.num" class="flex items-start gap-4">
            <div class="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                 style="background: linear-gradient(135deg, #C084FC, #7C3AED)">{{ item.num }}</div>
            <div>
              <h4 :class="['font-bold text-sm mb-1', isDark ? 'text-purple-400' : 'text-purple-600']">{{ item.title }}</h4>
              <p :class="['text-xs leading-relaxed', isDark ? 'text-white/60' : 'text-gray-500']">{{ item.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 团队壮大 时间轴 -->
    <section :class="['w-full py-20 px-6 lg:px-12', isDark ? 'bg-brand-bg' : 'bg-gray-50']">
      <div class="text-center mb-14">
        <h2 :class="['text-3xl font-bold mb-2', isDark ? 'text-white' : 'text-gray-900']">团队壮大</h2>
        <div class="w-10 h-0.5 bg-yellow-400 mx-auto"></div>
      </div>

      <!-- 时间轴 -->
      <div class="max-w-5xl mx-auto overflow-x-auto">
        <div class="relative min-w-[700px]">
          <!-- 横线 -->
          <div class="absolute top-[52px] left-0 right-0 h-0.5"
               :style="isDark ? 'background: rgba(0,212,255,0.2)' : 'background: #dbeafe'"></div>

          <div class="flex justify-between items-start relative">
            <div v-for="milestone in milestones" :key="milestone.year" class="flex flex-col items-center w-1/5 px-2">
              <!-- 时间 -->
              <div :class="['text-xs mb-3 font-medium', isDark ? 'text-white/50' : 'text-gray-400']">{{ milestone.year }}</div>
              <!-- 圆点 -->
              <div class="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold z-10 mb-3"
                   :style="`background: ${milestone.color}`">{{ milestone.label }}</div>
              <!-- 内容 -->
              <div :class="['text-xs leading-relaxed text-center', isDark ? 'text-white/60' : 'text-gray-500']">{{ milestone.desc }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 合作优势 -->
    <section :class="['w-full py-20 px-6 lg:px-12', isDark ? 'bg-brand-surface' : 'bg-white']">
      <div class="text-center mb-12">
        <h2 :class="['text-3xl font-bold mb-2', isDark ? 'text-white' : 'text-gray-900']">合作优势</h2>
        <div class="w-10 h-0.5 bg-yellow-400 mx-auto mb-6"></div>
        <p :class="['text-sm max-w-2xl mx-auto', isDark ? 'text-white/60' : 'text-gray-500']">
          面对全国的千亿市场，目前的药天下团队还远远不够，我们为各种合作伙伴提供最优化的持续政策：
        </p>
      </div>

      <!-- 外框 -->
      <div class="max-w-5xl mx-auto rounded-xl border-2 p-6"
           :style="isDark ? 'border-color: rgba(0,212,255,0.2)' : 'border-color: #bfdbfe'">
        <div :class="['text-sm font-bold mb-4 pb-2 border-b', isDark ? 'text-primary border-white/10' : 'text-blue-600 border-blue-100']">合作优势</div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-0">
          <!-- 优势1 -->
          <div class="flex gap-0 border-b border-r"
               :style="isDark ? 'border-color: rgba(255,255,255,0.06)' : 'border-color: #e0e7ff'">
            <div class="w-32 h-32 flex-shrink-0 overflow-hidden rounded-lg m-3"
                 :style="isDark ? 'background: rgba(0,212,255,0.08)' : 'background: #eff6ff'">
              <div class="w-full h-full flex items-center justify-center text-4xl">🏥</div>
            </div>
            <div class="p-4 flex flex-col justify-center">
              <div class="text-blue-500 font-bold text-lg mb-1">01</div>
              <h4 :class="['font-bold text-sm mb-2', isDark ? 'text-white' : 'text-gray-900']">千亿级的市场</h4>
              <p :class="['text-xs leading-relaxed mb-3', isDark ? 'text-white/60' : 'text-gray-500']">医药、医疗这个行业有千亿级的软件市场，目前70%的企业系统都面临改造。</p>
              <a href="/contact" :class="['text-xs px-4 py-1.5 rounded text-white inline-block w-fit', isDark ? 'bg-blue-600 hover:bg-blue-500' : 'bg-blue-600 hover:bg-blue-700']">查看更多</a>
            </div>
          </div>

          <!-- 优势3 -->
          <div class="flex gap-0 border-b"
               :style="isDark ? 'border-color: rgba(255,255,255,0.06)' : 'border-color: #e0e7ff'">
            <div class="w-32 h-32 flex-shrink-0 overflow-hidden rounded-lg m-3"
                 :style="isDark ? 'background: rgba(192,132,252,0.08)' : 'background: #f5f3ff'">
              <div class="w-full h-full flex items-center justify-center text-4xl">📋</div>
            </div>
            <div class="p-4 flex flex-col justify-center">
              <div class="text-purple-500 font-bold text-lg mb-1">03</div>
              <h4 :class="['font-bold text-sm mb-2', isDark ? 'text-white' : 'text-gray-900']">基本免费的代理价格政策</h4>
              <p :class="['text-xs leading-relaxed mb-3', isDark ? 'text-white/60' : 'text-gray-500']">只要你有技术或有资源，不破坏公司价格体系，不占公司技术，不破坏产品口碑，价格协议了算。</p>
              <a href="/contact" :class="['text-xs px-4 py-1.5 rounded text-white inline-block w-fit', isDark ? 'bg-purple-600 hover:bg-purple-500' : 'bg-purple-600 hover:bg-purple-700']">查看更多</a>
            </div>
          </div>

          <!-- 优势2 -->
          <div class="flex gap-0 border-r"
               :style="isDark ? 'border-color: rgba(255,255,255,0.06)' : 'border-color: #e0e7ff'">
            <div class="w-32 h-32 flex-shrink-0 overflow-hidden rounded-lg m-3"
                 :style="isDark ? 'background: rgba(0,255,157,0.08)' : 'background: #f0fdf4'">
              <div class="w-full h-full flex items-center justify-center text-4xl">🏆</div>
            </div>
            <div class="p-4 flex flex-col justify-center">
              <div class="text-green-500 font-bold text-lg mb-1">02</div>
              <h4 :class="['font-bold text-sm mb-2', isDark ? 'text-white' : 'text-gray-900']">品牌支持</h4>
              <p :class="['text-xs leading-relaxed mb-3', isDark ? 'text-white/60' : 'text-gray-500']">药天下14年品牌沉淀，众多的客户群，让你的客户不孤单，告别孤单广告，让你坚定坚持市。</p>
              <a href="/contact" :class="['text-xs px-4 py-1.5 rounded text-white inline-block w-fit', isDark ? 'bg-green-600 hover:bg-green-500' : 'bg-green-600 hover:bg-green-700']">查看更多</a>
            </div>
          </div>

          <!-- 优势4 -->
          <div class="flex gap-0">
            <div class="w-32 h-32 flex-shrink-0 overflow-hidden rounded-lg m-3"
                 :style="isDark ? 'background: rgba(255,179,71,0.08)' : 'background: #fffbeb'">
              <div class="w-full h-full flex items-center justify-center text-4xl">🛠️</div>
            </div>
            <div class="p-4 flex flex-col justify-center">
              <div class="text-yellow-500 font-bold text-lg mb-1">04</div>
              <h4 :class="['font-bold text-sm mb-2', isDark ? 'text-white' : 'text-gray-900']">强有力的技术支持</h4>
              <p :class="['text-xs leading-relaxed mb-3', isDark ? 'text-white/60' : 'text-gray-500']">如果你仅有客户没有资源，可以免费培训，售中支持和售后服务都交给我们，你只需分钱。</p>
              <a href="/contact" :class="['text-xs px-4 py-1.5 rounded text-white inline-block w-fit', isDark ? 'bg-yellow-600 hover:bg-yellow-500' : 'bg-yellow-600 hover:bg-yellow-700']">查看更多</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 欢迎您的加入 -->
    <section :class="['w-full py-20 px-6 lg:px-12 text-center', isDark ? 'bg-brand-bg' : 'bg-gray-50']">
      <div class="text-center mb-12">
        <h2 :class="['text-3xl font-bold mb-2', isDark ? 'text-white' : 'text-gray-900']">欢迎您的加入</h2>
        <div class="w-10 h-0.5 bg-yellow-400 mx-auto"></div>
      </div>

      <div class="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- 电话 -->
        <div class="flex flex-col items-center gap-3">
          <div class="w-16 h-16 rounded-full flex items-center justify-center text-2xl border-2"
               :style="isDark ? 'border-color: rgba(0,212,255,0.3); background: rgba(0,212,255,0.08)' : 'border-color: #bfdbfe; background: #eff6ff'">📞</div>
          <div>
            <div :class="['text-sm font-medium mb-1', isDark ? 'text-white/70' : 'text-gray-600']">服务热线</div>
            <div :class="['font-bold', isDark ? 'text-primary' : 'text-blue-600']">400 663 5617</div>
          </div>
        </div>

        <!-- 地址 -->
        <div class="flex flex-col items-center gap-3">
          <div class="w-16 h-16 rounded-full flex items-center justify-center text-2xl border-2"
               :style="isDark ? 'border-color: rgba(0,212,255,0.3); background: rgba(0,212,255,0.08)' : 'border-color: #bfdbfe; background: #eff6ff'">📍</div>
          <div>
            <div :class="['text-sm font-medium mb-1', isDark ? 'text-white/70' : 'text-gray-600']">公司地址</div>
            <div :class="['text-sm', isDark ? 'text-white/80' : 'text-gray-700']">北京市海淀区北太平庄路18号3层</div>
          </div>
        </div>

        <!-- 邮箱 -->
        <div class="flex flex-col items-center gap-3">
          <div class="w-16 h-16 rounded-full flex items-center justify-center text-2xl border-2"
               :style="isDark ? 'border-color: rgba(0,212,255,0.3); background: rgba(0,212,255,0.08)' : 'border-color: #bfdbfe; background: #eff6ff'">✉️</div>
          <div>
            <div :class="['text-sm font-medium mb-1', isDark ? 'text-white/70' : 'text-gray-600']">商务邮箱</div>
            <div :class="['text-sm', isDark ? 'text-white/80' : 'text-gray-700']">1359629003@qq.com</div>
          </div>
        </div>
      </div>

      <div class="mt-10">
        <RouterLink to="/contact" class="btn-primary px-10 py-4 text-base">立即联系我们</RouterLink>
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

const cooperationValues = [
  {
    num: '01',
    title: '使命：天下互联 一统天下《做诊药行业的阿里巴巴》',
    desc: '以互联网思维重构医药行业，打通上下游信息链，让每一家医药企业都能享受数字化红利。',
  },
  {
    num: '03',
    title: '深度价值观：用户第一，工匠精神，团队合作，拥抱创新，成佛知一，敢慢情在',
    desc: '坚持用户第一，以工匠精神打磨产品，团队协作共进，持续拥抱变化，追求极致体验。',
  },
  {
    num: '02',
    title: '深度愿景：让药天下成为大健康行业软件的代名词，做大健康行业的领航者',
    desc: '立志成为大健康行业软件标杆，引领行业数字化转型，服务全国医药企业。',
  },
  {
    num: '04',
    title: '深度优势：管理体系成熟；全新管理思想和设计理念；高度的灵活性和扩展性；系列产品和解决方案大限度的满足客户的不同应用',
    desc: '14年深耕医药行业，积累了成熟的管理体系和丰富的行业经验，产品覆盖医药全业态。',
  },
]

const milestones = [
  {
    year: '2014年5月',
    label: '萌芽',
    color: '#9CA3AF',
    desc: '2014年5月9号我们的第一粒种子在深度科技发芽。',
  },
  {
    year: '2019年11月',
    label: '初成',
    color: '#F59E0B',
    desc: '深度科技发展出来，天下互联企业合伙人大会，"远未来"中原城市论坛讨论召开。',
  },
  {
    year: '2019年12月',
    label: '发展',
    color: '#EF4444',
    desc: '深度科技集团成立，深圳市场讨论会议，尚品研讨会召开，商委企业主企业代理商经营状况。',
  },
  {
    year: '2020年4月',
    label: '高速',
    color: '#10B981',
    desc: '疫情期间，郑州深度软件研发团队加强，团队加快，本地化，免费提供给多个省份使用，高以知识链接持续推动线上线下的区域工作。',
  },
  {
    year: '2021年9月',
    label: '起飞',
    color: '#3B82F6',
    desc: '深度科技团队及区域认可手上，招募培训更多合伙伙伴加入队。',
  },
]
</script>
