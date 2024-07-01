<template>
  <div class="p-basic">
    <!-- :query-list="queryList"     :selectionChange="selectionChange"-->
    <!--  {{ this.$store.state.app.tenementInfoObj}}-->
    <exact-search
      ref="exactSearch"
      :immediate="immediateQuery"
      :update-state="updateState"
      :query-list="queryList"
      :search-height-change="calcHeight"
    />
    <exact-list
      :state="state"
      :table-h="tableH1"
      :handle-add="handleAdd"
      :handle-edit="handleEdit"
      :handle-delete="handleDelete"
      :addSonMenu="addSonMenu"
      :exchange="exchange"
      :queryList="queryList"
      :handleConnectMenuRole="handleConnectMenuRole"
    />
    <entity-dialog
      :module-name="moduleName"
      :visible="entityDlgVis"
      :action="entityDlgActn"
      :entity="state.entity"
      :update-vis="updateEntityDlgVis"
      :handle-save="handleSave"
      :tenementInfoObj="this.$store.state.app.tenementInfoObj"
      :level="level"
    />
    <!--关联菜单角色-->
    <connect-menu-role-dialog
      ref="ConnectMenuRoleRef"
      module-name=""
      :visible="dialogBool.connectMenuRoleWinShow"
      :action="entityDlgActn"
      :entity="state.entity"
      :state="state"
      :update-vis="updateEntityDlgVis"
      :win-close="winClose"
      :handle-save="handleSaveConnectMenuRole"
    />
  </div>
</template>

<script>
import PageList from "@/mixins/pageList";
import store from "./store";
import { mapActions, mapState } from "vuex";
import ExactSearch from "./components/exactSearch";
import ExactList from "./components/exactList";
import EntityDialog from "./components/entityDialog";
import ConnectMenuRoleDialog from "./components/connectMenuRoleDialog.vue";

export default {
  name: "usfMenuResource",
  mixins: [PageList],
  components: {
    ExactSearch,
    ExactList,
    EntityDialog,
    ConnectMenuRoleDialog,
  },
  data() {
    return {
      // store唯一标识
      storeKey: "usfMenuResource",
      // 模块名称
      moduleName: "usf菜单资源管理",
      //添加子菜单功能
      parentId: null,
      level: undefined,
      id: "",
      dialogBool: {
        connectMenuRoleWinShow: false,
      },
    };
  },
  created() {
    this.registStore(store);
  },
  methods: {
    ...mapActions("menuResource", ["exchange"]),
    // 点击关联菜单角色按钮
    handleConnectMenuRole(item) {
      this.dialogBool.connectMenuRoleWinShow = true;
      this.updateState({ id: item.id });
      // 分配菜单角色
      this.showDialog(`关联菜单角色`, "connectMenuRoleWinShow");
      // 触发该组件内事件设置默认值
      this.$refs.ConnectMenuRoleRef.setAppCode();
    },
    // 设置菜单角色 弹窗确定按钮
    handleSaveConnectMenuRole(ev) {
      this.dispatch("updateRolesForResource").then((ev) => {
        ev && this.dispatch("listForResourceOne");
      });
    },
    // 显示指定弹层公共方法
    showDialog(name, value) {
      this.dialogBool[value] = true;
      this.entityDlgActn = name;
    },
    winClose() {
      this.dialogBool.importUserWinShow = false;
      this.dialogBool.menuRole = false;
      this.dialogBool.menuRoled = false;
      this.dialogBool.connectMenuRoleWinShow = false;
    },
    addSonMenu(row) {
      // this.parentId=null
      this.level = row && row.level ? row.level + 1 : 1;
      this.parentId = row && row.id ? row.id : null;
      this.updateState({ parentId: this.parentId });
      this.handleAdd();
    }, //重写编辑
    handleEdit(params) {
      this.parentId = params && params.id ? params.id : null;
      this.updateState({ parentId: this.parentId });
      this.dispatch("queryEntity", { params }).then((res) => {
        this.entityDlgVis = true;
        this.entityDlgActn = "edit";
      });
    },
    //重写保存
    handleSave({ params, type }) {
      // params.resourceSource
      const done = () => {
        this.updateEntityDlgVis(false);
        this.queryList();
      };
      if (type === "add") {
        // 新建
        params.level = this.level;
        //if(this.level!=1){ params.parentId = this.parentId}
        params.parentId = this.parentId;
        this.dispatch("createEntity", { params, done });
      } else {
        // 更新
        this.dispatch("updateEntity", { params, done });
      }
    },
    handleDelete(params, msg) {
      let delParma = params.id;
      msg = "点击确认后，删除该菜单（及其所有子菜单）";
      const done = () => {
        if (this.state.list.length <= 1) {
          this.updateState({ pageIndex: 1, pageSize: 10000 });
        }
        this.queryList();
      };
      this.$confirm(msg, "确定删除该菜单吗")
        .then(() => {
          this.dispatch("delete", { params: { id: delParma }, done });
        })
        .catch(() => {});
    },
  },
};
</script>



