<template>
  <div class="p-basic">
    <exact-search
      ref="exactSearch"
      :immediate="immediateQuery"
      :update-state="updateState"
      :query-list="queryList"
      :search-height-change="calcHeight"
      :softSelect="softSelect"
      :state="state"
    />
    <exact-list
      ref="exactList"
      :state="state"
      :table-h="tableH1"
      :handle-add="handleAdd"
      :import-role="importRole"
      :import-role-resource="importRoleResource"
      :proxyActions="proxyActions"
      :exportMenuRole="exportMenuRole"
      @UPDATE_LIST="updateList"
    />

    <!-- 添加/编辑菜单角色 -->
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
      :showSensitive="showSensitive"
      :showFlowID="showFlowID"
      :changeIds="changeids"
      :update-vis="updateEntityDlgVis"
      :handle-save="handleSave"
    />

    <entity-dialog-distribute
      :visible="entityDlgVis2"
      :state="state"
      :action="entityDlgActn"
      :roleListId="roleListId"
      :roleCode="roleCode"
      :entity="state.entity"
      :update-vis="updateEntityDlgVis2"
      :handle-save="handleSave"
    />
    <copyUser-dialog
      :visible="entityDlgVis3"
      :update-vis="updateEntityDlgVis3"
      :row="userRow"
    />
    <!--批量导入-->
    <import-dialog-new
      module-name=""
      :visible="dialogBool.val"
      :action="importDialogTitle"
      :uploadData="uploadData"
      :entity="state.entity"
      :state="state"
      :win-close="() => (dialogBool.val = false)"
      :handle-save="() => {}"
    />
    <ext-dialog
      ref="extDialog"
      :module-name="moduleName"
      :visible="dialogBool.extRoleWinShow"
      :action="entityDlgActn"
      :entity="state.entity"
      :state="state"
      :update-vis="updateEntityDlgVis"
      :win-close="winClose"
      :dispatch="dispatch"
      @SETLISTEXTENDFIELDS="setListExtendFields"
    />

    <!-- 导出相关弹框 -->
    <ExportProgress
      ref="exportProgress"
      module-name="导出菜单资源关联用户"
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
import Vue from "vue";
import VXETable from "vxe-table";
import "vxe-table/lib/style.css";
import "xe-utils";
Vue.use(VXETable);
import PageList from "@/mixins/pageList";
import axios from "axios";
import store from "./store";
import ExactSearch from "./components/exactSearch";
import ExactList from "./components/exactList";
import EntityDialog from "./components/entityDialog";
import EntityDialogDistribute from "./components/entityDialogDis";
import CopyUserDialog from "./components/copyUserDialog";
// 自定义字段弹窗
import ExtDialog from "./components/extDialog";
import importDialogNew from "@/components/basicDialog/components/importDialogNew";
import { mapState } from "vuex";
import { handleSetExtendFields } from "./store/index";
import ExportProgressMixin from "@/mixins/exportProgressAsync";
const VUE_APP_API_PREFIX = process.env.VUE_APP_API_PREFIX;
export default {
  name: "rolePermissions",
  mixins: [PageList, ExportProgressMixin],
  components: {
    ExactSearch,
    ExactList,
    EntityDialog,
    EntityDialogDistribute,
    CopyUserDialog,
    importDialogNew,
    ExtDialog,
  },
  data() {
    return {
      VUE_APP_API_PREFIX: VUE_APP_API_PREFIX,
      // store唯一标识
      storeKey: "rolePermissions",
      // 模块名称
      moduleName: "自定义模块",
      // 实体弹窗是否可见
      entityDlgVis2: false,
      //点中的当前列表id
      roleListId: 0,
      //关联删除数量
      count: 0,
      //详情
      obj: {},
      //所有的父节点
      pIds: [],
      //roleCode  点击的角色的那一行的code编码
      roleCode: undefined,
      //软件系统下拉
      softSelect: [],
      // 是否立即查询
      immediateQuery: false,
      appCode: undefined,
      entityDlgVis3: false,
      userRow: null,
      dialogBool: {
        val: false,
        // 自定义字段 弹窗显示状态
        extRoleWinShow: false,
      },
      uploadData: {},
      showSensitive: false,
      showFlowID: false,
      importDialogTitle: "导入",
    };
  },
  created() {
    this.registStore(store);
    /*
      在主组件中 上来发送请求 ，
      来获取当前登陆用户的 菜单权限
    */
    this.dispatch("queryRoleExtList");
  },
  updated() {},
  computed: {
    ...mapState("rolePermissions", ["query"]),
    ...mapState("app", ["tenementInfoObj"]),
  },
  watch: {
    "state.query": {
      deep: true,
      immediate: false,
      handler: function (newVal) {
        if (newVal.appCode) {
          this.appCode = newVal.appCode;
          sessionStorage.setItem("appCode", newVal.appCode);
          const params = {
            data: {
              tenementCode: this.tenementInfoObj.tenementCode,
              appCode: newVal.appCode,
            },
          };
          api.rolePermissions
            .queryRoleExtList(params)
            .then(({ code, data, message }) => {
              if (code === 200) {
                this.setListExtendFields(data || []);
              }
            });
          api.rolePermissions
            .findUserResource({
              page: { pageIndex: 1, pageSize: 10000 },
              data: {
                tenementCode: this.tenementInfoObj.tenementCode,
                appCode: newVal.appCode,
              },
            })
            .then(({ code, data, message }) => {
              if (code == 200) {
                // this.state.listTree = tools.dataToTree(data);
                this.state.listTree = data;
                //获取所有父节点
                let newArr = [];
                function toArr(arr) {
                  arr.forEach((item, index) => {
                    if (item.children && item.children.length > 0) {
                      newArr.push(item.id);
                      toArr(item.children);
                    }
                  });
                }
                toArr(this.state.listTree);
                this.pIds = newArr;
              }
            });
        }
      },
    },
  },
  methods: {
    // 导入
    importRole(buttonName) {
      this.dialogBool.val = true;
      this.uploadData = {
        uploadUrl: "/role/import/importRoleV2.do",
        templateType: "role",
        name: "roleFile",
        enabled: this.buttonData("CDJSDR").has && this.showExportButton,
      };
      this.importDialogTitle = buttonName;
    },
    // 导入
    importRoleResource(buttonName) {
      this.dialogBool.val = true;
      this.uploadData = {
        uploadUrl: "/role/import/importRoleResource.do",
        templateType: "roleResource",
        name: "roleResourceFile",
        enabled: this.buttonData("DRCDJSZY").has && this.showExportButton,
      };
      this.importDialogTitle = buttonName;
    },
    // 获取菜单
    handelMeun() {
      api.rolePermissions
        .findUserResource({
          page: { pageIndex: 1, pageSize: 10000 },
          data: {
            tenementCode: this.tenementInfoObj.tenementCode,
            appCode: this.appCode,
          },
        })
        .then(({ code, data, message }) => {
          if (code == 200) {
            // this.state.listTree = tools.dataToTree(data);
            this.state.listTree = data;
            //获取所有父节点
            let newArr = [];
            function toArr(arr) {
              arr.forEach((item, index) => {
                if (item.children && item.children.length > 0) {
                  newArr.push(item.id);
                  toArr(item.children);
                }
              });
            }
            toArr(this.state.listTree);
            this.pIds = newArr;
          }
        });
      this.queryExtendList();
    },
    // 取消或退出按钮
    winClose(ev) {
      this.dialogBool["extRoleWinShow"] = false;
    },
    // 显示指定弹层公共方法
    showDialog(name, value) {
      this.dialogBool[value] = true;
      this.entityDlgActn = name;
    },
    // 列表扩展字段
    async queryExtendList() {
      const params = {
        data: {
          tenementCode: this.tenementInfoObj.tenementCode,
          appCode: sessionStorage.getItem("appCode"),
        },
      };
      const { code, msg, data } = await api.rolePermissions.queryRoleExtList(
        params
      );
      if (code === 200) {
        if (!data || data.length === 0) {
          this.state.diaExtLists = [];
          return;
        }
        const extList = data
          ? data.filter((item) => item.isEffective === 1)
          : [];
        this.state.diaExtLists = handleSetExtendFields(extList);
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
            return <span>{enumValue ? enumValue.label : ""}</span>;
          };
        }
        return col;
      });
      uListFields.splice(6, 0, ...extendFields);
      this.$refs.exactList.fields = uListFields;
      // this.$refs.exactSearch.handleSearch()
    },
    // 更新实体弹框可见状态
    updateEntityDlgVis2(vis) {
      this.entityDlgVis2 = vis;
    },
    //代理函数
    proxyActions({ action, rows, cb, erCb }) {
      /*
    action 为函数名, rows 选中的行, cb处理回调
    @ onAdd 添加菜单角色
    @ distribute 分配菜单角色
    @ edit 编辑
    @ view 删除
    @ delet 删除
    */
      const callee = this[action];
      if (callee) {
        return callee({ rows, cb, erCb });
      } else {
        return console.log("未知action:" + action);
      }
    },
    copyUser({ rows, cb, erCb }) {
      this.userRow = rows;
      this.entityDlgVis3 = true;
    },
    updateEntityDlgVis3(vis) {
      this.entityDlgVis3 = vis;
    },
    distribute({ rows, cb, erCb }) {
      if (rows.length === 0) {
        return this.$message.error("请至少选择一项进行分配");
      } else if (rows.length > 1) {
        return this.$message.error("只能选择一项进行分配");
      }
      this.roleListId = rows[0].id;
      this.roleCode = rows[0].roleCode;
      this.entityDlgVis2 = true;
    },
    //新建
    onAdd({ rows, cb, erCb }) {
      //查询该应用是否开启安全合规，即是否展示敏感下拉列表
      api.rolePermissions
        .showSensitiveRoleSelect({
          data: {
            tenementCode: this.tenementInfoObj.tenementCode,
            appCode: sessionStorage.getItem("appCode"),
          },
        })
        .then(({ success, msg, data }) => {
          this.showSensitive = success;
        });
      axios({
        method: "post",
        url: "/role/showFlowId",
        data: {
          data: {
            tenementCode: this.tenementInfoObj.tenementCode,
            appCode: sessionStorage.getItem("appCode"),
          },
        },
        params: {
          tenementCode: this.tenementInfoObj.tenementCode,
        },
      })
        .then((resolve) => {
          this.showFlowID = resolve.data.success;
          this.obj = {
            isApply: 0,
          };
        })
        .catch((reject) => {
          console.log("postBlurryQueryOrgData 请求失败", reject);
        });
      //roleAdd
      this.handelMeun();
      this.handleAdd();
      //发请求 获取当前登陆用户菜单权限
    },
    //删除
    delet({ rows, cb, erCb }) {
      if (rows.length === 0) {
        return this.$message.error("请至少选择一项进行删除");
      } else if (rows.length > 1) {
        return this.$message.error("只能选择一项进行删除");
      }
      this.handleDelete(
        { id: rows[0].id },
        `删除该角色后，原来已拥有的该角色的用户，可能会失去角色对应的权限`
      );
    },
    exportMenuRole(ev, extendsArgs = {}) {
      if (!this.showExportButton) {
        return this.$message({
          type: "error",
          message:
            "为确保大促期间系统正常运行，在封版期内USF所有【导入】【导出】功能将暂时屏蔽，封版结束后恢复正常使用，封版期间如有紧急导数需求联系USF小妹（org.missusf）",
          showClose: true,
        });
      }
      // 导出菜单角色
      let url = "/role/export/exportRoleWithPerm.do";
      if (ev[0] === 2) {
        // 导出菜单角色关联用户改为异步导出
        url = "/role/export/exportRoleWithUser.do";
      }
      return this.exportRequestFun({
        url,
        params: {
          tenementCode: this.tenementInfoObj.tenementCode,
          ...extendsArgs,
        },
        responseType: "stream",
        method: "get",
        onDownloadProgress: (processEvenet) => {
          console.log("####### processEvenet", processEvenet);
        },
      });
    },
    //展示详情
    view({ rows, cb, erCb }) {
      if (rows.length === 0) {
        return this.$message.error("请至少选择一项进行展示");
      } else if (rows.length > 1) {
        return this.$message.error("只能选择一项进行展示");
      }
      this.handelMeun();
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
            this.state.ids = data.role.resourceIds;
            this.obj = {
              roleCode: data.role.roleCode,
              roleName: data.role.roleName,
              flowId: data.role.flowId,
              remark: data.role.remark,
              businessFlowId: data.role.businessFlowId,
              ext1: data.role.ext1,
              ext2: data.role.ext2,
              ext3: data.role.ext3,
              ext4: data.role.ext4,
              ext5: data.role.ext5,
              ext6: data.role.ext6,
              ext7: data.role.ext7,
              ext8: data.role.ext8,
              ext9: data.role.ext9,
              ext10: data.role.ext10,
              sensitiveMark: data.role.sensitiveMark,
              isApply: data.role.isApply,
              illustration: data.role.illustration,
              flowCode: data.role.flowCode,
              flowVersion: data.role.flowVersion,
              lifespanType: data.role.lifespanType,
            };
          }
        });
      this.roleListId = rows[0].id;
    },
    //修改
    edit({ rows, cb, erCb }) {
      //修改的时候 获取当前选中的rows 的id
      if (rows.length === 0) {
        return this.$message.error("请至少选择一项进行编辑");
      } else if (rows.length > 1) {
        return this.$message.error("只能选择一项进行编辑");
      }
      api.rolePermissions
        .showSensitiveRoleSelect({
          data: {
            tenementCode: this.tenementInfoObj.tenementCode,
            appCode: sessionStorage.getItem("appCode"),
          },
        })
        .then(({ success, msg, data }) => {
          this.showSensitive = success;
        });
      axios({
        method: "post",
        url: "/role/showFlowId",
        data: {
          data: {
            tenementCode: this.tenementInfoObj.tenementCode,
            appCode: sessionStorage.getItem("appCode"),
          },
        },
        params: {
          tenementCode: this.tenementInfoObj.tenementCode,
        },
      })
        .then((resolve) => {
          this.showFlowID = resolve.data.success;
        })
        .catch((reject) => {
          console.log("postBlurryQueryOrgData 请求失败", reject);
        });
      this.handelMeun();
      api.rolePermissions
        .queryEntity({ data: { id: rows[0].id } })
        .then(({ code, data, message }) => {
          this.entityDlgVis = true;
          this.entityDlgActn = "edit";
          if (code == 200) {
            //  this.state.ids = data.role.resourceIds
            let changeArr = data.role.resourceIds ? data.role.resourceIds : [];
            let arr = Array.from(changeArr);
            var newArr = [];
            arr.forEach((item, index) => {
              newArr.push(item);
            });
            this.state.ids = data.role.resourceIds;
            this.obj = {
              roleCode: data.role.roleCode,
              roleName: data.role.roleName,
              flowId: data.role.flowId,
              remark: data.role.remark,
              ext1: data.role.ext1,
              ext2: data.role.ext2,
              ext3: data.role.ext3,
              ext4: data.role.ext4,
              ext5: data.role.ext5,
              ext6: data.role.ext6,
              ext7: data.role.ext7,
              ext8: data.role.ext8,
              ext9: data.role.ext9,
              ext10: data.role.ext10,
              sensitiveMark: data.role.sensitiveMark,
              isApply: data.role.isApply,
              illustration: data.role.illustration,
              businessFlowId: data.role.businessFlowId,
              flowCode: data.role.flowCode,
              flowVersion: data.role.flowVersion,
              lifespanType: data.role.lifespanType,
            };
          }
        });
      this.roleListId = rows[0].id;
    },
    //重写handleDelete
    // 删除按钮响应事件
    handleDelete(params, msg) {
      msg = msg || `确定删除选中的${this.moduleName}吗`;
      axios({
        method: "post",
        url: `/resource/checkPermRoleRelExists?tenementCode=${this.$store.state.app.tenementCode} `,
        data: {
          id: params.id,
        },
      })
        .then((resolve) => {
          if (
            resolve.data.data.userExists === false &&
            resolve.data.data.orgExists === false &&
            resolve.data.data.groupExists === false
          ) {
            this.deleteSure(params);
          } else if (
            resolve.data.data.userExists === true &&
            resolve.data.data.orgExists === false &&
            resolve.data.data.groupExists === false
          ) {
            this.$message({
              message: "该角色已经分配给用户使用，请先解除关联关系再删除",
              type: "error",
              center: true,
            });
          } else if (
            resolve.data.data.userExists === true &&
            resolve.data.data.orgExists === true &&
            resolve.data.data.groupExists === false
          ) {
            this.$message({
              message: "该角色已经分配给用户/机构使用，请先解除关联关系再删除",
              type: "error",
              center: true,
            });
          } else if (
            resolve.data.data.userExists === true &&
            resolve.data.data.orgExists === false &&
            resolve.data.data.groupExists === true
          ) {
            this.$message({
              message:
                "该角色已经分配给用户/用户组使用，请先解除关联关系再删除",
              type: "error",
              center: true,
            });
          } else if (
            resolve.data.data.userExists === true &&
            resolve.data.data.orgExists === true &&
            resolve.data.data.groupExists === true
          ) {
            this.$message({
              message:
                "该角色已经分配给用户/用户组/机构使用，请先解除关联关系再删除",
              type: "error",
              center: true,
            });
          } else if (
            resolve.data.data.userExists === false &&
            resolve.data.data.orgExists === true &&
            resolve.data.data.groupExists === false
          ) {
            this.$message({
              message: "该角色已经分配给机构使用，请先解除关联关系再删除",
              type: "error",
              center: true,
            });
          } else if (
            resolve.data.data.userExists === false &&
            resolve.data.data.orgExists === true &&
            resolve.data.data.groupExists === true
          ) {
            this.$message({
              message:
                "该角色已经分配给用户组/机构使用，请先解除关联关系再删除",
              type: "error",
              center: true,
            });
          } else if (
            resolve.data.data.userExists === false &&
            resolve.data.data.orgExists === false &&
            resolve.data.data.groupExists === true
          ) {
            this.$message({
              message: "该角色已经分配给用户组使用，请先解除关联关系再删除",
              type: "error",
              center: true,
            });
          }
        })
        .catch((reject) => {
          console.log("postBlurryQueryOrgData 请求失败", reject);
        });
    },
    deleteSure(params) {
      const done = () => {
        if (this.state.list.length <= 1) {
          this.updateState({ pageIndex: 0 });
        }
        this.queryList();
      };
      this.$confirm("确认删除选中的菜单角色吗", "操作提示")
        .then(() => {
          this.dispatch("deleteEntity", { params, done });
        })
        .catch(() => {});
    },
    changeids(data) {
      this.state.ids = data;
    },
    updateList() {
      this.$refs.exactSearch.handleSearch();
    },
  },
};
</script>
