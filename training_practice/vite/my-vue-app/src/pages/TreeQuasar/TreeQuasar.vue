<template>
  <!-- node-key là chỉ định dùng cái gì để phân biệt, như key trong vòng for -->
  <div class="q-pa-md bg-cyan-8 text-white">
    <q-tree
      :nodes="tree"
      node-key="label"
      v-model:expanded="expanded"
      dark
      color="white"
      ref="nodes"
    >
      <template v-slot:header-root="prop">
        <slot name="header-root" :data="{ prop }">
          <TreeItem
            :prop="prop"
            root
            @clickEventAddTreeItem="addNewTreeItem"
          ></TreeItem>
        </slot>
      </template>
      <template v-slot:header-generic="prop">
        <slot name="header-generic" :data="{ prop }">
          <TreeItem
            :prop="prop"
            generic
            @clickEventUpdateTreeItem="updateTreeItem"
            @deleteDepart="showDeleteDialog"
          ></TreeItem>
        </slot>
      </template>
    </q-tree>
  </div>
  <div class="text-h6">Expanded</div>
  <div>
    <div v-for="expand in expanded" :key="`expanded-${expand}`">
      {{ expand }}
    </div>
  </div>
  <VTI_Dialog v-show="isShowDelete" @confirm="confirmDeleteDepart"></VTI_Dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, watchEffect } from "vue";
import { getCompany, getCompanyAndDepart } from "../../api/companyApi";
import { createDepart, updateDepart, deleteDepart } from "../../api/departApi";
import { useQuery, useMutation, useQueryClient } from "vue-query";
import { Company, TreeQuasar, Depart } from "../../api/model/types";
import TreeItem from "../../components/TreeItemQuasar/TreeItemQuasar.vue";

// ---------------- Khai báo biến ----------------
const expanded = ref();
const nodes = ref();
const tree = ref<TreeQuasar[]>([]);
const idCompanyList = ref();
const loadAfterAdd = ref(false);
const idDepartUpdate = ref();
const isShowDelete = ref(false);
const departToDelete = ref();

// Quản lý trạng thái dữ liệu và thực hiện các tác vụ liên quan đến dữ liệu trong Vue Query
const queryClient = useQueryClient();

// ---------------- Lấy dữ liệu ----------------
// Lấy dữ liệu company
const getCompanyData = () => {
  try {
    useQuery("companyList", () => {
      getCompany().then((data) => {
        // Lấy danh sách id của các company
        idCompanyList.value = data
          .map((company: Company) => `id_company=${company.id}`)
          .join("&");
      });
    });
  } catch (error) {
    console.log(error);
  }
};

// const expandedWatch = watch(
//   expanded,
//   (newValue, oldValue) => {
//     console.log(newValue);
//   },
// //deep: ví dụ khi watch object thì vì nó xem sự thay đổi
// //của địa chỉ trỏ đến nên vô dụng, dùng deep để nó đào sâu hơn, xem có thuộc tính thay đổi như nào
//   { deep: true }
// );

// Cũng là watch nhưng viết đơn giản hơn, chú trọng vào việc xem sự thay đổi
const wah = watchEffect(() => {
  //console.log(expanded.value);
});

// Lấy dữ liệu company có child là các depart
const getCompanyDataWithChildren = () => {
  try {
    useQuery(
      "tree",
      () => {
        getCompanyAndDepart(idCompanyList.value).then((data) => {
          tree.value = data;

          if (data.length > 0 && !loadAfterAdd.value) {
            expanded.value = [tree.value[0].label];
          }
          return tree.value;
        });
      },
      {
        refetchOnWindowFocus: false, // Tắt tự động refetch khi cửa sổ focus lại
      }
    );
  } catch (error) {
    console.log(error);
  }
};

// Thêm mới item cho tree
const addNewTreeItem = async (departNew: Depart) => {
  await createDepartMutation.mutateAsync(departNew);
  loadAfterAdd.value = true;
};

// useMutation được thiết kế đặc biệt để xử lý các hành động có thể gây ra sửa đổi hoặc cập nhật dữ liệu
// chẳng hạn như thêm, sửa đổi hoặc xóa bản ghi
const createDepartMutation = useMutation(
  (createdDepartData: Depart) => createDepart(createdDepartData),
  {
    onSuccess: () => {
      queryClient.invalidateQueries("tree");
    },
    onError: (error, variables, context) => {
      console.error("Error updating depart:", error);
    },
  }
);

// Cập nhật thông tin của item
const updateTreeItem = async (departUpdate: Depart) => {
  idDepartUpdate.value = departUpdate.id;
  await updateDepartMutation.mutateAsync(departUpdate);
  loadAfterAdd.value = true;
};

// useMutation được thiết kế đặc biệt để xử lý các hành động có thể gây ra sửa đổi hoặc cập nhật dữ liệu
// chẳng hạn như thêm, sửa đổi hoặc xóa bản ghi
const updateDepartMutation = useMutation(
  (updateDepartData: Depart) =>
    updateDepart(idDepartUpdate.value, updateDepartData),
  {
    onSuccess: () => {
      queryClient.invalidateQueries("tree");
    },
    onError: (error, variables, context) => {
      console.error("Error updating depart:", error);
    },
  }
);

//Event lấy thông tin của depart cần xóa và hiển thị dialog
const showDeleteDialog = (depart: Depart) => {
  if (depart) {
    isShowDelete.value = true;
    departToDelete.value = depart;
  }
};

//
const confirmDeleteDepart = async (isConfirmDelete: Boolean) => {
  if (isConfirmDelete) {
    await deleteDepartMutation.mutateAsync(departToDelete.value.id);
    loadAfterAdd.value = true;
  } else {
    isShowDelete.value = false;
  }
};

//Gọi mutation để xóa bản ghi
// useMutation được thiết kế đặc biệt để xử lý các hành động có thể gây ra sửa đổi hoặc cập nhật dữ liệu
// chẳng hạn như thêm, sửa đổi hoặc xóa bản ghi
const deleteDepartMutation = useMutation(
  () => deleteDepart(departToDelete.value.id),
  {
    onMutate: async (variables) => {
      // Lưu trạng thái sản phẩm trước khi xóa để có thể khôi phục nếu xảy ra lỗi
      await queryClient.cancelQueries([
        "departDelete",
        departToDelete.value.id,
      ]);
      const previousDepartData = departToDelete.value;
      return previousDepartData;
    },
    onSuccess: () => {
      isShowDelete.value = false;
      queryClient.invalidateQueries("tree");
    },
    onError: (error, variables, context) => {
      console.error("Error updating depart:", error);
      // Khôi phục trạng thái sản phẩm về ban đầu nếu có lỗi
      queryClient.setQueryData(["depart", departToDelete.value.id], context);
    },
  }
);

// ---------------- OnMounted ----------------
onMounted(() => {
  getCompanyData();
  getCompanyDataWithChildren();
});
</script>

<style scoped>
@import url("./TreeQuasar.scss");
</style>
