<template>
  <div class="basic-list" v-loading="loading">
    <div class="basic-list__hd f-cb" v-if="showHead">
      <div class="basic-list__hd-col--l f-fl">
        <slot name="hd-col--l"></slot>
      </div>
      <div class="basic-list__hd-col--r f-fr">
        <el-pagination
          v-if="showPage && list.length"
          :current-page="pageIndexBase + 1"
          :page-size="pageSize"
          :page-sizes="pageSizes"
          :total="total"
          layout="total, sizes, prev, jumper, slot, next "
          @current-change="pageIndexChange"
          @size-change="pageSizeChange"
        >
          <span class="page-count"> / {{ pageCount }}</span>
        </el-pagination>
        <a
          class="el-icon-setting basic-list__field-set-btn"
          @click="updateColSetDlgVis(true)"
          v-if="showColSet"
        ></a>
        <!--兼容老代码-->
        <a
          class="el-icon-setting basic-list__field-set-btn"
          @click="extDlgVis"
          v-if="showExtSet"
        ></a>
        <!--封装 组件内置-->
        <a
          class="el-icon-setting basic-list__field-set-btn"
          @click="updateExtendSetDlgVis(true)"
          v-if="showExtendSet"
        ></a>
      </div>
    </div>
    <el-form :disabled="isTabDisabel">
      <u-table
        use-virtual
        border
        ref="table"
        size="mini"
        :lazy="lazy"
        :load="load"
        :stripe="stripe"
        :row-id="rowKey"
        :height="tableH"
        :row-height="40"
        :tree-config="treeConfig"
        :indent="indent"
        :record-table-select="true"
        :show-body-overflow="true"
        :show-header-overflow="true"
        @selection-change="selectionChange"
        @select="handleSelect"
        @row-click="rowClick"
        :class="{ single_mult: selectType === 'singleMult' }"
        style="width: 100%"
      >
        <div slot="empty">
          <img src="../../imgs/empty.png" alt="" />
        </div>
        <!--多选-->
        <u-table-column
          align="center"
          type="selection"
          :width="50"
          :selectable="selectable"
          disabled="true"
          v-if="
            showSelectCol &&
            (selectType === 'multiple' || selectType === 'singleMult')
          "
        />
        <!--单选-->
        <u-table-column
          align="center"
          fixed="left"
          :width="50"
          v-if="showSelectCol && selectType === 'single'"
        >
          <template slot-scope="scope">
            <el-radio v-model="radioIndex" :label="scope.$index"
              >&nbsp;
            </el-radio>
          </template>
        </u-table-column>
        <!--序号-->
        <u-table-column
          align="center"
          type="index"
          :width="indexColWidth"
          fixed="left"
          :label="indexColLabel"
          :index="getIndex"
          v-if="showIndexCol"
        />
        <u-table-column
          align="center"
          class-name="basic-list__col--action"
          v-if="showActionCol"
          :fixed="actionColFixed"
          :width="actionColWidth"
          :label="actionColLabel"
        >
          <template slot-scope="scope">
            <u-table-column
              v-if="isActionRender"
              :index="scope.$index"
              :row="scope.row"
              :col="scope.column"
              :render="actionRender"
            />
            <slot name="action" :row="scope.row" v-else></slot>
          </template>
        </u-table-column>
        <template v-for="(item, index) of colFields">
          <u-table-column
            v-if="!item.render && !item.hidden"
            :tree-node="index === 0"
            :key="`${item.key}-${index}`"
            :class-name="item.classNames ? item.classNames.join(' ') : null"
            :prop="item.key"
            :label="item.name"
            :align="item.align || 'center'"
            :width="item.width ? item.width + 'px' : undefined"
            :min-width="item.minWidth ? item.minWidth + 'px' : '120px'"
            :render-header="item.hdRender"
            :formatter="item.formatter"
          >
          </u-table-column>
          <u-table-column
            v-else-if="!item.hidden"
            :tree-node="index === 0"
            :key="`${item.key}-${index}`"
            :class-name="item.classNames ? item.classNames.join(' ') : null"
            :prop="item.key"
            :label="item.name"
            :align="item.align || 'center'"
            :width="item.width ? item.width + 'px' : undefined"
            :min-width="item.minWidth ? item.minWidth + 'px' : '120px'"
            :render-header="item.hdRender"
          >
            <template slot-scope="scope">
              <table-column
                :index="scope.$index"
                :row="scope.row"
                :col="scope.column"
                :field="item"
                :render="item.render"
              />
            </template>
          </u-table-column>
        </template>
      </u-table>
    </el-form>
    <column-set-dlg
      :visible="colSetDlgVis"
      :update-vis="updateColSetDlgVis"
      :val-fields="colFields"
      :all-fields="fields"
      :handle-save="handleSaveColSet"
    />
    <extend-set-dlg
      :visible="extendSetDlgVis"
      :update-vis="updateExtendSetDlgVis"
      :fields="extendFields"
      :list="extendList"
      :handle-save="handleSaveExtendSet"
    />
  </div>
