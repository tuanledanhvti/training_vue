<template>
   <p v-font-size:normal>normal</p>
   <p v-font-size:medium>medium</p>
   <p v-font-size:large>Large</p>
  <VTI_Button
    style="display: flex; justify-content: flex-end; margin-right: 16px"
    @clickEvent="showFormAddNewAsset"
  ></VTI_Button>
  <VTI_AssetList
    :listData="assetList"
    @delete="showDeleteDialog"
  ></VTI_AssetList>
  <VTI_AssetAdd
    v-if="isShowAdd"
    @reload="reload"
    @close="closePopup"
    @addNewAsset="addNewAsset"
  ></VTI_AssetAdd>
  <VTI_Dialog v-show="isShowDelete" @confirm="confirmDeleteAsset"></VTI_Dialog>
</template>

<script setup lang="ts">
import VTI_Button from "../../components/common/button/Button.vue";
import VTI_AssetList from "../../components/AssetList/AssetList.vue";
import VTI_AssetAdd from "../../components/AssetAdd/AssetAdd.vue";

import { useQuery, useMutation, useQueryClient } from "vue-query"; // Sử dụng ref để định nghĩa biến
import { getAsset } from "../../api/assetApi";
import { ref, inject, onUpdated } from "vue";
import { deleteAsset, createAsset } from "../../api/assetApi";
import { Asset } from "../../api/model/types";

// ---------------- Khai báo biến ----------------
const isShowAdd = ref(false);
const isShowDelete = ref(false);
// Quản lý trạng thái dữ liệu và thực hiện các tác vụ liên quan đến dữ liệu trong Vue Query
const queryClient = useQueryClient();
const assetToDelete = ref();
const eventBus = inject("eventBus");

// ---------------- Lấy dữ liệu ----------------
// Lấy danh sách tài sản
const { data: assetList, isLoading, error } = useQuery("assetList", getAsset);

// ---------------- Khai báo event ----------------
// hiển thị form thêm mới tài sản
const showFormAddNewAsset = (isAddNew: Boolean) => {
  if (isAddNew) {
    isShowAdd.value = true;
  }
};

// Thực hiện hành động thêm mới
const addNewAsset = async (createdAssetData: Asset) => {
  await createAssetMutation.mutateAsync(createdAssetData); 
};

// useMutation được thiết kế đặc biệt để xử lý các hành động có thể gây ra sửa đổi hoặc cập nhật dữ liệu
// chẳng hạn như thêm, sửa đổi hoặc xóa bản ghi
const createAssetMutation = useMutation(
  (createdAssetData) => createAsset(createdAssetData),
  {
    onSuccess: () => {
      isShowAdd.value = false;
      queryClient.invalidateQueries("assetList");
    },
    onError: (error, variables, context) => {
      console.error("Error updating asset:", error);
    },
  }
);

//Event lấy thông tin của tài sản cần xóa và hiển thị dialog
const showDeleteDialog = (asset: Asset) => {
  if (asset) {
    isShowDelete.value = true;
    assetToDelete.value = asset;
  }
};

// Event xóa bản ghi
const confirmDeleteAsset = async (isConfirmDelete: Boolean) => {
  if (isConfirmDelete) {
    await deleteAssetMutation.mutateAsync(assetToDelete.value.id);
  } else {
    isShowDelete.value = false;
  }
};

//Gọi mutation để xóa bản ghi
// useMutation được thiết kế đặc biệt để xử lý các hành động có thể gây ra sửa đổi hoặc cập nhật dữ liệu
// chẳng hạn như thêm, sửa đổi hoặc xóa bản ghi
const deleteAssetMutation = useMutation(
  () => deleteAsset(assetToDelete.value.id),
  {
    onMutate: async (variables) => {
      // Lưu trạng thái sản phẩm trước khi xóa để có thể khôi phục nếu xảy ra lỗi
      await queryClient.cancelQueries(["asset", assetToDelete.value.id]);
      const previousAssetData = assetToDelete.value;
      return previousAssetData;
    },
    onSuccess: () => {
      isShowDelete.value = false;
      queryClient.invalidateQueries("assetList");
    },
    onError: (error, variables, context) => {
      console.error("Error updating asset:", error);
      // Khôi phục trạng thái sản phẩm về ban đầu nếu có lỗi
      queryClient.setQueryData(["asset", assetToDelete.value.id], context);
    },
  }
);

// Reload lại trang sau khi thêm mới thành công:
const reload = (isReload: Boolean) => {
  if (isReload) {
    queryClient.invalidateQueries("assetList");
    isShowAdd.value = false;
  }
};

// Đóng popup thêm mới tài sản
const closePopup = (data) => {
  if (data) {
    isShowAdd.value = false;
  }
};

// ---------------- OnUpdateonUpdated ----------------
onUpdated(() => {
  eventBus.on("isShowPopupAdd", (param) => {
    isShowAdd.value = param;
  });
});
</script>
