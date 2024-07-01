<template>
  <div class="p-basic">
    <!-- :query-list="queryList"     :selectionChange="selectionChange"-->
    <exact-search
      ref="exactSearch"
      :immediate="immediateQuery"
      :update-state="updateState"
      :query-list="queryList"
      :search-height-change="calcHeight"
    />
    <exact-list
      v-if="state.query.appCode"
      :state="state"
      :table-h="tableH1"
      :handle-add="handleAdd"
      :handle-edit="handleEdit"
      :handle-delete="handleDelete"
      :addSonMenu="addSonMenu"
      :changeParent="changeParent"
      :exchange="exchange"
      :queryList="queryList"
      @UPDATE_LIST="updateList"
      :on-son-menu-role="onSonMenuRole"
      :on-son-menu-roled="onSonMenuRoled"
      :import-data="importData"
      :export-menu-data="exportMenuData"
      :dispatch="dispatch"
      :handleConnectMenuRole="handleConnectMenuRole"
      :queryObj="state.query"
      :more-view-data="moreViewData"
      ref="exactList"
    />
    <entity-dialog
      :module-name="moduleName"
      :visible="entityDlgVis"
      :action="entityDlgActn"
      :entity="state.entity"
      :queryObj="state.query"
      :tenementInfoObj="this.$store.state.app.tenementInfoObj"
      :update-vis="updateEntityDlgVis"
      :handle-save="handleSave"
      :level="level"
    />
    <!--批量导入-->
    <import-dialog-new
      module-name=""
      :visible="dialogBool.importUserWinShow"
      :action="'导入菜单资源'"
      :uploadData="uploadData"
      :entity="state.entity"
      :state="state"
      :win-close="winClose"
      :handle-save="() => {}"
    />
    <!--分配菜单角色-->
    <menu-role
      module-name=""
      ref="MenuRoleRef"
      :visible="dialogBool.menuRole"
      :action="'分配给菜单角色'"
      :entity="state.entity"
      :state="state"
      :win-close="winClose"
      :handle-save="handleSaveMenuRole"
    />
    <menu-roled
      module-name=""
      ref="MenuRoleRef"
      :visible="dialogBool.menuRoled"
      :action="'已分配菜单角色'"
      :entity="state.entity"
      :state="state"
      :win-close="winClose"
      :handle-save="() => {}"
    />
    <change-parent-dialog
      ref="changeParentDialog"
      :dlg-width="720"
      :state="state"
      :visible="dialogBool.changeParentDialog"
      :action="'变更换父节点'"
      :update-vis="updateEntityDlgVis1"
      :update-state="updateState"
      :handle-save="handleSave"
      @UPDATE_LIST="updateList"
      :past-id="changeParentPastData.pastId"
      :past-parent="changeParentPastData.pastParentId"
      :tenementInfoObj="this.$store.state.app.tenementInfoObj"
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
    <!-- 导出相关弹框 -->
    <ExportProgress
      ref="exportProgress"
      :module-name="exportTitle"
      action=""
      :visible="exportProgressShow"
      :progressStatus="exportProgressStatus"
      :progressPercentage="exportProgressPercentage"
    />
    <ExportDialog
      ref="exportDialog"
      module-name=""
      :action="exportResultTitle"
      :visible="exportResultShow"
      :content="exportResultContent"
      @closed="onCloseExportResultDialog"
    />
  </div>
</template>

<script>
import PageList from "@/mixins/pageList";
import store from "./store";
import { mapActions } from "vuex";
import ExactSearch from "./components/exactSearch";
import ExactList from "./components/exactList";
import EntityDialog from "./components/entityDialog";
import importDialogNew from "./components/importDialogNew";
import menuRole from "./components/menuRole";
import menuRoled from "./components/menuRoled";
import ChangeParentDialog from "./components/changeParentDialog";
import ConnectMenuRoleDialog from "./components/connectMenuRoleDialog.vue";
const VUE_APP_API_PREFIX = process.env.VUE_APP_API_PREFIX;

import ExportProgressMixin from "@/mixins/exportProgressAsync";

