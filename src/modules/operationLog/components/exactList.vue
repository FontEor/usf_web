<template>
  <div>
    <basic-list
      :fields="fields"
      :loading="state.loading"
      :total="state.total"
      :list="state.list"
      :table-h="tableH"
      :page-index="state.pageIndex"
      :page-size="state.pageSize"
      :page-index-change="pageIndexChange"
      :show-action-col="false"
      :selection-change="selectionChange"
      row-key="id"
      :page-size-change="pageSizeChange"
      :tooltip-effect="'dark'"
      :cellClassNames="['cell-overflow-two-line']"
      :index-locked="false"
      :index-align="'left'"
      :index-col-width="48"
      :indexClassName="'min-index-cloumn'"
    >
    </basic-list>
    <OperationLogDrawer :data="detail" :visible="drawerVisible" @close="onCloseDrawer"/>
  </div>
</template>

<script>
import ExactList from "@/mixins/exactList";
import OperationLogDrawer from "./drawer.vue";
export default {
  mixins: [ExactList],
  components: { OperationLogDrawer },
  data() {
    return {
      drawerVisible: false,
      detail: undefined,

      pageIndexChangeFlag: false,
      fields: [
        { key: "appCode", name: "应用编码", align: "left",
          render: (h, { row }) => (
            <el-tooltip placement="top" transition="none" open-delay={ 500 }>
              <div slot="content">{ row.appCode }</div>
              <div>{row.appCode}</div>
            </el-tooltip>
          )
        },
        { key: "granteeCode", name: "被操作对象编码", align: "left",
          render: (h, { row }) => (
            <el-tooltip placement="top" transition="none" open-delay={ 500 }>
              <div slot="content">{ row.granteeCode }</div>
              <div>{row.granteeCode}</div>
            </el-tooltip>
          )
        },
        { key: "granteeName", name: "被操作对象名称", align: "left",
          render: (h, { row }) => (
            <el-tooltip placement="top" transition="none" open-delay={ 500 }>
              <div slot="content">{ row.granteeName }</div>
              <div>{row.granteeName}</div>
            </el-tooltip>
          )
        },
        { key: "workType", name: "业务类型", align: "left",
          render: (h, { row }) => (
            <el-tooltip placement="top" transition="none" open-delay={ 500 }>
              <div slot="content">{ row.workType }</div>
              <div>{row.workType}</div>
            </el-tooltip>
          )
        },
        { key: "operateType", name: "操作类型", align: "left",
          render: (h, { row }) => (
            <el-tooltip placement="top" transition="none" open-delay={ 500 }>
              <div slot="content">{ row.operateType }</div>
              <div>{row.operateType}</div>
            </el-tooltip>
          )
        },
        { key: "purviewCode", name: "操作对象编码", align: "left",
          render: (h, { row }) => (
            <el-tooltip placement="top" transition="none" open-delay={ 500 }>
              <div slot="content">{ row.purviewCode }</div>
              <div>{row.purviewCode}</div>
            </el-tooltip>
          )
        },
        { key: "purviewName", name: "操作对象名称", align: "left",
          render: (h, { row }) => (
            <el-tooltip placement="top" transition="none" open-delay={ 500 }>
              <div slot="content">{ row.purviewName }</div>
              <div>{row.purviewName}</div>
            </el-tooltip>
          )
        },
        { key: "opBeforeValue", name: "操作内容", align: "left", width: "78px",
          render: (h, { row }) => {
            if (row.opBeforeValue || row.opAfterValue) {
              if (row.opBeforeValue !== '-' || row.opAfterValue !== '-') {
                return (
                  <el-button class="fs-14 fw-n" type="text" onClick={() => this.onContent(row)}>查看内容</el-button>
                )
              }
            }
            return <span>-</span>
          }
        },
        { key: "opPath", name: "操作路径", align: "left",
          render: (h, { row }) => (
            <el-tooltip placement="top" transition="none" open-delay={ 500 }>
              <div slot="content">{ row.opPath }</div>
              <div>{row.opPath}</div>
            </el-tooltip>
          )
        },
        { key: "createUser", name: "操作人", align: "left",
          render: (h, { row }) => (
            <el-tooltip placement="top" transition="none" open-delay={ 500 }>
              <div slot="content">{ row.createUser }</div>
              <div>{row.createUser}</div>
            </el-tooltip>
          )
        },
        {
          key: "createTime",
          name: "操作时间",
          align: "left",
          render: (h, { row }) => (
            <el-tooltip placement="top" transition="none" open-delay={ 500 }>
              <div slot="content">{ jt.date.format(new Date(row.createTime).getTime()) }</div>
              <div>{ jt.date.format(new Date(row.createTime).getTime()) }</div>
            </el-tooltip>
          )
          // formatter: function (row, column, cellValue, index) {
          //   return jt.date.format(new Date(cellValue).getTime());
          // },
        },
        { key: "remark", name: "备注", align: "left",
          render: (h, { row }) => (
            <el-tooltip placement="top" transition="none" open-delay={ 500 }>
              <div slot="content">{ row.remark }</div>
              <div>{row.remark}</div>
            </el-tooltip>
          )
        },
      ],
    };
  },
  methods: {
    onContent(row) {
      this.detail = row;
      this.drawerVisible = true
    },
    onCloseDrawer(){
      this.drawerVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped>

</style>