</template>

<script>
import TableColumn from "@/components/tableColumn";
import ColumnSetDlg from "./columnSetDlg";
import ExtendSetDlg from "./components/extendFieldSetDlg";

const DEFAULTS = {
  radioIndex: null,
};

export default {
  components: {
    TableColumn,
    ColumnSetDlg,
    ExtendSetDlg,
  },
  props: {
    stripe: {
      type: Boolean,
      default: true,
    },
    indent: {
      type: Number,
      default: 15,
    },
    tableH: {
      type: Number,
    },
    // 表格唯一code码
    tableCode: {
      type: String,
    },
    // 表格所有字段
    fields: {
      type: Array,
      default() {
        return [];
      },
    },
    isActionRender: {
      type: Boolean,
      default: true,
    },
    //是否显示索引列
    showIndexCol: {
      type: Boolean,
      default: true,
    },
    // 索引列宽度
    indexColWidth: {
      type: Number,
      default: 55,
    },
    // 索引列Label
    indexColLabel: {
      type: String,
      default: "序号",
    },
    // 是否显示选择列
    showSelectCol: {
      type: Boolean,
      default: false,
    },
    // 选择类型(单选|多选)
    selectType: {
      type: String,
      default: "multiple",
    },
    selectable: {
      type: Function,
      default: (row, index) => {
        if (row && row.disabled) {
          return false;
        } else {
          return true;
        }
      },
    },
    // 是否显示操作列
    showActionCol: {
      type: Boolean,
      default: true,
    },
    // 索引列是否固定
    actionColFixed: {
      type: [Boolean, String],
      default: "right",
    },
    // 操作列宽度
    actionColWidth: {
      type: Number,
      default: 100,
    },
    // 操作列Label
    actionColLabel: {
      type: String,
      default: "操作",
    },
    // 操作列渲染函数
    actionRender: {
      type: Function,
      default: () => {},
    },
    // 树形列表是否懒加载
    lazy: {
      type: Boolean,
      default: false,
    },
    // 懒加载调用函数
    load: Function,
    loading: {
      type: Boolean,
      default: false,
    },
    showHead: {
      type: Boolean,
      default: true,
    },
    showPage: {
      type: Boolean,
      default: true,
    },
    pageIndex: {
      type: Number,
      default: 0,
    },
    pageSize: {
      type: Number,
      default: 10,
    },
    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 50, 100, 200, 300, 500];
      },
    },
    total: {
      type: Number,
      default: 0,
    },
    list: {
      type: Array,
      default() {
        return [];
      },
    },
    rowKey: {
      type: [String, Function],
      default() {
        return "id";
      },
    },
    treeConfig: {
      type: Object,
      default(value) {
        const children = "children";
        const hasChildren = "hasChildren";
        const iconClose = "el-icon-arrow-right";
        const iconOpen = "el-icon-arrow-down";
        const treeConfig = Object.assign(
          {
            children,
            hasChildren,
            iconClose,
            iconOpen,
          },
          value instanceof Object ? value : {}
        );
        return treeConfig;
      },
    },
    pageIndexChange: {
      type: Function,
      default: () => {},
    },
    pageSizeChange: {
      type: Function,
      default: () => {},
    },
    selectionChange: {
      type: Function,
      default: () => {},
    },
    select: {
      type: Function,
      default: () => {},
    },
    handleRowClick: {
      type: Function,
      default: () => {},
    },
    // 是否显示列
    showColSet: {
      type: Boolean,
      default: false,
    },
    useRowClick: {
      type: Boolean,
      default: true,
    },
    isTabDisabel: {
      type: Boolean,
      default: false,
    },
    showExtSet: {
      type: Boolean,
      default: false,
    },
    extDlgVis: {
      type: Function,
      default: () => {},
    },
    showExtendSet: {
      type: Boolean,
      default: false,
    },
    extendFields: {
      type: Array,
      default() {
        return [];
      },
    },
    extendList: {
      type: Array,
      default() {
        return [];
      },
    },
    // 扩展字段设置保存
    handleSaveExtendSet: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      ..._.cloneDeep(DEFAULTS),
      // 列设置弹窗是否可见
      colSetDlgVis: false,
      // 列设置是否已经保存过
      colSetSaved: false,
      //  扩展字段设置弹窗是否可见
      extendSetDlgVis: false,
      empty: "111",
    };
  },
  computed: {
    pageCount() {
      return Math.ceil(this.total / this.pageSize);
    },
    // 显示的列字段
    colFields() {
      return this.fields;
    },
    colList() {
      return this.list;
    },
    pageIndexBase() {
      return this.pageIndex;
    },
  },
  watch: {
    async list(newVal) {
      const tableData = [...newVal];
      const getTreeExpandRecords = this.$refs.table.getTreeExpandRecords();
      const getCheckboxRecords = this.$refs.table.getCheckboxRecords();
      this.$refs.table.clearTreeExpand();
      await this.$refs.table.reloadData(tableData);
      this.$nextTick(() => {
        getTreeExpandRecords.forEach((item) => {
          this.$refs.table.setTreeExpansion(item, true);
        });
      });
      if (getCheckboxRecords && getCheckboxRecords.length > 0) {
        this.$nextTick(() => {
          getCheckboxRecords.forEach((item) => {
            this.$refs.table.setTreeExpansion(item, true);
          });
        });
      }
    },
    treeConfig: {
      immediate: true,
      handler(newVal) {
        const { expandRowKeys } = newVal;
        if (expandRowKeys && expandRowKeys.length > 0) {
          const getUTreeData = this.$refs.table.getUTreeData();
          this.$nextTick(() => {
            expandRowKeys.forEach((expandId) => {
              getUTreeData.some((item) => {
                const { id } = item;
                if (id === expandId) {
                  this.$refs.table.setTreeExpansion(item, true);
                  return true;
                }
              });
            });
          });
        }
      },
    },
    radioIndex(newVal) {
      if (newVal !== null || newVal !== undefined) {
        this.selectionChange([this.list[newVal]], newVal);
      } else {
        this.selectionChange([]);
      }
    },
  },
  created() {
    // 查询列设置查询 暂时隐藏-因为没有相关接口导致报错
    if (this.showHead && this.showColSet) {
      // this.queryColSet()
    }
  },
  methods: {
    getIndex(index) {
      return this.pageIndexBase * this.pageSize + index + 1;
    },
    // 点击该行触发
    rowClick(row = {}, col) {
      // 当前行角标
      let _lineIndex = null;
      if (!this.useRowClick) return;
      if (col && col.className === "edit-col") {
        return;
      }
      const table = this.$refs.table;
      let selected = false;
      if (this.showSelectCol) {
        if (this.selectType === "multiple") {
          table.toggleRowSelection([{ row }]);
          const selection = table.selection;
          for (let i = 0, len = selection.length; i < len; i++) {
            if (selection[i] === row) {
              selected = true;
              break;
            }
          }
        } else if (this.selectType === "singleMult") {
          if (!this.selectable(row)) {
            return;
          }
          const table = this.$refs.table;
          const selection = table.selection;
          if (selection && selection.length >= 1) {
            selection.forEach((item) => {
              if (item.id !== row.id) {
                item._isSelected = false;
              }
            });
            selection.shift();
            table.clearSelection();
            if (!row._isSelected) {
              table.toggleRowSelection([{ row }]);
              row._isSelected = true;
              this.selectionChange([row]);
            } else {
              row._isSelected = false;
              this.selectionChange([]);
            }
          } else {
            table.toggleRowSelection([{ row }]);
            row._isSelected = true;
            this.selectionChange([row]);
          }
        } else if (this.selectType === "single") {
          const list = this.list;
          for (let i = 0, len = this.list.length; i < len; i++) {
            if (list[i] === row) {
              _lineIndex = i;
              if (i === this.radioIndex) {
                this.radioIndex = i;
                selected = true;
              } else {
                this.radioIndex = null;
              }
              break;
            }
          }
        }
      }
      this.handleRowClick(row, _lineIndex, selected);
    },
    // 另类单选框
    handleSelect(rows, row) {
      if (this.selectType !== "singleMult") return;
      if (rows.length > 1) {
        const table = this.$refs.table;
        rows.shift();
        table.clearSelection();
        // 区别于el这里入参是一个数组
        table.toggleRowSelection([{ row }]);
      }
      // this.select(rows, row)
    },
    updateData(arg) {
      Object.assign(this, arg);
    },
    resetData(arg) {
      if (_.isEmpty(arg) || _.isObject(arg)) {
        Object.assign(this, { ..._.cloneDeep(DEFAULTS), ...(arg || {}) });
      } else if (_.isObject(arg)) {
        Object.assign(this, arg);
      } else if (_.isArray(arg)) {
        for (let i = 0; i < arg.length; i++) {
          this[arg[i]] = _.cloneDeep(DEFAULTS[arg[i]]);
        }
      } else if (_.isString(arg)) {
        this[arg] = _.cloneDeep(DEFAULTS[arg]);
      }
    },
    updateColSetDlgVis(vis) {
      this.colSetDlgVis = vis;
    },
    handleSaveColSet({ valFields, done }) {
      const cols = [];
      for (let i = 0, len = valFields.length; i < len; i++) {
        cols.push({
          paramNo: valFields[i].key,
          paramName: valFields[i].name,
          paramSeq: i + 1,
        });
      }
      if (!cols.length) {
        this.$message.error("请至少保留一个显示字段");
      }
      if (!this.tableCode) {
        return;
      }
      const saveFn = this.colSetSaved
        ? api.component.updateCustomColumn
        : api.component.addCustomColumn;
      saveFn({
        data: {
          tableCode: this.tableCode + "|col",
          customRowParamList: cols,
        },
      }).then(({ code, msg }) => {
        if (code === 200) {
          this.colFields = valFields;
          this.$nextTick(function () {
            this.$refs.table.doLayout();
          });
          done && done();
        } else {
          this.$message.error(msg);
        }
      });
    },
    queryColSet() {
      api.component
        .queryCustomColumnDetail({ data: this.tableCode + "|col" })
        .then(({ code, msg, data }) => {
          if (code === 200 && data.length) {
            this.colSetSaved = true;
            const colFields = [];
            data.forEach((item) => {
              colFields.push({ key: item.paramNo, name: item.paramName });
            });
            this.colFields = colFields;
          }
        });
    },
    updateExtendSetDlgVis(vis) {
      this.extendSetDlgVis = vis;
      // this.extDlgVis(true)
    },
  },
};
</script>

<style lang="scss" scoped>
.basic-list {
  /deep/ .cell {
    .el-radio__label {
      display: none;
    }
  }

  /deep/ .single_mult thead tr .el-checkbox__input {
    display: none;
  }
}

.basic-list__hd {
  padding: 15px 10px;
  height: 28px;
  line-height: 28px;
  border: 1px solid #e8ecef;
  border-bottom: none;
  background: #fcfcfc;

  .el-dropdown:not(:first-child) {
    margin-left: 10px;
  }
}

.basic-list__sel-field-btn {
  margin-left: 12px;
  vertical-align: middle;
  color: #606266;
  cursor: pointer;
}

.el-pagination {
  display: inline-block;
  font-size: 12px;

  /deep/ .el-select .el-input {
    width: 60px;
  }

  /deep/ .el-pagination__jump {
    margin-left: 0;
  }

  /deep/ .page-count {
    min-width: auto;
    font-weight: normal;
    color: #606266;
  }
}

/deep/ .tree--btn-wrapper {
  color: #666 !important;
  i {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 12px;
  }
}
</style>