export default {
  name: "menuResource",
  mixins: [PageList, ExportProgressMixin],
  components: {
    ExactSearch,
    ExactList,
    EntityDialog,
    importDialogNew,
    menuRole,
    menuRoled,
    ChangeParentDialog,
    ConnectMenuRoleDialog,
  },
  data() {
    return {
      VUE_APP_API_PREFIX: VUE_APP_API_PREFIX,
      // store唯一标识
      storeKey: "menuResource",
      // 模块名称
      moduleName: "菜单资源管理",
      //添加子菜单功能
      parentId: null,
      level: undefined,
      id: "",
      immediateQuery: false,
      extendVis: false,
      dialogBool: {
        importUserWinShow: false,
        menuRole: false,
        menuRoled: false,
        changeParentDialog: false,
        connectMenuRoleWinShow: false,
      },
      changeParentPastData: {
        pastParentId: "",
        pastId: "",
      },
      uploadData: {},
      // 导出标题
      exportTitle: ''
    };
  },
  created() {
    this.registStore(store);
  },
  methods: {
    ...mapActions("menuResource", ["exchange"]),
    changeParent(row) {
      this.changeParentPastData.pastParentId = row.row[0].parentId;
      this.changeParentPastData.pastId = row.row[0].id;
      this.dialogBool.changeParentDialog = true;
    },
    updateEntityDlgVis1(vis) {
      this.dialogBool.changeParentDialog = vis;
    },

    addSonMenu(row) {
      // this.parentId=null
      this.level = row && row.level ? row.level + 1 : 1;
      this.parentId = row && row.id ? row.id : null;
      this.updateState({ parentId: this.parentId });
      this.handleAdd();
    },

    //重写编辑
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
    //重写删除
    handleDelete(params, msg) {
      let delParma = params.id;
      let delparentId = params.parentId;
      if (delparentId === 0) {
        this.$message.error("不能删除根资源！");
        return false;
      }
      // msg = msg || `该菜单下有${params.children.length}个菜单资源,确定删除该菜单?`
      msg = "点击确认后，删除该菜单（及其所有子菜单）";
      const done = () => {
        if (this.state.list.length <= 1) {
          this.updateState({ pageIndex: 1, pageSize: 10000 });
        }
        this.queryList();
      };
      this.$confirm(msg, "确定删除该菜单吗")
        .then(async () => {
          const loading = this.$loading({
            lock: true,
          });
          await this.dispatch("delete", { params: { id: delParma } });
          done();
          setTimeout(() => {
            loading.close();
          }, 300);
        })
        .catch(() => {});
    },
    // 分配给菜单角色
    onSonMenuRole(item) {
      if (!item.id) {
        this.$message.error("请先选择菜单资源");
        return false;
      }
      this.updateState({ userId: item.id });
      this.$refs.MenuRoleRef.setAppCode();
      this.dialogBool.menuRole = true;
    },
    // 分配保存
    handleSaveMenuRole() {
      this.dispatch("saveMenuRole").then((res) => {
        res ? this.winClose() : null;
      });
    },
    // 已分配菜单角色
    onSonMenuRoled(item) {
      if (!item.id) {
        this.$message.error("请先选择菜单资源");
        return false;
      }
      this.updateState({ userId: item.id });
      this.$refs.MenuRoleRef.setAppCode();
      this.dialogBool.menuRoled = true;
    },
    // 导入
    importData() {
      this.dialogBool.importUserWinShow = true;
      this.uploadData = {
        uploadUrl: "/resource/import/importResourceV2.do",
        templateType: "resource",
        name: "resourceFile",
        appCode:this.state.query.appCode,
        enabled: this.buttonData('CDDR').has && this.showExportButton
      }; // 导入用户;
    },
    // 导出
    async exportMenuData() {
      this.exportRequestFun({
        url: '/resource/export/exportResource.do',
        params: {
          tenementCode: this.$store.state.app.tenementCode,
          appCode: this.$store.state.menuResource.appCode,
        },
        responseType: 'stream',
        method: 'get',
        onDownloadProgress: (processEvenet) => {
          console.log('####### processEvenet', processEvenet);
        }
      })
    },
    // 点击关联菜单角色按钮
    handleConnectMenuRole(item) {
      this.dialogBool.connectMenuRoleWinShow = true;
      this.updateState({ id: item.id });
      // 分配菜单角色
      this.showDialog(`查看关联菜单角色`, "connectMenuRoleWinShow");
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
    updateList() {
      this.$refs.exactSearch.handleSearch();
    },

    // 导出中间处理函数
    moreViewData(ev) {
      if (!this.showExportButton) {
        return this.$message({
          type: 'error',
          message: "为确保大促期间系统正常运行，在封版期内USF所有【导入】【导出】功能将暂时屏蔽，封版结束后恢复正常使用，封版期间如有紧急导数需求联系USF小妹（org.missusf）",
          showClose: true,
        })
      }
      switch (ev[0]) {
        case 0:
          this.exportTitle = ev[1];
          this.exportMenuData();
          break;
        case 1:
          this.exportTitle = ev[1];
          this.exportMenuUserData(ev[2]);
          break;
        default:
          break;
      }
    },
    async exportMenuUserData(row) {
      if(!row || !row.id) {
        return this.$message.error('请选择一个菜单资源');
      }
      this.exportRequestFun({
        url: '/resource/export/exportMenuResourceRelatedUser.do',
        params: {
          id: row.id,
          tenementCode: this.$store.state.app.tenementCode,
        },
        responseType: 'stream',
        method: 'get',
        onDownloadProgress: (processEvenet) => {
          console.log('####### processEvenet', processEvenet);
        }
      })
    },
  },
};
</script>
