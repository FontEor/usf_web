<template>
  <basic-dialog
    :visible="visible"
    :title="title"
    :width="600"
    :update-vis="updateVis"
    :handle-close="handleClose"
    :handle-closed="handleClosed"
    :handle-ok="handleOk"
  >
    <el-form
      ref="form"
      size="small"
      label-position="right"
      label-width="128px"
      :model="dto"
      :rules="rules"
      @submit.native.prevent
    >
      <div class="entity-dlg__block">
        <div class="entity-dlg__block-bd">
          <el-row :gutter="24">
            <el-col :span="20" :offset="1">
              <el-form-item label="用户组编码" prop="groupCode">
                <el-input
                  v-model.trim="dto.groupCode"
                  placeholder="必填"
                  :disabled="!!dto.id"
                />
              </el-form-item>
            </el-col>
            <el-col :span="20" :offset="1">
              <el-form-item label="用户组名称" prop="groupName">
                <el-input v-model.trim="dto.groupName" placeholder="必填" />
              </el-form-item>
            </el-col>

            <el-col :span="20" :offset="1">
              <el-form-item label="备注" prop="remark">
                <el-input
                  v-model="dto.remark"
                  type="input"
                  placeholder="请填写备注"
                />
              </el-form-item>
            </el-col>
            <el-col :span="20" :offset="1">
              <el-form-item
                label="是否可申请"
                prop="isApply"
                :rules="[
                  {
                    required: true,
                    message: '是否可申请不能为空',
                    trigger: 'blur',
                  },
                ]"
              >
                <el-select v-model="dto.isApply">
                  <el-option label="是" :value="0" />
                  <el-option label="否" :value="1" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col
              :span="20"
              :offset="1"
              v-for="item in state.extList"
              :key="item.key"
            >
              <el-form-item
                :label="item.name"
                :prop="item.key"
                :rules="item.rules"
              >
                <el-input
                  v-if="item.type === 'input'"
                  v-model.trim="dto[item.key]"
                  :placeholder="item.placeholder"
                  clearable
                />
                <el-input
                  v-else-if="item.type === 'textarea'"
                  type="textarea"
                  v-model.trim="dto[item.key]"
                  :placeholder="item.placeholder"
                  clearable
                />
                <el-select
                  v-else-if="item.type === 'select'"
                  v-model.trim="dto[item.key]"
                  :placeholder="item.placeholder"
                  clearable
                  filterable
                >
                  <el-option
                    v-for="subItem of item.options"
                    :key="subItem.code"
                    :label="subItem.label"
                    :value="subItem.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="20" :offset="1">
              <div
                style="
                  display: flex;
                  justify-content: center;
                  margin-bottom: 1rem;
                "
              >
                <el-radio-group v-model="flowIdOrFlowCode">
                  <el-radio label="flowId">新审批流ID</el-radio>
                  <el-radio label="flowCode">流程编码</el-radio>
                </el-radio-group>
              </div>
              <el-form-item v-if="flowIdOrFlowCode === 'flowId'">
                <div slot="label">新审批流ID</div>
                <el-input
                  v-model.trim="dto.businessFlowId"
                  placeholder="请填写新审批流ID"
                />
              </el-form-item>
              <el-form-item v-else>
                <div slot="label">流程编码</div>
                <el-input
                  v-model.trim="dto.flowCode"
                  placeholder="请填写流程编码"
                />
                <div slot="label" style="margin-top: 1rem">版本ID(非必填)</div>
                <el-input
                  style="margin-top: 1rem"
                  v-model.trim="dto.flowVersion"
                  placeholder="请填写版本ID"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-form>
  </basic-dialog>
</template>

<script>
// 添加或编辑用户
import EntityDialog from "@/mixins/entityDialog";
import { mapState } from "vuex";
export default {
  mixins: [EntityDialog],

  props: {
    state: {
      type: Object,
      default() {
        return {};
      },
    },
    selectItem: {
      type: Object,
      default() {
        return {};
      },
    },
    treeOrgList: {
      type: Array,
      default() {
        return [];
      },
    },
    winClose: {
      type: Function,
      default() {
        return () => {};
      },
    },
  },
  data() {
    return {
      rules: {
        groupCode: [
          { required: true, message: "请输入用户组编码", trigger: "blur" },
          {
            pattern: CNST.REG_EXP.ENGNUMLINEREDUCEZHPOINT,
            message: "用户组编码仅支持中文、英文、数字、-、_、.",
          },
          {
            max: 80,
            message: "用户组编码长度不能超过80个字符",
            trigger: ["change", "blur"],
          },
        ],
        groupName: [
          { required: true, message: "请输入用户组名称", trigger: "blur" },
          {
            max: 80,
            message: "用户组名称长度不能超过80个字符",
            trigger: ["change", "blur"],
          },
        ],
        remark: [{ max: 120, message: "备注最多120个字符", trigger: "change" }],
      },
      typeFlag: false,
      systype: [],
      flowIdOrFlowCode: "flowCode",
    };
  },
  beforeCreate() {
    this.allFields = [
      "id",
      "groupCode",
      "groupName",
      "remark",
      "businessFlowId",
      "isApply",
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
      "ext11",
      "ext12",
      "ext13",
      "ext14",
      "ext15",
      "ext16",
      "ext17",
      "ext18",
      "ext19",
      "ext20",
      "flowCode",
      "flowVersion",
    ];
    this.disFields = ["userCode"];
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.flowIdOrFlowCode = "flowCode";
        if (this.action === "编辑用户组") {
          if (!this.dto.flowCode && this.dto.businessFlowId) {
            this.flowIdOrFlowCode = "flowId";
          }
        }
      }
    },
  },
  mounted() {},
  methods: {
    // 确定按钮
    handleOk() {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return;
        }
        let params = this.toEnd();
        if (this.flowIdOrFlowCode === "flowCode") {
          params.businessFlowId = null;
        } else {
          params.flowCode = null;
          params.flowVersion = null;
        }
        this.handleSave({ params });
      });
    },
    // 关闭和取消按钮
    handleClose(ev) {
      this.updateState("entity");
      if (this.$refs.form) {
        this.$nextTick(() => {
          this.$refs.form.clearValidate();
        });
      }
      this.winClose(ev);
    },
  },
};
</script>

