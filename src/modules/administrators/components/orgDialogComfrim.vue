<template>
  <!-- 机构管理 -->
  <basic-dialog
    :visible="visible"
    title="确认机构管理权限"
    :width="1000"
    :update-vis="onClose"
    :handle-close="onClose"
    :handle-closed="onClose"
    :handle-ok="onComfirm"
    :isShowFooterAll="false"
    :modal="false"
    class="org-dialog"
  >
    <div class="entity-dlg__block-bd">
      <p class="org-dialog-tiptop">是否要将下表图示为<i></i>的机构及其子机构的管理权限赋予用户？请确认无误点击保存，如需修改请点击取消</p>
      <vxe-table
          ref="xTable"
          :height="500"
          resizable
          row-id="id"
          :data="list"
          :tree-config="{
            transform: true,
            rowField: 'id',
            iconOpen: 'el-icon-arrow-down',
            iconClose: 'el-icon-arrow-right',
            iconLoaded: 'el-icon-loading'
          }"
          :scroll-y="{ gt: 1000, enabled: true, mode: 'wheel', oSize: 0 }"
          >
          <vxe-column field="orgName" title="机构名称" width="400" tree-node>
            <template #default="{ row }">
              <span class="content-label-config">
                <i :class="`virtual-checkbox ${row.className}`"></i>
                <span>{{ row.orgName }}</span>
              </span>
            </template>
          </vxe-column>
          <vxe-column field="orgFullName" title="机构全称"></vxe-column>
          <vxe-column field="orgCode" title="机构编码"></vxe-column>
        </vxe-table>
    </div>
    <div class="footer pt-12">
      <el-button @click="onClose" size="mini">取消</el-button>
      <el-button @click="onSave" :loading="saveLoading" size="mini" type="primary">确认</el-button>
    </div>
  </basic-dialog>
</template>

<script>
import { get } from "lodash";
import BasicDialog from '@/components/basicDialog'

export default {
  name: "orgDialogComfirm",
  mixins: [],
  components: {
    BasicDialog
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    list: {
      type: Array,
      default: () => [],
    },
    selRows: {
      type: Array,
      default: () => [],
    },
    selects: {
      type: Array,
      default: () => [],
    }
  },
  data() {
    return {
      selectionList: [],
      tableData: [],
      selectIds: [],
      saveLoading: false
    };
  },
  computed: {},
  watch: {
    visible: {
      immediate: true,
      handler(n) {
        if (n) {
          this.$nextTick(() => {
            this.expandTree();
          })
        }
      },
    },
  },
  created() {
  },
  methods: {
    onSave() {
      this.saveLoading = true;
      const user = get(this, "selRows[0]", {});
      const list = tools.listToTreeTop(this.selects);
      const data = {
        id: user.id,
        orgIdList: list.map(item => item.id)
      };
      api.administrators
        .assignOrgAdmin({
          data: data,
        })
        .then(({ code, data, msg }) => {
          this.saveLoading = false;
          if (code == 200) {
            this.$emit('allClose');
            return this.$message.success(msg);
          } else {
            return this.$message.error(msg);
          }
        }).catch(() => {
          this.saveLoading = false;
        });
      // this.handleSave({ params, type: "edit" });
    },
    expandTree() {
      this.$refs.xTable.setTreeExpand(this.list.filter(item => {
        return item.parentId === 0;
      }), true);
      this.$refs.xTable.setCheckboxRow(this.selects, true);
    },
    onClose() {
      this.$emit('close');
    },
    classNameHandler({ row }) {
      return row.className
    },
    onComfirm() {

    }
  },
  beforeCreate() {
    this.allFields = [];
    this.disFields = [];
  },
};
</script>

<style lang="scss" scoped>
.top {
  height: 80px;
  position: relative;
  left: -6%;
  z-index: 100;
  background-color: #fff;
  display: flex;
  align-items: center;
}

.content {
  overflow: hidden;
}
.el-dialog__body {
  overflow: hidden !important;
}
.changeHeight {
  overflow: hidden !important;
}
.el-form .parent .el-form--label-right {
  min-height: 600px !important;
}
.left {
  overflow: scroll;
  height: 300px;
}
.footer {
  display: flex;
  justify-content: center;
  align-items: center;
}
.basic-dialog-ft {
  display: none !important;
}
.el-dialog__footer {
  display: none !important;
}
.el-dialog__footer {
  background-color: #000;
}

.org-dialog {
  // /deep/ .el-table__indent {
  //   display: none;
  // }
  /deep/ .text-overflow-clip {
    .cell {
      text-overflow: clip !important;
    }
  }
  /deep/ .vxe-table--render-default .vxe-tree-cell {
    padding-left: 2.2em;
  }
  /deep/ .vxe-header--row {
    .vxe-checkbox--icon {
      opacity: 0;
      display: none;
    }
    .vxe-cell--checkbox {
      cursor: none;
    }
    .vxe-checkbox--label {
      color: #606266 !important;
    }
  }
  /deep/ .content-label-config {
    position: relative;
    display: inline-block;
    padding-left: 25px;
  }
  /deep/ .virtual-checkbox {
    position: absolute;
    left: 0;
    top: 0;
    width: 16px;
    height: 22px;
    &::before {
      position: absolute;
      top: .25em;
      left: 0;
      content: "";
      height: 16px;
      width: 16px;
      background-color: #fff;
      border-radius: 2px;
      border: 1px solid #dcdfe6;
    }
  }
  /deep/ .add-is--indeterminate,
  /deep/ .add-is--checked {
    &::after {
      box-sizing: border-box;
    }
    &::before {
      border-color: #409eff;
      background-color: #409eff;
    }
  }
  /deep/ .add-is--indeterminate {
    &::after {
      content: "";
      position: absolute;
      top: 50%;
      left: 50%;
      height: 2px;
      width: 9.5px;
      background-color: #fff;
      -webkit-transform: translate(-50%,-50%);
      transform: translate(-50%,-50%);
    }
  }
  /deep/ .add-is--checked {
    &::after {
      content: "";
      position: absolute;
      height: 0.64em;
      width: 0.32em;
      top: 50%;
      left: 50%;
      border: 2px solid #fff;
      border-left: 0;
      border-top: 0;
      -webkit-transform: translate(-50%,-50%) rotate(45deg);
      transform: translate(-50%,-50%) rotate(45deg);
    }
  }

  p.org-dialog-tiptop {
    color: #333;
    font-size: 14px;
    margin-bottom: 5px;
    line-height: 22px;
    i {
      position: relative;
      display: inline-block;
      width: 16px;
      height: 22px;
      vertical-align: top;
      transform: translateY(-1px);
      margin: 0 5px;
      &::before {
        position: absolute;
        top: .25em;
        left: 0;
        content: "";
        height: 16px;
        width: 16px;
        background-color: #fff;
        border-radius: 2px;
        border: 1px solid #dcdfe6;
        border-color: #409eff;
        background-color: #409eff;
      }
      &::after {
        content: "";
        position: absolute;
        height: 0.64em;
        width: 0.32em;
        top: 50%;
        left: 50%;
        border: 2px solid #fff;
        border-left: 0;
        border-top: 0;
        -webkit-transform: translate(-50%,-50%) rotate(45deg);
        transform: translate(-50%,-50%) rotate(45deg);
      }
    }
  }
}
</style>
