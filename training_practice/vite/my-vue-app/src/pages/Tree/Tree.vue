<template>
  <div class="tree">
    <NodeTree :nodes="tree"></NodeTree>
  </div>
  <VTI_Dialog v-show="isShowDelete" @confirm="confirmDelete"></VTI_Dialog>
</template>
<script setup lang="ts">
import NodeTree from "../../components/NodeTree/NodeTree.vue";
import { TreeData, Company, Depart, Group } from "../../api/model/types";
import { ref, onMounted, inject, watch } from "vue";
import {
  getCompany,
  getTree,
  updateCompany,
  deleteCompany,
} from "../../api/companyApi";
import { createDepart, updateDepart, deleteDepart } from "../../api/departApi";
import { createGroup, updateGroup, deleteGroup } from "../../api/groupApi";
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
const isShowDelete = ref(false);
const objectsToDelete = ref();

// Quản lý trạng thái dữ liệu và thực hiện các tác vụ liên quan đến dữ liệu trong Vue Query
const queryClient = useQueryClient();

useQuery(
  "tree",
  async () => {
    await getTree(idCompanyList.value).then((data) => {
      if (data) {
        tree.value = data;

        if (data.length > 0 && !loadAfterAdd.value) {
          expanded.value = [tree.value[0].label];
        }
        return tree.value;
      } else {
        return (tree.value = []);
      }
    });
  },
  {
    refetchOnWindowFocus: false, // Tắt tự động refetch khi cửa sổ focus lại
  }
);
// ---------------- Khai báo event ----------------
// Cập nhật
const updateTreeItem = async (data) => {
  if (data.typeOfObject === VTI_Resource.TypeObject.Company) {
    const companyUpdate = <Company>{
      id: data.id,
      name: data.name,
      is_parent: data.is_parent,
    };
    idCompanyUpdate.value = companyUpdate.id;
    await updateCompanyMutation.mutateAsync(companyUpdate);
  }
  if (data.typeOfObject === VTI_Resource.TypeObject.Depart) {
    const departUpdate = {
      id: data.id,
      name: data.name,
      is_parent: data.is_parent,
    };
    idDepartUpdate.value = departUpdate.id;
    await updateDepartMutation.mutateAsync(departUpdate);
  }
  if (data.typeOfObject === VTI_Resource.TypeObject.Group) {
    const groupUpdate = {
      id: data.id,
      name: data.name,
    };
    idGroupUpdate.value = groupUpdate.id;
    await updateGroupMutation.mutateAsync(groupUpdate);
  }
};

// Thêm mới
const addTreeItem = async (data) => {
  if (data.typeOfObject === VTI_Resource.TypeObject.Depart) {
    const departAdd = <Depart>{
      id_company: data.id_parent,
      name: data.name,
      is_parent: data.is_parent,
    };
    await createDepartMutation.mutateAsync(departAdd);
  }
  if (data.typeOfObject === VTI_Resource.TypeObject.Group) {
    const groupAdd = <Group>{
      id_depart: data.id_parent,
      name: data.name,
    };
    await createGroupMutation.mutateAsync(groupAdd);
  }
};

// Hiển thị dialog để xóa
const showDeleteDialog = (data: object) => {
  if (data) {
    isShowDelete.value = !isShowDelete.value;
    objectsToDelete.value = data;
  }
};

// Xác nhận xóa
const confirmDelete = async (isConfirmDelete: Boolean) => {
  if (isConfirmDelete) {
    if (objectsToDelete.value.group && objectsToDelete.value.group.length > 0) {
      objectsToDelete.value.group.forEach(async (group) => {
        await deleteGroupMutation.mutateAsync(group.id);
      });
    }

    if (
      objectsToDelete.value.company &&
      objectsToDelete.value.company.length > 0
    ) {
      await deleteCompanyMutation.mutateAsync(
        objectsToDelete.value.company[0].id
      );
    }

    if (
      objectsToDelete.value.depart &&
      objectsToDelete.value.depart.length > 0
    ) {
      const departsReq = objectsToDelete.value.depart.map((depart) =>
        deleteDepartMutation.mutateAsync(depart.id)
      );
      await Promise.all(departsReq);
      queryClient.invalidateQueries("tree");
    }
  } else {
    isShowDelete.value = false;
  }
};

// ---------------- Lấy dữ liệu ----------------
// Lấy dữ liệu company
const getCompanyData = () => {
  try {
    useQuery(
      "companyList",
      async () => {
        await getCompany().then((data) => {
          // Lấy danh sách id của các company
          idCompanyList.value = data
            .map((company: Company) => `id_company=${company.id}`)
            .join("&");
        });
      },
      { refetchOnWindowFocus: false }
    );
  } catch (error) {
    console.log(error);
  }
};

