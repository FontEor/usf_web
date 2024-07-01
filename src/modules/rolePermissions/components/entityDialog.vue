<template>
    <div>
        <basic-dialog :visible="visible" :title="titleName" :width="900" :update-vis="updateVis" :handle-close="handleClose"
        :handle-closed="handleClosed" :handle-ok="handleOk" :isShowFooterAll="false" class="changeHeight">
            <el-form ref="form" size="small" label-position="right" label-width="128px" :model="dto" :rules="rules"
            node-key="id" @submit.native.prevent class="parent" :disabled="action == 'view'">
                <div class="entity-dlg__block-bd">
                    <div class="top">
                        <el-row :gutter="24">
                            <el-col :span="12">
                                <el-form-item label="角色编码" prop="roleCode">
                                    <el-input :disabled="action == 'edit'" v-model.trim="dto.roleCode" />
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
                                <el-form-item v-if="this.showSensitive" label="是否敏感" prop="sensitiveMark" required: true>
                                    <el-select :disabled="action == 'edit'" v-model="dto.sensitiveMark">
                                    <el-option label="否" :value="0" />
                                    <el-option label="是" :value="1" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <!-- <el-col :span="12">
                                <el-form-item v-if="this.showFlowID">
                                    <div slot="label">
                                    审批流ID
                                    <el-tooltip class="item" effect="dark" placement="top">
                                        <div slot="content">
                                        在审批平台配置审批流后即可获取审批ID。<a href="http://lcp.jdl.com/#/docSoftwareSystem/24/52741"
                                            style="color: #2e8ff4">查看操作说明</a>
                                        </div>
                                        <i class="el-icon-question"></i>
                                    </el-tooltip>
                                    </div>
                                    <el-input v-model.trim="dto.flowId" />
                                </el-form-item>
                            </el-col> -->
                            <el-col :span="12">
                                <el-form-item label="是否可申请" prop="isApply">
                                    <el-select v-model="dto.isApply">
                                        <el-option label="是" :value="0" />
                                        <el-option label="否" :value="1" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <!-- <el-form-item v-if="this.showFlowID"> -->
                                <el-form-item>
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
                            <el-col :span="12">
                                <div style="display: flex;justify-content: center;margin-bottom: 1rem;margin-top: 0.6rem;">
                                    <el-radio-group v-model="flowIdOrFlowCode">
                                        <el-radio label="flowId">新审批流ID</el-radio>
                                        <el-radio label="flowCode">流程编码</el-radio>
                                    </el-radio-group>
                                </div>
                                <el-form-item v-if="flowIdOrFlowCode==='flowId'">
                                    <div slot="label">
                                    新审批流ID
                                    </div>
                                    <el-input v-model.trim="dto.businessFlowId" />
                                </el-form-item>
                                <el-form-item v-else>
                                    <div slot="label">
                                        流程编码
                                    </div>
                                    <el-input v-model.trim="dto.flowCode" />
                                    <div slot="label" style="margin-top: 1rem;">
                                        版本ID(非必填)
                                    </div>
                                    <el-input style="margin-top: 1rem;" v-model.trim="dto.flowVersion" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" v-if="isShowExpireSelect">
                                <el-form-item label="角色有效期" :rules="isDisabledExpireSelect ? undefined : [{required: true, message: '请选择角色有效期'}]" prop="lifespanType">
                                  <el-select v-model="dto.lifespanType" :disabled="isDisabledExpireSelect" placeholder="请选择角色有效期">
                                    <el-option label="永久" :value="0" />
                                    <el-option :label="`短期${expireShortDay}`" :value="1" />
                                    <el-option :label="`长期${expireLongDay}`" :value="2" />
                                  </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" :offset="1" v-for="item in my.diaExtLists" :key="item.key">
                                <el-form-item :label="item.name" :prop="item.key" :rules="item.rules">
                                    <el-input v-if="item.type === 'input'" v-model.trim="dto[item.key]" :placeholder="item.placeholder"
                                    clearable />
                                    <el-select v-else-if="item.type === 'select'" v-model.trim="dto[item.key]"
                                    :placeholder="item.placeholder" clearable filterable>
                                    <el-option v-for="subItem of item.options" :key="subItem.code" :label="subItem.label"
                                        :value="subItem.value" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </div>
                </div>
            </el-form>

            <div class="search-form-el-row">
                <div class="search-input">
                    菜单资源快速定位
                    <el-input style="width:20rem" size="small" v-model="searchform.resourceEncode" clearable placeholder="仅支持资源编码精确查询" />
                </div>
                <div class="search-button">
                    <el-button type="primary" size="small" @click="handleSearch(searchform.resourceEncode)">查询
                    </el-button>
                    <el-button size="small" @click="handleReset">清理查询条件</el-button>
                </div>
            </div>

            <vxe-table border show-overflow show-header-overflow ref="vxeTable" size="mini"
            style="width: 100%; margin-bottom: 8px;" height="400" :row-config="{height: 40,keyField:'id',isCurrent:true}"
            :column-config="{resizable: true}"
            :tree-config="treeConfig"
            :checkbox-config="{ checkStrictly: true,reserve:true,showHeader:false,}"
            @checkbox-change="selectChangeEvent" :data="vexTableData">
                <vxe-column type="checkbox" field="id" width="40" ></vxe-column>
                <vxe-column field="resourceName"  title="资源名称" tree-node></vxe-column>
                <vxe-column field="resourceCode"  title="资源编码"></vxe-column>
                <vxe-column field="resourceType"  title="资源类型" width="72">
                    <template slot-scope="{row}">
                        <span :class="judgeResourceTypeClassName(row['resourceType'])">
                        {{ judgeResourceTypeText(row['resourceType']) }}
                        </span>
                    </template>
                </vxe-column>
                <vxe-column field="sensitiveMark"  title="敏感标示" width="72">
                    <template slot-scope="{row}">
                        <span :style="row['sensitiveMark'] === 1 ? 'color: #F56C6C' : null">
                        {{ row['sensitiveMark'] === 1 ? "是" : "否" }}
                        </span>
                    </template>
                </vxe-column>
            </vxe-table>

            <div class="footer" v-if="action != 'view'">
                <el-button @click="handleClose" size="mini">取消</el-button>
                <el-button :loading="submitLoading" @click="hanldeSave" size="mini" type="primary">{{ this.action == 'add' ? '确认' : '保存'}}</el-button>
            </div>
            <div class="footer" v-else>
                <el-button @click="handleClose" size="mini">关闭</el-button>
            </div>
        </basic-dialog>

        <el-dialog title="提示" :visible.sync="visibleHandle" width="40%">
            <span>请确认本次需要提交的内容，确认无误后点击保存，如需修改点击上一步。</span>
            <vxe-table border show-overflow show-header-overflow ref="umyCheckedTable" size="mini" style="width: 100%; margin-bottom: 8px;" height="400" :row-config="{height: 40}" :column-config="{resizable: true}" :tree-config="treeConfig">
                <vxe-column field="resourceName"  title="资源名称" tree-node></vxe-column>
                <vxe-column field="resourceCode"  title="资源编码"></vxe-column>
            </vxe-table>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleConfirmClose">上一步</el-button>
                <el-button type="primary" @click="handelClick">保存</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
