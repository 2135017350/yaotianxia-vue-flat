<template>
  <SolutionTemplate
    title="智慧医疗"
    en-title="Smart Medical"
    subtitle="为中小型医院、诊所提供一体化HIS系统，覆盖门诊、住院、药房、检验等全业务场景"
    overview="药天下深度HIS医院管理系统专为中小型医院、社区卫生服务中心、诊所设计，提供从挂号收费到出院结算的全流程管理。系统支持医保接入、电子病历、合理用药提醒等核心功能，帮助医疗机构提升服务质量，降低运营成本，实现数字化转型。"
    :tags="['HIS系统', '电子病历', '门诊管理', '住院管理', '医保接入']"
    :stats="[{ value: '60%', label: '挂号等待减少' }, { value: '80%', label: '病历书写提速' }, { value: '100%', label: '医保合规接入' }, { value: '30%', label: '运营成本降低' }]"
    :features="features"
    :advantages="advantages"
  />
</template>

<script setup lang="ts">
import SolutionTemplate from '../../components/common/SolutionTemplate.vue'

const features = [
  { icon: '📋', title: '门诊管理', desc: '挂号、分诊、就诊、收费全流程管理，支持预约挂号和自助服务' },
  { icon: '📝', title: '电子病历', desc: '结构化电子病历，支持模板快速录入，病历质控，历史记录查询' },
  { icon: '💊', title: '药房管理', desc: '门诊药房、住院药房一体化管理，合理用药提醒，药品追溯' },
  { icon: '🏥', title: '住院管理', desc: '入院、在院、出院全流程管理，床位管理，护理记录，费用结算' },
  { icon: '🔬', title: '检验检查', desc: '检验申请、样本管理、结果录入、报告打印全流程数字化' },
  { icon: '💰', title: '医保结算', desc: '对接医保系统，支持门诊和住院医保结算，自动生成医保报表' },
]

const advantages = [
  { icon: '🏥', title: '专为中小医院设计', desc: '针对中小型医院的实际需求，功能实用、操作简便、价格合理，快速上线' },
  { icon: '🔌', title: '医保无缝对接', desc: '已对接全国多个省市医保系统，帮助医院快速完成医保接入，合规经营' },
  { icon: '📱', title: '移动查房', desc: '医生移动端查房，随时查看患者信息、下达医嘱，提升工作效率' },
  { icon: '🛡️', title: '数据安全', desc: '患者数据加密存储，符合卫生信息安全标准，保障患者隐私安全' },
]
</script>
