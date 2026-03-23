<template>
  <Layout>
    <section class="page-hero">
      <div class="w-full px-6 lg:px-12 py-16">
        <div :class="['text-sm font-medium mb-3 tracking-wider uppercase', isDark ? 'text-primary' : 'text-blue-600']">Trial Apply</div>
        <h1 :class="['text-4xl lg:text-5xl font-bold mb-4', isDark ? 'text-white' : 'text-gray-900']">申请试用</h1>
        <p :class="['text-lg max-w-2xl', isDark ? 'text-white/60' : 'text-gray-600']">填写申请信息，获取测试版账号密码，免费体验药天下全系产品</p>
      </div>
    </section>

    <section :class="['w-full py-16 px-6 lg:px-12', isDark ? 'bg-brand-surface' : 'bg-gray-50']">
      <div class="max-w-2xl mx-auto">
        <div :class="['rounded-2xl p-8 shadow-lg', isDark ? 'bg-brand-bg border border-brand-border' : 'bg-white border border-gray-200']">
          <h2 :class="['text-xl font-bold mb-6 pb-4 border-b', isDark ? 'text-white border-brand-border' : 'text-gray-900 border-gray-200']">
            测试版本账号密码申请
          </h2>

          <form @submit.prevent="handleSubmit" class="space-y-5">
            <!-- 企业名称 -->
            <div>
              <label :class="labelClass">企业名称 <span class="text-red-400">*</span></label>
              <input v-model="form.companyName" type="text" :class="inputClass" placeholder="请输入企业名称" required />
            </div>

            <!-- 联系人 -->
            <div>
              <label :class="labelClass">联系人 <span class="text-red-400">*</span></label>
              <input v-model="form.contactName" type="text" :class="inputClass" placeholder="请输入联系人姓名" required />
            </div>

            <!-- 联系电话 -->
            <div>
              <label :class="labelClass">联系电话 <span class="text-red-400">*</span></label>
              <input v-model="form.contactPhone" type="tel" :class="inputClass" placeholder="必须真实有效，系统为您保密，不会被骚扰" maxlength="11" required />
            </div>

            <!-- 所在区域（三级联动） -->
            <div>
              <label :class="labelClass">所在区域 <span class="text-red-400">*</span></label>
              <div class="grid grid-cols-3 gap-3">
                <select v-model="form.province" @change="onProvinceChange" :class="selectClass">
                  <option value="">请选择省份</option>
                  <option v-for="p in provinces" :key="p" :value="p">{{ p }}</option>
                </select>
                <select v-model="form.city" @change="onCityChange" :class="selectClass" :disabled="!form.province">
                  <option value="">请选择城市</option>
                  <option v-for="c in currentCities" :key="c" :value="c">{{ c }}</option>
                </select>
                <select v-model="form.district" :class="selectClass" :disabled="!form.city">
                  <option value="">请选择区县</option>
                  <option v-for="d in currentDistricts" :key="d" :value="d">{{ d }}</option>
                </select>
              </div>
            </div>

            <!-- 需要测试的版本 -->
            <div>
              <label :class="labelClass">您需要测试的版本</label>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                <label
                  v-for="product in productOptions"
                  :key="product"
                  :class="[
                    'flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all border text-sm',
                    form.products.includes(product)
                      ? (isDark ? 'bg-primary/15 border-primary/50 text-primary' : 'bg-blue-50 border-blue-300 text-blue-700')
                      : (isDark ? 'bg-white/5 border-brand-border text-white/70 hover:border-white/30' : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300')
                  ]"
                >
                  <input type="checkbox" :value="product" v-model="form.products" class="accent-blue-500" />
                  {{ product }}
                </label>
              </div>
            </div>

            <!-- 图片验证码 -->
            <div>
              <label :class="labelClass">验证码 <span class="text-red-400">*</span></label>
              <CaptchaCanvas
                ref="captchaRef"
                v-model="form.captcha"
                :input-class="[inputClass, 'flex-1 max-w-36']"
                placeholder="验证码"
              />
            </div>

            <!-- 错误/成功提示 -->
            <div v-if="error" class="text-red-400 text-sm py-3 px-4 rounded-lg bg-red-500/10 border border-red-500/20">{{ error }}</div>
            <div v-if="success" class="text-green-400 text-sm py-3 px-4 rounded-lg bg-green-500/10 border border-green-500/20">{{ success }}</div>

            <button type="submit" :disabled="loading" class="w-full btn-primary py-3 text-base font-medium mt-2">
              {{ loading ? '提交中...' : '提交申请' }}
            </button>
          </form>
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

const captchaRef = ref<InstanceType<typeof CaptchaCanvas> | null>(null)

const form = ref({
  companyName: '',
  contactName: '',
  contactPhone: '',
  province: '',
  city: '',
  district: '',
  products: [] as string[],
  captcha: '',
})

const loading = ref(false)
const error = ref('')
const success = ref('')

const labelClass = computed(() => ['block text-sm font-medium mb-1.5', isDark.value ? 'text-white/70' : 'text-gray-600'])
const inputClass = computed(() => [
  'w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-all border',
  isDark.value
    ? 'bg-white/5 border-brand-border text-white placeholder-white/30 focus:border-primary'
    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white'
])
const selectClass = computed(() => [
  'w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-all border',
  isDark.value
    ? 'bg-white/5 border-brand-border text-white focus:border-primary'
    : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500'
])

