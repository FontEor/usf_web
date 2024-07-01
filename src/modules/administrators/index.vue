<template>
  <div class="p-basic">
    <exact-search
      ref="exactSearch"
      :state="state"
      :immediate="immediateQuery"
      :update-state="updateState"
      :query-list="queryList"
      :search-height-change="calcHeight"
    />
    <exact-list
      :state="state"
      :table-h="tableH1"
      :handle-add="handleAdd"
      :proxyActions="proxyActions"
      :handleSelectionChange="handleSelectionChange"
      :import-user="importUser"
    />
    <entity-dialog
      :obj="obj"
      :visible="entityDlgVis"
      :query-list="queryList"
      :action="entityDlgActn"
      :entity="state.entity"
      :state="state"
      :list="state.listTree"
      :ids="state.ids"
      :roleListId="roleListId"
      :update-vis="updateEntityDlgVis"
      :handle-save="handleSave"
    />
    <about
      :visible="entityDlgVisLD"
      :action="entityDlgActn"
      :entity="state.entity"
      :update-vis="updateEntityDlgVisLD"
      :userId="userIdLd"
      :handle-save="handleSave"
    />
    <enm-dia
      :visible="entityDlgVisTree"
      :query-list="queryList"
      :action="entityDlgActn"
      :entity="state.entity"
      :state="state"
      :list="state.treeList2"
      :ids2="ids2"
      :roleListId="roleListId"
      :update-vis="updateEntityDlgVisTree"
      :handle-save="handleSave"
    />
    <entity-dialog-distribute
      :visible="entityDlgVis2"
      :state="state"
      :action="entityDlgActn"
      :entity="state.entity"
      :userId="userId"
      :update-vis="updateEntityDlgVis2"
      :handle-save="handleSave"
      :userCode="userCode"
    />
    <entity-dialog2
      :visible="entityDlgVis4"
      :state="state"
      :action="entityDlgActn"
      :entity="state.entity"
      :userId="userId3"
      :update-vis="updateEntityDlgVis4"
      :handle-save="handleSave"
      :userCode="userCode"
    />
    <Enti-dia-dis-data
      :visible="entityDlgVis3"
      :state="state"
      :userId="userId2"
      :action="entityDlgActn"
      :entity="state.entity"
      :update-vis="updateEntityDlgVis3"
      :handle-save="handleSave"
    />
    <entity-dialog-user-group-allot
      ref="userGroupDlg"
      :visible="userGroupAllotDlgVis"
      :update-vis="updateUserGroupAllotDlgVis"
      :user-info="userInfo"
    />
    <InstitutionManagementDialog
      v-if="orgDialogVisible"
      ref="InstitutionManagementDom"
      diaTitle="分配机构管理权限"
      :visible="orgDialogVisible"
      :getTableData="getOrgTableData"
      :getSearchData="getOrgSearchData"
      :loading="orgLoading"
      :updateVis="(visible) => (orgDialogVisible = visible)"
      @selectConfirm="coSelectConfirm"
      :haseConfirmPage="true"
      :saveLoading="saveLoading"
      fullNameFiled="fullPathName"
      :itemTenementCode="itemTenementCode"
    />

    <!--导入用户菜单角色管理权限-->
    <import-dialog-new
      :module-name="moduleName"
      :visible="dialogBool.importUserWinShow"
      :action="entityDlgActn"
      :uploadData="uploadData"
      :entity="state.entity"
      :state="state"
      :update-vis="updateEntityDlgVis"
      :win-close="winClose"
    />
  </div>
</template>

