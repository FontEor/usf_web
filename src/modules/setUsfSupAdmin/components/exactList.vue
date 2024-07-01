<template>
  <basic-list
    :showIndexCol="false"
    :show-select-col="true"
    :show-action-col="false"
    :table-h="tableH"
    :fields="fields"
    select-type="multiple"
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
      <el-button type="danger" size="mini" @click="onDelete">删除</el-button>
      <el-button type="primary" size="mini" @click="exportMenuData"
        >导出</el-button
      >
    </template>
  </basic-list>
</template>

<script>
import ExactList from "@/mixins/exactList";
import axios from "axios";
export default {
  mixins: [ExactList],
  props: {
    exportMenuData: Function,
    handleDelete: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      fields: [
        { key: "userName", name: "用户名称" },
        { key: "userCode", name: "用户账号" },
        {
          key: "userSystemType",
          name: "账号类型",
          formatter: function (row, column, cellValue, index) {
            return _params.users.userSystemType[cellValue];
          },
        },
      ],
    };
  },
  methods: {
    onDelete() {
      const rows = this.selRows;
      if (!rows.length) {
        this.$message.error("请选择需要删除的数据！");
        return;
      }
      let busIdList = [];
      this.selRows.forEach((element) => {
        busIdList.push(element.userId);
      });
      axios({
        url: '/administrator/usf/delete.do',
        params: {
          tenementCode: this.$store.state.app.tenementCode,
          userIds: busIdList.join(','),
        },
        method: 'post',
      }).then(({data}) => {
          if (data.code == 200) {
            this.handleDelete()
            return this.$message.success(data.msg);
          } else {
            return this.$message.error(data.msg);
          }
        });
    },
  },
};
</script>
