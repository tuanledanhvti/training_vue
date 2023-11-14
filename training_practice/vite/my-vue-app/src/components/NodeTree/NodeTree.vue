<template>
  <div class="node-tree" v-for="node in nodes" :key="node.id">
    <div class="node" @click.stop="toggleChildren(node)">
      <q-icon
        v-if="node.children && node.children.length && node.is_show_children"
        :name="'arrow_drop_down'"
        size="28px"
      />
      <q-icon
        v-else-if="
          node.children && node.children.length && !node.is_show_children
        "
        :name="'arrow_drop_down'"
        size="28px"
        class="rotate"
      />
      <q-icon
        v-else-if="node.children?.length === 0 && node.is_parent"
        :name="'arrow_drop_down'"
        size="28px"
        class="disabled rotate"
      />
      <q-icon
        v-else
        :name="'arrow_drop_down'"
        size="28px"
        class="no-children"
      />
      <span class="label">{{ node.label }}</span>
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
          @clickEventPopupEdit="updateItem"
        ></PopupEdit>
      </q-icon>
      <q-icon
        :name="'delete'"
        size="14px"
        class="icon--add q-mr-sm"
        @click.stop="deleteDepart(node)"
      >
      </q-icon>
    </div>
    <ul v-if="node.children && node.children.length && node.is_show_children">
      <NodeTree :nodes="node.children"></NodeTree>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, inject } from "vue";
import { TreeData } from "../../api/model/types";
import PopupEdit from "../modal/popupEdit/PopupEdit.vue";

// ---------------- Định nghĩa props ----------------
const props = defineProps<{
  nodes: any[];
}>();

// ---------------- Khai báo biến ----------------
const VTI_Resource: any = inject("VTI_Resource");
const hint = ref();
const typeOfItem = ref<string | undefined>(undefined);
const emit = defineEmits();
const eventBus :any = inject("eventBus");

// ---------------- Khai báo event ----------------
const toggleChildren = (node: TreeData) => {
  node.is_show_children = !node.is_show_children;
};

const updateItem = (data: any) => {
  const dataUpdate = {
    id: data.id,
    name: data.scope,
    typeOfObject: typeOfItem.value,
  };
  eventBus.emit("clickEventUpdateTreeItem", dataUpdate);
};

const typeOfItemUpdate = (node: any) => {
  if (typeof node.id_company != "undefined") {
    typeOfItem.value = VTI_Resource.TypeObject.Depart;
    hint.value = VTI_Resource.Popup.Tree.Update.DepartHint;
  } else if (typeof node.id_depart != "undefined") {
    typeOfItem.value = VTI_Resource.TypeObject.Group;
    hint.value = VTI_Resource.Popup.Tree.Update.GroupHint;
  } else {
    typeOfItem.value = VTI_Resource.TypeObject.Company;
    hint.value = VTI_Resource.Popup.Tree.Update.CompanyHint;
  }
};

const deleteDepart = (data: any) => {};
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
