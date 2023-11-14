<template>
  <div class="q-pa-md">
    <q-markup-table>
      <thead>
        <tr>
          <th class="text-left">Id</th>
          <th class="text-center">Name</th>
          <th class="text-left">Price</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in listData" :key="item.id">
          <td class="v-row text-left">{{ item.id }}</td>
          <td class="v-row text-center">{{ item.name }}</td>
          <td class="v-row text-left">{{ item.price }}</td>
          <q-menu touch-position>
            <q-list style="min-width: 100px">
              <q-item clickable v-close-popup>
                <q-item-section @click="viewDetail(item.id)"
                  >Edit</q-item-section
                >
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section @click="deleteAsset(item)"
                  >Delete</q-item-section
                >
              </q-item>
            </q-list>
          </q-menu>
        </tr>
      </tbody>
    </q-markup-table>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, inject } from "vue";
import { useRouter } from "vue-router";

import { Asset } from "../../api/model/types";
import {Emitter,EventType} from "mitt";

// ---------------- Định nghĩa props ----------------
const props = defineProps<{
  listData: Asset[];
}>();

// ---------------- Khai báo biến ----------------
const router = useRouter();
const emit = defineEmits();

const eventBus = inject("eventBus") as Emitter<Record<EventType, unknown>>

// ---------------- Event ----------------
// Lấy chi tiết tài sản
const viewDetail = (id: number) => {
  router.push({ name: "AssetDetail", params: { id: id.toString() } });
};

// Xóa tài sản
const deleteAsset = (asset: Asset) => {
  eventBus.emit("itemDelete", asset.name);
  emit("delete", asset);
};
</script>
<style scoped>
@import url("./AssetList.scss");
</style>
