<template>
  <div class="tree">
    <NodeTree :nodes="tree"></NodeTree>
  </div>
</template>
<script setup lang="ts">
import NodeTree from "../../components/NodeTree/NodeTree.vue";
import { TreeData, Company, Depart, Group } from "../../api/model/types";
import { ref, onMounted, inject } from "vue";
import { getCompany, getTree, updateCompany } from "../../api/companyApi";
import { updateDepart } from "../../api/departApi";
import { updateGroup } from "../../api/groupApi";
import { useQuery, useMutation, useQueryClient } from "vue-query";

// ---------------- Khai báo biến ----------------
const VTI_Resource: any = inject("VTI_Resource");
const expanded = ref();
const tree = ref<TreeData[]>([]);
const idCompanyList = ref();
const loadAfterAdd = ref(false);
const idCompanyUpdate = ref();
const idDepartUpdate = ref();
const idGroupUpdate = ref();
const eventBus: any = inject("eventBus");

// Quản lý trạng thái dữ liệu và thực hiện các tác vụ liên quan đến dữ liệu trong Vue Query
const queryClient = useQueryClient();

// ---------------- Khai báo event ----------------
const updateTreeItem = (data) => {
  if (data.typeOfObject == VTI_Resource.TypeObject.Company) {
    const companyUpdate = <Company>{
      id: data.id,
      name: data.name,
      is_parent: true,
    };
    updateCompanyItem(companyUpdate);
  }
  if (data.typeOfObject == VTI_Resource.TypeObject.Depart) {
    const departUpdate = {
      id: data.id,
      name: data.name,
      is_parent: true,
    };
    updateDepartItem(departUpdate);
  }
  if (data.typeOfObject == VTI_Resource.TypeObject.Group) {
  }
};

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

// Lấy dữ liệu company có child là các depart
const getCompanyDataWithChildren = () => {
  try {
    useQuery(
      "tree",
      () => {
        getTree(idCompanyList.value).then((data) => {
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

// ---------------- Cập nhật thông tin của company ----------------
const updateCompanyItem = async (companyUpdate: Company) => {
  idCompanyUpdate.value = companyUpdate.id;
  await updateCompanyMutation.mutateAsync(companyUpdate);
  loadAfterAdd.value = true;
};

// useMutation được thiết kế đặc biệt để xử lý các hành động có thể gây ra sửa đổi hoặc cập nhật dữ liệu
// chẳng hạn như thêm, sửa đổi hoặc xóa bản ghi
const updateCompanyMutation = useMutation(
  (updateCompanyData: Company) =>
    updateCompany(idCompanyUpdate.value, updateCompanyData),
  {
    onSuccess: () => {
      queryClient.invalidateQueries("tree");
    },
    onError: (error, variables, context) => {
      console.error("Error updating depart:", error);
    },
  }
);

// ---------------- Cập nhật thông tin của depart ----------------
const updateDepartItem = async (departUpdate: any) => {
  idDepartUpdate.value = departUpdate.id;
  await updateDepartMutation.mutateAsync(departUpdate);
  loadAfterAdd.value = true;
};

// useMutation được thiết kế đặc biệt để xử lý các hành động có thể gây ra sửa đổi hoặc cập nhật dữ liệu
// chẳng hạn như thêm, sửa đổi hoặc xóa bản ghi
const updateDepartMutation = useMutation(
  (updateDepartData: any) =>
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

// ---------------- OnMounted ----------------
onMounted(() => {
  getCompanyData();
  getCompanyDataWithChildren();

  eventBus.on("clickEventUpdateTreeItem", (data) => {
    updateTreeItem(data);
  });
});
</script>
<style scoped>
@import url("./Tree.scss");
</style>
