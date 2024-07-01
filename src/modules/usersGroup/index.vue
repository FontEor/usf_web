<template>
  <div class="p-basic">
    <!--immediateQuery-->
    <exact-search
      ref="exactSearch"
      :immediate="immediateQuery"
      :update-state="updateState"
      :query-list="queryList"
      :search-height-change="calcHeight"
    />
    <exact-list
      ref="exactList"
      :state="state"
      :table-h="tableH1"
      :page-index-change="pageIndexChange"
      :page-size-change="pageSizeChange"
      :handle-add-user="handleAddUser"
      :import-user="importUser"
      :handle-config-user="handleConfigUser"
      :handle-config-admin="handleConfigAdmin"
      :handle-delete-user="handleDeleteUser"
      :handleRelatedJobs="handleRelatedJobs"
    />
    <!--添加用户 编辑-->
    <add-user-dialog
      :module-name="moduleName"
      ref="addUserDialog"
      :visible="dialogBool.addUserWinShow"
      :action="entityDlgActn"
      :entity="state.entity"
      :state="state"
      :userFlag="userFlag"
      :tree-org-list="state.treeOrgList"
      :update-vis="updateEntityDlgVis"
      :win-close="winClose"
      :handle-save="handleSaveAddUser"
    />
    <!--设置/查看菜单角色-->
    <config-user-menu-dialog
      ref="UserMenuRef"
      :module-name="moduleName"
      :visible="dialogBool.configUserMenuWinShow"
      :action="entityDlgActn"
      :entity="state.entity"
      :state="state"
      :update-vis="updateEntityDlgVis"
      :win-close="winClose"
      :handle-save="handleSaveConfigUserMenu"
    />
    <!--设置/查看数据角色-->
    <config-user-data-dialog
      :module-name="moduleName"
      :visible="dialogBool.configUserDataWinShow"
      :action="entityDlgActn"
      :entity="state.entity"
      :state="state"
      :update-vis="updateEntityDlgVis"
      :win-close="winClose"
      :handle-save="handleSaveConfigUserData"
    />
    <!--设置/查看组成员-->
    <config-admin-dialog
      :module-name="moduleName"
      :visible="dialogBool.configAdminWinShow"
      :action="entityDlgActn"
      :entity="state.entity"
      :state="state"
      :update-vis="updateEntityDlgVis"
      :win-close="winClose"
      :handle-save="handleSaveConfigAdmin"
    />

    <!--批量导入-->
    <import-dialog-new
      :module-name="moduleName"
      :visible="dialogBool.importUserWinShow"
      :action="entityDlgActn"
      :uploadData="uploadData"
      :entity="state.entity"
      :state="state"
      :win-close="winClose"
      :handle-save="() => {}"
    />
    <ext-dialog
      ref="extDialog"
      :module-name="moduleName"
      :visible="dialogBool.extWinShow"
      :action="entityDlgActn"
      :entity="state.entity"
      :state="state"
      :update-vis="updateEntityDlgVis"
      :win-close="winClose"
      :dispatch="dispatch"
      @SETLISTEXTENDFIELDS="setListExtendFields"
    />
    <!-- 用户组关联岗位 -->
    <RelatedJobsDialog
      dialogTitle="用户组关联岗位"
      type="group"
      :visible="dialogBool.relatedJobsDialogVisible"
      :update-vis="updateRelatedJobsDialogVisible"
      :code="groupCode"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";
import PageList from "@/mixins/pageList";
import store from "./store";
import ExactSearch from "./components/exactSearch";
import ExactList from "./components/exactList";
// 添加用户 编辑 弹窗
import AddUserDialog from "./components/addUserDialog";
// 设置菜单角色
import configUserMenuDialog from "./components/configUserMenuDialog";
// 设置数据角色
import configUserDataDialog from "./components/configUserDataDialog";
// 添加用户弹窗
import configAdminDialog from "./components/configAdminDialog";
// // 导入用户组弹窗
import importDialogNew from "@/components/basicDialog/components/importDialogNew";
import ExtDialog from "./components/extDialog";
import RelatedJobsDialog from "@/components/relatedJobsDialog/index.vue";
const VUE_APP_API_PREFIX = process.env.VUE_APP_API_PREFIX;

