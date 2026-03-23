<template>
  <SolutionTemplate
    title="WMS系统"
    en-title="Warehouse Management System"
    subtitle="专业仓储管理系统，支持多温区、多货主、批次效期管理，提升仓储作业效率"
    overview="药天下WMS仓储管理系统专为药品仓储作业设计，支持从收货、上架、拣货、复核、发货的全流程精细化管理。系统内置批次效期管理、先进先出规则、库位优化等专业功能，配合PDA移动作业，帮助仓储企业大幅提升作业效率，降低差错率，实现仓储管理数字化升级。"
    :tags="['仓储管理', '批次管理', '效期预警', 'PDA作业', '库位管理']"
    :stats="[{ value: '99.9%', label: '库存准确率' }, { value: '60%', label: '作业效率提升' }, { value: '80%', label: '差错率降低' }, { value: '30%', label: '仓储成本降低' }]"
    :features="features"
    :advantages="advantages"
  />
</template>

<script setup lang="ts">
import SolutionTemplate from '../../components/common/SolutionTemplate.vue'

const features = [
  { icon: '📦', title: '收货管理', desc: '扫码验收、质量检验、上架指引，收货效率提升50%，差错率接近零' },
  { icon: '🗺️', title: '库位管理', desc: '库位编码、货物定位、库位优化，实现货物精准定位，快速拣货' },
  { icon: '📋', title: '拣货管理', desc: '波次拣货、路径优化、PDA导航，拣货效率提升60%以上' },
  { icon: '⏰', title: '效期管理', desc: '批次效期全程追踪，临期预警，先进先出自动控制，杜绝过期药品流出' },
  { icon: '📊', title: '库存盘点', desc: '动态盘点、循环盘点、差异分析，库存准确率达到99.9%以上' },
  { icon: '🔗', title: '系统集成', desc: '与ERP、TMS、追溯系统无缝集成，数据自动同步，消除信息孤岛' },
]

const advantages = [
  { icon: '📱', title: 'PDA移动作业', desc: '全程PDA扫码作业，无纸化操作，实时数据上传，作业效率大幅提升' },
  { icon: '⏰', title: '效期精细管理', desc: '批次效期全程追踪，自动执行先进先出规则，确保药品质量安全' },
  { icon: '🔍', title: '全程可追溯', desc: '每一箱药品的入库、存储、出库全程记录，支持正向追踪和反向溯源' },
  { icon: '📊', title: '智能报表', desc: '库存周转率、作业效率、差错分析等多维度报表，助力仓储管理优化' },
]
</script>
