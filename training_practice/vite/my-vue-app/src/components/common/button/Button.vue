<template>
  <div class="button--save" v-bind="$attrs">
    <q-btn
      color="secondary"
      label="Thêm mới tài sản"
      @click="btnClick"
    />
  </div>
</template>
<script setup lang="ts">
import { defineEmits } from "vue";

const emit = defineEmits();
const btnClick = () => {
  emit("clickEvent", true);
};
</script>
<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>
