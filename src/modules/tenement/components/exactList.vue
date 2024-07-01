<template>
  <!-- :list="state.list"  :loading="state.loading"-->
  <basic-list
    :showIndexCol="false"
    :show-select-col="true"
    :show-action-col="false"
    :table-h="tableH"
    :fields="fields"
    select-type="singleMult"
    :loading="state.loading"
    :total="state.total"
    :list="state.list"
    :page-index="state.pageIndex"
    :page-size="state.pageSize"
    :page-index-change="pageIndexChange"
    :page-size-change="pageSizeChange"
    :selection-change="selectionChange"
    highlight-current
  >
    <template slot="hd-col--l">
      <el-button type="primary" size="mini" @click="handleAdd">添加</el-button>
      <el-button size="mini" @click="onEdit">编辑</el-button>
      <el-button type="primary" size="mini" @click="handleSet"
        >设置权限申请审批流程</el-button
      >
      <el-button type="primary" size="mini" @click="handleAutoAssign"
        >开通自动分配权限</el-button
      >
      <el-button size="mini" @click="onEditTenementMemphisCfg" v-if="boolSwitch"
        >人员管理和账号联动配置</el-button
      >
    </template>
  </basic-list>
</template>

<script>
import { mapState } from "vuex";
import ExactList from "@/mixins/exactList";
export default {
  mixins: [ExactList],
  data() {
    return {
      fields: [
        { key: "tenementName", name: "租户名称" },
        { key: "tenementCode", name: "租户编码" },
        { key: "createTime", name: "创建时间" },
        { key: "tenementSource", name: "来源" },
        { key: "remark", name: "备注" },
        { key: "did", name: "所属数据库",
          formatter: (row, column, cellValue, index) => {
            return this.state.didMap[cellValue];
          },
        },
        { key: "principal", name: "租户负责人" },
        { key: "principalErpCode", name: "租户负责人erp" },
      ],
      boolSwitch: false,
    };
  },
  mounted() {
    this.queryGlobalSwitchAboutUserCfg();
  },
  methods: {
    onEdit() {
      const rows = this.selRows;
      if (!rows.length) {
        this.$message.error("请选择需要编辑的数据！");
        return;
      }
      if (rows.length > 1) {
        this.$message.error("只能选择一个数据进行编辑！");
        return;
      }

      this.handleEdit({ id: rows[0].id, did: rows[0].did }, true);
      //  this.handleEdit(rows[0])
    },
    onEditUser() {
      if (!this.selRows.length) {
        this.$message.error("请选择需要编辑的数据！");
        return;
      }
      if (this.selRows.length > 1) {
        this.$message.error("只能选择一个数据进行编辑！");
        return;
      }
      this.$emit("onEditUser", this.selRows);
    },
    onEditTenementMemphisCfg() {
      if (!this.selRows.length) {
        this.$message.error("请选择需要编辑的数据！");
        return;
      }
      if (this.selRows.length > 1) {
        this.$message.error("只能选择一个数据进行编辑！");
        return;
      }
      this.$emit("onEditTenementMemphisCfg", this.selRows);
    },
    handleSet() {
      if (!this.selRows.length) {
        this.$message.error("请选择需要编辑的数据！");
        return;
      }
      if (this.selRows.length > 1) {
        this.$message.error("只能选择一个数据进行编辑！");
        return;
      }
      this.$emit("handleSet", this.selRows);
    },
    handleAutoAssign() {
      if (!this.selRows.length) {
        this.$message.error("请选择需要编辑的数据！");
        return;
      }
      if (this.selRows.length > 1) {
        this.$message.error("只能选择一个数据进行编辑！");
        return;
      }
      this.$emit("handleAutoAssign", this.selRows);
    },
    queryGlobalSwitchAboutUserCfg() {
      api.tenement
        .queryGlobalSwitchAboutUserCfg({
          data: {},
        })
        .then(({ data, code, msg }) => {
          if (code === 200) {
            this.boolSwitch = data;
          } else {
            this.$message.error(msg);
          }
        });
    },
  },
};
</script>

