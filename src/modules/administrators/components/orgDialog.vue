<template>
  <!-- 机构管理 -->
  <basic-dialog
    :visible="visible"
    :title="buttonData('glysqfpjgglqx').name"
    :width="1000"
    :update-vis="updateVis"
    :handle-close="handleClose"
    :handle-closed="handleClosed"
    :handle-ok="handleOk"
    :isShowFooterAll="false"
    class="org-dialog"
  >
    <div v-show="!showComfirm" class="entity-dlg__block-bd">
      <vxe-table
          ref="uTable"
          :height="500"
          resizable
          row-id="id"
          :data="tableData"
          :tree-config="{
            transform: true,
            rowField: 'id',
            iconOpen: 'el-icon-arrow-down',
            iconClose: 'el-icon-arrow-right',
            iconLoaded: 'el-icon-loading'
          }"
          :loading="loading"
          :checkbox-config="{
            labelField: 'orgName'
          }"
          :scroll-y="{ gt: 100, enabled: true, mode: 'wheel', oSize: 0 }"
          >
          <vxe-column type="checkbox" title="机构名称" width="400" tree-node field="orgName"></vxe-column>
          <vxe-column field="orgFullName" title="机构全称"></vxe-column>
          <vxe-column field="orgCode" title="机构编码"></vxe-column>
        </vxe-table>
    </div>
    <div v-show="!showComfirm" class="footer pt-12">
      <el-button @click="handleClose" size="mini">关闭</el-button>
      <el-button @click="onSave" size="mini" type="primary">保存</el-button>
    </div>

    <div v-if="showComfirm" class="entity-dlg__block-bd org-dialog">
      <p class="org-dialog-tiptop">是否要将下表图示为<i></i>的机构及其子机构的管理权限赋予用户？请确认无误点击保存，如需修改请点击取消</p>
      <vxe-table
          ref="xTable"
          :height="500"
          resizable
          row-id="id"
          :data="allSelectList"
          :tree-config="{
            transform: true,
            rowField: 'id',
            iconOpen: 'el-icon-arrow-down',
            iconClose: 'el-icon-arrow-right',
            iconLoaded: 'el-icon-loading'
          }"
          :scroll-y="{ gt: 100, enabled: true, mode: 'wheel', oSize: 0 }"
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
    <div v-show="showComfirm" class="footer pt-12">
      <el-button @click="showComfirm = false" size="mini">取消</el-button>
      <el-button @click="onComfirm" :loading="saveLoading" size="mini" type="primary">确认</el-button>
    </div>
  </basic-dialog>
</template>

<script>
import { get } from "lodash";
import Vue from "vue";
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'
import { mapState } from "vuex";
import 'xe-utils'
Vue.use(VXETable);

import EntityDialog from "@/mixins/entityDialog";
// import tableData from "../../../../mock/data/orgTreeData.json";

export default {
  name: "orgDialog",
  mixins: [EntityDialog],
  components: {
    VXETable
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    state: {
      type: Object,
      default: {},
    },
    selRows: {
      type: Array,
      default: () => [],
    },
    queryList: {
      type: Function,
      required: true,
    },
    updateVis: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      selectionList: [],
      tableData: [],
      selectIds: [],
      loading: false,
      showComfirm: false,
      saveLoading: false,
      selectList: [],
      // 包括半选
      allSelectList: []
    };
  },
  computed: {},
  watch: {
    visible: {
      immediate: true,
      handler(n) {
        if (n) {
          this.getList({ isInit: true });
        }
      },
    },
  },
  created() {
  },
  methods: {
    onLoad(row, treeNode, resolve) {
      this.getList({ resolve, treeNode, params: { id: row.id } });
    },
    getList({ isInit, treeNode, resolve, params = {} }) {
      this.loading = true
      const user = get(this, "selRows[0]", {});
      const data = {
        tenementCode: user.tenementCode,
        userId: user.id,
        ...params,
      };
      return api.administrators
        .queryOrgManagerList({ data })
        .then(({ code, data = {}, msg }) => {
          this.loading = false
          this.formatData(data.orgList, data.orgIds)
        }).catch(() => {
          this.loading = false
        })
    },
    formatData(list = [], orgIds = []) {
      // 当前选中数组
      const selects = [];
      // 展开元素数组
      const expands = []
      const datas = list.map(item => {
        const instance = {
          id: item.id,
          orgName: item.orgName,
          orgCode: item.orgCode,
          orgFullName: item.orgFullName,
          parentId: item.parentId
        }
        if(orgIds.includes(item.id)) {
          selects.push(instance)
        }
        if (instance.parentId === 0) {
          expands.push(instance)
        }
        return instance
      });
      // 不使用 transform 手动处理为树结构效率会高一些
      // this.tableData = tools.listToTree(datas);
      // 手动处理树结构 不知为何的 没有了虚拟滚动
      this.tableData = datas
      this.$nextTick(() => {
        this.$refs.uTable.setCheckboxRow(selects, true)
        this.$refs.uTable.setTreeExpand(expands, true);
      });
    },
    onSave() {
      const selects = this.$refs.uTable.getCheckboxRecords(true);
      const halfSelects = this.$refs.uTable.getCheckboxIndeterminateRecords(true);
      const halfSelectList = this.deleteProperty(halfSelects);
      const list = this.deleteProperty(selects, 'add-is--checked');
      // 抛弃选择的子树
      const listTop = tools.listToTreeTop(this.cloneData(list));
      this.selectList = listTop;
      // 删除无用属性 并处理为树结构
      // this.allSelectList = tools.listToTree(
      //   halfSelectList.concat(listTop)
      // );
      this.allSelectList = halfSelectList.concat(listTop)
      this.showComfirm = true;
      this.$nextTick(() => {
        this.$refs.xTable.setTreeExpand(halfSelectList, true);
      });
    },
    deleteProperty(list, className = 'add-is--indeterminate') {
      const innerList = this.cloneData(list);
      innerList.forEach(item => {
        delete item.children
        item.className = className
      })
      return innerList
    },
    // 确认逻辑
    onComfirm() {
      this.saveLoading = true;
      const user = get(this, "selRows[0]", {});
      // const list = tools.listToTreeTop(this.selectList);
      const list = this.selectList;
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
            this.handleClose();
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
    // 手动clone性能会好很多
    cloneData(list) {
      return list.map(item => {
        return {
          className: item.className,
          id: item.id,
          orgCode: item.orgCode,
          orgFullName: item.orgFullName,
          orgName: item.orgName,
          parentId: item.parentId
        }
      })
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
        transform: translate(-50%,-50%) rotate(45deg);
      }
    }
  }

  /deep/ .vxe-table--body {
    transform: translateY(0);
    transition: margin-top 0ms;
  }
}
</style>
