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
      <!-- <el-button  size="mini" @click="onStop">停用</el-button> -->
      <!-- <el-button size="mini" @click="onWorkflow">配置审批流</el-button> -->
    </template>
  </basic-list>
</template>

<script>
import ExactList from "@/mixins/exactList";
export default {
  mixins: [ExactList],

  data() {
    return {
      fields: [
        { key: "appName", name: "应用名称" },
        { key: "appCode", name: "应用编码" },
        { key: "domainName", name: "域名" },
        { key: "createTime", name: "创建时间" },
        { key: "appSource", name: "来源" },
        { key: "remark", name: "备注" },
        // { key: "flowId", name: "流程ID" },
        { key: "principal", name: "应用负责人" },
        { key: "principalErpCode", name: "应用负责人erp" },
      ],
    };
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
      this.handleEdit({ id: rows[0].id }, true);
      //  this.handleEdit(rows[0])
    },
    onStop() {
      const rows = this.selRows;
      if (!rows.length) {
        this.$message.error("请选择需要编辑的数据！");
        return;
      }
      if (rows.length > 1) {
        this.$message.error("只能选择一个数据进行编辑！");
        return;
      }
      this.handleDelete(rows[0]);
    },
    onWorkflow() {
      const rows = this.selRows;
      if (!rows.length) {
        this.$message.error("请选择需要配置的应用！");
        return;
      }
      if (rows.length > 1) {
        this.$message.error("只能选择一个应用进行配置！");
        return;
      }
      if(rows[0].flowId) {
        this.handleWorkflow({ id: rows[0].id });
      } else {
        this.$message.error('该功能即将下线，请咚咚联系USF小妹处理。');
      }
    },
  },
};
</script>
