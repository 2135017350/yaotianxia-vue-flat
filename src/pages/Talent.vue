<template>
  <Layout>
    <!-- Hero 区域 -->
    <section class="w-full relative overflow-hidden py-24 px-6 lg:px-12"
             :style="isDark ? 'background: linear-gradient(135deg, #070E1A 0%, #0D1B2E 100%)' : 'background: linear-gradient(135deg, #EBF8FF 0%, #DBEAFE 60%, #EDE9FE 100%)'">
      <!-- 背景装饰 -->
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[150px]"
             style="background: radial-gradient(circle, rgba(255,140,0,0.15) 0%, transparent 70%)"/>
        <div class="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[120px]"
             style="background: radial-gradient(circle, rgba(255,80,0,0.10) 0%, transparent 70%)"/>
        <!-- 网格背景 -->
        <div class="absolute inset-0 opacity-5"
             style="background-image: linear-gradient(rgba(255,140,0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,140,0,0.5) 1px, transparent 1px); background-size: 60px 60px"/>
      </div>

      <div class="relative z-10 max-w-5xl">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-6"
             style="border-color: rgba(255,140,0,0.3); background: rgba(255,140,0,0.08)">
          <span class="w-2 h-2 rounded-full animate-pulse" style="background: #FF8C00"/>
          <span class="text-xs tracking-widest uppercase" style="color: #FF8C00">Talent Recruitment</span>
        </div>

        <h1 :class="['text-4xl lg:text-6xl font-black mb-6 leading-tight', isDark ? 'text-white' : 'text-gray-900']">
          寻找<span style="background: linear-gradient(135deg, #FF8C00, #FF4500); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">千里马</span>
          <br>共创医药数字化未来
        </h1>
        <p :class="['text-lg max-w-2xl mb-10 leading-relaxed', isDark ? 'text-white/60' : 'text-gray-600']">
          药天下科技深耕医药管理软件14年，我们相信人才是企业最重要的资产。
          无论你是技术精英、销售达人还是运营高手，这里都有你施展才华的舞台。
        </p>

        <!-- 统计数据 -->
        <div class="flex flex-wrap gap-8 mb-10">
          <div v-for="stat in heroStats" :key="stat.label" class="text-center">
            <div class="text-3xl font-black mb-1" style="color: #FF8C00">{{ stat.value }}</div>
            <div :class="['text-sm', isDark ? 'text-white/40' : 'text-gray-500']">{{ stat.label }}</div>
          </div>
        </div>

        <div class="flex flex-wrap gap-4">
          <a href="#positions"
             class="px-8 py-3.5 rounded-xl font-semibold text-white transition-all duration-300 hover:-translate-y-1"
             style="background: linear-gradient(135deg, #FF8C00, #FF4500); box-shadow: 0 8px 25px rgba(255,140,0,0.3)">
            查看招聘职位
          </a>
          <a href="#culture"
             class="px-8 py-3.5 rounded-xl font-semibold border transition-all duration-300 hover:-translate-y-1"
             style="border-color: rgba(255,140,0,0.4); color: #FF8C00; background: rgba(255,140,0,0.05)">
            了解公司文化
          </a>
        </div>
      </div>
    </section>

    <!-- 公司文化 -->
    <section id="culture" class="py-20 px-6 lg:px-12"
             :class="isDark ? 'bg-brand-surface' : 'bg-white'">
      <div class="text-center mb-14">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border mb-4"
             style="border-color: rgba(255,140,0,0.3); background: rgba(255,140,0,0.08)">
          <span class="text-xs tracking-widest uppercase" style="color: #FF8C00">Company Culture</span>
        </div>
        <h2 :class="['text-3xl lg:text-4xl font-black', isDark ? 'text-white' : 'text-gray-900']">我们的文化与价值观</h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="culture in cultures"
          :key="culture.title"
          :class="['p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-2 cursor-default', isDark ? 'border-orange-900/30 hover:border-orange-500/30' : 'border-orange-100 hover:border-orange-300']"
          :style="isDark ? 'background: rgba(255,140,0,0.04)' : 'background: white'"
        >
          <div class="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-2xl"
               style="background: rgba(255,140,0,0.12)">
            {{ culture.icon }}
          </div>
          <h3 :class="['font-bold text-lg mb-2', isDark ? 'text-white' : 'text-gray-900']">{{ culture.title }}</h3>
          <p :class="['text-sm leading-relaxed', isDark ? 'text-white/50' : 'text-gray-500']">{{ culture.desc }}</p>
        </div>
      </div>
    </section>

    <!-- 员工福利 -->
    <section class="py-20 px-6 lg:px-12"
             :class="isDark ? 'bg-brand-bg' : 'bg-gray-50'">
      <div class="text-center mb-14">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border mb-4"
             style="border-color: rgba(255,140,0,0.3); background: rgba(255,140,0,0.08)">
          <span class="text-xs tracking-widest uppercase" style="color: #FF8C00">Benefits</span>
        </div>
        <h2 :class="['text-3xl lg:text-4xl font-black', isDark ? 'text-white' : 'text-gray-900']">员工福利待遇</h2>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div
          v-for="benefit in benefits"
          :key="benefit.label"
          :class="['p-5 rounded-2xl text-center transition-all duration-300 hover:-translate-y-1 border', isDark ? 'border-orange-900/20 hover:border-orange-500/30' : 'border-orange-100 hover:border-orange-300 bg-white']"
          :style="isDark ? 'background: rgba(255,140,0,0.04)' : ''"
        >
          <div class="text-3xl mb-3">{{ benefit.icon }}</div>
          <div :class="['text-sm font-semibold', isDark ? 'text-white/80' : 'text-gray-800']">{{ benefit.label }}</div>
          <div :class="['text-xs mt-1', isDark ? 'text-white/40' : 'text-gray-400']">{{ benefit.desc }}</div>
        </div>
      </div>
    </section>

    <!-- 招聘职位 -->
    <section id="positions" class="py-20 px-6 lg:px-12"
             :class="isDark ? 'bg-brand-surface' : 'bg-white'">
      <div class="text-center mb-14">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border mb-4"
             style="border-color: rgba(255,140,0,0.3); background: rgba(255,140,0,0.08)">
          <span class="text-xs tracking-widest uppercase" style="color: #FF8C00">Open Positions</span>
        </div>
        <h2 :class="['text-3xl lg:text-4xl font-black mb-3', isDark ? 'text-white' : 'text-gray-900']">热招职位</h2>
        <p :class="['text-sm', isDark ? 'text-white/40' : 'text-gray-400']">共 {{ positions.length }} 个职位虚位以待</p>
      </div>

      <!-- 职位分类筛选 -->
      <div class="flex gap-2 mb-8 flex-wrap justify-center">
        <button
          v-for="cat in categories"
          :key="cat"
          @click="activeCategory = cat"
          :class="['px-4 py-2 rounded-full text-sm font-medium transition-all duration-200', activeCategory === cat ? 'text-white' : (isDark ? 'text-white/50 hover:text-white/80' : 'text-gray-500 hover:text-gray-700')]"
          :style="activeCategory === cat ? 'background: linear-gradient(135deg, #FF8C00, #FF4500)' : (isDark ? 'background: rgba(255,140,0,0.08)' : 'background: #FFF0E0')"
        >
          {{ cat }}
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto">
        <div
          v-for="pos in filteredPositions"
          :key="pos.title"
          :class="['p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 cursor-pointer group', isDark ? 'border-orange-900/30 hover:border-orange-500/40' : 'border-orange-100 hover:border-orange-300 bg-white']"
          :style="isDark ? 'background: rgba(255,140,0,0.04)' : ''"
          @click="selectedPosition = pos"
        >
          <div class="flex items-start justify-between mb-4">
            <div>
              <h3 :class="['font-bold text-lg mb-1 group-hover:text-orange-400 transition-colors', isDark ? 'text-white' : 'text-gray-900']">
                {{ pos.title }}
              </h3>
              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-xs px-2 py-0.5 rounded-full text-white"
                      style="background: linear-gradient(135deg, #FF8C00, #FF4500)">{{ pos.dept }}</span>
                <span :class="['text-xs', isDark ? 'text-white/40' : 'text-gray-400']">{{ pos.location }}</span>
                <span :class="['text-xs', isDark ? 'text-white/40' : 'text-gray-400']">{{ pos.type }}</span>
              </div>
            </div>
            <div class="text-right flex-shrink-0 ml-4">
              <div class="font-bold text-sm" style="color: #FF8C00">{{ pos.salary }}</div>
              <div :class="['text-xs mt-0.5', isDark ? 'text-white/30' : 'text-gray-400']">{{ pos.headcount }}人</div>
            </div>
          </div>
          <p :class="['text-sm line-clamp-2 mb-4', isDark ? 'text-white/50' : 'text-gray-500']">{{ pos.desc }}</p>
          <div class="flex flex-wrap gap-1.5">
            <span v-for="tag in pos.tags" :key="tag"
                  :class="['text-xs px-2 py-0.5 rounded-full', isDark ? 'bg-orange-900/20 text-orange-400/70' : 'bg-orange-50 text-orange-600']">
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- 投递简历 CTA -->
    <section class="py-20 px-6 lg:px-12 text-center"
             :style="isDark ? 'background: linear-gradient(135deg, #070E1A 0%, #0D1B2E 100%)' : 'background: linear-gradient(135deg, #EBF8FF 0%, #DBEAFE 60%, #EDE9FE 100%)'">
      <div class="max-w-2xl mx-auto">
        <h2 :class="['text-3xl lg:text-4xl font-black mb-4', isDark ? 'text-white' : 'text-gray-900']">准备好加入我们了吗？</h2>
        <p :class="['mb-8', isDark ? 'text-white/50' : 'text-gray-500']">将简历发送至招聘邮箱，我们会在3个工作日内与您联系</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a href="mailto:hr@yaotianxia.com"
             class="px-8 py-3.5 rounded-xl font-semibold text-white transition-all duration-300 hover:-translate-y-1"
             style="background: linear-gradient(135deg, #FF8C00, #FF4500); box-shadow: 0 8px 25px rgba(255,140,0,0.3)">
            📧 发送简历至 hr@yaotianxia.com
          </a>
          <a href="tel:4006635617"
             class="px-8 py-3.5 rounded-xl font-semibold border transition-all duration-300 hover:-translate-y-1"
             style="border-color: rgba(255,140,0,0.4); color: #FF8C00">
            📞 400 663 5617
          </a>
        </div>
      </div>
    </section>

    <!-- 职位详情弹窗 -->
    <Transition name="modal">
      <div v-if="selectedPosition" class="fixed inset-0 z-50 flex items-center justify-center p-4"
           @click.self="selectedPosition = null">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="selectedPosition = null"/>
        <div :class="['relative w-full max-w-lg rounded-2xl p-6 shadow-2xl', isDark ? 'bg-brand-surface border border-white/10' : 'bg-white border border-orange-100']">
          <button @click="selectedPosition = null"
                  :class="['absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center', isDark ? 'bg-white/10 text-white/60 hover:bg-white/20' : 'bg-gray-100 text-gray-500 hover:bg-gray-200']">
            ✕
          </button>
          <div class="mb-4">
            <h3 :class="['text-xl font-bold mb-2', isDark ? 'text-white' : 'text-gray-900']">{{ selectedPosition.title }}</h3>
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-xs px-2 py-0.5 rounded-full text-white"
                    style="background: linear-gradient(135deg, #FF8C00, #FF4500)">{{ selectedPosition.dept }}</span>
              <span :class="['text-xs', isDark ? 'text-white/40' : 'text-gray-400']">{{ selectedPosition.location }}</span>
              <span class="font-semibold text-sm" style="color: #FF8C00">{{ selectedPosition.salary }}</span>
            </div>
          </div>
          <div :class="['text-sm space-y-3', isDark ? 'text-white/60' : 'text-gray-600']">
            <div>
              <div :class="['font-semibold mb-1', isDark ? 'text-white/80' : 'text-gray-800']">职位描述</div>
              <p>{{ selectedPosition.desc }}</p>
            </div>
            <div>
              <div :class="['font-semibold mb-1', isDark ? 'text-white/80' : 'text-gray-800']">任职要求</div>
              <ul class="space-y-1">
                <li v-for="req in selectedPosition.requirements" :key="req" class="flex items-start gap-2">
                  <span style="color: #FF8C00" class="mt-0.5">•</span>
                  <span>{{ req }}</span>
                </li>
              </ul>
            </div>
          </div>
          <div class="mt-6">
            <a :href="`mailto:hr@yaotianxia.com?subject=应聘${selectedPosition.title}`"
               class="w-full block text-center py-3 rounded-xl font-semibold text-white transition-all"
               style="background: linear-gradient(135deg, #FF8C00, #FF4500)">
              立即投递简历
            </a>
          </div>
        </div>
      </div>
    </Transition>
  </Layout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Layout from '../components/common/Layout.vue'
