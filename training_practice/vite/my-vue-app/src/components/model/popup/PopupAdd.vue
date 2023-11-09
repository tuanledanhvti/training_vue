<template>
  <div class="popup-container" :style="`margin-left: ${drawerWidth}px`">
    <div class="icon--exit" @click="closePopup">
      <q-icon :name="matCancel" />
    </div>
    <div class="popup">
      <div class="popup-header">{{ content }}</div>
      <div class="q-pa-md" style="max-width: 400px">
        <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
          <slot></slot>
          <div>
            <q-btn label="Create" type="submit" color="primary" />
            <q-btn
              label="Reset"
              type="reset"
              color="primary"
              flat
              class="q-ml-sm"
            />
          </div>
        </q-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { matCancel } from "@quasar/extras/material-icons";
import { useDrawerStore } from "../../../store/drawerStore";
import {
  ref,
  defineEmits,
  inject,
  defineProps,
  onMounted,
  onUpdated,
} from "vue";
// ---------------- Định nghĩa props ----------------
const props = defineProps<{
  content: string;
}>();

// ---------------- Khai báo biến ----------------
const drawerStore = useDrawerStore();
const eventBus = inject("eventBus");
const emit = defineEmits();

// ---------------- Khai báo event ----------------
// Đóng form
const closePopup = () => {
  eventBus.emit("isShowPopupAdd", false);
};

// Xóa dữ liệu đã điền vô input
const onReset = () => {
  emit("clearData", true);
};

// Confirm (hành động chấp thuận)
const onSubmit = () => {
  emit("onSubmit", true);
};

// ---------------- OnMounted ----------------
onMounted(() => {
  eventBus.on("drawerWidth", (param) => {
    drawerWidth.value = param;
  });
  drawerWidth.value = drawerStore.width;
});
const drawerWidth = ref({});
</script>

<style scoped>
@import url("./PopupAdd.scss");
</style>