<script>
import PageList from "@/mixins/pageList";
import store from "./store";
import ExactSearch from "./components/exactSearch";
import ExactList from "./components/exactList";
import EntityDialog from "./components/entityDialog";
import EntityDialog2 from "./components/entityDialog2";
import EntityDialogDistribute from "./components/entityDialogDis";
import EntiDiaDisData from "./components/entityDialogDisDataRole";
import EnmDia from "./components/entityDialogDisMenu";
import About from "./components/extDiaAbout";
import EntityDialogUserGroupAllot from "./components/entityDialogUserGroupAllot";
import orgDialog from "./components/orgDialog.vue";
import InstitutionManagementDialog from "../apply2022/components/dialog/InstitutionManagementDialog.vue";
// 导入用户弹窗
import importDialogNew from "@/components/basicDialog/components/importDialogNew";
import axios from "axios";
import { get, intersection } from "lodash";
export default {
  name: "administrators",
  mixins: [PageList],
  components: {
    ExactSearch,
    ExactList,
    EntityDialog,
    EntityDialog2,
    EntityDialogDistribute,
    EntiDiaDisData,
    EnmDia,
    About,
    EntityDialogUserGroupAllot,
    orgDialog,
    InstitutionManagementDialog,
    importDialogNew,
  },
  data() {
    return {
      // store唯一标识
      storeKey: "administrators",
      // 模块名称
      moduleName: "",
      // 实体弹窗是否可见
      entityDlgVis2: false,
      // 实体弹窗是否可见
      entityDlgVis3: false,
      entityDlgVisTree: false,
      entityDlgVis4: false,
      //点中的当前列表id
      roleListId: 0,
      //关联删除数量
      count: 0,
      //详情
      obj: {},
      //所有的父节点
      pIds: [],
      //userId
      userId: 0,
      userId2: 0,
      userId3: 0,
      ids2: [],
      entityDlgVisLD: false,
      userIdLd: 0,
      userCode: undefined,
      firstIn: false,
      // 是否立即查询
      // immediateQuery: false,
      userGroupAllotDlgVis: false,
      // 当前选中的管理员
      userInfo: undefined,
      // 选择机构弹框
      orgDialogVisible: false,
      orgLoading: false, // 选择机构loading状态
      saveLoading: false,
      // 选择当前选择数据
      selRows: [],
      upLoadArray: [
        {
          uploadUrl: "/userAdminAuth/importUserAdminAuthRole.do",
          templateType: "userRole",
          name: "userRoleFile",
          permission: "YHCDJSGLQX",
        }, // 导入用户菜单角色
      ],
      // 上传参数对象
      uploadData: {},
      // 弹层显示隐藏状态集合
      dialogBool: {
        importUserWinShow: false,
      },
    };
  },
  computed: {
    itemTenementCode() {
      const user = get(this, "selRows[0]", {});
      return user.tenementCode;
    },
  },
  created() {
    this.registStore(store);
  },
  activated() {
    if (!this.firstIn) {
      this.firstIn = true;
    } else {
      this.queryList();
    }
  },
  methods: {
    updateEntityDlgVisLD(vis) {
      this.entityDlgVisLD = vis;
    },
    handleSearch() {
      const query = this.toEnd();
      this.updateState({ query, pageIndex: 0 });
      this.queryList();
    },
    // 更新实体弹框可见状态
    updateEntityDlgVis2(vis) {
      this.entityDlgVis2 = vis;
    },
    // 更新实体弹框可见状态
    updateEntityDlgVis3(vis) {
      this.entityDlgVis3 = vis;
    },
    // 更新实体弹框可见状态
    updateEntityDlgVis4(vis) {
      this.entityDlgVis4 = vis;
    },
    // 更新实体弹框可见状态
    updateEntityDlgVisTree(vis) {
      this.entityDlgVisTree = vis;
    },
    //代理函数
    /*
            action 为函数名, rows 选中的行, cb处理回调
            @ amenManPri 分配菜单角色管理权限
            @ EntiDiaDisData 分配数据角色管理权限
            @ edit 分配机构管理权限
            @ disMeun 分配菜单管理权限
            @ distribute 分配数据管理权限
        */
    proxyActions({ action, rows, cb, erCb }) {
      const callee = this[action];
      if (callee) {
        return callee({ rows, cb, erCb });
      } else {
        return console.log("未知action:" + action);
      }
    },
    // distribute 分配数据管理权限
    distribute({ rows, cb, erCb }) {
      if (rows.length === 0) {
        return this.$message.error("请至少选择一项进行分配");
      } else if (rows.length > 1) {
        return this.$message.error("只能选择一项进行分配");
      }
      this.entityDlgVisLD = true;
      this.userIdLd = rows[0].id;
    },
    //新建
    onAdd({ rows, cb, erCb }) {
      this.handleAdd();
    },
    // EntiDiaDisData 分配数据角色管理权限
    EntiDiaDisData({ rows, cb, erCb }) {
      if (rows.length === 0) {
        return this.$message.error("请至少选择一项进行删除");
      } else if (rows.length > 1) {
        return this.$message.error("只能选择一项进行删除");
      }
      this.userId2 = rows[0].id;
      this.entityDlgVis3 = true;
    },
    //展示详情
    view({ rows, cb, erCb }) {
      if (rows.length === 0) {
        return this.$message.error("请至少选择一项进行展示");
      } else if (rows.length > 1) {
        return this.$message.error("只能选择一项进行展示");
      }
      this.entityDlgVis = true;
      this.entityDlgActn = "view";
      this.updateState("entity");
      api.rolePermissions
        .queryEntity({ data: { id: rows[0].id } })
        .then(({ code, data, message }) => {
          this.entityDlgVis = true;
          this.entityDlgActn = "view";
          if (code == 200) {
            let changeArr = data.role.resourceIds ? data.role.resourceIds : [];
            let arr = Array.from(changeArr);
            var newArr = [];
            arr.forEach((item, index) => {
              newArr.push(item);
            });
            let relleyIds = _.difference(data.role.resourceIds, this.pIds);
            this.state.ids = relleyIds;
            this.obj = {
              roleCode: data.role.roleCode,
              roleName: data.role.roleName,
            };
          }
        });
      this.roleListId = rows[0].id;
    },
    //edit 分配机构管理权限
    edit({ rows, cb, erCb }) {
      if (rows.length === 0) {
        return this.$message.error("请至少选择一项进行编辑");
      } else if (rows.length > 1) {
        return this.$message.error("只能选择一项进行编辑");
      }
      this.orgDialogVisible = true;
      // 这句话代码不知道意义是啥 先留着吧
      this.roleListId = rows[0].id;
    },
    // EntiDiaDisData 分配数据角色管理权限
    edit2({ rows, cb, erCb }) {
      if (rows.length === 0) {
        return this.$message.error("请至少选择一项进行编辑");
      } else if (rows.length > 1) {
        return this.$message.error("只能选择一项进行编辑");
      }
      this.userId3 = rows[0].id;
      this.entityDlgVis4 = true;
    },
    // disMeun 分配菜单管理权限
    disMeun({ rows, cb, erCb }) {
      if (rows.length === 0) {
        return this.$message.error("请至少选择一项进行编辑");
      } else if (rows.length > 1) {
        return this.$message.error("只能选择一项进行编辑");
      }
      this.entityDlgVisTree = true;
      this.entityDlgActn = "disMeun";
      this.roleListId = rows[0].id;
    },
    // amenManPri 分配菜单角色管理权限
    amenManPri({ rows, cb, erCb }) {
      if (rows.length === 0) {
        return this.$message.error("请至少选择一项进行分配");
      } else if (rows.length > 1) {
        return this.$message.error("只能选择一项进行分配");
      }
      this.userId = rows[0].id;
      this.userCode = rows[0].userCode;
      this.entityDlgVis2 = true;
    },
    updateUserGroupAllotDlgVis(vis) {
      this.userGroupAllotDlgVis = vis;
    },
    // 分配用户组管理权限
    handleUserGroupAllot({ rows = [] }) {
      if (!rows.length) {
        this.$message.error("请选择管理员");
        return;
      }
      if (rows.length !== 1) {
        this.$message.error("每次只允许对一个管理员进行分配");
        return;
      }
      this.updateUserGroupAllotDlgVis(true);
      this.userInfo = rows[0];
    },
    // 选择数据变化
    handleSelectionChange(rows = []) {
      this.selRows = rows;
    },
    getOrgTableData(rowInfo) {
      this.orgLoading = true;
      return new Promise((resolve, reject) => {
        const user = get(this, "selRows[0]", {});
        axios({
          method: "post",
          url: "/org/queryOrgManagerList",
          data: {
            data: {
              tenementCode: this.itemTenementCode,
              parentId: (rowInfo && rowInfo.id) || null,
              userId: user.id,
            },
          },
          params: {
            tenementCode: this.itemTenementCode,
          },
        })
          .then((response) => {
            // 管理是否已分配，已分配的select状态为选中，disabled字段影响禁用状态
            this.orgLoading = false;
            const { data, code, msg } = response.data || {};
            if (+code === 200) {
              const { orgIds = [], orgList: list, totals = 0 } = data || {};
              totals > 1000 &&
                this.$message({
                  type: "warning",
                  message: "已超出界面展示范围，请使用查询功能进行定位",
                });
              list.forEach((dataItem) => {
                const parentIdList = (dataItem.parentIds || "")
                  .split(",")
                  .filter((item) => item)
                  .map((item) => +item);
                const isAdmin =
                  intersection([...parentIdList, dataItem.id], orgIds).length >
                  0;
                // 是否已分配会影响选中状态
                dataItem.isAdmin = isAdmin;
                dataItem.selected = isAdmin;
                dataItem.hasChild = true;
              });
              resolve({
                data: list,
                total: totals,
                orgIds,
              });
            } else {
              this.$message.error({ message: msg });
              reject();
            }
          })
          .catch((err) => {
            this.orgLoading = false;
            this.$message.error({ message: err });
            reject();
          });
      });
    },
    getOrgSearchData({ query, pageInfo }) {
      return new Promise((resolve, reject) => {
        this.orgLoading = true;
        const user = get(this, "selRows[0]", {});
        axios({
          method: "post",
          url: "/org/queryOrgListByCondition",
          data: {
            data: {
              tenementCode: this.itemTenementCode,
              orgCode: query.orgCode,
              orgName: query.orgName,
              userId: user.id,
            },
            page: {
              pageSize: pageInfo.pageSize,
              pageIndex: pageInfo.pageIndex,
            },
          },
          params: {
            tenementCode: this.itemTenementCode,
          },
        }).then((response) => {
          this.orgLoading = false;
          const { data, code, msg } = response.data || {};
          if (+code === 200) {
            const { orgIds, orgPageList } = data || {};
            const { pageIndex, pageSize, pageTotal, rowTotal, rows } =
              orgPageList || {};
            const pageInfo = {
              pageIndex,
              pageSize,
              pageTotal,
              rowTotal,
            };
            (rows || []).forEach((dataItem) => {
              const parentIdList = (dataItem.parentIds || "")
                .split(",")
                .filter((item) => item)
                .map((item) => +item);
              const isAdmin =
                intersection([...parentIdList, dataItem.id], orgIds).length > 0;
              dataItem.isAdmin = isAdmin;
              dataItem.selected = isAdmin;
              dataItem.hasChild = true;
            });
            resolve({ data: rows, pageInfo, orgIds });
          } else {
            this.$message.error(msg);
          }
        });
      });
    },
    coSelectConfirm({
      selectedAllList,
      orgSelectedAllList,
      selectList,
      addList,
      deleteList,
    }) {
      const user = get(this, "selRows[0]", {});
      const data = {
        userId: user.id,
        addAuthOrgIdList: addList.map((item) => item.id),
        delAuthOrgIdList: deleteList.map((item) => item.id),
      };
      api.administrators
        .assignOrgAdmin({
          data: data,
        })
        .then(({ code, data, msg }) => {
          this.saveLoading = false;
          if (code == 200) {
            this.orgDialogVisible = false;
            return this.$message.success(msg);
          } else {
            return this.$message.error(msg);
          }
        })
        .catch(() => {
          this.saveLoading = false;
        });
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
    winClose(ev) {
      this.hideDialog();
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
  },
};
</script>
