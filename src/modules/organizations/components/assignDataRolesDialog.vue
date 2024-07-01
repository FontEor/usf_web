<template>
  <basic-dialog
    :visible="visible"
    :title="title"
    :width="800"
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
        <div class="entity-dlg__block-bd">
          <el-row :gutter="24">
            <el-col :span="10">
              <el-form-item label="角色名称" prop="name">
                <el-input v-model="roleNameLike" placeholder="角色名称" />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="角色编码" prop="name">
                <el-input v-model="roleCodeLike" placeholder="角色编码" />
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
        :loading="false"
        :fields="fields"
        :total="userList ? userList.total : 0"
        :list="userList ? userList.list : []"
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
import EntityDialog from "@/mixins/entityDialog";
import ExactList from "@/mixins/exactList";
export default {
  name: "AssignDataRolesDialog",
  mixins: [EntityDialog, ExactList],
  data() {
    return {
      rules: {},
      pageSize: 10,
      roleNameLike: "",
      roleCodeLike: "",
      userList: null,
      apiName: "queryDataRolesList",
      cascaderVal: "",
      apiIdList: [],
      pickIdList: [],
      fields: [
        { key: "roleCode", name: "角色编码" },
        { key: "roleName", name: "角色名称" },
        { key: "source", name: "来源" },
        { key: "createUser", name: "添加人" },
        { key: "createTime", name: "添加时间",
          formatter: function (row, column, cellValue, index) {
            return jt.date.format(new Date(cellValue).getTime());
          }
        },
        { key: "rootOrgName", name: "所属机构名称" },
      ],
    };
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
    "state.userList": {
      deep: true,
      immediate: true,
      handler: function (newVal) {
        this.userList = newVal;
        this.giveCheck();
      },
    },
    visible: {
      handler(newValue) {
        newValue && this.reset();
      },
    },
  },
  methods: {
    // 查询
    query(ev) {
      this.$parent.updateState({
        roleNameLike: this.roleNameLike,
        roleCodeLike: this.roleCodeLike,
        dataPageIndex: 0,
      });
      // 查询 设置菜单角色列表
      this.$parent.dispatch("queryDataRolesList");
    },
    // 重置
    reset() {
      this.roleNameLike = "";
      this.roleCode = "";
      this.$parent.updateState({ roleNameLike: this.roleNameLike, roleCodeLike: this.roleCodeLike });
      // 查询 设置菜单角色列表
      this.$parent.dispatch("queryDataRolesList");
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
        this.userList &&
          this.userList.list &&
          this.userList.list.forEach((item, ind) => {
            const _table = this.$refs.userTB.$refs.table;
            // 设置状态
            item && _table.toggleRowSelection(item, !!item.isOwnRole);
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
      this.$parent.updateState({ dataPageIndex: _ind });
      // 查询列表
      this.$parent.dispatch(this.apiName || "queryDataRolesList");
    },
    // 切换每页显示条数
    pageSizeChange(_size) {
      // 查询列表
      this.pageSize = _size;
      this.$parent.updateState({ dataPageSize: _size });
      // 查询列表
      this.$parent.dispatch(this.apiName || "queryDataRolesList");
    },
  },
};
</script>