import { useTheme } from '../composables/useTheme'

const { theme } = useTheme()
const isDark = computed(() => theme.value === 'dark')

const activeCategory = ref('全部')
const selectedPosition = ref<typeof positions[0] | null>(null)

const heroStats = [
  { value: '14年', label: '深耕医药行业' },
  { value: '200+', label: '在职员工' },
  { value: '4家', label: '旗下公司' },
  { value: '31省', label: '客户遍布全国' },
]

const cultures = [
  { icon: '🏆', title: '追求卓越', desc: '我们鼓励每位员工挑战极限，在各自领域追求最高水准的专业表现' },
  { icon: '🤝', title: '协作共赢', desc: '跨部门协作是我们的基因，相信团队的力量远大于个体的总和' },
  { icon: '🌱', title: '持续成长', desc: '提供完善的培训体系和晋升通道，让每位员工都能实现职业价值' },
  { icon: '💡', title: '创新驱动', desc: '鼓励大胆创新，容忍合理失败，用技术创新推动医药行业数字化变革' },
]

const benefits = [
  { icon: '💰', label: '竞争薪资', desc: '行业前20%' },
  { icon: '🏥', label: '五险一金', desc: '全额缴纳' },
  { icon: '🎯', label: '绩效奖金', desc: '季度+年终' },
  { icon: '📚', label: '培训补贴', desc: '年度1万元' },
  { icon: '🏖️', label: '带薪年假', desc: '10-20天' },
  { icon: '🎉', label: '团建活动', desc: '季度出游' },
]

