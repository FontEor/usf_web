<template>
  <UmyBasicList
    :show-index-col="false"
    :show-select-col="false"
    :show-action-col="true"
    :show-page="!!state2.showPage"
    :table-h="280"
    :fields="fields"
    :loading="state2.loading"
    :total="state2.viewMenuTotal"
    :list="state2.viewMenuListData"
    select-type="singleMult"
    :tree-config="treeConfig"
    :selection-change="selectionChange"
    class-name="menuResource"
    highlight-current
    row-key="id"
    :table-code="tableCode"
    :lazy="true"
    :actionColLabel="'权限来源'"
    :isActionRender="false"
  >
    <template v-slot:action="row">
      <el-popover placement="top" trigger="click">
        <div style="max-width: 640px">
          <el-alert
            title="用户从以下渠道获得了该菜单/按钮的权限,如果想要去除用户对于该菜单/按钮的权限,需要将用户从以下渠道中全部移除"
            type="info"
            :closable="false"
            style="margin-bottom: 10px"
          >
          </el-alert>
          <el-table :data="dataCodeArray" border style="width: 100%">
            <el-table-column prop="source" label="权限来源类型" width="200px">
            </el-table-column>
            <el-table-column prop="detail" label="详情"> </el-table-column>
          </el-table>
        </div>
        <!-- <el-button slot="reference">click 激活</el-button> -->
        <el-button
          slot="reference"
          type="primary"
          @click="watchData(row)"
          size="mini"
          >查看</el-button
        >
      </el-popover>
    </template>
  </UmyBasicList>
</template>

<script>
import ExactList from "@/mixins/exactList";
export default {
  mixins: [ExactList],
  data() {
    return {
      fields: [
        // 列表显示字段
        { key: "resourceName", name: "名称", align: "left", minWidth: 220 },
        {
          key: "resourceCode",
          name: "编码",
          render: (h, { index, row, col }) => {
            return <span>{row.resourceCode}</span>;
          },
          minWidth: 220,
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
        // {
        //   key: "isOwn",
        //   name: "是否有操作权限",
        //   width: 120,
        //   formatter: function(row, column, cellValue, index) {
        //     return cellValue == 1 ? "有" : "没有";
        //   }
        // },
        // { key: "resourceUrl", name: "URL", width: 160 },
        // { key: "createTime", name: "创建时间", width: 160 },
        // { key: "remark", name: "备注" },
      ],
      treeConfig: { expandRowKeys: [] },
      dataCodeArray: [],
    };
  },
  computed: {
    state2() {
      return this.$store.state.users;
    },
  },
  watch: {
    "state2.viewMenuListData": {
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
  methods: {
    watchData({ row }) {
      let params = {
        resourceId: row.id,
        id: this.$store.state.users.userId,
      };
      api.users.viewSingleMenuSource({ data: params }).then((res) => {
        if (res.code == 200) {
          this.dataCodeArray = res.data;
        } else {
          this.$message({ message: res.msg || "请求异常", type: "error" });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.el-table__header-wrapper {
  /deep/ .el-table__header {
    .is-left {
      text-align: center;
    }
  }
}
</style>
