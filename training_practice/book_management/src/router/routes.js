import IndexCopy from "../pages/IndexPageCopy.vue";
import Index from "../pages/IndexPage.vue";

import Error from "../pages/ErrorNotFound.vue"

const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: Index },
      { path: "copy", component: IndexCopy },
    ],
  },
  {
    path: "/:catchAll(.*)*",
    component: () => Error,
  },
];

export default routes;