const categories = ['全部', '技术研发', '销售市场', '产品运营', '职能支持']

const positions = [
  {
    title: 'Java 后端开发工程师',
    dept: '技术研发',
    location: '北京',
    type: '全职',
    salary: '15K-25K',
    headcount: 3,
    desc: '负责药天下ERP/WMS/HIS系统后端开发，参与核心业务模块设计与实现，优化系统性能',
    tags: ['Java', 'Spring Boot', 'MySQL', 'Redis'],
    requirements: [
      '本科及以上学历，计算机相关专业',
      '3年以上Java开发经验，熟悉Spring Boot/Cloud',
      '熟悉MySQL数据库设计与优化',
      '有医疗/医药行业系统开发经验者优先',
    ],
  },
  {
    title: '前端开发工程师',
    dept: '技术研发',
    location: '北京',
    type: '全职',
    salary: '12K-20K',
    headcount: 2,
    desc: '负责药天下产品Web端及移动端前端开发，与产品和后端紧密协作，打造优质用户体验',
    tags: ['Vue3', 'TypeScript', 'Element Plus', 'Vite'],
    requirements: [
      '本科及以上学历，2年以上前端开发经验',
      '熟练掌握Vue3/React，有TypeScript实战经验',
      '了解前端工程化，熟悉Vite/Webpack',
      '有ToB产品开发经验者优先',
    ],
  },
  {
    title: '医药行业销售经理',
    dept: '销售市场',
    location: '全国',
    type: '全职',
    salary: '8K-15K+提成',
    headcount: 10,
    desc: '负责药天下ERP/WMS产品的销售推广，开拓药品批发企业、连锁药店等客户资源',
    tags: ['医药行业', 'ERP销售', '客户开发', 'B2B'],
    requirements: [
      '大专及以上学历，有医药行业工作经验优先',
      '具备较强的客户开拓和维护能力',
      '有医药软件或ERP系统销售经验者优先',
      '能接受一定程度出差',
    ],
  },
  {
    title: '产品经理',
    dept: '产品运营',
    location: '北京',
    type: '全职',
    salary: '15K-25K',
    headcount: 2,
    desc: '负责药天下核心产品规划与迭代，深入理解医药行业业务需求，推动产品持续优化',
    tags: ['产品规划', '需求分析', '医药行业', 'Axure'],
    requirements: [
      '本科及以上学历，3年以上产品经理经验',
      '有医疗/医药行业SaaS产品经验优先',
      '能独立完成需求分析、原型设计、文档撰写',
      '具备较强的跨部门沟通协调能力',
    ],
  },
  {
    title: '实施顾问',
    dept: '产品运营',
    location: '全国',
    type: '全职',
    salary: '8K-14K',
    headcount: 5,
    desc: '负责药天下产品的客户现场实施、培训及售后支持，确保客户顺利上线并满意使用',
    tags: ['ERP实施', '客户培训', '售后支持', '医药行业'],
    requirements: [
      '大专及以上学历，有ERP/HIS实施经验优先',
      '了解医药行业业务流程',
      '具备良好的沟通表达和培训能力',
      '能接受出差（全国范围）',
    ],
  },
  {
    title: '人力资源专员',
    dept: '职能支持',
    location: '北京',
    type: '全职',
    salary: '6K-10K',
    headcount: 1,
    desc: '负责公司招聘、员工关系、薪酬绩效等人力资源日常工作，支持公司快速发展',
    tags: ['招聘', '员工关系', '薪酬绩效', 'HRBP'],
    requirements: [
      '本科及以上学历，人力资源管理相关专业',
      '2年以上人力资源工作经验',
      '熟悉劳动法及相关法规',
      '有互联网/软件公司HR经验者优先',
    ],
  },
]

const filteredPositions = computed(() => {
  if (activeCategory.value === '全部') return positions
  return positions.filter(p => p.dept === activeCategory.value)
})
</script>

<style scoped>
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-from, .modal-leave-to {
  opacity: 0;
}
</style>
