import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior() {
    return { top: 0 }
  },
  routes: [
    {
      path: '/',
      component: () => import('../pages/Home.vue'),
    },
    {
      path: '/products',
      component: () => import('../pages/Products.vue'),
    },
    {
      path: '/solutions',
      component: () => import('../pages/Solutions.vue'),
    },
    {
      path: '/solutions/logistics',
      component: () => import('../pages/solutions/SolutionLogistics.vue'),
    },
    {
      path: '/solutions/supply-chain',
      component: () => import('../pages/solutions/SolutionSupplyChain.vue'),
    },
    {
      path: '/solutions/smart-medical',
      component: () => import('../pages/solutions/SolutionSmartMedical.vue'),
    },
    {
      path: '/solutions/medical-care',
      component: () => import('../pages/solutions/SolutionMedicalCare.vue'),
    },
    {
      path: '/solutions/elder-care',
      component: () => import('../pages/solutions/SolutionElderCare.vue'),
    },
    {
      path: '/solutions/wms',
      component: () => import('../pages/solutions/SolutionWMS.vue'),
    },
    {
      path: '/about',
      component: () => import('../pages/About.vue'),
    },
    {
      path: '/partners',
      component: () => import('../pages/Partners.vue'),
    },
    {
      path: '/contact',
      component: () => import('../pages/Contact.vue'),
    },
    {
      path: '/download',
      component: () => import('../pages/Download.vue'),
    },
    {
      path: '/login',
      component: () => import('../pages/Login.vue'),
    },
    {
      path: '/news',
      component: () => import('../pages/News.vue'),
    },
    {
      path: '/trial-apply',
      component: () => import('../pages/TrialApply.vue'),
    },
    {
      path: '/project-report',
      component: () => import('../pages/ProjectReport.vue'),
    },
    {
      path: '/doc-download',
      component: () => import('../pages/DocDownload.vue'),
    },
    {
      path: '/talent',
      component: () => import('../pages/Talent.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      component: () => import('../pages/NotFound.vue'),
    },
  ],
})

export default router
