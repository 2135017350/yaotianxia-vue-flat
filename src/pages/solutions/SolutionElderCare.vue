<template>
  <SolutionTemplate
    title="智慧养老"
    en-title="Smart Elder Care"
    subtitle="机构养老与居家养老双模式并行，提供全方位老人服务管理，助力养老机构数字化升级"
    overview="药天下智慧养老平台支持机构养老和居家养老两种运营模式，提供老人档案管理、床位管理、服务调度、费用结算等核心功能。平台通过物联网设备接入，实现老人安全监护和健康监测，同时提供家属小程序，让家属随时了解老人状态，提升养老服务质量和家属满意度。"
    :tags="['机构养老', '居家养老', '智慧养老', '物联网', '服务调度']"
    :stats="[{ value: '50%', label: '服务效率提升' }, { value: '90%', label: '家属满意度' }, { value: '24h', label: '安全监护' }, { value: '30%', label: '运营成本降低' }]"
    :features="features"
    :advantages="advantages"
  />
</template>

<script setup lang="ts">
import SolutionTemplate from '../../components/common/SolutionTemplate.vue'

const features = [
  { icon: '👴', title: '老人档案管理', desc: '建立老人完整档案，包括基本信息、健康状况、服务需求、家属联系等' },
  { icon: '🛏️', title: '床位管理', desc: '床位状态实时显示，入住、转床、离院全流程管理，床位利用率统计' },
  { icon: '📋', title: '服务工单管理', desc: '服务计划制定、工单派发、执行记录、质量评估全流程数字化管理' },
  { icon: '🔔', title: '安全监护', desc: '对接智能床垫、门磁、紧急呼叫等设备，老人异常情况自动报警' },
  { icon: '💰', title: '费用管理', desc: '入住费、服务费、餐费等多类费用统一管理，自动生成账单，支持多种支付方式' },
  { icon: '📱', title: '家属小程序', desc: '家属通过小程序实时查看老人状态、服务记录、健康数据，在线缴费' },
]

const advantages = [
  { icon: '🏠', title: '双模式并行', desc: '机构养老和居家养老双模式统一管理，一套系统满足不同业务场景需求' },
  { icon: '📱', title: '物联网集成', desc: '深度集成智能硬件设备，实现老人安全监护和健康数据自动采集' },
  { icon: '👨‍👩‍👧', title: '家属透明化', desc: '家属小程序让老人服务全程透明，增强家属信任，提升口碑' },
  { icon: '📊', title: '运营数据分析', desc: '床位利用率、服务质量、收入分析等多维度运营报表，助力科学决策' },
]
</script>
