<template>
  <div class="node-tree" v-for="node in nodes" :key="node.id">
    <div class="node" @click.stop="toggleChildren(node)">
      <VTI_IconEdit
        v-if="
          node.children &&
          node.children.length &&
          node.is_parent &&
          node.is_show_children
        "
      />
      <VTI_IconEdit
        v-else-if="
          node.children &&
          node.children.length &&
          node.is_parent &&
          !node.is_show_children
        "
        class="rotate"
      />
      <VTI_IconEdit
        v-else-if="node.children?.length === 0 && node.is_parent"
        class="disabled rotate"
      />
      <VTI_IconEdit v-else class="no-children" />

      <span class="label">{{ node.label }}</span>
      <q-icon
        v-if="node.is_parent"
        :name="'add_circle'"
        size="14px"
        class="icon--add q-mr-sm"
        @click.stop="typeOfItemAdd(node)"
      >
        <PopupEdit :hint="hint" :isShowCheckbox="addToParent"></PopupEdit>
      </q-icon>
      <q-icon
        :name="'edit_square'"
        size="14px"
        class="icon--add q-mr-sm"
        @click.stop="typeOfItemUpdate(node)"
      >
        <PopupEdit
          :prop_id="node.id"
          :prop_label="node.label"
          :hint="hint"
          :isShowCheckbox="addToParent"
          :checkbox="node.is_parent"
        ></PopupEdit>
      </q-icon>
      <q-icon
        :name="'delete'"
        size="14px"
        class="icon--add q-mr-sm"
        @click.stop="deleteItem(node)"
      >
      </q-icon>
    </div>
    <ul
      v-if="
        node.children &&
        node.children.length &&
        node.is_parent &&
        node.is_show_children
      "
    >
      <NodeTree :nodes="node.children"></NodeTree>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, inject, onMounted } from "vue";
import { TreeData } from "../../api/model/types";
import PopupEdit from "../modal/popupEdit/PopupEdit.vue";
import VTI_IconEdit from "../common/icon/IconEdit.vue";

// ---------------- Định nghĩa props ----------------
const props = defineProps<{
  nodes: any[];
}>();

// ---------------- Khai báo biến ----------------
const VTI_Resource: any = inject("VTI_Resource");
const hint = ref();
const typeOfItem = ref<string | undefined>(undefined);
const emit = defineEmits();
const eventBus: any = inject("eventBus");
const addToParent = ref(false);
const idParent = ref();

// ---------------- Khai báo event ----------------
const toggleChildren = (node: TreeData) => {
  if (node.is_parent) node.is_show_children = !node.is_show_children;
};

const addItem = (data: any) => {
  const dataAdd = {
    name: data.scope,
    is_parent: data.is_parent,
    typeOfObject: typeOfItem.value,
    id_parent: idParent.value,
  };
  // Vì sử dụng đệ quy, nên những component này sẽ không thể emit trước tiếp lên cha
  // vì tụi nó ở sâu bên trong, nên phải dùng eventBus
  eventBus.emit("clickEventAddTreeItem", dataAdd);
  typeOfItem.value = undefined;
};

const updateItem = (data: any) => {
  const dataUpdate = {
    id: data.id,
    name: data.scope,
    is_parent: data.is_parent,
    typeOfObject: typeOfItem.value,
  };
  // Vì sử dụng đệ quy, nên những component này sẽ không thể emit trước tiếp lên cha
  // vì tụi nó ở sâu bên trong, nên phải dùng eventBus
  eventBus.emit("clickEventUpdateTreeItem", dataUpdate);
  typeOfItem.value = undefined;
};

// Xem loại đối tượng nào cần thêm
const typeOfItemAdd = (node: any) => {
  if (typeof node.id_company != "undefined") {
    typeOfItem.value = VTI_Resource.TypeObject.Group;
    hint.value = VTI_Resource.Popup.Tree.Add.GroupHint;
    addToParent.value = false;
  } else {
    typeOfItem.value = VTI_Resource.TypeObject.Depart;
    hint.value = VTI_Resource.Popup.Tree.Add.DepartHint;
    addToParent.value = true;
  }
  idParent.value = node.id;
};

// Xem loại đối tượng nào cần cập nhật
const typeOfItemUpdate = (node: any) => {
  if (typeof node.id_company != "undefined") {
    typeOfItem.value = VTI_Resource.TypeObject.Depart;
    hint.value = VTI_Resource.Popup.Tree.Update.DepartHint;
    addToParent.value = true;
  } else if (typeof node.id_depart != "undefined") {
    typeOfItem.value = VTI_Resource.TypeObject.Group;
    hint.value = VTI_Resource.Popup.Tree.Update.GroupHint;
    addToParent.value = false;
  } else {
    typeOfItem.value = VTI_Resource.TypeObject.Company;
    hint.value = VTI_Resource.Popup.Tree.Update.CompanyHint;
    addToParent.value = true;
  }
};

const deleteItem = (data: any) => {
  typeOfItemUpdate(data);
  const object = <Object>{
    id: data.id,
    type_object: typeOfItem.value,
    name: data.label,
  };

  const flatData: any[] = flattenData(data);
  const groupData = flatData
    .filter((data) => data.id_depart !== undefined)
    .map((data) => ({
      id: data.id,
      type_object: VTI_Resource.TypeObject.Group,
      name: data.label,
    }));
  const departData = flatData
    .filter((data) => data.id_company !== undefined)
    .map((data) => ({
      id: data.id,
      type_object: VTI_Resource.TypeObject.Depart,
      name: data.label,
    }));
  const companyData = flatData
    .filter(
      (data) => data.id_depart === undefined && data.id_company == undefined
    )
    .map((data) => ({
      id: data.id,
      type_object: VTI_Resource.TypeObject.Company,
      name: data.label,
    }));

  const objectUpgrade = <Object>{
    group: groupData,
    depart: departData,
    company: companyData,
  };

  eventBus.emit("clickEventDeleteTreeItem", object);
  eventBus.emit("clickEventDeleteTreeItemUpgrade", objectUpgrade);
  eventBus.emit("itemDelete", data.label);
};

// Đệ quy để lấy ra từng đối tượng trong children
const flattenData = (node: any) => {
  let result: any[] = [node];
  if (node.children && node.children.length > 0) {
    result = result.concat(...node.children.map(flattenData));
  }
  return result;
};

// ---------------- OnMounted ----------------
onMounted(() => {
  eventBus.on("clickEventPopupEdit", (data) => {
    if (data.id) {
      updateItem(data);
    } else {
      addItem(data);
    }
  });
});
</script>

<script lang="ts">
import { defineComponent } from "vue";
// ---------------- Định nghĩa component ----------------
export default defineComponent({
  name: "NodeTree",
});
</script>
<style scoped>
@import url("./NodeTree.scss");
</style>
