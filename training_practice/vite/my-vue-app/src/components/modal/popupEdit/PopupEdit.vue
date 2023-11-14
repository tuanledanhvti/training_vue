<template>
  <!-- <q-popup-edit v-model="label">
    <template v-slot="scope">
      <q-input autofocus dense v-model="scope.value" :hint="hint">
        <template v-slot:up>
          <q-btn
            flat
            color="negative"
            icon="cancel"
            @click.stop="scope.cancel"
          />

          <q-btn
            flat
            dense
            color="positive"
            icon="check_circle"
            @click.stop="btnClick(prop_id, scope)"
            :disable="
              scope.validate(scope.value) === false ||
              scope.initialValue === scope.value ||
              scope.value.trim() === ''
            "
          />
        </template>
      </q-input>
    </template>
  </q-popup-edit> -->
  <q-popup-edit
    v-model="label"
    buttons
    label-set="Save"
    label-cancel="Close"
    :validate="textValidate"
    @save="setData(scope)"
    v-slot="scope"
  >
    <q-input
      type="text"
      v-model="scope.value"
      hint="Enter a number between 4 and 7"
      dense
      autofocus
      @keyup.enter="scope.set"
    >
    </q-input>
  </q-popup-edit>
</template>
<script setup lang="ts">
import { ref, defineProps, inject, defineEmits, onMounted } from "vue";

// ---------------- Định nghĩa props ----------------
const props = defineProps<{
  prop_id: number;
  prop_label: string;
  hint: string;
}>();

// ---------------- Khai báo biến ----------------
const emit = defineEmits();
const label = ref();

// ---------------- Khai báo event ----------------
const btnClick = (id: number, scope) => {
  scope.set();
  const object: Object = {
    scope: scope.value,
    id: id,
  };
  emit("clickEventPopupEdit", object);
};

const setData = (scope: any) => {
  console.log(scope);
};

const textValidate = (text) => {
  if (!text || text.trim() === "") {
    return false;
  }
};

onMounted(() => {
  label.value = props.prop_label;
});
</script>
