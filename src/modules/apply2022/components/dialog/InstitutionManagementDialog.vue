<template>
  <!-- 机构管理 -->
  <basic-dialog
    :visible="visible"
    :title="diaTitle"
    :width="1200"
    :update-vis="updateVis"
    :handle-close="handleClose"
    :handle-closed="handleClosed"
    :handle-ok="handleOk"
    :isShowFooterAll="false"
    class="org-dialog"
  >
    <el-form
      ref="form"
      size="small"
      label-position="right"
      label-width="80px"
      :model="query"
      :inline="true"
    >
      <div class="entity-dlg__block">
        <div class="entity-dlg__block-bd formFix">
          <el-row :gutter="0">
            <el-form-item label="机构名称">
              <el-input v-model="query.orgName" clearable />
            </el-form-item>
            <el-form-item label="机构编码">
              <el-input v-model="query.orgCode" clearable />
            </el-form-item>
            <div class="col-r" style="width: 205px; margin-bottom: 20px">
              <el-button type="primary" size="small" @click="handleSearch"
                >查询</el-button
              >
              <el-button size="small" @click="handleReset">重置</el-button>
            </div>
          </el-row>
        </div>
      </div>
    </el-form>
    <div class="entity-dlg__block-bd">
      <div class="vxe-table-toolbar-pagination">
        <el-pagination
          :current-page="pageInfo.pageIndex"
          :page-size="pageInfo.pageSize"
          :page-sizes="[10, 20, 50, 100, 200, 300, 500]"
          :total="pageInfo.total"
          layout="total, sizes, prev, jumper, slot, next "
          @current-change="pageIndexChange"
          @size-change="pageSizeChange"
        >
          <span class="page-count"> / {{ pageInfo.pageTotal }}</span>
        </el-pagination>
      </div>

      <vxe-table
        v-if="!useSearch"
        :key="visible"
        ref="uTable"
        :height="500"
        resizable
        :data="treeData"
        row-id="id"
        :column-config="{ resizable: true }"
        :tree-config="{
          transform: true,
          rowField: 'id',
          iconOpen: 'el-icon-arrow-down',
          iconClose: 'el-icon-arrow-right',
          iconLoaded: 'el-icon-loading',
          parentField: 'parentId',
          loadMethod: updateTableData,
          lazy: true,
          hasChild: 'hasChild',
        }"
        :loading="loading"
        :checkbox-config="{
          labelField: 'orgName',
          checkMethod: ({ row }) => !row.disabled,
          reserve: true,
        }"
        :scroll-y="{ gt: 100, enabled: true, mode: 'wheel', oSize: 0 }"
        @checkbox-change="selectChangeEvent"
      >
        <vxe-column
          type="checkbox"
          title="机构名称"
          width="400"
          tree-node
          field="orgName"
        ></vxe-column>
        <vxe-column :field="fullNameFiled" title="机构全称"></vxe-column>
        <vxe-column field="orgCode" title="机构编码"></vxe-column>
        <vxe-column field="isAdmin" title="是否已分配">
          <template #default="{ row }">
            <span
              :style="{
                color: row.isAdmin ? '#12B35D' : '#FC3737',
              }"
            >
              {{ (row.isAdmin && "是") || "否" }}
            </span>
          </template>
        </vxe-column>
      </vxe-table>
      <template v-else>
        <vxe-table
          ref="sTable"
          :height="458"
          resizable
          :key="visible"
          :data="searchData"
          row-id="id"
          :tree-config="{}"
          :loading="loading"
          :checkbox-config="{
            labelField: 'orgName',
            checkMethod: ({ row }) => !row.disabled,
          }"
          :scroll-y="{
            gt: 100,
            enabled: true,
            mode: 'wheel',
            oSize: 0,
          }"
          @checkbox-change="handleSearchSelectChangeEvent"
        >
          <vxe-column
            type="checkbox"
            title="机构名称"
            width="400"
            field="orgName"
          ></vxe-column>
          <vxe-column :field="fullNameFiled" title="机构全称"></vxe-column>
          <vxe-column field="orgCode" title="机构编码"></vxe-column>
          <vxe-column field="isAdmin" title="是否已分配">
            <template #default="{ row }">
              <span
                :style="{
                  color: row.isAdmin ? '#12B35D' : '#FC3737',
                }"
              >
                {{ (row.isAdmin && "是") || "否" }}
              </span>
            </template>
          </vxe-column>
        </vxe-table>
      </template>
    </div>
    <div class="footer pt-12">
      <template v-if="!haseConfirmPage">
        <el-button @click="updateVis(false)" size="mini">取消</el-button>
        <el-button @click="handleComfirm" size="mini" type="primary"
          >保存</el-button
        >
      </template>
      <template v-else>
        <el-button size="mini" @click="updateVis(false)">关闭</el-button>
        <el-button size="mini" @click="handleComfirm" type="primary"
          >保存</el-button
        >
      </template>
    </div>
    <template v-if="haseConfirmPage">
      <el-dialog
        width="1100px"
        title="分配机构管理权限"
        :visible.sync="innerVisible"
        append-to-body
      >
        <InstitutionManagementInnerDialogContent
          :addList="addList"
          :deleteList="deleteList"
          :visible="innerVisible"
        />
        <div slot="footer" class="dialog-footer">
          <el-button
            :loading="saveLoading"
            @click="handleComfirm"
            size="mini"
            type="primary"
            :disabled="innerSaveBtnDisabled"
            >保存</el-button
          >
          <el-button size="mini" @click="() => (innerVisible = false)"
            >上一步</el-button
          >
        </div>
      </el-dialog>
    </template>
  </basic-dialog>
