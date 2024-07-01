<template>
  <div class="p-basic">
    <exact-search
      ref="exactSearch"
      :state="state"
      :immediate="immediateQuery"
      :update-state="updateState"
      :query-list="queryList"
      :search-height-change="calcHeight"
      @queryParams="queryParams"
    />
    <exact-list
      ref="exactList"
      :state="state"
      :table-h="tableH1"
      :page-index-change="pageIndexChange"
      :page-size-change="pageSizeChange"
      :handle-add-user="handleAddUser"
      :handle-config-user="handleConfigUser"
      :handle-config-admin="handleConfigAdmin"
      :view-menu-authority="viewMenuAuthority"
      :view-data-authority="viewDataAuthority"
      :import-user="importUser"
      :more-view-data="moreViewData"
      :handle-export="handleExport"
      :export-user-data="exportUserData"
      :handle-stop-line="handleStopLine"
      :handle-delete-user="handleDeleteUser"
      :handle-reset-user="handleResetUser"
      :handle-unfreeze-account="handleUnfreezeAccount"
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
    <!--设置菜单角色-->
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
    <!--设置数据角色-->
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
    <!--设置数据权限-->
    <config-admin-dialog
      :module-name="moduleName"
      :visible="dialogBool.configAdminWinShow"
      :action="entityDlgActn"
      :entity="state.entity"
      :state="state"
      :update-vis="updateEntityDlgVis"
      :win-close="winClose"
      :handle-save="handleSaveConfigAdmin"
      :commit="commit"
    />
    <!-- 查看数据权限 -->
    <view-menu-authority
      module-name=""
      :visible="dialogBool.viewMenuAuthority"
      :action="entityDlgActn"
      :entity="state.entity"
      :state="state"
      :win-close="winClose"
      :handle-save="() => {}"
    />
    <!-- 查看数据权限 -->
    <view-data-authority
      module-name=""
      :visible="dialogBool.viewDataAuthority"
      :action="entityDlgActn"
      :entity="state.entity"
      :state="state"
      :win-close="winClose"
      :handle-save="() => {}"
    />
    <!-- 查看用户组 -->
    <view-user-group
      module-name=""
      :visible="dialogBool.viewUserGroup"
      :action="entityDlgActn"
      :entity="state.entity"
      :state="state"
      :win-close="winClose"
      :handle-save="() => {}"
    />
    <!--批量导入-->
    <import-dialog-new
      :module-name="moduleName"
      :visible="dialogBool.importUserWinShow"
      :action="entityDlgActn"
      :uploadData="uploadData"
      :entity="state.entity"
      :state="state"
      :update-vis="updateEntityDlgVis"
      :win-close="winClose"
      :handle-save="handleSaveImportUser"
    />
    <!--齿轮设置扩展字段-->
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
    <!--重置密码按钮-->
    <reset-user-dialog
      ref="resetUserDialog"
      :module-name="moduleName"
      :visible="dialogBool.resetUserWinShow"
      :action="entityDlgActn"
      :entity="state.entity"
      :state="state"
      :update-vis="updateEntityDlgVis"
      :win-close="winClose"
      :handle-save="handleSaveResetUser"
    />
    <!-- 导出用户 -->
    <ExportDialog
      ref="exportDialog"
      :module-name="moduleName"
      :visible="dialogBool.exportUserShow"
      :content="content"
      :action="entityDlgActn"
      :win-close="winClose"
    />
    <!-- 导出用户进度条 -->
    <ExportProgress
      ref="exportProgress"
      :module-name="moduleName"
      :visible="dialogBool.exportProgressShow"
      :progressStatus="progressStatus"
      :progressPercentage="progressPercentage"
      :action="entityDlgActn"
    />
    <!-- 查看用户菜单角色 -->
    <ViewMenuRoleAuthority
      :module-name="moduleName"
      :visible="dialogBool.viewUserMenuRoleShow"
      :win-close="winClose"
    />
  </div>
