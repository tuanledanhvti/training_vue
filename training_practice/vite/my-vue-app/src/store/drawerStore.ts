import { defineStore } from "pinia";

export const useDrawerStore = defineStore("drawer", {
  state: () => ({
    width: 0,
  }),
  actions: {
    setDrawerWidth(width) {
      this.width = width;
    },
  },
});
