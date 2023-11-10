<template>
  <!-- node-key là chỉ định dùng cái gì để phân biệt, như key trong vòng for -->
  <div class="q-pa-md bg-cyan-8 text-white">
    <q-tree
      :nodes="companyList"
      node-key="id"
      v-model:expanded="expanded"
      dark
      color="white"
    />
  </div>
  {{ departList }}
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getCompany } from "../../api/companyApi";
import { getDepartByCompanyId } from "../../api/departApi";
import { useQuery } from "vue-query";
import { Company } from "../../api/model/types";

// ---------------- Khai báo biến ----------------
const expanded = ref();
const companyList = ref([]);
const idCompanyList = ref();

// ---------------- Lấy dữ liệu ----------------
// Lấy dữ liệu company
const getCompanyData = () => {
  try {
    useQuery("companyList", () => {
      getCompany().then((data) => {
        companyList.value = data.map((item) => {
          return {
            id: item.id,
            label: item.name,
          };
        });

        // Lấy danh sách id của các company
        idCompanyList.value = companyList.value
          .map((company: Company) => `id_company=${company.id}`)
          .join("&");
      });
    });
  } catch (error) {
    console.log(error);
  }
};

// Lấy dữ liệu depart theo id của company
const {
  data: departList,
  isLoading,
  error,
} = useQuery("departList", () => getDepartByCompanyId(idCompanyList.value));
// ---------------- OnMounted ----------------
onMounted(() => {
  getCompanyData();
});
</script>
