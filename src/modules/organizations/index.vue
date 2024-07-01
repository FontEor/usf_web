<template>
  <div class="p-basic">
    <exact-search
      ref="exactSearch"
      :immediate="immediateQuery"
      :update-state="updateState"
      :query-list="queryList"
      :on-view-change="onViewChange"
      :search-height-change="calcHeight"
    />
    <exact-list
      ref="exactList"
      :state="state"
      :table-h="tableH1"
      :page-index-change="pageIndexChange"
      :page-size-change="pageSizeChange"
      :handle-add="handleAdd"
      :handle-uers="handleViewUsers"
      :handle-roles="handleRoles"
      :handle-edit="handleEdit"
      :handle-config-admin="handleConfigAdmin"
      :handleRelatedJobs="handleRelatedJobs"
      :import-user="importUser"
      :handle-delete="handleDelete"
      :handle-org="handleOrgChange"
      :handle-selection-change="handleSelectionChange"
      :handleAssignDataRoles="handleAssignDataRoles"
      :check-single-row="checkSingleRow"
      :load-childen="loadChilden"
      :org-types="ORGTYPES"
      :handle-extend-dialog="handleExtendDialog"
      :export-org="exportOrg"
      :handle-allow-apply="handleAllowApply"
    />
    <entity-dialog
      ref="entityDialog"
      :state="state"
      :visible="commonDlgVis[ACTIONTYPES.ADD] || commonDlgVis[ACTIONTYPES.EDIT]"
      :action="commonDlgActn"
      :entity="state.entity"
      :action-names="ACTIONNAMES"
      :action-types="ACTIONTYPES"
      :update-vis="updateDlgVis"
      :update-state="updateState"
      :handle-save="handleSave"
      :org-types="getEditOrgTypes"
    />
    <users-dialog
      ref="usersDialog"
      :dlg-width="720"
      :state="state"
      :current-row="currentRow"
      :visible="commonDlgVis[ACTIONTYPES.VIEW]"
      :action="commonDlgActn"
      :action-names="ACTIONNAMES"
      :action-types="ACTIONTYPES"
      :update-vis="updateDlgVis"
      :update-state="updateState"
      :query-list-user="queryListUser"
    />
    <!-- 分配菜单角色 -->
    <roles-dialog
      ref="rolesDialog"
      :dlg-width="900"
      :state="state"
      :current-row="currentRow"
      :visible="commonDlgVis[ACTIONTYPES.ROLE]"
      :action="commonDlgActn"
      :action-names="ACTIONNAMES"
      :action-types="ACTIONTYPES"
      :update-vis="updateDlgVis"
      :update-state="updateState"
      :handle-save="handleSave"
      :query-list-roles="queryListRoles"
    />
    <change-parent-dialog
      ref="changeParentDialog"
      :dlg-width="720"
      :state="state"
      :current-row="currentRow"
      :visible="commonDlgVis[ACTIONTYPES.LEVEL]"
      :action="commonDlgActn"
      :action-names="ACTIONNAMES"
      :action-types="ACTIONTYPES"
      :update-vis="updateDlgVis"
      :update-state="updateState"
      :handle-save="handleSave"
    />
    <extend-field-dialog
      ref="extendFeildDialog"
      action="extend"
      :visible="extendVis"
      :updateVis="updateExtendVis"
      @SETLISTEXTENDFIELDS="setListExtendFields"
    />
    <!--设置数据权限-->
    <config-admin-dialog
      module-name=""
      :visible="dialogBool.configAdminWinShow"
      action="分配数据资源"
      :entity="state.entity"
      :state="state"
      :win-close="winClose"
      :handle-save="handleSaveConfigAdmin"
      :commit="commit"
    />
    <!-- 分配数据角色 -->
    <AssignDataRolesDialog
      module-name=""
      :visible="dialogBool.assignDataRolesDialogVisbile"
      action="分配数据角色"
      :entity="state.entity"
      :state="state"
      :win-close="winClose"
      :handle-save="handleSaveAssignDataRoles"
      :commit="commit"
    />
    <!--批量导入-->
    <import-dialog-new
      module-name=""
      :visible="dialogBool.importUserWinShow"
      :action="'导入机构信息'"
      :uploadData="uploadData"
      :entity="state.entity"
      :state="state"
      :win-close="winClose"
      :handle-save="() => {}"
    />
    <!-- 机构关联岗位 -->
    <RelatedJobsDialog
      dialogTitle="机构关联岗位"
      type="org"
      :visible="dialogBool.relatedJobsDialogVisible"
      :update-vis="updateRelatedJobsDialogVisible"
      :code="orgCode"
    />
    <!-- 配置接口可申请角色 -->
    <AllowApplyDialog
      ref="rolesDialog"
      :state="state"
      :current-row="currentRow"
      :visible="showAllowApplyDialog"
      @close="onAllowApplyDialogClose"
    />
  </div>
