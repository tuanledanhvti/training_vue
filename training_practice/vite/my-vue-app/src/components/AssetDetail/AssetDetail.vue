<template>
  <div class="q-pa-md" style="max-width: 400px" v-if="asset">
    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
      <q-input
        filled
        v-model="asset.name"
        label="Name *"
        hint="Product's name"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Please type something']"
      />

      <q-input
        filled
        type="number"
        v-model="asset.price"
        label="Price *"
        lazy-rules
        :rules="[
          (val) => (val !== null && val !== '') || 'Please type number',
          (val) => (val > 0 && val < 1000000000) || 'Please type a real number',
        ]"
      />
      <div>
        <q-btn label="Update" type="submit" color="primary" />
        <q-btn
          label="Reset"
          type="reset"
          color="primary"
          flat
          class="q-ml-sm"
        />
      </div>
    </q-form>
    <!-- <div class="button--save">
      <q-btn color="amber" label="Cập nhật" @click="btnSave" />
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { useQuery, useMutation, useQueryClient } from "vue-query";
import { getAssetById, updateAsset } from "../../api/assetApi";
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import { Asset } from "../../api/model/types";

// ---------------- Khai báo biến ----------------
const route = useRoute();
const router = useRouter();
// Quản lý trạng thái dữ liệu và thực hiện các tác vụ liên quan đến dữ liệu trong Vue Query
const queryClient = useQueryClient();

const asset = ref<Asset | null>(null);

// ---------------- Khai báo event ----------------
// Lấy thông tin tài sản theo id
const getAssetData = () => {
  try {
    useQuery(["asset", route.params.id], () => {
      getAssetById(route.params.id).then((data) => {
        asset.value = data;
      });
    });
  } catch (error) {
    console.log(error);
  }
};

// Cập nhật dữ liệu
// useMutation được thiết kế đặc biệt để xử lý các hành động có thể gây ra sửa đổi hoặc cập nhật dữ liệu
// chẳng hạn như thêm, sửa đổi hoặc xóa bản ghi
const updateAssetMutation = useMutation(
  (updatedAssetData) => updateAsset(route.params.id, updatedAssetData),
  {
    onMutate: async (variables) => {
      // Lưu trạng thái sản phẩm trước khi cập nhật để có thể khôi phục nếu xảy ra lỗi
      await queryClient.cancelQueries(["asset", route.params.id]);
      const previousAssetData = asset.value;
      return previousAssetData;
    },
    onSuccess: () => {
      router.push({ name: "Assets" });
    },
    onError: (error, variables, context) => {
      console.error("Error updating asset:", error);
      // Khôi phục trạng thái sản phẩm về ban đầu nếu có lỗi
      queryClient.setQueryData(["asset", route.params.id], context);
    },
  }
);

// Lưu cập nhật
const onSubmit = async () => {
  // Gọi mutation để cập nhật sản phẩm với dữ liệu đã cập nhật từ đối tượng asset
  const updatedAssetData = {
    name: asset.value?.name,
    price: asset.value?.price,
  };
  await updateAssetMutation.mutateAsync(updatedAssetData);
};

// Clear những thông tin trên input
const onReset = () => {
  if (asset.value) {
    asset.value.name = "";
    asset.value.price = "";
  }
};

// ---------------- OnMounted ----------------
onMounted(() => {
  getAssetData();
});
</script>

<style scoped>
</style>
