<template>
  <basic-dialog
    :visible="visible"
    :title="'菜单角色详情'"
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
      label-position="right"
      label-width="128px"
      :model="dto"
      :rules="rules"
      node-key="id"
      @submit.native.prevent
      class="parent"
      :disabled="action=='view'"
    >
      <div class="entity-dlg__block-bd">
        <div class="top">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="角色编码" prop="roleCode">
                <el-input :disabled="action=='edit'" v-model.trim="dto.roleCode" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="角色名称" prop="roleName">
                <el-input v-model.trim="dto.roleName" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="备注" prop="remark">
                <el-input v-model="dto.remark" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <div class="left">
          <el-tree
            :data="state.listTree"
            show-checkbox
            default-expand-all
            node-key="id"
            :default-expanded-keys="ids"
            :default-checked-keys="ids"
            ref="tree"
            highlight-current
            :props="{ children: 'children', label: 'resourceName' }"
            :check-strictly="false"
          ></el-tree>
        </div>
      </div>
    </el-form>
    <div class="footer" v-if="action!='view'">
      <el-button @click="handleClose" size="mini">取消</el-button>
      <el-button @click="handelClick" size="mini" type="primary">{{this.action=='add'?'确认':'保存'}}</el-button>
    </div>
    <div class="footer" v-else>
      <el-button @click="handleClose" size="mini">关闭</el-button>
    </div>
  </basic-dialog>
</template>

