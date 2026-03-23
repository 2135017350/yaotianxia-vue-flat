<template>
  <SolutionTemplate
    title="药品三方物流"
    en-title="Third-party Logistics"
    subtitle="为药品第三方物流企业提供专业的仓储配送管理系统，支持温控管理、GSP合规、多客户管理等核心需求"
    overview="药天下三方物流解决方案专为承接药品仓储配送业务的第三方物流企业设计，全面覆盖入库、存储、拣货、配送、退货等全流程作业管理。系统内置GSP合规管理模块，自动生成合规报告，帮助企业轻松通过药监部门检查。支持多温区（常温、阴凉、冷藏、冷冻）精细化管理，确保药品储存安全。"
    :tags="['三方物流', '仓储管理', 'GSP合规', '温控管理', '多客户管理']"
    :stats="[{ value: '99.9%', label: '库存准确率' }, { value: '50%', label: '作业效率提升' }, { value: '100%', label: 'GSP合规率' }, { value: '24h', label: '全天候监控' }]"
    :features="features"
    :advantages="advantages"
  />
</template>

<script setup lang="ts">
import SolutionTemplate from '../../components/common/SolutionTemplate.vue'

const features = [
  { icon: '🌡️', title: '多温区管理', desc: '支持常温、阴凉、冷藏、冷冻多温区精细化管理，实时温湿度监控预警' },
  { icon: '👥', title: '多客户管理', desc: '支持多货主独立管理，库存隔离，费用分摊，报表独立生成' },
  { icon: '📋', title: 'GSP合规管理', desc: '内置GSP质量管理模块，自动生成各类合规报告，轻松应对药监检查' },
  { icon: '🔍', title: '药品追溯', desc: '对接国家药品追溯系统，扫码入库出库，全程追溯记录' },
  { icon: '🚚', title: '配送管理', desc: '路线规划、司机调度、在途追踪、签收确认全流程数字化' },
  { icon: '📊', title: '数据报表', desc: '多维度运营数据分析，库存周转率、配送及时率等关键指标可视化' },
]

const advantages = [
  { icon: '✅', title: '深度GSP合规', desc: '系统设计完全符合《药品经营质量管理规范》要求，帮助企业建立完整的质量管理体系' },
  { icon: '🔗', title: '无缝系统对接', desc: '可与客户的ERP、WMS系统无缝对接，实现数据自动同步，减少人工录入' },
  { icon: '📱', title: 'PDA移动作业', desc: '支持PDA扫码作业，入库、拣货、盘点全程无纸化，提升作业效率50%以上' },
  { icon: '🛡️', title: '安全可靠', desc: '数据加密存储，多重备份机制，确保业务数据安全，系统稳定运行' },
]
</script>
