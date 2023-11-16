<template>
  <div
    v-if="root"
    class="row items-center"
    style="display: flex; column-gap: 4px"
  >
    <div class="text-weight-bold">{{ prop.node.label }}</div>
    <q-icon
      :name="prop.node.icon || 'add_circle'"
      size="14px"
      class="icon--add q-mr-sm"
      @click.stop
    >
      <PopupEdit
        :prop_id="prop.node.id"
        :hint="VTI_Resource.Popup.Tree.Add.DepartHint"
        @clickEventPopupEdit="addItem"
      ></PopupEdit>
    </q-icon>
  </div>
  <div v-if="generic" class="row items-center">
    <div class="text-weight-bold">{{ prop.node.label }}</div>
    <q-icon
      :name="prop.node.icon || 'edit_square'"
      size="14px"
      class="icon--add q-mr-sm"
      @click.stop
    >
      <PopupEdit
        :prop_id="prop.node.id"
        :prop_label="prop.node.label"
        :hint="VTI_Resource.Popup.Tree.Update.DepartHint"
        @clickEventPopupEdit="updateItem"
      ></PopupEdit>
    </q-icon>
    <q-icon
      :name="prop.node.icon || 'delete'"
      size="14px"
      class="icon--add q-mr-sm"
      @click.stop="deleteDepart(prop.node)"
    >
    </q-icon>
  </div>
</template>
<script setup lang="ts">
import { ref, defineProps, inject, defineEmits } from "vue";
import { Depart, DepartDTO } from "../../api/model/types";
import PopupEdit from "../modal/popupEdit/PopupEdit.vue";

// ---------------- Định nghĩa props ----------------
const props = defineProps<{
  prop: [];
  root: false;
  generic: false;
}>();

// ---------------- Khai báo biến ----------------
const emit = defineEmits();
const eventBus = inject("eventBus");
const VTI_Resource : any = inject("VTI_Resource");

// ---------------- Khai báo event ----------------
// Thêm mới item
const addItem = (data) => {
  const departNew: Depart = {
    id: 0,
    name: data.scope,
    id_company: data.id,
  };
  emit("clickEventAddTreeItem", departNew);
};

// Cập nhật item
const updateItem = (data) => {
  const departUpdate: Depart = {
    id: data.id,
    name: data.scope,
    id_company: props.prop.node.id_company,
  };

  emit("clickEventUpdateTreeItem", departUpdate);
};

// Xóa item
const deleteDepart = (depart: DepartDTO) => {
  eventBus.emit("itemDelete", depart.label);
  emit("deleteDepart", depart);
};
</script>
