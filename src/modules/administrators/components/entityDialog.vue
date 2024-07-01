<template>
  <!--分配机构管理权限页面-->
  <basic-dialog
    :visible="visible"
    :title="buttonData('glysqfpjgglqx').name"
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
      @submit.native.prevent
      class="parent"
    >
      <div class="entity-dlg__block-bd">
        <div class="left">
          <el-tree
            :data="state.listTree"
            show-checkbox
            node-key="id"
            :default-expanded-keys="getDefaultExt"
            :default-checked-keys="ids"
            ref="tree"
            :check-strictly="true"
            highlight-current
            :props="{ children: 'children', label: 'orgName' }"
          ></el-tree>
        </div>
      </div>
    </el-form>
    <div class="footer">
      <el-button @click="handleClose" size="mini">取消</el-button>
      <el-button @click="handelClick" size="mini" type="primary">保存</el-button>
    </div>
  </basic-dialog>
</template>

<script>
import EntityDialog from "@/mixins/entityDialog";
import ExactList from "@/mixins/exactList";

export default {
  mixins: [EntityDialog, ExactList],
  data() {
    return {
      rules: {
        appCode: [{ required: true, message: "请输入角色编码" }],
      },
      defaultProps: {
        children: "children",
        label: "label",
      },
      softSelect: [],
    };
  },
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
    ids: {
      type: Array,
      default: [],
    },
    obj: {
      type: Object,
      default: {},
    },
  },
  beforeCreate() {
    this.allFields = ["roleName", "roleCode"];
    this.disFields = [];
  },
  computed: {
    getDefaultExt() {
      if (this.state.listTree && this.state.listTree[0]) {
        return [this.state.listTree[0].id];
      }
    },
  },
  methods: {
    //点击确认的事件
    handelClick() {
      //选中的id
      api.administrators
        .assignOrgAdmin({
          data: {
            id: this.roleListId,
            orgIdList: this.$refs.tree.getCheckedKeys(),
          },
        })
        .then(({ code, data, msg }) => {
          if (code == 200) {
            this.updateVis(false);
            return this.$message.success(msg);
          } else {
            return this.$message.error(msg);
          }
        });
    },
    handleClose() {
      this.updateVis(false);
      //清空树
      this.$refs.tree.setCheckedKeys([]);
    },
  },
  updated() {
    if (this.action == "add" && this.$refs.tree) {
      this.$refs.tree.setCheckedKeys([]);
    }
  },
};
</script>
<style scoped>
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
  height: 400px;
  overflow: hidden;
}
.el-dialog__body {
  height: 600px !important;
  overflow: hidden !important;
}
.changeHeight {
  height: 600px !important;
  min-height: 600px !important;
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