import Vue from "vue";
import EntityDialog from "@/mixins/entityDialog";
import { mapState } from "vuex";
import ExactList from "@/mixins/exactList";
import { VXETable } from "vxe-table";
import "xe-utils";
import "vxe-table/lib/style.css";
Vue.use(VXETable);
import { cloneDeep } from "lodash";

import expireMixin from "./expire.mixin";

export default {
  mixins: [EntityDialog, ExactList, expireMixin],
  components: {
    VXETable,
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
      default() {
        return [];
      },
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
  data() {
    return {
      submitLoading: false,
      warningMessageVisible: false,
      titleName: "",
      rules: {
        isApply: [
          { required: true, message: "是否可申请不能为空", trigger: "blur" },
        ],
        roleName: [
          { required: true, message: "角色名称不能为空", trigger: "blur" },
          { max: 80, message: "角色名称长度不能超过80个字符" },
        ],
        roleCode: [
          { required: true, message: "角色编码不能为空", trigger: "blur" },
          {
            pattern: CNST.REG_EXP.MENU_CODE,
            message: "支持字符如下：中文英文数字-_.=+#()（）&/",
          },
          { max: 80, message: "角色编码长度不能超过80个字符" },
        ],
        remark: [{ max: 120, message: "备注长度不能超过120个字符" }],
        sensitiveMark: [
          { required: true, message: "不能为空", trigger: "blur" },
        ],
      },
      treeConfig: {
        iconClose: "el-icon-arrow-right",
        iconOpen: "el-icon-arrow-down",
        rowField: "id",
        parentField: "parentId",
        expandAll: true,
        transform: true,
      },
      tableList: [
        { prop: "resourceName", label: "资源名称" },
        { prop: "resourceCode", label: "资源编码" },
        {
          prop: "resourceType",
          label: "资源类型",
          width: "72",
        },
        {
          prop: "sensitiveMark",
          label: "敏感标示",
          width: "72",
        },
      ],
      checkedTableList: [
        { prop: "resourceName", label: "资源名称" },
        { prop: "resourceCode", label: "资源编码" },
      ],
      resourceTypeClassNameMap: {
        0: "cell-menu-word-style cell-common-word",
        1: "cell-button-word-style cell-common-word",
        2: "cell-others-word-style cell-common-word",
      },
      defaultProps: {
        children: "children",
        label: "label",
      },
      searchform: {
        resourceName: "",
        resourceEncode: "",
      },
      visibleHandle: false,
      vexTableData: [],
      tempArr: [],
      flowIdOrFlowCode: "flowCode",
    };
  },
  computed: {
    ...mapState("rolePermissions", ["query"]),
    ...mapState("app", ["tenementInfoObj"]),
    my() {
      return this.state;
    },
  },
  watch: {
    visible(newValue) {
      this.searchform.resourceEncode = "";
      if (newValue) {
        // 获取是否显示角色过期规则选择框
        this.getShowExpireSelect();
        // 加载虚拟表格数据
        this.$nextTick(async () => {
          await this.$refs.vxeTable.reloadData(this.state.listTree || []);
          // 根据ids勾选虚拟表格
          if (this.action === "add") {
            this.$refs.vxeTable.setCheckboxRow([], true);
          } else {
            if (this.ids && this.ids.length > 0) {
              const rows = this.state.listTree.filter((item) => {
                return this.ids.includes(item.id);
              });
              this.$refs.vxeTable.setCheckboxRow(rows, true);
            }
          }
        });
      }
    },
    visibleHandle(newValue) {
      if (newValue) {
        this.$nextTick(async () => {
          let selectionDataList = this.$refs.vxeTable.getCheckboxRecords(true);
          this.tempArr = cloneDeep([...selectionDataList]);
          for (const key in this.tempArr) {
            delete this.tempArr[key].children;
          }
          await this.$refs.umyCheckedTable.reloadData(this.tempArr, []);
        });
      }
    },
    // "state.listTree": {
    //   deep: true,
    //   handler(newValue) {},
    // },
    // immediate: true,
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
      handler: function (newVal) {
        this.queryList();
      },
    },
    obj(n, o) {
      if (this.action !== "add") {
        if (!this.obj.flowCode && this.obj.businessFlowId) {
          this.flowIdOrFlowCode = "flowId";
        }
        var obj2 = _.cloneDeep(this.obj);
        //修改
        this.dto.roleName = obj2.roleName;
        this.dto.roleCode = obj2.roleCode;
        this.dto.remark = obj2.remark;
        // this.dto.flowId = obj2.flowId;
        this.dto.lifespanType = obj2.lifespanType;
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
        this.dto.businessFlowId = obj2.businessFlowId;
        this.dto.flowCode = obj2.flowCode;
        this.dto.flowVersion = obj2.flowVersion;
      } else if (this.action === "add") {
        var obj3 = _.cloneDeep(this.obj);
        //修改
        this.dto.isApply = obj3.isApply;
      }
    },
  },
  methods: {
    //提交保存数据
    hanldeSave() {
      this.visibleHandle = true;
    },
    //返回上一步或取消
    handleConfirmClose() {
      this.visibleHandle = false;
    },
    //搜索
    async handleSearch(value) {
      if (value) {
        let visibleData = this.$refs.vxeTable.getTableData()["visibleData"];
        let row = visibleData.find((element) => {
          return element.resourceCode === value;
        });
        if (typeof row === "undefined") {
          this.$message.error("未找到资源编码为:【" + value + "】的数据");
          return;
        }
        this.$refs.vxeTable.setCurrentRow(row);
        this.$refs.vxeTable.scrollToRow(row, "resourceCode");
      } else {
        this.$message.error("资源编码不能为空");
      }
      this.$refs.vxeTable.setAllTreeExpand(true);
    },
    //清理查询条件
    handleReset() {
      this.searchform.resourceEncode = "";
      this.$refs.vxeTable.clearCurrentRow(); //清空当前高亮的状态
    },
    // selectAll(selection) {
    //   this.selectionList = selection;
    // },
    judgeResourceTypeClassName(value) {
      return this.resourceTypeClassNameMap[value];
    },
    judgeResourceTypeText(value) {
      return CNST.ENUMS.resourceType[value];
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
    selectChangeEvent({ $table, row }) {
      // 判断当前操作是勾选还是取消勾选
      const selected = this.$refs.vxeTable
        .getCheckboxRecords()
        .some((item) => item == row);
      // 勾选父节点时，会勾选其全部子节点；取消勾选父节点时，会取消勾选其全部子节点
      // 将父节点及其子节点的数组拍平以便整体勾选及取消勾选
      const flattenedChildren = this.flatChildrenOfRows([row]);
      this.$refs.vxeTable.setCheckboxRow(flattenedChildren, selected);
      // 勾选子节点时，会勾选其父节点；取消勾选子节点时，不会影响其父节点
      if (selected) {
        const treeData = this.$refs.vxeTable.getTableData()["fullData"];
        const flattenedTreeData = this.flatChildrenOfRows(treeData);
        const flattenedParents = this.flatParentsOfRows(row, flattenedTreeData);
        this.$refs.vxeTable.setCheckboxRow(flattenedParents, selected);
      }
      // 保存当前勾选节点
      //this.selectionList = this.$refs.vxeTable.getCheckboxRecords(true);
    },
    // 展开收起虚拟表格时候勾选已选节点
    // toggleTreeExpand(row, treeExpanded, event) {
    //   this.$refs.umyTable.partRowSelections(this.selectionList, true);
    // },
    //点击确认的事件
    handelClick() {
      this.submitLoading = true;
      // 获取虚拟列表中勾选行ID
      let allArrTree = this.tempArr.map((item) => item.id);
      //还要判断是否通过验证
      if (!this.$refs.form) {
        this.submitLoading = false;
        return;
      }
      this.$refs.form.validate((valid) => {
        if (!valid) {
          this.submitLoading = false;
          return this.$message.error("数据校验不通过！");
        } else {
          this.dto.appId = this.query.appId;
          this.dto.appCode = this.query.appCode;
          this.dto.tenementCode = this.tenementInfoObj.tenementCode;
          if (this.flowIdOrFlowCode === "flowCode") {
            this.dto.businessFlowId = null;
          } else {
            this.dto.flowCode = null;
            this.dto.flowVersion = null;
          }
          //发请求 判断是否重名
          if (this.action == "edit") {
            api.rolePermissions
              .updateCommit({
                data: {
                  id: this.roleListId,
                  ...this.dto,
                  resourceIds: allArrTree,
                },
              })
              .then(async ({ code, data, msg }) => {
                if (code == 200) {
                  await this.queryList();
                  await this.updateVis();
                  await this.queryList();
                  this.submitLoading = false;
                  return this.$message.success(msg);
                } else if (code === 301) {
                  this.warningMessageVisible = true;
                  let warningSeconds = 5;
                  const message = `<p>当前有其他用户正在提交处理中，<span class="warning-message__seconds">${warningSeconds}</span>秒后将自动关闭对话框</p>`;
                  const duration = 0;
                  const dangerouslyUseHTMLString = true;
                  const customClass = "warning-message";
                  this.$message.warning({
                    message,
                    duration,
                    dangerouslyUseHTMLString,
                    customClass,
                  });
                  const step = () => {
                    setTimeout(() => {
                      if (this.warningMessageVisible && warningSeconds > 0) {
                        warningSeconds -= 1;
                        document.querySelector(
                          `.${customClass} .warning-message__seconds`
                        ).textContent = warningSeconds;
                        step();
                      } else {
                        this.updateVis(false);
                        this.submitLoading = false;
                      }
                    }, 1000);
                  };
                  step();
                } else {
                  this.ids = [3466, 3467, 3468];
                  this.submitLoading = false;
                  return this.$message.error(msg);
                }
              });
          } else if (this.action == "add") {
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
                        .then(async ({ code, data, msg }) => {
                          if (code == 200) {
                            await this.queryList();
                            await this.updateVis();
                            this.submitLoading = false;
                            return this.$message.success(msg);
                          } else if (code !== 200) {
                            this.submitLoading = false;
                            return this.$message.error(msg);
                          }
                        });
                    } else if (this.action == "edit") {
                      this.submitLoading = false;
                    } else if (this.action == "view") {
                      this.submitLoading = false;
                    } else {
                      this.submitLoading = false;
                    }
                    //重名
                  } else {
                    this.submitLoading = false;
                    return this.$message.error("该角色已经存在，请重新输入！");
                  }
                } else {
                  this.submitLoading = false;
                }
              });
          } else {
            this.submitLoading = false;
          }
        }
      });
      this.visibleHandle = false;
    },
    handleClose() {
      this.flowIdOrFlowCode = "flowCode";
      this.warningMessageVisible = false;
      this.$message.closeAll();
      this.submitLoading = false;
      // 清空虚拟列表选项
      this.$refs.vxeTable.setCheckboxRow([], true);
      this.updateVis(false);
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
    //   "flowId",
      "isApply",
      "illustration",
      "businessFlowId",
      "flowCode",
      "flowVersion",
      "lifespanType",
    ];
    this.disFields = [];
  },
  created() {
    this.dto.appCode = this.query.appCode;
    this.dto.tenementCode = this.tenementInfoObj.tenementCode;
  },
  mounted() {
    //由于三个组件通用 上来添加的默认就是这个名字
    this.titleName = this.buttonData("tjcdjs").name;
  },
};
</script>

