<template>
  <VTI_PopupAdd
    :content="VTI_Resource.Popup.Asset.Add.Header"
    @clearData="clearData"
    @onSubmit="onSubmit"
  >
    <q-input
      filled
      v-model="name"
      label="Name *"
      hint="Product's name"
      lazy-rules
      :rules="[(val) => (val && val.length > 0) || 'Please type something']"
    />

    <q-input
      filled
      type="number"
      v-model="price"
      label="Price *"
      lazy-rules
      :rules="[
        (val) => (val !== null && val !== '') || 'Please type number',
        (val) => (val > 0 && val < 1000000000) || 'Please type a real number',
      ]"
    />
  </VTI_PopupAdd>
</template>

<script setup>
import { ref, defineEmits, inject } from "vue";

// ---------------- Khai báo biến ----------------
const emit = defineEmits();
const name = ref(null);
const price = ref(null);
const VTI_Resource = inject("VTI_Resource");

// ---------------- Khai báo Event ----------------
// Thêm mới dữ liệu
const onSubmit = async () => {
  const createdAssetData = {
    name: name.value,
    price: price.value,
  };
  emit("addNewAsset", createdAssetData);
};

// Xóa dữ liệu đã điền vô input
const clearData = () => {
  name.value = null;
  price.value = null;
};
</script>

<style scoped>
@import url("./AssetAdd.scss");
</style>
