import PopupAdd from "../components/modal/popup/PopupAdd.vue";
import DialogConfirm from "../components/modal/dialog/DialogConfirm.vue";
import { ref, inject } from "vue";
import { useDrawerStore } from "../store/drawerStore";

export default {
  install: (app, options) => {
    // Danh sách các components cần đăng ký
    const components = {
      VTI_PopupAdd: PopupAdd,
      VTI_Dialog: DialogConfirm,
    };

    // Đăng ký từng component
    // Object.entries là một phương thức trong JavaScript, được sử dụng
    // để trả về một mảng chứa các cặp giá trị key-value của một đối tượng
    for (const [name, component] of Object.entries(components)) {
      app.component(name, component);
    }

    app.mixin({
      updated() {
        const eventBus = inject("eventBus");
        const drawerStore = useDrawerStore();
        const drawerWidth = ref();
        drawerWidth.value = drawerStore.width;
        eventBus.emit("drawerWidth", drawerWidth.value);
      },
    });

    //el: Đối tượng thực của phần tử (element) được gắn với directive.
    // binding: Một đối tượng chứa thông tin về cách directive được gọi, bao gồm các giá trị được truyền vào.
    // vnode: Virtual Node, đại diện cho nút (element) mà directive được áp dụng.
    app.directive("font-size", (el, binding, vnode) => {
      var size = 16;
      switch (binding.arg) {
        case "normal":
          size = options.fontSize.normal;
          break;
        case "medium":
          size = options.fontSize.medium;
          break;
        case "large":
          size = options.fontSize.large;
          break;
        default:
          break;
      }
      el.style.fontSize = size + "px";
    });
  },
};
