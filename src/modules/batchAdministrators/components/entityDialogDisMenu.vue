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
      @submit.native.prevent
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
        <div class="left">
          <el-tree
            :data="treeList2"
            show-checkbox
            default-expand-all
            node-key="id"
            ref="tree"
            :default-expanded-keys="ids2"
            :default-checked-keys="ids2"
            :check-strictly="true"
            @check="apiScopeGrantListCheck"
            highlight-current
            :props="{ children: 'children', label: 'resourceName' }"
          ></el-tree>
        </div>
      </div>
    </el-form>
    <div class="footer" v-if="action != 'view'">
      <el-button @click="handleClose" size="mini">关闭</el-button>
      <el-button @click="handelClick" size="mini" type="primary">保存</el-button>
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
      type: Array,
      default: [],
    },
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
      }
    },
  },
  beforeCreate() {
    this.allFields = ["roleName", "roleCode"];
    this.disFields = [];
  },
  computed: {
    ...mapState("app", ["tenementInfoObj"]),
  },
  methods: {
    //更改树的性质，选完父，子全部被勾选
    apiScopeGrantListCheck(a, b) {
      this.handleCheck(a, b, this.$refs.tree);
    },
   handleCheck(a, b, refDom) {
      if (a.children.length) {
        const children = this.myFlat(a.children, Infinity);
        const checkedKeys = b.checkedKeys.slice();
        if (b.checkedKeys.indexOf(a.id) != -1) {
          //勾选了a
          const tempArr = Array.from(new Set(checkedKeys.concat(children)));
          if (a.parentIds != null) {
            const parentIds = a.parentIds.split(",");
            if (parentIds != null && parentIds.length > 0) {
              for (let i = 0; i < parentIds.length; i++) {
                parentIds[i] = parseInt(parentIds[i]);
              }
            }
            for (var i = 0; i < tempArr.length; i++) {
              for (var j = 0; j < parentIds.length; j++) {
                if (tempArr[i] === parentIds[j]) {
                  tempArr.splice(i, 1); //利用splice函数删除元素，从第i个位置，截取长度为1的元素
                }
              }
            }
            for (var i = 0; i < parentIds.length; i++) {
              tempArr.push(parentIds[i]);
            }
          }

          refDom.setCheckedKeys(tempArr);
        } else {
          //取消勾选a，计算差集
          let checkedKeysSet = new Set(checkedKeys);
          let childrenSet = new Set(children);
          let newArr = [...checkedKeysSet].filter(
            (ele) => !childrenSet.has(ele)
          );
          refDom.setCheckedKeys(newArr);
        }
      } else {
        if (b.checkedKeys.indexOf(a.id) != -1 && a.parentIds != null) {
          const parentIds = a.parentIds.split(",");
          const newArr = b.checkedKeys;
          if (parentIds != null && parentIds.length > 0) {
            for (let i = 0; i < parentIds.length; i++) {
              parentIds[i] = parseInt(parentIds[i]);
            }
          }
          for (var i = 0; i < newArr.length; i++) {
            for (var j = 0; j < parentIds.length; j++) {
              if (newArr[i] === parentIds[j]) {
                newArr.splice(i, 1); //利用splice函数删除元素，从第i个位置，截取长度为1的元素
              }
            }
          }
          for (var i = 0; i < parentIds.length; i++) {
            newArr.push(parentIds[i]);
          }
          refDom.setCheckedKeys(newArr);
        }
      }
    },
    myFlat(arr, deep) {
      //将数组进行扁平化处理
      return deep > 0
        ? arr.reduce((acc, val) => {
            val.children.length > 0 ? acc.push(val.id) : "";
            return acc.concat(
              val.children.length > 0 ? this.myFlat(val.children, deep - 1) : val.id
            );
          }, [])
        : arr.slice();
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
          let allArrTree = [];
          allArrTree = this.$refs.tree
            .getCheckedKeys()
            .concat(this.$refs.tree.getHalfCheckedKeys());
          //获取所有id
          let newArr = [];
          function toArr(arr) {
            arr.forEach((item, index) => {
              newArr.push(item.id);
              if (item.children && item.children.length > 0) {
                toArr(item.children);
              }
            });
          }
          toArr(this.treeList2);
          //还要判断是否通过验证
          let data = this.roleListId.map((id) => {
            return {
              appCode: this.dto.appCode,
              tenementCode: this.tenementInfoObj.tenementCode,
              id: id,
              resourceIdList: allArrTree,
              allDataIdList: newArr,
            };
          });
          api.batchAdministrators
            .assignResourcesToUsers({ data })
            .then(({ code, data, msg }) => {
              if (code == 200) {
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
          data: { userId: 929, ...this.dto },

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
            var pIds = newArr;
            let relleyIds = _.difference(data.selectList, pIds);
            // 回显
            // this.ids2 = relleyIds
          }
        });
    },

    handleClose() {
      this.updateVis(false);
      //清空树
      this.$refs.tree.setCheckedKeys([]);
      this.$refs.tree.setCheckedKeys([]);
      this.treeList2 = [];
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
