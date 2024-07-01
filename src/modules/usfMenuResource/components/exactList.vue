<template>
  <!-- :selection-change="selectionChange"]
    :page-index="state.pageIndex"
        :page-size="state.pageSize"
        :page-index-change="pageIndexChange"
        :page-size-change="pageSizeChange"
    -->
  <basic-list
    :showIndexCol="false"
    :show-select-col="true"
    :show-action-col="false"
    :showPage="false"
    :rowKey="'id'"
    :table-h="tableH"
    :fields="fields"
    :loading="state.loading"
    :total="state.total"
    :list="state.list"
    select-type="singleMult"
    :treeProps="{ children: 'children', hasChildren: '!!children' }"
    :selection-change="selectionChange"
    class-name="menuResource"
    highlight-current
    :expand-row-keys="state.expandKey"
  >
    <template slot="hd-col--l">
      <el-button type="primary" size="mini" @click="onSonMenu"
        >添加子菜单</el-button
      >
      <el-button size="mini" @click="onEdit">编辑</el-button>
      <!--  <el-button size="mini" @click="onMove('up')">上移</el-button>
              <el-button size="mini" @click="onMove('down')">下移</el-button>-->
      <el-button type="danger" size="mini" @click="onDelete">删除</el-button>
      <!-- 关联菜单角色 -->
      <el-button
        v-if="selRows.length !== 0"
        size="mini"
        @click="handleConnectMenuRole(selRows[0])"
        >关联菜单角色</el-button
      >
    </template>
  </basic-list>
</template>

<script>
import ExactList from "@/mixins/exactList";
import { mapState } from "vuex";

export default {
  mixins: [ExactList],
  props: {
    addSonMenu: Function,
    exchange: Function,
    queryList: Function,
    handleConnectMenuRole: Function,
  },
  created() {
    this.userType();
  },
  data() {
    return {
      // store唯一标识
      fields: [
        { key: "resourceName", name: "名称", width: 300, align: "left" },
        { key: "resourceSeq", name: "菜单序号", width: 100 },
        {
          key: "resourceType",
          name: "类型",
          render: (h, { index, row, col }) => {
            if (row.resourceType == 0) {
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
        { key: "resourceUrl", name: "URL" },
        { key: "createTime", name: "创建时间", width: 200 },
        { key: "remark", name: "备注" },
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
      if (rows.length > 1) {
        this.$message.error("只能选择一个数据进行删除！");
        return;
      }
      if (rows[0].parentId == null) {
        this.$message.error("根菜单不可删除！");
        return false;
      }
      this.handleDelete(rows[0]); //
    },
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
      if (rows[0].parentId == null) {
        this.$message.error("根菜单不可编辑！");
        return false;
      }
      this.handleEdit({ id: rows[0].id }, true);
    },
    //添加子菜单
    onSonMenu() {
      const rows = this.selRows;
      if (!rows.length) {
        this.$message.error("请选择需要添加的usf子菜单！");
        return;
      }
      if (rows.length > 1) {
        this.$message.error("只能选择一个数据进行添加！");
        return false;
      }
      this.addSonMenu(rows[0]);
    },
    //上移 下移
    onMove(upDown) {
      let _this = this;
      const rows = this.selRows; //当前行数据
      if (!rows.length) {
        this.$message.error("请选择需要移动的节点！");
        return false;
      }
      let thisParentId = rows[0].parentId; //父级id
      let oldTree = this.state.rowsTree; //接口的扁平化数据
      let fathorObj = [];
      for (let i = 0; i < oldTree.length; i++) {
        if (oldTree[i].parentId == thisParentId) {
          fathorObj.push(oldTree[i]); //父级对象
        }
      }
      let brother2 = {};
      let thisParam1 = {};
      for (let i = 0; i < fathorObj.length; i++) {
        if (fathorObj[i].parentId == null || fathorObj[i].parentId == "null") {
          this.$message.error("根节点不可移动!");
          return false;
        }
        fathorObj[i].index = i;
        if (fathorObj[i].id == rows[0].id) {
          if (upDown === "up" && fathorObj[i].index == 0) {
            _this.$message.error("已经是第一个节点了!");
            return false;
          }
          if (upDown == "down" && fathorObj[i].index == fathorObj.length - 1) {
            _this.$message.error("已经是最后一个节点了!");
            return false;
          }
          if (upDown == "up") {
            thisParam1 = {
              id: rows[0].id,
              //"resourceSeq": rows[0].resourceSeq
              resourceSeq: fathorObj[i - 1].resourceSeq,
            }; //必传的参数1
            brother2 = {
              id: fathorObj[i - 1].id,
              //"resourceSeq": fathorObj[i - 1].resourceSeq
              resourceSeq: rows[0].resourceSeq,
            };
          } else if (upDown === "down") {
            thisParam1 = {
              id: rows[0].id,
              //"resourceSeq": rows[0].resourceSeq
              resourceSeq: fathorObj[i + 1].resourceSeq,
            }; //必传的参数1
            brother2 = {
              id: fathorObj[i + 1].id,
              resourceSeq: rows[0].resourceSeq,
            };
          }
        }
      }

      api.menuResource
        .exchange({
          data: [thisParam1, brother2],
        })
        .then((res) => {
          if (res.code == 200) {
            res && _this.$message.success(res.msg || "上移成功webMsg");
            _this.queryList();
          } else if (res) {
            this.$message.error(res.msg || res.errorCode || "上移失败webMsg");
          }
        });
    },

    // 判断用户类型
    userType() {
      api.usfAdmin
        .IsPlatformAdmin({ tenementCode: this.tenementInfoObj.tenementCode })
        .then(({ code, data, message }) => {
          if (data) {
            this.fields.splice(2, 0, {
              key: "resourceCode",
              name: "编码",
              width: 200,
              classNames: ["transition-style"],
            });
          }
        });
    },
  },

  computed: {
    ...mapState("app", ["tenementInfoObj"]),
  },
  watch: {
    tenementInfoObj: {
      deep: true,
      immediate: false,
      handler: function (newVal) {
        if (newVal.tenementCode) {
          //this.dispatch('queryList')
          this.queryList();
        }
      },
    },
  },
};
</script>

<style>
.cell-common {
  display: inline-block;
  background-color: red;
  padding: 0 5px;
  border-radius: 4px;
  color: #fff;
}
.cell-menu-style {
  background-color: #67c23a;
}
.cell-button-style {
  background-color: #e6a23c;
}
.cell-others-style {
  background-color: #909399;
}
.transition-style {
  transition: all 0.25s ease;
}
</style>