export default {
  name: "usersGroup",
  mixins: [PageList],
  components: {
    ExactSearch,
    ExtDialog,
    ExactList,
    AddUserDialog,
    configUserMenuDialog,
    configUserDataDialog,
    configAdminDialog,
    importDialogNew,
    RelatedJobsDialog,
  },
  data() {
    return {
      VUE_APP_API_PREFIX: VUE_APP_API_PREFIX,
      // store唯一标识
      storeKey: "usersGroup",
      // 新增 编辑用户 0新增 1编辑
      userFlag: "0",
      // 模块名称
      moduleName: "",
      // 弹层显示隐藏状态集合
      dialogBool: {
        // 编辑增加 弹窗显示状态
        addUserWinShow: false,
        // 设置菜单角色 弹窗显示状态
        configUserMenuWinShow: false,
        // 设置数据角色 弹窗显示状态
        configUserDataWinShow: false,
        // 设置数据权限 弹窗显示状态
        configAdminWinShow: false,
        // 导入用户 弹窗显示状态
        importUserWinShow: false,
        // 查看菜单权限  弹窗显示状态
        viewMenuAuthority: false,
        // 查看数据权限  弹窗显示状态
        viewDataAuthority: false,
        // 自定义字段 弹窗显示状态
        extWinShow: false,
        // 重置密码，弹窗显示状态
        resetUserWinShow: false,
        // 用户组关联岗位，弹窗显示状态
        relatedJobsDialogVisible: false,
      },
      uploadArray: [
        {
          uploadUrl: "/userGroup/importGroup.do",
          templateType: "group",
          name: "groupFile",
          permission: 'DRYHZ'
        },
        {
          uploadUrl: "/userGroup/importGroupResourceRoleV2.do",
          templateType: "groupResourceRole",
          name: "groupResourceRoleFile",
          permission: 'DRYHZCDJS'
        },
        {
          uploadUrl: "/userGroup/importGroupDataRoleV2.do",
          templateType: "groupDataRole",
          name: "groupDataRoleFile",
          permission: 'DRYHZSJJS'
        },
      ],
      uploadData: {},
      adminDialogHasData: false,
      immediateQuery: false, // 改为异步
      groupCode: "",
    };
  },
  computed: {
    ...mapState("app", ["tenementInfoObj", "tenementCode"]),
  },
  methods: {
    async queryExtendList() {
      const params = { data: { tenementCode: this.tenementCode } };
      const { code, msg, data } = await api.users.queryExtList(params);
      if (code === 200) {
        if (!data || data.length === 0) return;
        this.setListExtendFields(data || []);
      } else {
        this.$message.error(msg);
      }
    },
    async queryGroupExtList() {
      const params = { data: { tenementCode: this.tenementCode } };
      const { code, msg, data } = await api.users.queryGroupExtList(params);
      if (code === 200) {
        if (!data || data.length === 0) return;
        this.setListExtendFields(data || []);
      } else {
        this.$message.error(msg);
      }
    },
    // 关联岗位
    handleRelatedJobs(item) {
      if (!item.id) {
        this.$message.error("请先选择用户组！");
        return;
      }
      this.groupCode = item.groupCode;
      this.updateRelatedJobsDialogVisible(true);
    },
    updateRelatedJobsDialogVisible(visible) {
      this.dialogBool.relatedJobsDialogVisible = visible;
    },
    updateExtendVis(vis) {
      this.extendVis = vis;
    },
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
            return (
              <span>{enumValue ? tools.ellipsis(enumValue.label) : ""}</span>
            );
          };
        } else {
          col.render = (h, { row }) => {
            return <span>{tools.ellipsis(row[col.key])}</span>;
          };
        }
        return col;
      });
      uListFields.splice(6, 0, ...extendFields);
      this.$refs.exactList.fields = uListFields;
      this.$refs.exactSearch.handleSearch();
    },
    importUser([index, title]) {
      this.dialogBool.importUserWinShow = true;
      const config = this.uploadArray[index];
      this.uploadData = {
        ...config,
        enabled: this.buttonData(config.permission).has && this.showExportButton
      };
      this.entityDlgActn = title;
    },
    // 添加 编辑用户
    handleAddUser(_flag, item) {
      if (!item.id && _flag === "1") {
        this.$message.error("请选择用户组！");
        return;
      }
      this.userFlag = _flag;
      this.showDialog(`${["添加", "编辑"][_flag]}用户组`, "addUserWinShow");
      // 如果是新增就清空状态 清空状态
      _flag == "0" && this.updateState("entity");
      // 传值到弹窗
      if (_flag == "1") {
        this.updateState({ entity: item, setId: item.id });
      }
    },
    // 0 设置菜单角色 1 设置数据角色 弹起
    handleConfigUser(ev, item, type) {
      if (!item.id) {
        this.$message.error("请选择用户组！");
        return;
      }
      this.updateState({ userId: item.id });
      if (ev === "0") {
        if (type === "view") {
          this.showDialog(
            `查看${["菜单", "数据"][ev]}角色`,
            "configUserMenuWinShow"
          );
          this.$refs.UserMenuRef.setAppCode(type);
        } else {
          this.showDialog(
            `分配${["菜单", "数据"][ev]}角色`,
            "configUserMenuWinShow"
          );
          this.$refs.UserMenuRef.setAppCode(type);
        }
        // 触发该组件内事件设置默认值
      } else if (ev === "1") {
        if (type === "view") {
          this.showDialog(
            `查看${["菜单", "数据"][ev]}角色`,
            "configUserDataWinShow"
          );
          this.dispatch("viewDataRoleListByGroup");
        } else {
          this.showDialog(
            `分配${["菜单", "数据"][ev]}角色`,
            "configUserDataWinShow"
          );
          this.dispatch("DataRoleListByGroup");
        }
        // 查询 分配数据角色列表
        // this.dispatch('queryDataRoleByUser')
      }
    },
    // 设置/查看 组成员
    handleConfigAdmin(item, type) {
      if (!item.id) {
        this.$message.error("请选择用户组！");
        return;
      }
      this.updateState({ userId: item.id });
      if (type === "view") {
        this.showDialog(`查看组成员`, "configAdminWinShow");
        this.dispatch("viewUserListByGroup");
      } else {
        this.showDialog(`设置组成员`, "configAdminWinShow");
        this.dispatch("DataTypeList");
      }
    },
    // 设置菜单角色 弹窗确定按钮
    handleSaveConfigUserMenu(ev) {
      this.dispatch("addMenuRoleToUserGroup").then((ev) => {
        this.updateState({ menuPageIndex: 0 });
        ev && this.dispatch("listForUser");
      });
    },
    // 设置数据角色 弹窗确定按钮
    handleSaveConfigUserData(ev) {
      this.dispatch("addDataRoleToUserGroup").then((ev) => {
        this.updateState({ dataPageIndex: 0 });
        ev && this.dispatch("DataRoleListByGroup");
      });
    },
    //设置组成员 弹窗确定按钮
    handleSaveConfigAdmin(ev) {
      this.dispatch("addUserToUserGroup").then((ev) => {
        this.updateState({ dataPageIndex: 0 });
        ev && this.dispatch("DataTypeList");
      });
    },
    // 添加 编辑 弹窗确定按钮
    handleSaveAddUser({ params }) {
      this.updateState({ entity: params });
      if (this.userFlag === "0") {
        // 添加用户
        this.dispatch("addUser").then((ev) => {
          if (ev) {
            this.hideDialog();
            this.dispatch("queryList");
          }
        });
      } else {
        // 编辑用户
        this.dispatch("editUser").then((ev) => {
          this.hideDialog();
          this.dispatch("queryList");
        });
      }
    },
    // 取消或退出按钮
    winClose(ev) {
      this.hideDialog();
      this.updateState("entity");
    },
    // 显示指定弹层公共方法
    showDialog(name, value) {
      this.dialogBool[value] = true;
      this.entityDlgActn = name;
    },
    // 隐藏指定弹层公共方法
    hideDialog() {
      for (var k in this.dialogBool) {
        this.dialogBool[k] = false;
      }
    },
    // 删除
    handleDeleteUser(user) {
      const { groupName, id } = user;
      if (!id) return;
      const content = `点击确定后,删除用户组 ${groupName}`;
      const title = "确定删除用户组吗";
      const options = {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        cancelButtonClass: "el-button--mini",
        confirmButtonClass: "el-button--mini",
      };
      const params = { id };
      this.$confirm(content, title, options)
        .then(() => api.usersGroup.deleteUser({ data: params }))
        .then(({ code, data, msg }) => {
          if (code === 200) {
            this.$message.success(msg);
            this.$refs.exactSearch.handleSearch();
          } else {
            this.$message.error(msg);
          }
        });
    },
  },
  beforeCreate() {
    this.allFields = ["id"];
    this.disFields = [];
  },
  created() {
    this.registStore(store);
    this.dispatch("queryGroupExtList");
  },
  mounted() {
    this.queryGroupExtList();
  },
  activated() {
    this.queryList();
  },
};
</script>
