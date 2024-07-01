<template>
  <!-- //multiple single-->
  <UmyBasicList
    :show-index-col="false"
    :show-select-col="false"
    :show-action-col="false"
    :show-page="!!state.showPage"
    :table-h="tableH"
    :fields="fields"
    :loading="state.loading"
    :total="state.total"
    :list="state.list"
    select-type="singleMult"
    :tree-config="treeConfig"
    :selection-change="selectionChange"
    highlight-current
    class-name="menuResource"
    row-key="id"
    :show-col-set="false"
    :table-code="tableCode"
    :lazy="true"
    :page-index="state.pageIndex"
    :page-size="state.pageSize"
    :page-index-change="pageIndexChange"
    :page-size-change="pageSizeChange"
  >
    <!--<template slot="hd-col--l">
            <el-button type="primary" size="small" @click="handleAdd">增加子机构</el-button>
            <el-button type="primary" size="small" @click="handleUers">查看机构成员</el-button>
            <el-button type="primary" size="small" @click="handleRoles">管理机构角色</el-button>
            <el-button type="primary" plain size="small" @click="handleEdit">编辑</el-button>
            <el-button type="primary" plain size="small" @click="handleDelete">删除</el-button>
            <el-button type="primary" plain size="small" @click="handleOrg">变更父节点</el-button>
    </template>-->
  </UmyBasicList>
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
    orgTypes: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      fields: [
        // 列表显示字段
        { key: "resourceName", name: "名称", align: "left", minWidth: 280 },
        {
          key: "resourceCode",
          name: "编码",
          render: (h, { index, row, col }) => {
            return <span>{row.resourceCode}</span>;
          },
          minWidth: 280,
        },
        {
          key: "resourceType",
          name: "类型",
          width: 120,
          render: (h, { index, row, col }) => {
            if (row.resourceType === 0) {
              return (
                <span class="cell-menu-style cell-common">
                  {CNST.ENUMS.resourceType[row.resourceType]}
                </span>
              );
            } else if (row.resourceType == 1) {
              return (
                <span class="cell-button-style cell-common">
                  {CNST.ENUMS.resourceType[row.resourceType]}
                </span>
              );
            } else {
              return (
                <span class="cell-others-style cell-common">
                  {CNST.ENUMS.resourceType[row.resourceType]}
                </span>
              );
            }
          },
        },
        {
          key: "isOwn",
          name: "是否有管理权限",
          width: 120,
          formatter: function (row, column, cellValue, index) {
            return cellValue == 1 ? "有" : "没有";
          },
        },
        { key: "resourceUrl", name: "URL", width: 160 },
        { key: "createTime", name: "创建时间", width: 160 },
        { key: "remark", name: "备注" },
      ],
      defalutArr: [],
      treeConfig: { expandRowKeys: [] },
    };
  },
  methods: {
    handleRoles() {
      // todo
    },
  },
  watch: {
    "state.list": {
      deep: true,
      immediate: false,
      handler: function (newVal) {
        if (newVal.length > 0) {
          const expandRowKeys = [newVal[0].id];
          this.treeConfig = { expandRowKeys };
        }
      },
    },
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