</template>

<script>
import axios from "axios";
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
// 导入用户弹窗
import importDialogNew from "@/components/basicDialog/components/importDialogNew";
// 查看数据权限弹窗
import viewDataAuthority from "./components/viewDataAuthority";
// 查看viewUserGroup弹窗
import viewUserGroup from "./components/viewUserGroup";
// 查看菜单权限
import viewMenuAuthority from "./components/viewMenuAuthority";
// 自定义字段弹窗
import ExtDialog from "./components/extDialog";
//重置密码弹窗
import resetUserDialog from "./components/resetUserDialog";
//导出用户弹窗
import ExportDialog from "./components/exportDialog.vue";
//导出用户进度条组件
import ExportProgress from "@/components/exportProgress";
// 查看用户菜单角色
import ViewMenuRoleAuthority from "./components/viewMenuRoleAuthority.vue";

const VUE_APP_API_PREFIX = process.env.VUE_APP_API_PREFIX;

export default {
  name: "users",
  mixins: [PageList],
  components: {
    ExactSearch,
    ExactList,
    AddUserDialog,
    configUserMenuDialog,
    configUserDataDialog,
    configAdminDialog,
    importDialogNew,
    ExtDialog,
    viewMenuAuthority,
    viewDataAuthority,
    resetUserDialog,
    viewUserGroup,
    ExportDialog,
    ExportProgress,
    ViewMenuRoleAuthority,
  },
  data() {
    return {
      //查询参数
      searchParams: "",
      VUE_APP_API_PREFIX: VUE_APP_API_PREFIX,
      // store唯一标识
      storeKey: "users",
      // 新增 编辑用户 0新增 1编辑
      userFlag: "0",
      // 模块名称
      moduleName: "",
      //弹框显示内容
      content: "",
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
        viewUserGroup: false,
        // 自定义字段 弹窗显示状态
        extWinShow: false,
        // 重置密码，弹窗显示状态
        resetUserWinShow: false,
        //导出用户 弹窗显示状态
        exportUserShow: false,
        //导出用户进度条 弹窗显示状态
        exportProgressShow: false,
        // 查看用户菜单角色
        viewUserMenuRoleShow: false,
      },
      adminDialogHasData: false,
      immediateQuery: false, // 改为异步
      // 上传参数对象
      uploadData: {},
      /**
       * permission
              v-if="buttonData('BTCRU').has"
              :command="[5, '批量创建用户']"
            >
            **/
      upLoadArray: [
        {
          uploadUrl: "/userImportNew/importUser.do",
          templateType: "user",
          name: "userFile",
          permission: "dryh",
        }, // 导入用户
        {
          uploadUrl: "/userImportNew/importUserRoleV2.do",
          templateType: "userRole",
          name: "userRoleFile",
          permission: "YHCDJS",
        }, // 导入用户菜单角色
        {
          uploadUrl: "/userImportNew/importUserDataRoleV2.do",
          templateType: "userDataRole",
          name: "userDataRoleFile",
          permission: "YHSJJS",
        }, // 导入用户数据角色
        {
          uploadUrl: "/user/import/importUserDataAuthorityV2",
          templateType: "userDataAuthority",
          name: "userDataAuthorityFile",
          permission: "YHSJQX",
        }, // 导入用户数据权限
        {
          uploadUrl: "/userGroup/importUserGroupV2.do",
          templateType: "userGroup",
          name: "userGroupFile",
          permission: "YHYHZ",
        }, // 导入用户用户组
        {
          uploadUrl: "/iDaaSAccountImport/doImport",
          templateType: "batchCreateIDaaSAccount",
          name: "importFile",
          permission: "BTCRU",
        }, // 批量创建用户
      ],
      //进度条状态
      progressStatus: null,
      //进度条百分比
      progressPercentage: 0,
    };
  },
  computed: {
    ...mapState("app", ["tenementInfoObj", "tenementCode"]),
  },
  beforeCreate() {
    this.allFields = ["id"];
    this.disFields = [];
  },
  created() {
    this.registStore(store);
    this.dispatch("queryExtList");
  },
  activated() {
    this.queryList();
    this.dispatch("queryTreeOrgList");
  },
  mounted() {
    this.queryExtendList();
  },
  methods: {
    //exact-search查询参数
    queryParams(data) {
      this.searchParams = JSON.parse(JSON.stringify(data));
    },
    // 添加 编辑用户
    handleAddUser(_flag, item) {
      if (!item.id && _flag === "1") {
        this.$message.error("请选择用户！");
        return;
      }
      this.userFlag = _flag;
      // 如果是编辑
      if (_flag === "1") {
        // 如果用户已经停用
        if (item.userStatus === 0) {
          this.$message.error("当前该用户已停用，必须启用后才能进行相关操作");
          return;
        }
      }
      this.showDialog(`${["添加", "编辑"][_flag]}用户`, "addUserWinShow");
      // 如果是新增就清空状态 清空状态
      _flag == "0" && this.updateState("entity");
      // 传值到弹窗
      if (_flag == "1") {
        this.updateState({ entity: item, setId: item.id });
        this.dispatch("findUserById").then((_ev) => {
          var _data = _ev;
          let orgCodeList = this.state.list
            .find((f) => f.id == _data.id)
            .parentFullName.replace(/ > /g, " / ");
          this.$refs.addUserDialog.placeholder =
            this.$refs.addUserDialog.queryChannelNum == 1 ? orgCodeList : "";
          this.$refs.addUserDialog.dto.orgCode = _data.orgCode;
          this.$refs.addUserDialog.dto.orgCodeList = _data.orgCodeList;
          this.updateState({ entity: _data });
        });
      }
    },
    // 停用 启用
    async handleStopLine(_ev, item) {
      if (item instanceof Array) {
        // 批量操作
        const itemList = item;
        if (itemList.length > 0) {
          const hashMap = {
            1: {
              content: "启用后，所选用户将恢复所有权限，确认启用吗？",
              title: "确认启用",
            },
            0: {
              content: "停用后，所选用户将失去所有权限，确认停用吗？",
              title: "确认停用",
            },
          };
          const content = hashMap[_ev].content;
          const title = hashMap[_ev].title;
          const options = {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            closeOnClickModal: false,
            cancelButtonClass: "el-button--mini",
            confirmButtonClass: "el-button--mini",
          };
          const operationType = _ev;
          const data = itemList.map((item) => {
            const { id } = item;
            return { id };
          });
          const params = { operationType };
          this.$confirm(content, title, options)
            .then(() => api.users.batchEnableOrDisableUser(data, params))
            .then(({ code, msg }) => {
              if (code === 200) {
                this.$message.success(msg);
                this.$refs.exactSearch.handleSearch();
              } else {
                this.$message.error(msg);
              }
            });
        } else {
          this.$message.error("请选择用户！");
        }
      } else {
        // 单选操作
        if (!item.id) {
          this.$message.error("请选择用户！");
          return;
        }
        var glovalFlag = false;
        await this.dispatch("queryGlobalSwitchAboutUserCfg").then((env) => {
          glovalFlag = env;
        });
        this.$confirm(
          `${
            glovalFlag
              ? [
                  "停用后，该用户将失去所有权限，无法再登录任何系统",
                  "启用后，该用户将恢复所有权限，并能正常登录使用系统",
                ][_ev]
              : [
                  "停用后，该用户将失去所有权限，无法正常使用系统",
                  "启用后，该用户将恢复所有权限",
                ][_ev]
          }`,
          `${["确认停用该用户？", "确认启用该用户？"][_ev]}`
        )
          .then((event) => {
            // 更新状态对象
            this.updateState({ setId: item.id });
            // 请求接口 enableUser：启用  disableUser: 停用
            _ev === "1"
              ? this.dispatch("enableUser").then((ev) => {
                  this.dispatch("queryList");
                })
              : this.dispatch("disableUser").then((ev) => {
                  this.dispatch("queryList");
                });
          })
          .catch((ev) => {
            console.log("catch:", ev);
          });
      }
    },
    // 查看菜单权限
    viewMenuAuthority(item) {
      if (!item.id) {
        this.$message.error("请选择用户！");
        return false;
      }
      this.updateState({ userId: item.id });
      this.showDialog("查看菜单权限", "viewMenuAuthority");
    },
    // 查看所属用户组
    viewUserGroup(item) {
      if (!item.id) {
        this.$message.error("请选择用户！");
        return false;
      }
      this.updateState({ userId: item.id });
      this.updateState({ userCode: item.userCode });
      this.showDialog("查看所属用户组", "viewUserGroup");
      this.dispatch("queryUserGroup");
    },
    // 查看数据权限
    viewDataAuthority(item) {
      if (!item.id) {
        this.$message.error("请选择用户！");
        return false;
      }
      this.updateState({ userId: item.id });
      this.showDialog("查看数据权限", "viewDataAuthority");
      this.dispatch("DataTypeList2");
    },
    // 0 设置菜单角色 1 设置数据角色 弹起
    handleConfigUser(ev, item) {
      if (!item.id) {
        this.$message.error("请选择用户！");
        return;
      }
      this.updateState({ userId: item.id });
      if (ev === "0") {
        // 分配菜单角色
        this.showDialog(
          `分配${["菜单", "数据"][ev]}角色`,
          "configUserMenuWinShow"
        );
        // 查询 分配菜单角色列表
        // 触发该组件内事件设置默认值
        this.$refs.UserMenuRef.setAppCode();
      } else if (ev === "1") {
        this.showDialog(
          `分配${["菜单", "数据"][ev]}角色`,
          "configUserDataWinShow"
        );
        // 查询 分配数据角色列表
        this.dispatch("queryDataRoleByUser");
      }
    },
    // 分配数据权限 弹起
    handleConfigAdmin(item) {
      if (!item.id) {
        this.$message.error("请选择用户！");
        return;
      }
      this.updateState({ userId: item.id });
      this.showDialog(`分配数据资源`, "configAdminWinShow");
      // 查询 设置菜单角色列表
      this.dispatch("DataTypeList");
    },
    // 设置菜单角色 弹窗确定按钮
    handleSaveConfigUserMenu(ev) {
      this.dispatch("updateUserRole").then((ev) => {
        ev && this.dispatch("listForUser");
      });
    },
    // 设置数据角色 弹窗确定按钮
    handleSaveConfigUserData(ev) {
      this.dispatch("assignDataRoles").then((ev) => {
        ev && this.dispatch("queryDataRoleByUser");
      });
    },
    //设置数据权限 弹窗确定按钮
    handleSaveConfigAdmin(ev) {
      this.adminDialogHasData
        ? this.dispatch("DataAssign")
            .then((ev) => {
              ev && this.dispatch("DataAssignList");
              return ev;
            })
            .then((res) => res !== "assign")
        : this.$message.error("暂无数据");
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
    // 导出
    exportUserData(rows) {
      if (!this.showExportButton) {
        return this.$message({
          type: "error",
          message:
            "为确保大促期间系统正常运行，在封版期内USF所有【导入】【导出】功能将暂时屏蔽，封版结束后恢复正常使用，封版期间如有紧急导数需求联系USF小妹（org.missusf）",
          showClose: true,
        });
      }
      const ids = rows.map((row) => row.id);
      this.showDialog("正在导出", "exportUserShow");
      this.content = "请稍后。。。";
      axios({
        url: "user/export/exportUser.do",
        params: {
          tenementCode: this.tenementCode,
          userIds: ids.join(","),
        },
        responseType: "stream",
        method: "get",
        onDownloadProgress: (processEvenet) => {
          console.log("####### processEvenet", processEvenet);
        },
      })
      .then((res) => {
        this.showDialog("导出详情", "exportUserShow");
        this.content = "导出结果将于24小时内通过咚咚/邮件下发，请注意查收。";
      })
      .catch((error) => {
        this.showDialog("导出失败", "exportUserShow");
        this.content =
          "导出失败！请重新导出，若仍无结果，请联系USF小妹（org.missusf)";
      });
    },
    //下载文件
    async downloadFile() {
      this.progressStatus = null;
      this.progressPercentage = 0;
      const _origin = window.location.origin;
      let a = document.createElement("a");
      let searchParams = this.searchParams;
      let searchParamsUrl = "";
      //下载导出用户文件拼接查询参数到接口参数url
      Object.keys(searchParams).map((key) => {
        searchParamsUrl += key + "=" + searchParams[key] + "&";
      });
      searchParamsUrl = searchParamsUrl.substring(
        0,
        searchParamsUrl.length - 1
      );
      const preParams = {
        asyncExport: false,
      };
      const params = preParams;
      // const params = Object.assign(preParams, this.searchParams);
      api.users
        .exportUser(params)
        .then((res) => {
          const url = URL.createObjectURL(
            new Blob(["\ufeff" + res], { type: "text/csv;charset=utf-8;" })
          );
          a.href = url;
          a.download = `用户信息${this.tenementCode}`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          this.progressPercentage = 100;
          this.progressStatus = "success";
          this.$message.success("操作成功");
          this.dialogBool.exportProgressShow = false;
        })
        .catch((error) => {
          this.progressStatus = "exception";
          this.dialogBool.exportProgressShow = false;
          this.showDialog("导出失败", "exportUserShow");
          this.content =
            "导出失败！请重新导出，若仍无结果，请联系USF小妹（org.missusf)";
        });
    },
    // 重置用户密码
    handleResetUser(item) {
      if (!item.id) {
        this.$message.error("请选择用户！");
        return;
      }
      //弹出重置框(里面包含选项：重置密码，重置手机号，重置邮箱)
      this.showDialog(`重置`, "resetUserWinShow");
      //传值到弹窗
      this.updateState({ userId: item.id });
    },
    // 设置重置密码 弹窗确定按钮
    handleSaveResetUser({ params }) {
      this.updateState({ entity: params });
      this.dispatch("resetUserInfoPTE").then((res) => this.winClose());
    },
    winClose(ev) {
      this.hideDialog();
      // // 清空状态
      // this.updateState('entity')
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
    // 导入用户数据 弹出
    importUser([index, title]) {
      this.showDialog(title, "importUserWinShow");
      const config = this.upLoadArray[index];
      this.uploadData = {
        ...config,
        enabled:
          this.buttonData(config.permission).has && this.showExportButton,
      };
    },
    // 更多查看权限
    moreViewData(ev) {
      if (ev[0] == 0) {
        this.viewDataAuthority(ev[2]);
      } else if (ev[0] == 1) {
        this.viewMenuAuthority(ev[2]);
      } else if (ev[0] == 2) {
        this.handleDeleteUser(ev[2]);
      } else if (ev[0] == 3) {
        this.handleStopLine("0", ev[2]);
      } else if (ev[0] == 4) {
        this.handleStopLine("1", ev[2]);
      } else if (ev[0] == 6) {
        this.viewUserGroup(ev[2]);
      } else if (ev[0] == 7) {
        this.viewUserMenuRole(ev[2]);
      }
    },
    //导入用户数据 弹窗确定按钮
    handleSaveImportUser(ev) {
      console.log("===handleSaveImportUser:", ev);
    },
    // 删除
    handleDeleteUser(user) {
      if (user instanceof Array) {
        // 批量操作
        const userList = user;
        if (userList.length > 0) {
          const content = `您确认要删除所选用户吗?`;
          const title = "确认删除";
          const options = {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            closeOnClickModal: false,
            cancelButtonClass: "el-button--mini",
            confirmButtonClass: "el-button--mini",
          };
          const data = userList.map((item) => {
            const { id } = item;
            return { id };
          });
          this.$confirm(content, title, options)
            .then(() => api.users.batchDeleteUser(data))
            .then(({ code, msg }) => {
              if (code === 200) {
                this.$message.success(msg);
                this.$refs.exactSearch.handleSearch();
              } else {
                this.$message.error(msg);
              }
            });
        } else {
          this.$message.error("请选择用户！");
        }
      } else {
        // 单选操作
        const { userName, id } = user;
        if (!id) {
          this.$message.error("请选择用户！");
          return;
        }
        const content = `您确认要删除 ${userName} 吗?`;
        const title = "确认删除";
        const options = {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          closeOnClickModal: false,
          cancelButtonClass: "el-button--mini",
          confirmButtonClass: "el-button--mini",
        };
        const params = { id };
        this.$confirm(content, title, options)
          .then(() => api.users.deleteUser(params))
          .then(({ code, msg }) => {
            if (code === 200) {
              this.$message.success(msg);
              this.$refs.exactSearch.handleSearch();
            } else {
              this.$message.error(msg);
            }
          });
      }
    },
    // 账号解冻
    handleUnfreezeAccount(item) {
      const { userName, id } = item;
      if (!id) {
        this.$message.error("请选择用户！");
        return;
      }
      const content = `您确认要解冻账号 ${userName} 吗?`;
      const title = "确认账号解冻";
      const options = {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        cancelButtonClass: "el-button--mini",
        confirmButtonClass: "el-button--mini",
      };
      const params = { id, userName };
      this.$confirm(content, title, options)
        .then(() => api.users.unlockUser(params))
        .then(({ code, data, msg }) => {
          if (code === 200) {
            this.$message.success(msg);
          } else {
            this.$message.error(msg);
          }
        });
    },
    // 列表扩展字段
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

    // 导出事件回调
    handleExport([value, alias, data] = []) {
      switch (value) {
        case 1:
          // 导出用户
          if (this.exportProxyValid(data)) {
            this.exportUserData(data);
          }
          break;
        case 2:
          // 导出用户菜单资源
          if (this.exportProxyValid(data)) {
            this.exportUserMenuResource(data);
          }
          break;
        case 3:
          // 导出用户数据资源
          if (this.exportProxyValid(data)) {
            this.exportUserDataResource(data);
          }
          break;
        case 4:
          // 导出用户菜单角色
          if (this.exportProxyValid(data)) {
            this.exportUserMenuRole(data);
          }
          break;
        case 5:
          // 导出用户数据角色
          if (this.exportProxyValid(data)) {
            this.exportUserDataRole(data);
          }
          break;
        default:
          break;
      }
    },
    exportProxyValid(rows = [], ignore = false) {
      if (!this.showExportButton) {
        this.$message({
          type: "error",
          message:
            "为确保大促期间系统正常运行，在封版期内USF所有【导入】【导出】功能将暂时屏蔽，封版结束后恢复正常使用，封版期间如有紧急导数需求联系USF小妹（org.missusf）",
          showClose: true,
        });
        return false;
      }
      if (rows.length > 500) {
        this.$message.error("超出系统支持范围，请联系系统负责人解决");
        return false;
      }
      if(ignore) {
        return true
      }
      if (!rows || rows.length === 0) {
        this.$message.error("请选择要导出的用户");
        return false;
      }
      return true;
    },
    // 导出用户菜单资源
    exportUserMenuResource(rows) {
      if (this.exportProxyValid(rows)) {
        const ids = rows.map((row) => row.id);
        this.showDialog("正在导出", "exportUserShow");
        this.content = "请稍后。。。";
        axios({
          url: "/user/export/exportUserMenuResources.do",
          params: {
            tenementCode: this.tenementCode,
            userIds: ids.join(","),
          },
          responseType: "stream",
          method: "get",
          onDownloadProgress: (processEvenet) => {
            console.log("####### processEvenet", processEvenet);
          },
        })
          .then((res) => {
            this.showDialog("导出详情", "exportUserShow");
            this.content =
              "导出结果将于24小时内通过咚咚/邮件下发，请注意查收。";
          })
          .catch((error) => {
            this.showDialog("导出失败", "exportUserShow");
            this.content =
              "导出失败！请重新导出，若仍无结果，请联系USF小妹（org.missusf)";
          });
      }
    },
    // 导出用户数据资源
    exportUserDataResource(rows) {
      if (this.exportProxyValid(rows)) {
        const ids = rows.map((row) => row.id);
        this.showDialog("正在导出", "exportUserShow");
        this.content = "请稍后。。。";
        axios({
          url: "/user/export/exportUserDataResources.do",
          params: {
            tenementCode: this.tenementCode,
            userIds: ids.join(","),
          },
          responseType: "stream",
          method: "get",
          onDownloadProgress: (processEvenet) => {
            console.log("####### processEvenet", processEvenet);
          },
        })
          .then((res) => {
            this.showDialog("导出详情", "exportUserShow");
            this.content =
              "导出结果将于24小时内通过咚咚/邮件下发，请注意查收。";
          })
          .catch((error) => {
            this.showDialog("导出失败", "exportUserShow");
            this.content =
              "导出失败！请重新导出，若仍无结果，请联系USF小妹（org.missusf)";
          });
      }
    },
    exportUserMenuRole(rows) {
      const ids = rows.map((row) => row.id);
      this.showDialog("正在导出", "exportUserShow");
      this.content = "请稍后。。。";
      axios({
        url: "/user/export/exportUserMenuRoles.do",
        params: {
          tenementCode: this.tenementCode,
          userIds: ids.join(","),
        },
        responseType: "stream",
        method: "get",
        onDownloadProgress: (processEvenet) => {
          console.log("####### processEvenet", processEvenet);
        },
      })
        .then((res) => {
          this.showDialog("导出详情", "exportUserShow");
          this.content = "导出结果将于24小时内通过咚咚/邮件下发，请注意查收。";
        })
        .catch((error) => {
          this.showDialog("导出失败", "exportUserShow");
          this.content =
            "导出失败！请重新导出，若仍无结果，请联系USF小妹（org.missusf)";
        });
    },
    // 导出用户数据角色
    exportUserDataRole(rows) {
      const ids = rows.map((row) => row.id);
      this.showDialog("正在导出", "exportUserShow");
      this.content = "请稍后。。。";
      axios({
        url: "/dataRole/export/exportUserWithAssignDataRole.do",
        params: {
          tenementCode: this.tenementCode,
          userIds: ids.join(","),
        },
        responseType: "stream",
        method: "get",
        onDownloadProgress: (processEvenet) => {
          console.log("####### processEvenet", processEvenet);
        },
      })
        .then((res) => {
          this.showDialog("导出详情", "exportUserShow");
          this.content = "导出结果将于24小时内通过咚咚/邮件下发，请注意查收。";
        })
        .catch((error) => {
          this.showDialog("导出失败", "exportUserShow");
          this.content =
            "导出失败！请重新导出，若仍无结果，请联系USF小妹（org.missusf)";
        });
    },
    // 查看用户菜单角色
    viewUserMenuRole(item) {
      if (!item.id) {
        this.$message.error("请选择用户！");
        return false;
      }
      this.updateState({ userId: item.id });
      this.updateState({ userCode: item.userCode });
      this.showDialog("查看用户菜单角色", "viewUserMenuRoleShow");
    }
  },
};
</script>

<style lang="scss">
.data-resource-message {
  .el-message__closeBtn.el-icon-close {
    top: 16px;
  }
}
</style>
