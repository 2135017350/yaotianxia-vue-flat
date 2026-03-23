<template>
  <SolutionTemplate
    title="医药供应链"
    en-title="Pharma Supply Chain"
    subtitle="打通医药供应链上下游，实现采购、库存、配送、结算全链路数字化管理，降低运营成本"
    overview="药天下医药供应链解决方案以「流通码」为核心，整合供应商、经销商、医疗机构等各方数据，构建透明高效的医药供应链管理体系。通过智能补货、精准预测、协同计划等功能，帮助企业降低库存积压，提升资金周转效率，实现供应链全链路可视化管理。"
    :tags="['供应链管理', '智能补货', '协同计划', '库存优化', '资金周转']"
    :stats="[{ value: '30%', label: '库存成本降低' }, { value: '40%', label: '订单处理提速' }, { value: '95%', label: '订单准时率' }, { value: '20%', label: '资金周转提升' }]"
    :features="features"
    :advantages="advantages"
  />
</template>

<script setup lang="ts">
import SolutionTemplate from '../../components/common/SolutionTemplate.vue'

const features = [
  { icon: '🛒', title: '智能采购管理', desc: '基于历史销售数据和库存水位，智能生成采购建议，减少人工判断误差' },
  { icon: '📦', title: '库存优化', desc: '安全库存预警、效期管理、滞销预警，帮助企业精准控制库存水平' },
  { icon: '🔄', title: '供应商协同', desc: '供应商门户，在线询价、下单、对账，提升采购协同效率' },
  { icon: '💳', title: '结算管理', desc: '自动对账、票据管理、应收应付管理，财务结算效率提升60%' },
  { icon: '📈', title: '需求预测', desc: '基于AI算法的销售预测，提前规划库存和采购计划' },
  { icon: '🗺️', title: '全链路可视化', desc: '从采购到销售的全链路数据可视化，实时掌握供应链运营状态' },
]

const advantages = [
  { icon: '🔗', title: '上下游协同', desc: '打通供应商、经销商、医疗机构三方数据，实现供应链全链路信息共享' },
  { icon: '💡', title: '智能决策', desc: '基于大数据分析的智能补货和需求预测，减少库存积压和缺货风险' },
  { icon: '💰', title: '降本增效', desc: '通过优化库存结构和采购计划，帮助企业降低30%以上的供应链运营成本' },
  { icon: '📊', title: '数据驱动', desc: '丰富的供应链数据报表，为管理层提供科学的决策依据' },
]
</script>