watch(idCompanyList, (newValue, from) => {
  // queryClient.invalidateQueries('tree')
});

// Lấy dữ liệu company có child là các depart
const getCompanyDataWithChildren = () => {
  // try {
  //   if(idCompanyList.value) {
  //     useQuery(
  //     "tree",
  //     async () => {
  //       await getTree(idCompanyList.value).then((data) => {
  //         if (data) {
  //           tree.value = data;
  //           if (data.length > 0 && !loadAfterAdd.value) {
  //             expanded.value = [tree.value[0].label];
  //           }
  //           return tree.value;
  //         }
  //       });
  //     },
  //     {
  //       refetchOnWindowFocus: false, // Tắt tự động refetch khi cửa sổ focus lại
  //     }
  //   );
  //   }
  // } catch (error) {
  //   console.log(error);
  // }
};

// ---------------- Cập nhật thông tin của company ----------------
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
      console.error("Error updating company:", error);
    },
  }
);

// Xóa company
const deleteCompanyMutation = useMutation((id: number) => deleteCompany(id), {
  onMutate: async (variables) => {
    // Lưu trạng thái sản phẩm trước khi xóa để có thể khôi phục nếu xảy ra lỗi
    await queryClient.cancelQueries(["companyDelete"]);
    const previousData = objectsToDelete.value;
    return previousData;
  },
  onSuccess: () => {
    isShowDelete.value = false;
    // queryClient.invalidateQueries("tree");
  },
  onError: (error, variables, context) => {
    console.error("Error updating company:", error);
    // Khôi phục trạng thái sản phẩm về ban đầu nếu có lỗi
    queryClient.setQueryData(["companyDelete"], context);
  },
});

// ---------------- Cập nhật thông tin của depart ----------------
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

// Thêm mới depart
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

// Xóa depart
const deleteDepartMutation = useMutation((id: number) => deleteDepart(id), {
  onMutate: async (variables) => {
    // Lưu trạng thái sản phẩm trước khi xóa để có thể khôi phục nếu xảy ra lỗi
    await queryClient.cancelQueries(["departDelete"]);
    const previousData = objectsToDelete.value;
    return previousData;
  },
  onSuccess: () => {
    isShowDelete.value = false;
    // queryClient.invalidateQueries("tree");
  },
  onError: (error, variables, context) => {
    console.error("Error updating depart:", error);
    // Khôi phục trạng thái sản phẩm về ban đầu nếu có lỗi
    queryClient.setQueryData(["departDelete"], context);
  },
});

// ---------------- Cập nhật thông tin của group ----------------
// useMutation được thiết kế đặc biệt để xử lý các hành động có thể gây ra sửa đổi hoặc cập nhật dữ liệu
// chẳng hạn như thêm, sửa đổi hoặc xóa bản ghi
const updateGroupMutation = useMutation(
  (updateGroupData: any) => updateGroup(idGroupUpdate.value, updateGroupData),
  {
    onSuccess: () => {
      queryClient.invalidateQueries("tree");
    },
    onError: (error, variables, context) => {
      console.error("Error updating group:", error);
    },
  }
);

// Thêm mới group
const createGroupMutation = useMutation(
  (createdGroupData: Group) => createGroup(createdGroupData),
  {
    onSuccess: () => {
      queryClient.invalidateQueries("tree");
    },
    onError: (error, variables, context) => {
      console.error("Error updating group:", error);
    },
  }
);

// Xóa group
const deleteGroupMutation = useMutation((id: number) => deleteGroup(id), {
  onMutate: async (variables) => {
    // Lưu trạng thái sản phẩm trước khi xóa để có thể khôi phục nếu xảy ra lỗi
    await queryClient.cancelQueries(["groupDelete"]);
    const previousData = objectsToDelete.value;
    return previousData;
  },
  onSuccess: () => {
    isShowDelete.value = false;
    queryClient.invalidateQueries("tree");
  },
  onError: (error, variables, context) => {
    console.error("Error updating group:", error);
    // Khôi phục trạng thái sản phẩm về ban đầu nếu có lỗi
    queryClient.setQueryData(["groupDelete"], context);
  },
});

// ---------------- OnMounted ----------------
onMounted(() => {
  getCompanyData();
  getCompanyDataWithChildren();

  eventBus.on("clickEventUpdateTreeItem", (data: any) => {
    updateTreeItem(data);
  });

  eventBus.on("clickEventAddTreeItem", (data: any) => {
    addTreeItem(data);
  });

  eventBus.on("clickEventDeleteTreeItemUpgrade", (data: object) => {
    showDeleteDialog(data);
  });
});
</script>
<style scoped>
@import url("./Tree.scss");
</style>