<style lang="scss" scoped>
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
  display: inline-block;
  width: 250px;
  text-align: center;
}

.header2 {
  display: inline-block;
  width: 370px;
  text-align: center;
}

.header3 {
  display: inline-block;
  width: 140px;
  text-align: center;
}

.header4 {
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
  display: -moz-inline-box;
  display: inline-block;
  width: 400px;
}

.el-tree /deep/ .custom-tree-node .span2 {
  display: -moz-inline-box;
  display: inline-block;
  width: 300px;
  position: absolute;
  left: 400px;
  overflow: hidden;
  text-align: left;
}

.el-tree /deep/ .custom-tree-node .span3 {
  display: -moz-inline-box;
  display: inline-block;
  position: absolute;
  width: 100px;
  left: 650px;
  overflow: hidden;
  text-align: center;
}

.el-tree /deep/ .custom-tree-node .span3_1 {
  display: -moz-inline-box;
  display: inline-block;
  position: absolute;
  width: 100px;
  left: 650px;
  overflow: hidden;
  text-align: center;
}

.el-tree /deep/ .custom-tree-node .span4 {
  display: -moz-inline-box;
  display: inline-block;
  position: absolute;
  width: 70px;
  left: 750px;
  overflow: hidden;
  text-align: center;
}

.el-tree /deep/ .custom-tree-node .span5 {
  display: -moz-inline-box;
  display: inline-block;
  position: absolute;
  width: 70px;
  left: 580px;
  overflow: hidden;
  text-align: center;
  color: red;
}

.style-el-button {
  display: inline;
  float: right;
}

.search-form-el-row {
  display: flex;
  align-items: center;
  height: 4rem;
  background: #ffffff;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  &:hover {
    border-color: #3c6ef0;
  }
  .search-input {
    float: left;
    margin-left: 0.5rem;
    margin-right: 13rem;
  }
  .search-button {
    float: right;
    margin-right: 0.5rem;
  }
}
</style>