</template>

<script>
import {
  get,
  uniqBy,
  xorWith,
  intersectionBy,
  pullAllBy,
  differenceBy,
  find,
} from "lodash";
import Vue from "vue";
import VXETable from "vxe-table";
import "vxe-table/lib/style.css";
import { mapState } from "vuex";
import "xe-utils";
import axios from "axios";
import EntityDialog from "@/mixins/entityDialog";
import webPageMixins from "../../mixins/webPage";
import InstitutionManagementInnerDialogContent from "./InstitutionManagementInnerDialogContent.vue";
function deleteChild(rows) {
  const list = [];
  rows.forEach((item) => {
    if (item.parentId) {
      const parentItem = rows.find((pItem) => pItem.id == item.parentId);
      if (parentItem) {
        item.delete = true;
        item.children = [];
      } else {
        list.push(item);
      }
    } else {
      list.push(item);
    }
  });
  return list.filter((item) => !item.delete);
}
function deleteFilterCallback(item, row) {
  const rowParentIdList = (row.parentIds || "")
    .split(",")
    .filter((i) => i)
    .map((i) => +i);
  const parentIdList = (item.parentIds || "")
    .split(",")
    .filter((i) => i)
    .map((i) => +i);
  // 删除当前元素，如果是父节点，删除其所有子节点：
  const includeChild = (parentIdList || []).includes(+row.id);
  // 当前元素如果为子节点，删除其父节点： 找到父节点
  const includeParent = rowParentIdList.includes(+item.id);
  if (+item.id !== +row.id && !includeChild && !includeParent) {
    return true;
  } else {
    item.selected = false;
    return false;
  }
}
function findChildren(pItem, treeData) {
  let children = [];
  const loop = (item, tree) => {
    tree.forEach((treeItem) => {
      if (+item.id === +treeItem.id) {
        children = treeItem.children || [];
      } else {
        loop(item, treeItem.children || []);
      }
    });
  };
  loop(pItem, treeData);
  return children;
}
let table, closeDiaTimerOut;
export default {
  name: "InstitutionManagementDialog",
  mixins: [EntityDialog, webPageMixins],
  components: {
    VXETable,
    InstitutionManagementInnerDialogContent,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    diaTitle: {
      type: "",
      default: "",
    },
    getTableData: {
      type: Function,
      require: true,
    },
    getSearchData: {
      type: Function,
      require: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    updateVis: {
      type: Function,
      required: true,
    },
    haseConfirmPage: {
      type: Boolean,
      default: false,
    },
    saveLoading: {
      type: Boolean,
      default: false,
    },
    fullNameFiled: {
      type: String,
      default: "orgFullName",
    },
    itemTenementCode: {
      type: String,
      default: "",
    },
    preSelectedList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      treeData: [],
      selectList: [], // 用户勾选的集合
      selectedAllList: [],
      orgSelectedAllList: [],
      timerOut: null,
      query: {
        // 查询
        orgName: "",
        orgCode: "",
      },
      useSearch: false,
      searchData: [],
      pageInfo: {
        pageIndex: 1,
        pageSize: 10,
        pageTotal: 0,
        total: 0,
      },
      innerVisible: false,
      addList: [],
      deleteList: [],
      orgIds: [],
      useSearchSelectedList: [],
    };
  },
  computed: {
    innerSaveBtnDisabled() {
      return !this.addList.length && !this.deleteList.length;
    },
  },
  watch: {
    visible: {
      immediate: true,
      handler(n) {
        if (n) {
          this.useSearch = false;
          this.selectList = [];
          this.orgSelectedAllList = [];
          this.selectedAllList = [];
          this.query = {
            orgName: "",
            orgCode: "",
          };
          this.$nextTick(() => {
            table = this.$refs.uTable;
          });
          this.updateTableData();
        }
      },
    },
    innerVisible: {
      handler(n) {
        if (!n) {
          this.addList = [];
          this.deleteList = [];
        }
      },
    },
    itemTenementCode: {
      handler(n) {
        console.log("tenementCode", n);
      },
      immediate: true,
    },
  },
  created() {
  },
  methods: {
    updateTableData({ row } = {}) {
      return new Promise((resolve, reject) => {
        this.getTableData(row)
          .then(({ data, total, orgIds = [] }) => {
            this.orgIds = orgIds;
            const selectedList = data.filter((item) => item.selected);
            this.selectList = uniqBy(
              this.selectList.concat(selectedList),
              "id"
            );
            this.orgSelectedAllList = uniqBy(
              this.orgSelectedAllList.concat(selectedList),
              "id"
            );
            this.selectedAllList = deleteChild(
              uniqBy(this.selectedAllList.concat(selectedList), "id")
            );
            this.pageInfo.total = total;
            if (!row) {
              this.treeData = data;
              table.setCheckboxRow(this.selectList, true);
            } else {
              resolve(data);
              row.hasChild = !!total;
              if (row.selected || !table) {
                // 父节点选中，子节点dom状态会默认选中
                return;
              }
              this.timerOut && clearTimeout(this.timerOut);
              this.timerOut = setTimeout(() => {
                const result = [];
                this.selectList.forEach((item) => {
                  result.push(table.getRowById(item.id));
                });
                table.setCheckboxRow(result, true);
                this.timerOut && clearTimeout(this.timerOut);
              }, 0);
            }
          })
          .catch((err) => {
            this.treeData = [];
            reject();
          });
      });
    },
    selectChangeEvent({ $table }) {
      const records = $table.getCheckboxRecords();
      this.selectList = uniqBy(
        this.useSearchSelectedList.concat(records, this.preSelectedList),
        "id"
      );
    },
    handleSearchSelectChangeEvent(option) {
      const { checked, row } = option;
      if (checked) {
        this.selectList = uniqBy(
          this.selectList.concat(row, this.preSelectedList),
          "id"
        );
      } else {
        // 搜索取消勾选进行弹窗，产品给文案，前后端给继承节点，体现在文案中
        if (!this.orgIds.includes(row.id)) {
          this.getOrgById(row).then((data) => {
            if (data) {
              this.$message({
                type: "warning",
                message: `当前节点权限为继承方式获得，请先取消勾选${data.orgName}节点后，再重新选择所需节点`,
              });
              closeDiaTimerOut = setTimeout(() => {
                this.updateVis(false);
                clearTimeout(closeDiaTimerOut);
              }, 8000);
            }
          });
          return;
        }
        this.selectList = uniqBy(
          this.selectList.concat(this.preSelectedList),
          "id"
        ).filter((item) => deleteFilterCallback(item, row));
      }
      this.useSearchSelectedList = this.selectList;
    },
    handleComfirm() {
      if (!this.haseConfirmPage || this.innerVisible) {
        this.orgSelectedAllList = this.selectList;
        this.selectedAllList = deleteChild(this.selectList);
        this.$emit("selectConfirm", {
          selectedAllList: this.selectedAllList,
          orgSelectedAllList: this.orgSelectedAllList,
          selectList: this.selectList,
          addList: this.addList,
          deleteList: this.deleteList,
        });
        this.updateVis(false);
        this.innerVisible = false;
        return;
      }
      this.computeAddAndDeleteList();
      this.innerVisible = true;
    },
    deleteItem(row) {
      this.selectedAllList = this.selectedAllList.filter((item) => {
        return +item.id !== +row.id;
      });
      this.orgSelectedAllList = this.orgSelectedAllList.filter((item) => {
        return deleteFilterCallback(item, row);
      });
      return {
        selectedAllList: this.selectedAllList,
        orgSelectedAllList: this.orgSelectedAllList,
      };
    },
    handleSearch() {
      this.useSearch = true;
      this.useSearchSelectedList = [];
      this.getSearchData({
        query: this.query,
        pageInfo: this.pageInfo,
      }).then(({ data, pageInfo, orgIds = [] }) => {
        this.orgIds = orgIds;
        this.searchData = data;
        this.pageInfo = Object.assign({}, pageInfo, {
          total: pageInfo.rowTotal,
        });
        const resultArray = [];
        (data || []).forEach((item) => {
          item.selected && resultArray.push(item);
        });
        // 更改代码
        this.orgSelectedAllList = uniqBy(
          this.orgSelectedAllList.concat(resultArray),
          "id"
        );
        this.$refs.sTable.setCheckboxRow(resultArray, true);
      });
    },
    pageIndexChange(index) {
      this.pageInfo.pageIndex = index;
      this.handleSearch();
    },
    pageSizeChange(size) {
      this.pageInfo.pageSize = size;
      this.pageInfo.pageIndex = 1;
      this.handleSearch();
    },
    handleReset() {
      this.useSearch = false;
      this.searchData = [];
      this.pageInfo.pageIndex = 1;
      this.query = {
        orgName: "",
        orgCode: "",
      };
      this.updateTableData();
    },
    computeAddAndDeleteList() {
      /**
       * 1.新增：若所有子集都选中，则新增元素为父节点
       * 2.取消：若父级全选，去掉一个子集，则取消节点为父级，新增为剩余选中其他子节点（剩余节点需添加）
       */
      // 新增：orgSelectedAllList没有，selectedList有
      // 删除：orgSelectedAllList有，selectedList没有
      const orgDeleteList = differenceBy(
        this.orgSelectedAllList,
        this.selectList,
        "id"
      ).map((item) => {
        item.delete = false;
        return item;
      });
      const orgAddList = differenceBy(
        this.selectList,
        this.orgSelectedAllList,
        "id"
      ).map((item) => {
        item.delete = false;
        return item;
      });
      this.deleteList = deleteChild(orgDeleteList);
      let deleteAddList = [];
      orgDeleteList.forEach((item) => {
        findChildren(item, this.treeData).forEach((cItem) => {
          if (this.selectList.find((sItem) => +sItem.id === +cItem.id)) {
            deleteAddList = uniqBy(deleteAddList.concat(cItem), "id");
          }
        });
      });
      this.addList = deleteChild(
        uniqBy(orgAddList.concat(deleteAddList), "id").map((item) => {
          item.delete = false;
          return item;
        })
      );
    },
    computeNoSaveSelectStatus(item) {
      const parentIdList = (item.parentIds || "")
        .split(",")
        .filter((item) => item)
        .concat(item.id);
      return (
        this.selectList.filter((sItem) => {
          return parentIdList.filter((pId) => +pId === +sItem.id).length > 0;
        }).length > 0
      );
    },
    getOrgById(row) {
      return new Promise((resolve) => {
        axios({
          method: "post",
          url: "/org/getOrgById",
          data: {
            data: {
              tenementCode: this.itemTenementCode,
              id: row.id,
            },
          },
          params: {
            tenementCode: this.itemTenementCode,
          },
        })
          .then((response) => {
            const { code, msg, data } = response.data || {};
            if (+code === 200) {
              resolve(data);
            } else {
              this.$message.error({ message: msg });
            }
          })
          .catch((err) => {
            this.$message.error({ message: err });
          });
      });
    },
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
      top: 0.25em;
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
      transform: translate(-50%, -50%);
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
      transform: translate(-50%, -50%) rotate(45deg);
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
        top: 0.25em;
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
        transform: translate(-50%, -50%) rotate(45deg);
      }
    }
  }

  /deep/ .vxe-table--body {
    transform: translateY(0);
    transition: margin-top 0ms;
  }
}
.entity-dlg__block-bd.formFix .col-r {
  float: right;
  position: relative;
  padding: 0 12px 0 25px;
}
.vxe-table-toolbar-pagination {
  border: 1px solid #e8ecef;
  border-bottom: none;
  background: #fcfcfc;
  display: flex;
  justify-content: flex-end;
  padding: 8px 0;
}
</style>
