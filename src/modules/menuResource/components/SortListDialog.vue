<template>
  <el-dialog
    class="sort-list-dialog"
    :title="`子菜单排序: ${data.resourceName}`"
    :visible="visible"
    width="600px"
    :before-close="onClose"
  >
    <div class="sort-list-group-title">
      <div style="width: 220px">菜单名称</div>
      <div style="width: 200px">菜单编码</div>
      <div>菜单类型</div>
    </div>
    <draggable
      :list="list"
      class="sort-list-group"
      ghost-class="ghost"
      :move="checkMove"
      @start="dragging = true"
      @end="dragging = false"
    >
      <div
        class="sort-list-group-item"
        v-for="(item, index) in list"
        :key="item.code"
      >
        <div class="sort-list-group-item-index">{{ index + 1 }}</div>
        <div class="sort-list-group-item-content">
          <div style="width: 200px">{{ item.name }}</div>
          <div style="width: 200px">{{ item.code }}</div>
          <div>{{ ENUMS.resourceType[item.type] }}</div>
        </div>
        <div class="sort-list-group-item-icon">
          <i class="el-icon-rank"></i>
        </div>
      </div>
    </draggable>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onClose" size="mini">取 消</el-button>
      <el-button type="primary" @click="onConfirm" size="mini">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import draggable from "vuedraggable";

export default {
  name: "SortListDialog",
  display: "Simple",
  order: 0,
  components: {
    draggable,
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => ({ children: [] })
    }
  },
  data() {
    return {
      enabled: true,
      dragging: false,
      ENUMS: CNST.ENUMS,
      list: [],
    };
  },
  watch: {
    data: {
      handler: function (n, o) {
        this.list = n.children.map(item => {
          return {
            id: item.id,
            code: item.resourceCode,
            name: item.resourceName,
            index: item.resourceSeqRel,
            type: item.resourceType,
          }
        })
      },
      immediate: true,
      deep: true,
    }
  },
  methods: {
    checkMove: function (e) {
      window.console.log("Future index: " + e.draggedContext.futureIndex);
    },
    onClose(refresh = false) {
      this.$emit('close', refresh)
    },
    onConfirm() {
      api.menuResource.setMenuResourceSort({
        data: {
          id: this.data.id,
          ids: this.list.map(item => item.id),
          tenementCode: this.data.tenementCode
        }
      }).then(res => {
        if(res.code === 200) {
          this.onClose(true);
        } else {
          this.$message.error(res.msg)
        }
      })
    },
  },
};
</script>
<style scoped>
.buttons {
  margin-top: 35px;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.sort-list-dialog /deep/ .el-table .cell {
  white-space: normal !important;
}
</style>
