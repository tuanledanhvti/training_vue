<template>
  <div class="q-pa-md">
    <q-layout
      view="lHh Lpr lff"
      container
      style="height: calc(100vh - 32px)"
      class="shadow-2 rounded-borders"
    >
      <q-header elevated class="bg-cyan-8">
        <q-toolbar>
          <q-btn flat @click="toggleDrawer" round dense icon="menu" />
          <q-toolbar-title>Quản lý tài sản</q-toolbar-title>
        </q-toolbar>
      </q-header>

      <q-drawer
        ref="drawerRef"
        v-model="drawer"
        show-if-above
        :width="200"
        :breakpoint="400"
      >
        <q-scroll-area
          style="
            height: calc(100% - 150px);
            margin-top: 150px;
            border-right: 1px solid #ddd;
          "
        >
          <q-list padding>
            <router-link to="/assets">
              <q-item clickable v-ripple>
                <q-item-section avatar>
                  <q-icon name="inventory" />
                </q-item-section>
                <q-item-section> Tài sản </q-item-section>
              </q-item></router-link
            >

            <router-link to="/tree_quasar">
              <q-item clickable v-ripple>
                <q-item-section avatar>
                  <q-icon name="account_tree" />
                </q-item-section>
                <q-item-section> Phân cấp quasar </q-item-section>
              </q-item></router-link
            >
            <router-link to="/tree">
              <q-item clickable v-ripple>
                <q-item-section avatar>
                  <q-icon name="account_tree" />
                </q-item-section>
                <q-item-section> Phân cấp </q-item-section>
              </q-item></router-link
            >
          </q-list>
        </q-scroll-area>

        <q-img
          class="absolute-top"
          src="https://cdn.quasar.dev/img/material.png"
          style="height: 150px"
        >
          <div class="absolute-bottom bg-transparent">
            <q-avatar size="56px" class="q-mb-sm">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
            </q-avatar>
            <div class="text-weight-bold">Tuan Le Danh</div>
            <div>@kaikawa888</div>
          </div>
        </q-img>
      </q-drawer>

      <q-page-container>
        <q-page padding>
          <router-view></router-view>
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, onMounted } from "vue";
import { useDrawerStore } from "../store/drawerStore";


//inject là một hàm dùng trong Vue 3 Composition API để truy cập các thuộc tính
//hoặc dữ liệu từ component cha vào component con.
//Thường thì, chúng ta sử dụng provide ở component cha để cung cấp dữ liệu
//và inject ở component con để lấy dữ liệu đó.

//Cơ chế này cho phép truyền dữ liệu từ component cha xuống component con
//một cách hiệu quả,
//mà không cần phải truyền qua các props qua lại hoặc thông qua Event Bus

const drawer = ref(false);
const drawerRef = ref<HTMLDivElement | null>(null);
const drawerWidth = ref<number>();
const drawerStore = useDrawerStore();
const eventBus = inject("eventBus");

const toggleDrawer = () => {
  
  drawer.value = !drawer.value;
  if (drawer.value == false) {
    drawerWidth.value = 0;
  } else {
    drawerWidth.value = drawerRef.value?.width;
  }
  drawerStore.setDrawerWidth(drawerWidth.value);
};

onMounted(() => {
  drawerStore.setDrawerWidth(drawerRef.value?.width);
  
});
</script>

<style scoped>
a {
  text-decoration: none;
  color: unset;
}
.router-link-active {
  color: #1aa4c8;
}
</style>