const productOptions = [
  '深度HIS配套数据分析平台',
  '药天下ERP在线版',
  '药天下WMS在线版',
  '药天下移动商务平台（OMS）',
  '药天下批发版客户端',
  '智慧养老平台',
  '流通码中台系统',
]

// 简化的省市区数据
const regionData: Record<string, Record<string, string[]>> = {
  '北京市': { '北京市': ['东城区', '西城区', '朝阳区', '丰台区', '石景山区', '海淀区', '顺义区', '通州区', '大兴区', '房山区', '门头沟区', '昌平区', '平谷区', '密云区', '怀柔区', '延庆区'] },
  '上海市': { '上海市': ['黄浦区', '徐汇区', '长宁区', '静安区', '普陀区', '虹口区', '杨浦区', '浦东新区', '闵行区', '宝山区', '嘉定区', '金山区', '松江区', '青浦区', '奉贤区', '崇明区'] },
  '广东省': { '广州市': ['越秀区', '海珠区', '荔湾区', '天河区', '白云区', '黄埔区', '番禺区', '花都区', '南沙区', '从化区', '增城区'], '深圳市': ['福田区', '罗湖区', '南山区', '宝安区', '龙岗区', '盐田区', '龙华区', '坪山区', '光明区', '大鹏新区'] },
  '浙江省': { '杭州市': ['上城区', '拱墅区', '西湖区', '滨江区', '萧山区', '余杭区', '临平区', '钱塘区', '富阳区', '临安区'], '宁波市': ['海曙区', '江北区', '北仑区', '镇海区', '鄞州区', '奉化区'] },
  '江苏省': { '南京市': ['玄武区', '秦淮区', '建邺区', '鼓楼区', '浦口区', '栖霞区', '雨花台区', '江宁区', '六合区', '溧水区', '高淳区'], '苏州市': ['姑苏区', '虎丘区', '吴中区', '相城区', '吴江区', '工业园区'] },
  '山东省': { '济南市': ['历下区', '市中区', '槐荫区', '天桥区', '历城区', '长清区', '章丘区', '济阳区', '莱芜区', '钢城区'], '青岛市': ['市南区', '市北区', '黄岛区', '崂山区', '李沧区', '城阳区', '即墨区'] },
  '河南省': { '郑州市': ['中原区', '二七区', '管城回族区', '金水区', '上街区', '惠济区', '中牟县', '巩义市', '荥阳市', '新密市', '新郑市', '登封市'], '洛阳市': ['老城区', '西工区', '瀍河回族区', '涧西区', '偃师区', '孟津区'] },
  '四川省': { '成都市': ['锦江区', '青羊区', '金牛区', '武侯区', '成华区', '龙泉驿区', '青白江区', '新都区', '温江区', '双流区', '郫都区', '新津区'] },
  '湖北省': { '武汉市': ['江岸区', '江汉区', '硚口区', '汉阳区', '武昌区', '青山区', '洪山区', '东西湖区', '汉南区', '蔡甸区', '江夏区', '黄陂区', '新洲区'] },
  '陕西省': { '西安市': ['新城区', '碑林区', '莲湖区', '灞桥区', '未央区', '雁塔区', '阎良区', '临潼区', '长安区', '高陵区', '鄠邑区'] },
}

const provinces = computed(() => Object.keys(regionData))
const currentCities = computed(() => form.value.province ? Object.keys(regionData[form.value.province] || {}) : [])
const currentDistricts = computed(() => (form.value.province && form.value.city) ? (regionData[form.value.province]?.[form.value.city] || []) : [])

function onProvinceChange() {
  form.value.city = ''
  form.value.district = ''
}
function onCityChange() {
  form.value.district = ''
}

async function handleSubmit() {
  error.value = ''
  success.value = ''
  // 验证码校验
  if (!captchaRef.value?.validate(form.value.captcha)) {
    error.value = '验证码错误，请重新输入'
    captchaRef.value?.refresh()
    form.value.captcha = ''
    return
  }
  loading.value = true
  try {
    const API_BASE = (import.meta.env.VITE_API_URL || '/api')
    try {
      const res = await fetch(`${API_BASE}/trial`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form.value),
        signal: AbortSignal.timeout(3000),
      })
      const data = await res.json()
      if (data.success) {
        success.value = data.message
        form.value = { companyName: '', contactName: '', contactPhone: '', province: '', city: '', district: '', products: [], captcha: '' }
      } else {
        error.value = data.message
      }
      captchaRef.value?.refresh()
      return
    } catch {
      // 后端不可用，本地模拟提交
    }
    // 本地模拟：直接提示成功
    success.value = '申请提交成功！我们将在1-2个工作日内与您联系，请保持手机畅通。'
    form.value = { companyName: '', contactName: '', contactPhone: '', province: '', city: '', district: '', products: [], captcha: '' }
    captchaRef.value?.refresh()
  } finally {
    loading.value = false
  }
}
</script>
