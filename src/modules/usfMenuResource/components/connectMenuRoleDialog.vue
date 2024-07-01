<template>
  <basic-dialog
    :visible="visible"
    :title="title"
    :width="900"
    :update-vis="updateVis"
    :handle-close="handleClose"
    :handle-closed="handleClosed"
    :handle-ok="handleOk"
  >
    <el-form
      ref="form"
      size="small"
      label-position="right"
      label-width="80px"
      :model="dto"
      :rules="rules"
      @submit.native.prevent
    >
      <div class="entity-dlg__block">
        <div class="entity-dlg__block-bd formFix">
          <el-row :gutter="24">
            <el-col :span="20">
              <el-form-item
                label="角色"
                prop="name"
                style="display: inline-block"
              >
                <el-input
                  v-model="roleNameLike"
                  placeholder="角色名称"
                  :maxlength="30"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-button type="primary" size="small" @click="query"
              >查询</el-button
            >
            <el-button size="small" @click="reset">重置</el-button>
          </el-row>
        </div>
      </div>
    </el-form>
    <template>
      <basic-list
        ref="userTB"
        :show-select-col="true"
        :show-action-col="false"
        :loading="state.loading"
        :fields="fields"
        :total="menuRoleList ? menuRoleList.total : 0"
        :list="menuRoleList ? menuRoleList.list : []"
        :selection-change="selectionChange"
        :page-index-change="pageIndexChange"
        :page-size-change="pageSizeChange"
        :page-size="pageSize"
      >
      </basic-list>
    </template>
  </basic-dialog>
</template>

<script>
// 添加或编辑用户
import EntityDialog from "@/mixins/entityDialog";
import ExactList from "@/mixins/exactList";
import { mapState } from "vuex";
export default {
  mixins: [EntityDialog, ExactList],
  data() {
    return {
      rules: {},
      pageSize: 10,
      roleNameLike: "",
      menuRoleList: null,
      cascaderVal: "",
      // 设置翻页触发接口名
      apiName: "",
      apiIdList: [],
      pickIdList: [],
      fields: [
        { key: "roleName", name: "名称" },
        { key: "roleCode", name: "角色编码" },
        {
          key: "sensitiveMark",
          name: "是否敏感",
          render: (h, { row }) => {
            const status = { 0: "否", 1: "是" };
            const value = status[row.sensitiveMark];
            return <span>{value}</span>;
          },
        },
        { key: "rootOrgName", name: "所属机构名称" },
      ],
    };
  },
  computed: {
    ...mapState("app", ["appList"]),
  },
  props: {
    selectItem: {
      type: Object,
      default() {
        return {};
      },
    },
    winClose: {
      type: Function,
      default() {
        return () => {};
      },
    },
  },
  watch: {
    "state.menuRoleList": {
      deep: true,
      immediate: true,
      handler: function (newVal) {
        this.menuRoleList = newVal;
        this.giveCheck();
      },
    },
  },
  methods: {
    // 弹出触发
    setAppCode() {
      this.query();
    },
    // 查询
    query() {
      this.$parent.updateState({
        roleNameLike: this.roleNameLike,
        menuPageIndex: 0,
      });
      // 查询 设置菜单角色列表
      this.$parent.dispatch("listForResourceOne");
    },
    // 重置
    reset() {
      this.roleNameLike = "";
      this.$parent.updateState({ roleNameLike: this.roleNameLike });
      // 查询 设置菜单角色列表
      this.$parent.dispatch("listForResourceOne");
    },
    handleOk() {
      if (!this.$refs.form) {
        return;
      }
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return;
        }
        let params = this.toEnd();
        this.handleSave({ params, type: this.action });
      });
    },
    // 关闭和取消按钮
    handleClose(ev) {
      this.winClose(ev);
    },
    handleChange(ev) {},
    // 选择触发事件 获取当前行数据
    selectionChange(rows, ind) {
      this.pickIdList.length = 0;
      rows.forEach((item) => {
        this.pickIdList.push(item.id);
      });
      this.$parent.updateState({ pickIdList: this.pickIdList });
    },
    giveCheck() {
      // 设置数据勾选
      setTimeout(() => {
        this.apiIdList.length = 0;
        this.menuRoleList &&
          this.menuRoleList.list &&
          this.menuRoleList.list.forEach((item, ind) => {
            const _table = this.$refs.userTB.$refs.table;
            // 设置状态
            item && _table.toggleRowSelection(item, !!item.appId);
            // 存储id
            this.apiIdList.push(item.id);
          });
        if (this.apiIdList.length > 0) {
          this.$parent.updateState({ apiIdList: this.apiIdList });
        }
      });
    },
    // 切换页数
    pageIndexChange(_index) {
      let _ind = _index - 1;
      // 更新页面数据
      this.$parent.updateState({ menuPageIndex: _ind });
      // 查询列表
      this.$parent.dispatch("listForResourceOne");
    },
    // 切换每页显示条数
    pageSizeChange(_size) {
      // 查询列表
      this.pageSize = _size;
      this.$parent.updateState({ menuPageSize: _size });
      // 查询列表
      this.$parent.dispatch("listForResourceOne");
    },
  },
};
</script>

<style lang="scss" scope>
.entity-dlg__block-bd.formFix {
  input {
    width: 200px;
  }
  .col-r {
    float: right;
    position: relative;
    padding: 0 12px 0 25px;
    width: 162px;
    .el-button {
      width: 75px;
    }
  }
}
</style>
