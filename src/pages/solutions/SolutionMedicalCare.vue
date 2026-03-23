<template>
  <SolutionTemplate
    title="医养结合系统"
    en-title="Medical & Care Integration"
    subtitle="整合医疗与养老服务，实现健康档案共享、慢病管理、远程医疗等医养结合核心功能"
    overview="药天下医养结合系统打通医疗机构与养老机构之间的数据壁垒，实现老人健康档案、诊疗记录、用药信息的共享互通。系统支持慢病管理、健康监测、远程会诊等功能，帮助养老机构提升医疗服务能力，为老人提供连续性、一体化的医养服务。"
    :tags="['医养结合', '健康档案', '慢病管理', '远程医疗', '数据共享']"
    :stats="[{ value: '100%', label: '健康档案电子化' }, { value: '60%', label: '慢病管理效率提升' }, { value: '24h', label: '健康监测覆盖' }, { value: '80%', label: '家属满意度提升' }]"
    :features="features"
    :advantages="advantages"
  />
</template>

<script setup lang="ts">
import SolutionTemplate from '../../components/common/SolutionTemplate.vue'

const features = [
  { icon: '📋', title: '健康档案管理', desc: '建立老人完整健康档案，整合医疗、养老、康复等多方数据，实现信息共享' },
  { icon: '💊', title: '慢病管理', desc: '针对高血压、糖尿病等慢性病，提供用药提醒、指标监测、定期随访管理' },
  { icon: '🩺', title: '远程会诊', desc: '连接医疗机构专家资源，为养老机构老人提供远程问诊和会诊服务' },
  { icon: '📊', title: '健康监测', desc: '对接智能硬件，实时采集血压、血糖、心率等健康数据，异常自动预警' },
  { icon: '🏥', title: '转诊管理', desc: '老人需要住院治疗时，一键发起转诊申请，医疗机构快速响应' },
  { icon: '👨‍👩‍👧', title: '家属互动', desc: '家属小程序，实时查看老人健康状态、服务记录，增强家属信任感' },
]

const advantages = [
  { icon: '🔗', title: '医养数据互通', desc: '打通医疗机构与养老机构数据壁垒，实现老人健康信息无缝流转' },
  { icon: '🏥', title: '专业医疗支撑', desc: '整合医疗机构专家资源，为养老机构提供专业医疗技术支撑' },
  { icon: '📱', title: '多端协同', desc: '医生端、护理端、家属端多端协同，提升服务响应速度和质量' },
  { icon: '📊', title: '数据驱动服务', desc: '基于健康数据分析，为老人提供个性化健康管理方案' },
]
</script>
