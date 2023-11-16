<template>
  <q-popup-edit
    v-model="label"
    buttons
    label-set="Save"
    label-cancel="Close"
    :validate="textValidateAndSave"
    @cancel="closeForm"
    v-slot="scope"
  >
    <q-input
      type="text"
      v-model="scope.value"
      :hint="hint"
      :error="errorText"
      :error-message="errorTextMessage"
      dense
      autofocus
    />
    <div v-if="checkbox !== undefined && isShowCheckbox">
      <q-checkbox
        dense
        v-model="isParent"
        :label="VTI_Resource.Popup.Tree.Label.CheckBox.Parent"
      />
    </div>
  </q-popup-edit>
</template>
<script setup lang="ts">
import { ref, defineProps, inject, defineEmits, onMounted } from "vue";

// ---------------- Định nghĩa props ----------------
const props = defineProps<{
  prop_id: number;
  prop_label: string;
  hint: string;
  isShowCheckbox: boolean;
  checkbox: boolean;
}>();

// ---------------- Khai báo biến ----------------
const emit = defineEmits();
const label = ref();
const errorText = ref(false);
const errorTextMessage = ref("");
const VTI_Resource: any = inject("VTI_Resource");
const eventBus: any = inject("eventBus");
const isParent = ref(false);

// ---------------- Khai báo event ----------------
// Đóng form
const closeForm = () => {
  errorText.value = false;
  errorTextMessage.value = "";
};

// Validate label mà người dùng nhập
const textValidateAndSave = (text: string) => {
  if (!text || text.trim() === "") {
    errorText.value = true;
    errorTextMessage.value = VTI_Resource.Popup.Tree.Validate.Empty;
    return false;
  }
  const object: Object = {
    scope: text,
    id: props.prop_id,
    is_parent: isParent.value,
  };
  // Vì sử dụng đệ quy, nên những component này sẽ không thể emit trước tiếp lên cha
  // vì tụi nó ở sâu bên trong, nên phải dùng eventBus
  eventBus.emit("clickEventPopupEdit", object);
  emit("clickEventPopupEdit", object);
  errorText.value = false;
  errorTextMessage.value = "";
  return true;
};

// ---------------- OnMounted ----------------
onMounted(() => {
  // Gán dữ liệu cho label để hiển thị
  label.value = props.prop_label;
  isParent.value = props.checkbox;
});
</script>
