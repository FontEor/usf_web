<template>
  <!-- 分配菜单资源管理权限 -->
  <basic-dialog
    :visible="visible"
    :title="buttonData('glqsqfpcdglqx').name"
    :width="720"
    :update-vis="updateVis"
    :handle-close="handleClose"
    :handle-closed="handleClosed"
    :handle-ok="handleOk"
    :isShowFooterAll="false"
    class="changeHeight"
  >
    <el-form
      ref="form"
      size="small"
      label-position="center"
      label-width="90px"
      :model="dto"
      :rules="rules"
      node-key="id"
      class="parent"
    >
      <el-row :gutter="12">
        <el-col :span="12">
          <el-form-item label="软件系统" prop="appCode">
            <el-select v-model="dto.appCode" @change="this.handelChange">
              <el-option
                v-for="item in softSelect"
                :key="item.appCode"
                :value="item.appCode"
                :label="item.appName"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <div class="entity-dlg__block-bd">
        <u-table
          use-virtual
          border
          class="umy-table"
          ref="umyTable"
          size="mini"
          style="width: 100%; margin-bottom: 8px"
          row-id="id"
          row-key="id"
          :show-body-overflow="true"
          :show-header-overflow="true"
          :big-data-checkbox="true"
          :height="360"
          :row-height="40"
          :tree-config="treeConfig"
          :record-table-select="true"
          @select="select"
          @select-all="selectAll"
          @toggle-tree-expand="toggleTreeExpand"
        >
          <u-table-column type="selection" width="40"></u-table-column>
          <u-table-column
            :tree-node="true"
            prop="resourceName"
            label="资源名称"
          ></u-table-column>
        </u-table>
      </div>
    </el-form>
    <div class="footer" v-if="action != 'view'">
      <el-button @click="handleClose" size="mini">关闭</el-button>
      <el-button @click="handelClick" size="mini" type="primary"
        >保存</el-button
      >
    </div>
    <div class="footer" v-else>
      <el-button @click="handleClose" size="mini">关闭</el-button>
    </div>
  </basic-dialog>
</template>

<script>
import EntityDialog from "@/mixins/entityDialog";
import ExactList from "@/mixins/exactList";

import { mapState } from "vuex";