</template>

<script>
import store from "./store";
import PageList from "./components/mixins/pageList";
import ExactSearch from "./components/exactSearch";
import ExactList from "./components/exactList";
import EntityDialog from "./components/entityDialog";
import UsersDialog from "./components/usersDialog";
import RolesDialog from "./components/rolesDialog";
import ChangeParentDialog from "./components/changeParentDialog";
import ExtendFieldDialog from "./components/extendFieldDialog";
import configAdminDialog from "../users/components/configAdminDialog";
import importDialogNew from "@/components/basicDialog/components/importDialogNew";
import RelatedJobsDialog from "@/components/relatedJobsDialog/index.vue";
import AssignDataRolesDialog from "./components/assignDataRolesDialog.vue";
import AllowApplyDialog from "./components/allowApply.vue";
const VUE_APP_API_PREFIX = process.env.VUE_APP_API_PREFIX;

import { mapState } from "vuex";

export default {
  name: "organizations",
  mixins: [PageList],
  components: {
    ExactSearch,
    ExactList,
    EntityDialog,
    UsersDialog,
    RolesDialog,
    ChangeParentDialog,
    ExtendFieldDialog,
    configAdminDialog,
    importDialogNew,
    RelatedJobsDialog,
    AssignDataRolesDialog,
    AllowApplyDialog
  },
  data() {
    return {
      VUE_APP_API_PREFIX: VUE_APP_API_PREFIX,
      // store唯一标识
      storeKey: "organizations",
      // 模块名称
      moduleName: "机构管理",
      extendVis: false,
      dialogBool: {
        configAdminWinShow: false,
        importUserWinShow: false,
        relatedJobsDialogVisible: false,
        assignDataRolesDialogVisbile: false,
      },
      uploadData: {}, // 导入地址数据信息
      orgCode: "",
      // 是否显示 配置可申请角色接口文档
      showAllowApplyDialog: false
    };
  },
  computed: {
    ...mapState("app", ["tenementCode"]),
  },
  created() {
    this.registStore(store);
    this.dispatch("queryExtList");
  },
  mounted() {
    this.queryExtendList();
  },
  methods: {
    handleExtendDialog() {
      this.updateExtendVis(true);
      this.$refs.extendFeildDialog.queryExtendList();
    },
    updateExtendVis(vis) {
      this.extendVis = vis;
    },
    // 列表扩展字段
    async queryExtendList() {
      const params = { data: { tenementCode: this.tenementCode } };
      const { code, msg, data } = await api.organizations.queryExtendField(
        params
      );
      if (code === 200) {
        if (!data || data.length === 0) return;
        this.setListExtendFields(data || []);
      } else {
        this.$message.error(msg);
      }
    },
    // 导入机构信息
    importUser(ev) {
      this.dialogBool.importUserWinShow = true;
      this.uploadData = {
        uploadUrl: "/org/import/importOrgV2.do",
        templateType: "org",
        name: "orgFile",
        enabled: this.buttonData('JGDR').has && this.showExportButton
      };
    },
    winClose() {
      this.dialogBool.configAdminWinShow = false;
      this.dialogBool.importUserWinShow = false;
      this.dialogBool.assignDataRolesDialogVisbile = false;
    },
    // 分配数据权限 弹起
    handleConfigAdmin(item) {
      if (!item.id) {
        this.$message.error("请先选择机构！");
        return;
      }
      this.updateState({ userId: item.id });
      this.dialogBool.configAdminWinShow = true;
      // 查询 设置菜单角色列表
      this.dispatch("DataTypeList");
    },
    // 点击分配数据角色按钮
    handleAssignDataRoles(item) {
      if (!item.id) {
        this.$message.error("请先选择机构！");
        return;
      }
      this.updateState({ userId: item.id });
      this.dialogBool.assignDataRolesDialogVisbile = true;
    },
    // 保存机构分配数据角色
    handleSaveAssignDataRoles(ev) {
      this.dispatch("addOrgDataRoleRel").then((res) => {
        res && this.winClose();
      });
    },
    // 关联岗位
    handleRelatedJobs(item) {
      if (!item.id) {
        this.$message.error("请先选择机构！");
        return;
      }
      this.orgCode = item.orgCode;
      this.updateRelatedJobsDialogVisible(true);
    },
    updateRelatedJobsDialogVisible(visible) {
      this.dialogBool.relatedJobsDialogVisible = visible;
    },
    // 保存
    handleSaveConfigAdmin(ev) {
      this.dispatch("DataAssign").then((res) => {
        res ? this.winClose() : null;
      });
    },
    // 更改列表展示列
    setListExtendFields(extendList) {
      const showExtendFields = extendList.filter(
        (item) => item.isEffective === 1
      );
      const listFields = this.$refs.exactList.fields;
      // 除扩展字段外的字段
      const uListFields = [];
      listFields.forEach((elem) => {
        if (!elem.key.includes("ext")) {
          uListFields.push(elem);
        }
      });
      const extendFields = showExtendFields.map((item) => {
        const col = {
          key: `ext${item.extNo}`,
          name: item.extName,
          hidden: false,
        };
        if (item.isEnum === 1) {
          col.render = (h, { row }) => {
            const enums = jt.fn.generateEnums(item.enumValue, ",");
            const enumValue = enums.find(
              (subItem) => subItem.value === row[col.key]
            );
            return <span>{enumValue ? enumValue.label : ""}</span>;
          };
        }
        return col;
      });
      uListFields.splice(6, 0, ...extendFields);
      this.$refs.exactList.fields = uListFields;
      this.$refs.exactSearch.handleSearch();
    },
    exportOrg() {
      if (!this.showExportButton) {
        return this.$message({
          type: 'error',
          message: "为确保大促期间系统正常运行，在封版期内USF所有【导入】【导出】功能将暂时屏蔽，封版结束后恢复正常使用，封版期间如有紧急导数需求联系USF小妹（org.missusf）",
          showClose: true,
        })
      }
      //获取查询参数
      let param = this.$refs.exactSearch.queryParam();
      param.tenementCode = this.$store.state.app.tenementInfoObj.tenementCode;
      let url = "";
      Object.keys(param).map((key) => {
        if (key != "viewModel") {
          url += key + "=" + param[key] + "&";
        }
      });
      url = url.substring(0, url.length - 1);
      const _origin = window.location.origin;
      let a = document.createElement("a");
      a.href =
        `${_origin}${this.VUE_APP_API_PREFIX}/org/export/exportOrg.do?` + url;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },
    // 打开配置允许可配置角色弹框
    handleAllowApply() {
      if (!this.currentRow || !this.currentRow.id) {
        this.$message.error("请先选择机构！");
        return;
      }
      this.showAllowApplyDialog = true;
    },
    // 关闭配置允许可配置觉得弹框
    onAllowApplyDialogClose(refreshList = false) {
      if (refreshList) {
        this.$refs.exactSearch.handleReset();
      }
      this.showAllowApplyDialog = false;
    }
  },
};
</script>
