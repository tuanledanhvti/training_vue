// router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import AssetDetail from '../components/AssetDetail/AssetDetail.vue';
import Assets from '../pages/Assets/Assets.vue';

const routes = [
  {
    path: '/assets',
    name: 'Assets',
    component: Assets,
    children:[
      
    ]
  },
  {
    path: '/asset/:id',
    name: 'AssetDetail',
    component: AssetDetail,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