export default {
  mixins: [EntityDialog, ExactList],
  props: {
    action: {
      type: String,
      default: "add",
    },
    state: {
      type: Object,
      default: {},
    },
    queryList: {
      type: Function,
      default: () => {},
    },
    roleListId: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      rules: {
        appCode: [{ required: true, message: "请选择软件系统" }],
      },
      defaultProps: {
        children: "children",
        label: "label",
      },
      softSelect: [],
      dto: {
        appCode: undefined,
      },
      treeList2: [],
      ids2: [],
      selectionList: [],
      treeConfig: {
        children: "children",
        iconClose: "el-icon-arrow-right",
        iconOpen: "el-icon-arrow-down",
        expandAll: true,
      },
    };
  },
  computed: {
    ...mapState("app", ["tenementInfoObj"]),
  },
  watch: {
    tenementInfoObj: {
      deep: true,
      immediate: false,
      handler: function (newVal) {
        newVal.isLoad && this.handelChange();
      },
    },
    visible(newVal) {
      if (newVal) {
        //queryAppList  上来先获取软件系统的下来   并且传给seacher组件
        api.rolePermissions
          .queryAppList({ tenementCode: this.tenementInfoObj.tenementCode })
          .then(({ code, data, message }) => {
            if (code == 200) {
              this.softSelect = data;
              this.dto.appCode = data[0].appCode;
              this.handelChange();
            }
          });
      } else {
        this.dto.appCode = undefined;
        this.selectionList = [];
      }
    },
  },
  methods: {
    selectAll(selection) {
      this.selectionList = selection;
    },
    flatChildrenOfRows(rows) {
      return rows.reduce((flattened, item) => {
        const { children } = item;
        return flattened.concat(
          [item],
          children && children.length > 0
            ? this.flatChildrenOfRows(children)
            : []
        );
      }, []);
    },
    flatParentsOfRows(row, flattenedTreeData) {
      const { parentId } = row;
      return parentId
        ? flattenedTreeData.reduce((acc, item) => {
            const { id } = item;
            return id === parentId
              ? acc.concat(
                  [item],
                  this.flatParentsOfRows(item, flattenedTreeData)
                )
              : acc.concat([]);
          }, [])
        : [row];
    },
    select(selection, row) {
      // 判断当前操作是勾选还是取消勾选
      const selected = this.$refs.umyTable
        .getCheckboxRecords()
        .some((item) => item === row);
      // 勾选父节点时，会勾选其全部子节点；取消勾选父节点时，会取消勾选其全部子节点
      // 将父节点及其子节点的数组拍平以便整体勾选及取消勾选
      const flattenedChildren = this.flatChildrenOfRows([row]);
      this.$refs.umyTable.partRowSelections(flattenedChildren, selected);
      // 勾选子节点时，会勾选其父节点；取消勾选子节点时，不会影响其父节点
      if (selected) {
        const treeData = this.$refs.umyTable.getUTreeData();
        const flattenedTreeData = this.flatChildrenOfRows(treeData);
        const flattenedParents = this.flatParentsOfRows(row, flattenedTreeData);
        this.$refs.umyTable.partRowSelections(flattenedParents, selected);
      }
      // 保存当前勾选节点
      this.selectionList = this.$refs.umyTable.getCheckboxRecords();
    },
    // 展开收起虚拟表格时候勾选已选节点
    toggleTreeExpand(row, treeExpanded, event) {
      this.$refs.umyTable.partRowSelections(this.selectionList, true);
    },
    //点击确认的事件
    handelClick() {
      if (!this.$refs.form) {
        return;
      }
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return;
        } else {
          const resourceIdList = this.selectionList.map((item) => item.id);
          //获取所有id
          const allDataIdList = this.flatChildrenOfRows(this.treeList2).map(
            (item) => item.id
          );
          //还要判断是否通过验证
          api.administrators
            .Cresource({
              data: {
                appCode: this.dto.appCode,
                tenementCode: this.tenementInfoObj.tenementCode,
                id: this.roleListId,
                resourceIdList,
                allDataIdList,
              },
            })
            .then(({ code, data, msg }) => {
              if (code == 200) {
                // this.updateVis(false)
                this.handleClose();
                return this.$message.success(msg);
              } else {
                return this.$message.error(msg);
              }
            });
        }
      });
    },

    //下拉的发请求    的回调函数
    handelChange() {
      this.dto.tenementCode = this.tenementInfoObj.tenementCode;
      api.administrators
        .Tlist({
          data: { userId: this.roleListId, ...this.dto },

          page: {
            pageIndex: 1,
            pageSize: 10,
          },
        })
        .then(({ code, data, message }) => {
          if (code == 200) {
            this.treeList2 = tools.dataToTree(data.datas);

            //获取所有父节点
            let newArr = [];
            function toArr(arr) {
              arr.forEach((item, index) => {
                if (item.children && item.children.length > 0) {
                  newArr.push(item.id);
                  toArr(item.children);
                }
              });
            }
            toArr(this.treeList2);
            // var pIds = newArr;
            // let relleyIds = _.difference(data.selectList, pIds);
            this.ids2 = data.selectList;
            this.$nextTick(async () => {
              // 加载虚拟表格数据
              await this.$refs.umyTable.reloadData(this.treeList2 || []);
              // 根据ids勾选虚拟表格
              if (this.ids2 && this.ids2.length > 0) {
                const rows = this.$refs.umyTable
                  .getUTreeData()
                  .filter((item) => {
                    return this.ids2.includes(item.id);
                  });
                this.$refs.umyTable.partRowSelections(rows, true);
              }
              this.selectionList = this.$refs.umyTable.getCheckboxRecords();
            });
          }
        });
    },

    handleClose() {
      this.$refs.form.resetFields();
      this.updateVis(false);
      //清空树
      this.treeList2 = [];
    },
  },
  beforeCreate() {
    this.allFields = ["roleName", "roleCode"];
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
</style>
