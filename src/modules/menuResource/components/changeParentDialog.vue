<template>
  <basic-dialog
    :visible="visible"
    title="变更资源父节点"
    :width="720"
    :update-vis="updateVis"
    :handle-close="handleClose"
    :handle-closed="handleClosed"
    :handle-ok="handleOk"
  >
    <div class="basic-search basic-search--small">
      <el-tree
        :loading="state.subEntity.loading"
        show-checkbox
        default-expand-all
        check-strictly
        node-key="id"
        ref="tree"
        highlight-current
        check-on-click-node
        :data="ownList"
        @check-change="handleCheckChange"
        :props="prop"
      >
      </el-tree>
    </div>
  </basic-dialog>
</template>

<script>
import EntityDialog from "@/mixins/entityDialog";
export default {
  mixins: [EntityDialog],
  computed: {
    getDefaultExt() {
      if (this.ownList && this.ownList[0]) {
        return [this.ownList[0].id];
      }
    },
  },
  props: {
    state: {
      type: Object,
      default() {
        return {};
      },
    },
    tenementInfoObj: Object,
    list: {},
    pastId: {},
    pastParent: {},
    currentRow: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  watch: {
    visible(vis) {
      if (vis === true) {
        this.ownList = _.cloneDeep(this.state.list);
        // this.ownList = this.addAttr(this.ownList);
        this.addAttr(this.ownList);
      }
    },
  },
  data() {
    return {
      ownList: [],
      prop: {
        children: "children",
        label: "resourceName",
      },
    };
  },
  methods: {
    addAttr(data) {
      data.forEach((item) => {
        if (item.id === this.pastParent) {
          item.disabled = true;
          if (item.children && item.children.length !== 0) {
            this.addAttr(item.children);
          }
        } else if (item.id === this.pastId) {
          item.disabled = true;
          if (item.children && item.children.length !== 0) {
            this.addAttrAll(item.children);
          }
        } else {
          item.disabled = false;
          if (item.children && item.children.length !== 0) {
            this.addAttr(item.children);
          }
        }
      });
      // return data;
    },
    addAttrAll(data) {
      data.forEach((item) => {
        item.disabled = true;
        if (item.children && item.children.length !== 0) {
          this.addAttrAll(item.children);
        }
      });
      // return data;
    },
    handleCheckChange(data = {}, checked, indeterminate) {
      if (checked) {
        this.$refs.tree.setCheckedNodes([data]);
      }
    },
    handleClose() {
      this.updateVis(false);
    },
    handleClosed() {
      this.updateState("entity");
      if (this.$refs.form) {
        this.$nextTick(() => {
          this.$refs.form.clearValidate();
        });
      }
    },
    handleOk() {
      let newIdData = this.$refs.tree.getCheckedNodes();
      if (newIdData.length < 1) {
        this.$message.error("请选择父节点");
      } else {
        this.$confirm(
          "该资源已关联菜单角色，变更后未关联角色的父资源将一并关联，是否继续？",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        )
          .then(() => {
            let newId = newIdData[0].id;
            api.menuResource
              .changeMenuResource({
                data: {
                  tenementCode: this.tenementInfoObj.tenementCode,
                  appCode: this.$store.state.menuResource.appCode,
                  id: this.pastId,
                  destinationId: newId,
                },
              })
              .then((resolve) => {
                if (resolve.code === 200) {
                  this.$message.success("操作成功");
                  this.updateVis(false);
                  this.$emit("UPDATE_LIST");
                } else {
                  this.$message.error(resolve.msg);
                }
              })
              .catch((reject) => {
                console.log("changeMenuResource 请求失败", reject);
              });
          })
          .catch(() => {});
      }

      // this.updateVis(false);
      // this.$emit("UPDATE_LIST");
    },
  },
};
</script>
<style lang="scss" scoped>
.basic-search {
  padding: 10px 0 0;
  .basic-search__bd {
    display: flex;
    .col-l {
      flex: 1;
      .el-form {
        display: flex;
        flex-wrap: wrap;
      }
      /deep/ .el-form-item {
        padding-right: 15px;
        box-sizing: border-box;
      }
    }
    .col-r {
      position: relative;
      padding: 0 0 0 25px;
      width: 162px;
      .el-button {
        width: 75px;
      }
    }
  }
}
.basic-search--small {
  /deep/ .el-form-item__label {
    font-weight: 500;
  }
}
.el-tree-node__label {
  margin-left: 10px;
}
</style>
