<template>
  <div class="dialog-container" :style="`margin-left: ${drawerWidth}px`">
    <div class="dialog">
      <div class="q-pa-md q-gutter-sm">
        <q-banner dense class="bg-white text-black" v-if="name">
          Bạn có muốn xóa tài sản
          <i
            ><strong>{{ name }}</strong></i
          >
          ?
          <template v-slot:action>
            <q-btn color="primary" label="Delete" @click="confirm" />
            <q-btn flat color="primary" label="Cancel" @click="cancel" />
          </template>
        </q-banner>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, onMounted, onUpdated, defineEmits } from "vue";
import { useDrawerStore } from "../../../store/drawerStore";
const emit = defineEmits();

const drawerStore = useDrawerStore();
const eventBus = inject("eventBus");
const drawerWidth = ref({});
const name = ref<string | null>();

// ---------------- Event ----------------
// Xác nhận thực hiện
const confirm = () => {
  emit("confirm", true);
};

// Hủy hành động
const cancel = () => {
  emit("confirm", false);
};

// ---------------- OnMounted ----------------
onMounted(() => {
  // Lấy độ rộng của drawerWidth
  eventBus.on("drawerWidth", (param) => {
    drawerWidth.value = param;
  });

  // Lấy thông tin của tài sản cần xóa
  eventBus.on("itemDelete", (param) => {
    name.value = param;
  });
});

// ---------------- OnUpdated ----------------

</script>
<style scoped>
@import url('./DialogConfirm.scss');
</style>
