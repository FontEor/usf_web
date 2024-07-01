<template>
  <div class="p-basic">
    <exact-search
      ref="exactSearch"
      :immediate="immediateQuery"
      :update-state="updateState"
      :tenementCode="tenementCode"
      :query-list="queryList"
      :search-height-change="calcHeight"
    />
    <exact-list
      :state="state"
      :table-h="tableH1"
      :handle-add="handleAdd"
      :handle-allocate="handleAllocate"
      :handle-edit="handleEdit"
      :import-data-role="importDataRole"
      :handle-view="handleView"
      :handle-delete="handleDelete"
      :handle-export="handleExport"
      :handle-import="handleImport"
    />
    <!-- 添加 编辑 详情 -->
    <entity-dialog
      ref="entityDialog"
      :title="entityDlgTitle"
      :module-name="moduleName"
      :visible="entityDlgVis"
      :action="entityDlgActn"
      :entity="state.entity"
      :update-vis="updateEntityDlgVis"
      :handle-save="handleSave"
      :tenementCode="tenementCode"
      :showFlowID="showFlowID"
    />
    <!-- 分配数据角色弹窗 -->
    <allocate-dialog
      :title="allocateBtnName"
      :module-name="moduleName"
      :visible="allocateDlgVis"
      :select-role="selectRole"
      :update-vis="updateAllocateDlgVis"
      :tenementCode="tenementCode"
    />

    <!--批量导入-->
    <import-dialog
      module-name=""
      :visible="dialogBool.dataRole"
      :action="'导入数据角色'"
      :uploadData="uploadData"
      :entity="state.entity"
      :state="state"
      :win-close="() => (dialogBool.dataRole = false)"
      :handle-save="() => {}"
    />
    <!-- 导出相关弹框 -->
    <ExportProgress
      ref="exportProgress"
      module-name="导出数据角色关联用户"
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
    <!--导入用户菜单角色管理权限-->
    <import-dialog-new
      :module-name="''"
      :visible="dialogBool.dataRoleRelationDataResource"
      :action="'数据角色关联数据资源'"
      :uploadData="uploadData"
      :entity="state.entity"
      :state="state"
      :update-vis="updateEntityDlgVis"
      :win-close="() => dialogBool.dataRoleRelationDataResource = false"
    />
  </div>
</template>

<script>
import PageList from "@/mixins/pageList";
import ExportProgressMixin from "@/mixins/exportProgressAsync";