<script>
import EntityDialog from "@/mixins/entityDialog";
import { mapState } from "vuex";
import ExactList from "@/mixins/exactList";
export default {
  mixins: [EntityDialog, ExactList],
  data() {
    return {
      titleName: "",
      rules: {
        roleName: [
          { required: true, message: "角色名称不能为空", trigger: "blur" },
          {
            pattern: CNST.REG_EXP.NORMAL,
            message: "角色名称不能输入特殊字符"
          },
          { max: 30, message: "角色名称长度不能超过30个字符" },
        ],
        roleCode: [
          { required: true, message: "角色编码不能为空", trigger: "blur" },
          {
            pattern: CNST.REG_EXP.ENGNUMLINE,
            message: "角色编码不能输入特殊字符"
          },
          { max: 50, message: "角色编码长度不能超过50个字符" },
        ],
        remark: [
          { max: 120, message: "备注长度不能超过120个字符" },
        ]
      },
      defaultProps: {
        children: "children",
        label: "label"
      }
    };
  },
  props: {
    action: {
      type: String,
      default: "add"
    },
    state: {
      type: Object,
      default: {}
    },
    queryList: {
      type: Function,
      default: () => {}
    },
    roleListId: {
      type: Number,
      default: 0
    },
    ids: {
      type: Array,
      default: []
    },
    obj: {
      type: Object,
      default: {}
    },
    changeids: {
      type: Function,
      default: () => {}
    },
    appCode: {
      type: String,
      default:undefined
    }
  },
  watch: {
    immediate: true,
    action(n, l) {
      switch (this.action) {
        case "add":
          this.titleName = this.buttonData("tjcdjs").name;
          // this.titleName = "添加菜单角色";
          break;
        case "edit":
          // this.titleName = "编辑菜单角色";
          this.titleName = this.buttonData("bjcdjs").name;
          this.$forceUpdate();
          break;
        case "view":
          // this.titleName = "菜单角色详情";
          this.titleName = this.buttonData("cdjsxq").name;
          break;
      }
    },
    tenementInfoObj: {
      deep: true,
      immediate: false,
      handler: function(newVal) {
        this.queryList();
      }
    },
    obj(n, o) {
      if (this.action !== "add") {
        var obj2 = _.cloneDeep(this.obj);
        //修改
        this.dto.roleName = obj2.roleName;
        this.dto.roleCode = obj2.roleCode;
        this.dto.remark = obj2.remark;
      }
    },
    appCode(n, o) {
      if(n){
        this.dto.appCode = n
      }
    }
  },
  beforeCreate() {
    this.allFields = ["roleName", "roleCode", "remark"];
    this.disFields = [];
  },
  created() {
    this.dto.tenementCode = this.tenementInfoObj.tenementCode;
  },
  computed: {
    ...mapState("app", ["tenementInfoObj"])
  },
  methods: {
    replaceSpace(obj, props) {
      if (obj) {
        this.dto[props] = obj.replace(/\s/gi, "");
      }
    },
    handleTreeChange(data) {
      if (!data.isAllShow && data.children.length == 0 && !data.isChinld) {
        var str = data.parentIds || ",";
        //字符串截取为数组
        var strArr = str.split(",");
        for (var j = 0, len = strArr.length; j < len; j++) {}
        this.state.ids = [...strArr, data.id];
        data.isChinld = true;
      } else if (data.isChinld) {
        //1判断 兄弟节点是否勾选  如果勾选不删除父  没勾选的话删除父
        //找到所有兄弟节点 遍历兄弟节点 看是否有这个
        //父id  data.parentId
        //获取所有子
        let newArr = [];
        function toArr(arr) {
          arr.forEach((item, index) => {
            //如果这一步 所有子都加这个属性
            if (item.id == data.parentId) {
              newArr.push(item);
            }
            if (item.children && item.children.length > 0) {
              toArr(item.children);
            }
          });
        }
        toArr(this.state.listTree);
        var a = newArr[0].children.filter(item => {
          return item.isChinld == true;
        });

        var str = data.parentIds || ",";
        //字符串截取为数组
        var strArr = str.split(",");
        var str2 = [];
        strArr.forEach(item => {
          str2.push(item * 1);
        });
        if (a.length - 1 > 0) {
          //如果勾选不删除父
          // this.state.ids =
        } else {
          //没勾选的话删除父
          this.state.ids = _.difference(this.ids, [...str2]);
        }
        //删除自己节点
      } else if (!data.isAllShow && data.children.length != 0) {
        data.isChinld2 = true;
        var str = data.parentIds || ",";
        //字符串截取为数组
        var strArr = str.split(",");
        for (var j = 0, len = strArr.length; j < len; j++) {}
        this.state.ids = [...strArr, data.id];
        data.isAllShow = 1;
      } else if (data.isAllShow == 1) {
        //获取所有子id
        let newArr = [];
        function toArr(arr) {
          arr.forEach((item, index) => {
            //如果这一步 所有子都加这个属性
            item.isChinld = true;
            newArr.push(item.id);
            if (item.children && item.children.length > 0) {
              toArr(item.children);
            }
          });
        }
        toArr(data.children);
        this.state.ids = this.$refs.tree
          .getCheckedKeys()
          .concat(this.$refs.tree.getHalfCheckedKeys())
          .concat(newArr)
          .concat([data.id]);
        data.isAllShow = 2;
      } else if (data.isAllShow == 2) {
        //这里清除所有的点中的 父 以及所有的子
        let newArr = [];
        function toArr(arr) {
          arr.forEach((item, index) => {
            newArr.push(item.id);
            if (item.children && item.children.length > 0) {
              toArr(item.children);
            }
          });
        }
        toArr(data.children);
        var a = this.$refs.tree
          .getCheckedKeys()
          .concat(this.$refs.tree.getHalfCheckedKeys())
          .concat(newArr)
          .concat([data.id]);
        var str = data.parentIds || ",";
        //字符串截取为数组
        var strArr = str.split(",");
        var str2 = [];
        strArr.forEach(item => {
          str2.push(item * 1);
        });

        //获取所有子
        let newArr2 = [];
        function toArr2(arr) {
          arr.forEach((item, index) => {
            //如果这一步 所有子都加这个属性
            if (item.id == data.parentId) {
              newArr2.push(item);
            }
            if (item.children && item.children.length > 0) {
              toArr2(item.children);
            }
          });
        }
        toArr2(this.state.listTree);
        var a = newArr2[0].children.filter(item => {
          return item.isChinld2 == true;
        });

        var str3 = data.parentIds || ",";
        //字符串截取为数组
        var strArr2 = str.split(",");
        var str4 = [];
        strArr2.forEach(item => {
          str4.push(item * 1);
        });
        if (a.length - 1 > 0) {
          //如果勾选不删除父
          // alert(1)
          this.$refs.tree.setCheckedKeys(
            _.difference(this.ids, [...newArr, data.id])
          );
        } else {
          //没勾选的话删除父
          this.$refs.tree.setCheckedKeys(
            _.difference(this.ids, [...str2, ...newArr, data.id])
          );
        }
        data.isChinld2 = false;
        data.isAllShow = false;
      }
    },
    //获取所有父节点 以及pid  【{1:2}，{2：null}】这种
    getPIds() {
      //获取所有父节点
    },

    //点击确认的事件
    handelClick() {
      //选中的id
      // **  this.$refs.tree.getCheckedKeys()
      //获取当前叶子节点的id（父级id）
      // **  this.$refs.tree.getHalfCheckedKeys()
      //通过数组的concat 方法连接
      let allArrTree = [];
      allArrTree = this.$refs.tree
        .getCheckedKeys()
        .concat(this.$refs.tree.getHalfCheckedKeys());
      //还要判断是否通过验证
      if (!this.$refs.form) {
        return;
      }
      this.$refs.form.validate(valid => {
        if (!valid) {
          return;
        } else {
          this.dto.appId = this.query.appId;
          this.dto.appCode = this.query.appCode;
          this.dto.tenementCode = this.tenementInfoObj.tenementCode;
          //发请求 判断是否重名
          if (this.action == "edit") {
            this.$refs.form.validate(valid => {});
            api.rolePermissions
              .updateCommit({
                data: {
                  id: this.roleListId,
                  ...this.dto,
                  resourceIds: allArrTree
                }
              })
              .then(({ code, data, msg }) => {
                if (code == 200) {
                  this.queryList();
                  this.updateVis();
                  return this.$message.success(msg);
                  this.queryList();
                } else {
                  return this.$message.error(msg);
                }
              });
          }

          if (this.action == "add") {
            api.rolePermissions
              .isHasUser({
                data: {
                  roleCode: this.dto.roleCode,
                  roleName: this.dto.roleName,
                  tenementCode:this.tenementInfoObj.tenementCode
                }
              })
              .then(({ code, data, msg }) => {
                if (code == 200) {
                  //不重名
                  if (!data) {
                    if (this.action == "add") {
                      //这里发送天机角色的请求
                      api.rolePermissions
                        .roleAdd({
                          data: { ...this.dto, resourceIds: allArrTree }
                        })
                        .then(({ code, data, msg }) => {
                          if (code == 200) {
                            this.queryList();
                            this.updateVis();
                            return this.$message.success(msg);
                          } else if (code == 500) {
                            return this.$message.error(msg);
                          }
                        });
                    } else if (this.action == "edit") {
                    } else if (this.action == "view") {
                    }

                    //重名
                  } else {
                    return this.$message.error("该角色已经存在，请重新输入！");
                  }
                }
              });
          }
        }
      });
    },
    handleClose() {
      this.$emit('funcl')
      //清空树
      this.$refs.tree.setCheckedKeys([]);
      this.$refs.tree.setCheckedKeys([]);
    }
  },
  getCheckedKeys(data, keys, key) {
    var res = [];
    recursion(data, false);
    return res;

    // arr -> 树形总数据
    // keys -> getCheckedKeys获取到的选中key值
    // isChild -> 用来判断是否是子节点
    function recursion(arr, isChild) {
      var aCheck = [];
      for (var i = 0; i < arr.length; i++) {
        var obj = arr[i];
        aCheck[i] = false;

        if (obj.children) {
          aCheck[i] = recursion(obj.children, true) ? true : aCheck[i];
          if (aCheck[i]) {
            res.push(obj[key]);
          }
        }

        for (var j = 0; j < keys.length; j++) {
          if (obj[key] == keys[j]) {
            aCheck[i] = true;
            if (res.indexOf(obj[key]) == -1) {
              res.push(obj[key]);
            }
            break;
          }
        }
      }
      if (isChild) {
        return aCheck.indexOf(true) != -1;
      }
    }
  },

  mounted() {
    //由于三个组件通用 上来添加的默认就是这个名字
    this.titleName = this.buttonData("tjcdjs").name;
  }
};
</script>



<style  scoped>
.left {
  overflow: scroll;
  min-height: 50px;
  max-height: 400px;
}
.footer {
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
</style>
