import { createRouter, createWebHistory } from "vue-router";
import Tree from "../pages/Tree/Tree.vue";
import Assets from "../pages/Assets/Assets.vue";
import AssetDetail from "../components/AssetDetail/AssetDetail.vue";

const routes = [
  {
    path: "/assets",
    name: "Assets",
    component: Assets,
  },
  {
    path: "/asset/:id",
    name: "AssetDetail",
    component: AssetDetail,
  },
  {
    path: "/tree",
    name: "Tree",
    component: Tree,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
