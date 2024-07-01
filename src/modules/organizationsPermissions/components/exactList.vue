<template>
  <basic-list
    :show-select-col="true"
    :show-page="!!state.showPage"
    :show-action-col="false"
    :show-index-col="false"
    select-type="singleMult"
    :fields="fields"
    :loading="state.loading"
    :total="state.total"
    :list="state.list"
    :table-h="tableH"
    :table-code="tableCode"
    :lazy="true"
    :load="loadChilden"
    :tree-props="{ children: 'children', hasChildren: 'hasChild' }"
    row-key="id"
    :page-index="state.pageIndex"
    :page-size="state.pageSize"
    :page-index-change="pageIndexChange"
    :page-size-change="pageSizeChange"
    :selection-change="selectionChange"
  >
    <template slot="hd-col--l">
      <el-button
        type="primary"
        size="small"
        @click="proxyActions({ action: 'setAdd', rows: selRows })"
        v-if="buttonData('szjgcjgly').has"
        :disabled="selRows[0] && selRows[0].parentId == 0"
        >{{ buttonData("szjgcjgly").name }}</el-button
      >
    </template>
  </basic-list>
</template>

<script>
import ExactList from "@/mixins/exactList";
export default {
  mixins: [ExactList],
  props: {
    handleAdd: Function,
    handleDelete: Function,
    handleEdit: Function,
    handleUers: Function,
    handleOrg: Function,
    checkSingleRow: Function,
    proxyActions: Function,
    loadChilden: Function,
    orgTypes: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      //
      fields: [
        // 列表显示字段
        { key: "orgName", name: "机构名称", align: "left", minWidth: 280 },
        {
          key: "orgFullName",
          name: "机构全称",
          align: "left",
          render: (h, { index, row, col }) => {
            return <span>{row.orgFullName}</span>;
          },
          minWidth: 280,
        },
        {
          key: "isOwnOrg",
          name: "是否有管理权限",
          width: 120,
          render: (h, { index, row, col }) => {
            if (row.isOwnOrg === 0) {
              return <span class="cell-others-style cell-common">否</span>;
            } else {
              return <span class="cell-menu-style cell-common">是</span>;
            }
          },
        },
        { key: "orgCode", name: "机构编码", width: 160 },
        { key: "principal", name: "机构负责人", width: 160 },
        {
          key: "orgType",
          name: "类型",
          width: 120,
          render: (h, { index, row, col }) => {
            const currentRow = this.orgTypes.filter(function (item) {
              return item.key === row.orgType;
            });
            return <span>{currentRow.length ? currentRow[0].value : ""}</span>;
          },
        },
        { key: "orgSource", name: "来源", width: 160 },
        { key: "createTime", name: "创建时间", width: 160 },
        { key: "remark", name: "备注" },
      ],
      indent: 0,
    };
  },
};
</script>
<style lang="scss">
.el-table__header-wrapper {
  /deep/ .el-table__header {
    .is-left {
      text-align: center;
    }
  }
}
</style>