import store from "./store";
import ExactSearch from "./components/exactSearch";
import ExactList from "./components/exactList";
import EntityDialog from "./components/entityDialog";
import AllocateDialog from "./components/allocateDialog";
import importDialog from "@/components/basicDialog/components/importDialog";
import importDialogNew from "@/components/basicDialog/components/importDialogNew";
import { mapState } from "vuex";
import { async } from "q";
import axios from "axios";
export default {
  name: "dataRole",
  mixins: [PageList, ExportProgressMixin],
  components: {
    ExactSearch,
    ExactList,
    EntityDialog,
    AllocateDialog,
    importDialog,
    importDialogNew,
  },
  data() {
    return {
      // store唯一标识
      storeKey: "dataRole",
      // 模块名称
      showFlowID: false,
      moduleName: "数据角色管理",
      allocateDlgVis: false,
      selectRole: undefined,
      immediateQuery: false,
      allocateBtnName: undefined,
      entityDlgTitle: undefined,
      dialogBool: {
        val: false,
        dataRole: false,
        dataRoleRelationDataResource: false,
      },
      uploadData: {},
    };
  },
  created() {
    this.registStore(store);
  },
  methods: {
    // 分配菜单角色按钮事件
    handleAllocate(val, btnName) {
      if (!val) {
        this.$message.error("请选择角色");
        return;
      }
      this.allocateDlgVis = true;
      this.selectRole = val;
      this.allocateBtnName = btnName;
    },
    updateAllocateDlgVis(bool) {
      this.allocateDlgVis = bool;
    },
    handleAdd(btnName) {
      axios({
        method: "post",
        url: "/dataRole/showFlowId",
        data: {
          data: {
            tenementCode: this.tenementCode,
            appCode: "",
          },
        },
        params:{
          tenementCode:this.tenementCode
        }
      })
        .then((resolve) => {
          this.showFlowID = resolve.data.success;
          // this.showFlowID = true;
          this.entityDlgVis = true;
          this.entityDlgActn = "add";
          this.entityDlgTitle = btnName;
          this.updateState("entity");
        })
        .catch((reject) => {
          console.log("postBlurryQueryOrgData 请求失败", reject);
        });
    }, // 编辑
    handleEdit(params, btnName, flag) {
      if (_.isEmpty(params)) {
        this.$message.error("请选择角色");
        return;
      }
      if (flag) {
        axios({
          method: "post",
          url: "/dataRole/showFlowId",
          data: {
            data: {
              tenementCode: this.tenementCode,
              appCode: "",
            },
          },
          params:{
            tenementCode:this.tenementCode
          }
        })
          .then((resolve) => {
            this.showFlowID = resolve.data.success;
            // this.showFlowID = true;
            this.dispatch("queryEntity", { params }).then((res) => {
              this.entityDlgVis = true;
              this.entityDlgActn = "edit";
              this.entityDlgTitle = btnName;
            });
          })
          .catch((reject) => {
            console.log("postBlurryQueryOrgData 请求失败", reject);
          });
      } else {
        axios({
          method: "post",
          url: "/dataRole/showFlowId",
          data: {
            data: {
              tenementCode: this.tenementCode,
              appCode: "",
            },
          },
          params:{
            tenementCode:this.tenementCode
          }
        })
          .then((resolve) => {
            this.showFlowID = resolve.data.success;
            // this.showFlowID = true;
            this.entityDlgVis = true;
            this.entityDlgActn = "edit";
            this.entityDlgTitle = btnName;
            this.updateState({ entity: params });
          })
          .catch((reject) => {
            console.log("postBlurryQueryOrgData 请求失败", reject);
          });
      }
    },
    // 导入
    importDataRole() {
      this.dialogBool.dataRole = true;
      this.uploadData = {
        uploadUrl: "/dataRole/importDataRole.do",
        templateType: "dataRole",
        name: "dataRoleFile",
        enabled: this.buttonData('SJJSDR').has && this.showExportButton
      };
    },
    // 导入数据角色关联数据资源
    importDataRoleRelationDataResource() {
      this.dialogBool.dataRoleRelationDataResource = true;
      this.uploadData = {
        uploadUrl: "/dataRoleImport/importDataRoleResource.do",
        templateType: "dataRoleResource",
        name: "dataRoleResourceFile",
        appCode:this.state.query.appCode,
        enabled: this.buttonData('CDDR').has && this.showExportButton
      }; // 导入用户;
    },
    handleView(params, btnName, flag) {
      if (_.isEmpty(params)) {
        this.$message.error("请选择角色");
        return;
      }
      this.entityDlgVis = true;
      this.entityDlgActn = "view";
      this.entityDlgTitle = btnName;
      if (flag) {
        this.dispatch("queryEntity", { params });
      } else {
        this.updateState({ entity: params });
      }
    },
    // 删除
    handleDelete(params, msg) {
      if (_.isEmpty(params)) {
        this.$message.error("请选择要删除的角色");
        return;
      }
      api.dataRole
        .queryUsersOfDataRole({
          id: params.id,
          tenementCode: this.tenementCode,
        })
        .then(({ code, data, msg }) => {
          let info = `该角色已分配给${data}位用户，你确定删除该角色？`;
          const done = () => {
            if (this.state.list.length <= 1) {
              this.updateState({ pageIndex: 0 });
            }
            this.queryList();
          };
          this.$confirm(info, "确认删除该数据角色？").then(() => {
            const req = { id: params.id, tenementCode: this.tenementCode };
            this.dispatch("delete", { params: req, done });
          });
        });
    },
    handleSave({ params, type }) {
      const done = () => {
        this.updateEntityDlgVis(false);
        this.queryList();
        this.$refs.entityDialog.queryList();
      };
      if (type === "add") {
        // 新建
        this.dispatch("createEntity", { params, done });
      } else if (type === "edit") {
        // 新建
        this.dispatch("updateEntity", { params, done });
      } else {
        // 更新
        this.dispatch("updateEntity", { params, done });
      }
    },
    handleExport(ev) {
      if (!this.showExportButton) {
        return this.$message({
          type: 'error',
          message: "为确保大促期间系统正常运行，在封版期内USF所有【导入】【导出】功能将暂时屏蔽，封版结束后恢复正常使用，封版期间如有紧急导数需求联系USF小妹（org.missusf）",
          showClose: true,
        })
      }
      const rows = ev[2];
      if(rows.length) {
        return this.exportRequestFun({
          url: '/dataRole/export/exportDataRoleWithAssignUser.do',
          params: {
            tenementCode: this.tenementCode,
            roleIds: rows.map(row => row.id).join(','),
          },
          responseType: 'stream',
          method: 'get',
          onDownloadProgress: (processEvenet) => {
            console.log('####### processEvenet', processEvenet);
          }
        })
      } else {
        this.$message.error('请至少选择一个数据角色')
      }
    },
    handleImport(argument) {
      console.log('argument', argument)
      if(argument) {
        switch (argument[0]) {
        case 1:
          this.importDataRole()
          break;
        case 2:
          this.importDataRoleRelationDataResource();
          break;
        default:
          this.$message.error('WEB: 导入参数错误');
          break;
      }
      } else {
        this.$message.error('WEB: 导入参数错误');
      }
    }
  },
  computed: {
    ...mapState("app", {
      tenementCode: (state) => state.tenementCode,
    }),
  },
};
</script>
