<template>
  <basic-dialog
    :visible="visible"
    :title="titleName"
    :width="900"
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
            <!--菜单角色敏感字段-->

            <el-col :span="12">
              <el-form-item   v-if="this.showSensitive" label="是否敏感" prop="sensitiveMark" required: true>
                <el-select :disabled="action=='edit'" v-model="dto.sensitiveMark" >
                    <el-option label="否" :value="0" />
                    <el-option label="是" :value="1" />
                </el-select>
              </el-form-item>
            </el-col>
             <el-col :span="12">
              <el-form-item  v-if="this.showFlowID" >
                   <div slot="label">
                  审批流ID
                  <el-tooltip class="item" effect="dark" placement="top">
                    <div slot="content">
                     在审批平台配置审批流后即可获取审批ID。<a
                        href="http://lcp.jdl.com/#/docSoftwareSystem/24/52741"
                        style="color: #2e8ff4"
                        >查看操作说明</a
                      >
                    </div>
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </div>
                <el-input v-model.trim="dto.flowId" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否可申请"  prop="isApply">
               <el-select  v-model="dto.isApply" >
                    <el-option label="是" :value="0" />
                    <el-option label="否" :value="1" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item  v-if="this.showFlowID" >
                   <div slot="label">
                  角色说明
                  <el-tooltip class="item" effect="dark" placement="top">
                    <div slot="content">
                     角色说明将显示在权限申请页面，避免申请人不清楚申请哪些角色
                    </div>
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </div>
                <el-input v-model.trim="dto.illustration" />
              </el-form-item>
            </el-col>
              <el-col :span="12" :offset="1" v-for="item in my.diaExtLists" :key="item.key">
                  <el-form-item :label="item.name" :prop="item.key" :rules="item.rules">
                      <el-input v-if="item.type === 'input'" v-model.trim="dto[item.key]" :placeholder="item.placeholder" clearable />
                      <el-select v-else-if="item.type === 'select'" v-model.trim="dto[item.key]" :placeholder="item.placeholder" clearable filterable>
                          <el-option v-for="subItem of item.options" :key="subItem.code" :label="subItem.label" :value="subItem.value" />
                      </el-select>
                  </el-form-item>
              </el-col>
          </el-row>

        </div>

        <div class="left">
            <table width="830px">
                <tr>
                    <td>
                        <span class="header1">资源名称</span>
                        <span class="header2">资源编码</span>
                        <span class="header3">资源类型</span>
                        <span class="header4">敏感标识</span>
                    </td>
                </tr>
                  <el-tree
                    :data="state.listTree"
                    show-checkbox
                    default-expand-all
                    node-key="id"
                    :default-expanded-keys="ids"
                    :default-checked-keys="ids"
                    ref="tree"
                    highlight-current
                   @check="apiScopeGrantListCheck"
                    :props="{ children: 'children', label: 'resourceName' }"
                    :check-strictly="checkIs"
                    :render-content="renderContent"
                  ></el-tree>
            </table>
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
      checkIs: true,
      titleName: "",
      rules: {
        isApply: [
          { required: true, message: "是否可申请不能为空", trigger: "blur" },
        ],
        roleName: [
          { required: true, message: "角色名称不能为空", trigger: "blur" },
          // {
          //   pattern: CNST.REG_EXP.NORMAL,
          //   message: "角色名称不能输入特殊字符",
          // },
          { max: 80, message: "角色名称长度不能超过80个字符" },
        ],
        roleCode: [
          { required: true, message: "角色编码不能为空", trigger: "blur" },
          {
            pattern: CNST.REG_EXP.NORMAL_ROLE,
            message: "支持字符如下：中文英文数字-_.=+#()（）&",
          },
          { max: 80, message: "角色编码长度不能超过80个字符" },
        ],
        remark: [
          { max: 120, message: "备注长度不能超过120个字符" },
        ],
        sensitiveMark: [
          { required: true, message: "不能为空", trigger: "blur" },
        ],
      },
      defaultProps: {
        children: "children",
        label: "label",
      },
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
    showSensitive: {
      type: Boolean,
      default: false,
    },
    showFlowID: {
      type: Boolean,
      default: false,
    },
    ids: {
      type: Array,
      default: [],
    },
    obj: {
      type: Object,
      default: {},
    },
    changeids: {
      type: Function,
      default: () => {},
    },
  },

  watch: {
    immediate: true,
    action(n, l) {
      switch (this.action) {
        case "add":
          this.titleName = this.buttonData("tjcdjs2").name;

          // this.titleName = "添加菜单角色";
          break;
        case "edit":
          // this.titleName = "编辑菜单角色";
          this.titleName = this.buttonData("bjcdjs2").name;
          this.$forceUpdate();
          break;
        case "view":
          // this.titleName = "菜单角色详情";
          this.titleName = this.buttonData("cdjsxq2").name;
          break;
      }
    },
    tenementInfoObj: {
      deep: true,
      immediate: false,
      handler: function (newVal) {
        this.queryList();
      },
    },
    obj(n, o) {
      if (this.action !== "add") {
        var obj2 = _.cloneDeep(this.obj);
        //修改
        this.dto.roleName = obj2.roleName;
        this.dto.roleCode = obj2.roleCode;
        this.dto.remark = obj2.remark;
        this.dto.flowId = obj2.flowId;
        this.dto.ext1 = obj2.ext1;
        this.dto.ext2 = obj2.ext2;
        this.dto.ext3 = obj2.ext3;
        this.dto.ext4 = obj2.ext4;
        this.dto.ext5 = obj2.ext5;
        this.dto.ext6 = obj2.ext6;
        this.dto.ext7 = obj2.ext7;
        this.dto.ext8 = obj2.ext8;
        this.dto.ext9 = obj2.ext9;
        this.dto.ext10 = obj2.ext10;
        if (obj2.sensitiveMark === null) {
          this.dto.sensitiveMark = 0;
        } else {
          this.dto.sensitiveMark = obj2.sensitiveMark;
        }
        this.dto.isApply = obj2.isApply;
        this.dto.illustration = obj2.illustration;
      } else if (this.action === "add") {
        var obj3 = _.cloneDeep(this.obj);
        //修改
        this.dto.isApply = obj3.isApply;
      }
    },
  },
  beforeCreate() {
    this.allFields = [
      "roleName",
      "roleCode",
      "remark",
      "ext1",
      "ext2",
      "ext3",
      "ext4",
      "ext5",
      "ext6",
      "ext7",
      "ext8",
      "ext9",
      "ext10",
      "sensitiveMark",
      "flowId",
      "isApply",
      "illustration",
    ];
    this.disFields = [];
  },
  created() {
    this.dto.appCode = "usf";
    this.dto.tenementCode = this.tenementInfoObj.tenementCode;

    //  if(this.dto.tenementCode==='business-seller'  || this.dto.tenementCode==='DJQXXT'){this.checkIs=true}else{this.checkIs=false}
  },
  computed: {
    ...mapState("rolePermissions", ["query"]),
    ...mapState("app", ["tenementInfoObj"]),
    my() {
      return this.state;
    },
  },
  methods: {
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
              val.children.length > 0
                ? this.myFlat(val.children, deep - 1)
                : val.id
            );
          }, [])
        : arr.slice();
    },

    replaceSpace(obj, props) {
      if (obj) {
        this.dto[props] = obj.replace(/\s/gi, "");
      }
    },
    handleTreeChange(data) {
      // data.reInitChecked = false
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
        var a = newArr[0].children.filter((item) => {
          return item.isChinld == true;
        });

        var str = data.parentIds || ",";
        //字符串截取为数组
        var strArr = str.split(",");
        var str2 = [];
        strArr.forEach((item) => {
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
        strArr.forEach((item) => {
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
        var a = newArr2[0].children.filter((item) => {
          return item.isChinld2 == true;
        });

        var str3 = data.parentIds || ",";
        //字符串截取为数组
        var strArr2 = str.split(",");
        var str4 = [];
        strArr2.forEach((item) => {
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
        // this.state.ids = []
        data.isChinld2 = false;
        data.isAllShow = false;
      }
    },
    renderContent(h, { node, data, store }) {
      return (
        <span class="custom-tree-node">
          <span class="span1">{node.label}</span>
          <span class="span2">{data.resourceCode}</span>
          {data.resourceType == 0 ? (
            <span class="span3 ">菜单</span>
          ) : data.resourceType == 1 ? (
            <span class="span3_1">按钮</span>
          ) : (
            <span class="span3_1">其他</span>
          )}
          {data.sensitiveMark == 0 ? (
            <span class="span4"> 否 </span>
          ) : (
            <span class="span4" style="color:red">
              {" "}
              是{" "}
            </span>
          )}
        </span>
      );
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
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return;
        } else {
          // this.dto.appId = this.query.appId;
          this.dto.appCode = "usf";
          this.dto.tenementCode = this.tenementInfoObj.tenementCode;
          // this.dto.isApply=parseInt( this.dto.isApply);
          //发请求 判断是否重名
          if (this.action == "edit") {
            this.$refs.form.validate((valid) => {});
            api.rolePermissions
              .updateCommit({
                data: {
                  id: this.roleListId,
                  ...this.dto,
                  resourceIds: allArrTree,
                },
              })
              .then(({ code, data, msg }) => {
                if (code == 200) {
                  this.queryList();
                  this.updateVis();
                  return this.$message.success(msg);
                  this.queryList();
                } else {
                  this.ids = [3466, 3467, 3468];
                  return this.$message.error(msg);
                }
              });
          }

          if (this.action == "add") {
            api.rolePermissions
              .isHasUser({
                data: {
                  appCode: this.dto.appCode,
                  roleCode: this.dto.roleCode,
                  roleName: this.dto.roleName,
                  tenementCode: this.tenementInfoObj.tenementCode,
                },
              })
              .then(({ code, data, msg }) => {
                if (code == 200) {
                  //不重名
                  if (!data) {
                    if (this.action == "add") {
                      //这里发送天机角色的请求
                      api.rolePermissions
                        .roleAdd({
                          data: { ...this.dto, resourceIds: allArrTree },
                        })
                        .then(({ code, data, msg }) => {
                          if (code == 200) {
                            this.queryList();
                            this.updateVis();
                            return this.$message.success(msg);
                          } else if (code !== 200) {
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
      this.updateVis(false);
      //清空树
      this.$refs.tree.setCheckedKeys([]);
      this.$refs.tree.setCheckedKeys([]);
    },
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
    this.titleName = this.buttonData("tjcdjs2").name;
  },
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

.header1 {
  /*border: #63bc6f 1px solid;*/
  /*background-color:#ffcc00;*/
  /*display:-moz-inline-box;*/
  display: inline-block;
  width: 250px;
  text-align: center;
}

.header2 {
  /*border: #63bc6f 1px solid;*/
  /*background-color:#ffcc00;*/
  /*display:-moz-inline-box;*/
  display: inline-block;
  width: 370px;
  text-align: center;
}

.header3 {
  /*border: #63bc6f 1px solid;*/
  /*background-color:#ffcc00;*/
  /*display:-moz-inline-box;*/
  display: inline-block;
  width: 140px;
  text-align: center;
}

.header4 {
  /*border: #63bc6f 1px solid;*/
  /*background-color:#ffcc00;*/
  /*display:-moz-inline-box;*/
  display: inline-block;
  width: 60px;
  text-align: center;
}

.el-tree /deep/ .custom-tree-node {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-tree /deep/ .custom-tree-node .span1 {
  overflow: hidden;
  /*border: #63bc6f 1px solid;*/
  /*background-color:#ffcc00;*/
  display: -moz-inline-box;
  display: inline-block;
  width: 400px;
}

.el-tree /deep/ .custom-tree-node .span2 {
  /*border: #63bc6f 1px solid;*/
  /*background-color:#ffcc00;*/
  display: -moz-inline-box;
  display: inline-block;
  width: 300px;
  position: absolute;
  left: 400px;
  overflow: hidden;
  text-align: left;
}
.el-tree /deep/ .custom-tree-node .span3 {
  /*border: #63bc6f 1px solid;*/
  /*background-color:#ffcc00;*/
  display: -moz-inline-box;
  display: inline-block;
  position: absolute;
  width: 100px;
  left: 650px;
  overflow: hidden;
  text-align: center;
  /*color: #67C23A;*/
}

.el-tree /deep/ .custom-tree-node .span3_1 {
  /*border: #63bc6f 1px solid;*/
  /*background-color:#ffcc00;*/
  display: -moz-inline-box;
  display: inline-block;
  position: absolute;
  width: 100px;
  left: 650px;
  overflow: hidden;
  text-align: center;
  /*color: #E6A23C;*/
}

.el-tree /deep/ .custom-tree-node .span4 {
  /*border: #63bc6f 1px solid;*/
  /*background-color:#ffcc00;*/
  display: -moz-inline-box;
  display: inline-block;
  position: absolute;
  width: 70px;
  left: 750px;
  overflow: hidden;
  text-align: center;
}

.el-tree /deep/ .custom-tree-node .span5 {
  /*border: #63bc6f 1px solid;*/
  /*background-color:#ffcc00;*/
  display: -moz-inline-box;
  display: inline-block;
  position: absolute;
  width: 70px;
  left: 580px;
  overflow: hidden;
  text-align: center;
  color: red;
}
</style>
