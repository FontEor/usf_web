<template>
  <div class="p-basic">
    <exact-search
      ref="exactSearch"
      :immediate="immediateQuery"
      :update-state="updateState"
      :query-list="queryList"
      :on-view-change="onViewChange"
      :search-height-change="calcHeight"/>
    <exact-list
      :state="state"
      :table-h="tableH1"
      :page-index-change="pageIndexChange"
      :page-size-change="pageSizeChange"
      :handle-add="handleAdd"
      :handle-uers="handleViewUsers"
      :handle-edit="handleEdit"
      :handle-delete="handleDelete"
      :handle-org="handleOrgChange"
      :handle-selection-change="handleSelectionChange"
      :check-single-row="checkSingleRow"
      :proxyActions="proxyActions"
      :load-childen="loadChilden"
      :org-types="ORGTYPES"/>

    <users-dialog
      :dlg-width="720"
      :state="state"
      :current-row="currentRow"
      :visible="commonDlgVis[ACTIONTYPES.VIEW]"
      :action="commonDlgActn"
      :action-names="ACTIONNAMES"
      :action-types="ACTIONTYPES"
      :update-vis="updateDlgVis"
      :update-state="updateState"
      :query-list-user="queryListUser"/>
    <change-parent-dialog
      :dlg-width="720"
      :state="state"
      :current-row="currentRow"
      :visible="commonDlgVis[ACTIONTYPES.LEVEL]"
      :action="commonDlgActn"
      :action-names="ACTIONNAMES"
      :action-types="ACTIONTYPES"
      :update-vis="updateDlgVis"
      :update-state="updateState"
      :handle-save="handleSave"/>

    <entity-dialogDis
      :visible="entityDlgVis2"
      :state="state"
      :action="entityDlgActn"
      :entity="state.entity"
      :update-vis="updateEntityDlgVis2"
      :handle-save="handleSave"
      :orggId="orggId"
      :orgCode="orgCode"/>

    <el-dialog
      class="heightSet"
      title="操作失败"
      :visible.sync="centerDialogVisible"
      width="50%"
      center>
      <span>仅能给机构设置超级管理员，不能给部门设置超级管理员，设置超级管理员后，该用户将拥有该机构下所有数据、角色、部门的管理权限。</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import store from "./store";
import PageList from "./components/mixins/pageList";
import ExactSearch from "./components/exactSearch";
import ExactList from "./components/exactList";
import UsersDialog from "./components/usersDialog";
import ChangeParentDialog from "./components/changeParentDialog";
import EntityDialogDis from "./components/entityDialogDis";
export default {
  name: "organizationsPermissions",
  mixins: [PageList],
  components: {
    ExactSearch,
    ExactList,
    UsersDialog,
    ChangeParentDialog,
    EntityDialogDis
  },
  data() {
    return {
      // store唯一标识
      storeKey: "organizationsPermissions",
      // 模块名称
      moduleName: "机构",
      // 实体弹窗是否可见
      entityDlgVis2: false,
      //弹窗类型 用于判断
      entityDlgActn: "add",
      //实体弹窗
      centerDialogVisible: false,
      //机构id
      orggId: 0,
      //机构编码
      orgCode: undefined,
      // 是否显示查询
      showQueryBtn: true,
      // 是否显示重置
      showResetBtn: true,
    };
  },
  created() {
    this.registStore(store);
  },
  methods: {
    // 更新实体弹框可见状态
    updateEntityDlgVis2(vis) {
      this.entityDlgVis2 = vis;
    },
    proxyActions({ action, rows, cb, erCb }) {
      /*
        action 为函数名, rows 选中的行, cb处理回调
        @ onAdd 添加菜单角色
      */
      const callee = this[action];
      if (callee) {
        return callee({ rows, cb, erCb });
      } else {
        return console.log("未知action:" + action);
      }
    },
    setAdd({ rows, cb, erCb }) {
      //上来先判断一下orgType 来判断是不是机构 1为机构  2非机构
      //如果不是机构弹出提示窗，反之则授权
      if (rows.length == 0) {
        return this.$message.error("请至少选择一项进行设置");
      }
      if (rows[0].orgType == 1) {
        //设置超级管理员权限的弹窗
        this.entityDlgVis2 = true;
        this.orggId = rows[0].id;
        this.orgCode = rows[0].orgCode;
      } else {
        //弹出错误提示
        this.centerDialogVisible = true;
      }
    }
  }
};
</script>

<style scoped>
.heightSet {
  height: 500px !important;
}
</style>
