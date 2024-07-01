<template>
  <basic-dialog
    :visible="visible"
    title="配置审批流"
    :width="720"
    :update-vis="updateVis"
    :handle-close="handleClose"
    :handle-ok="handleOk"
    :handle-closed="handleClosed"
    :handle-open="handleOpen"
    okText="确认"
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
            <el-col :span="20">
              <el-form-item prop="startFlow">
                <div slot="label">
                  开启审批流
                  <el-tooltip class="item" effect="dark" placement="top">
                    <div slot="content">
                      配置后，用户可在【ERP-流程中心】中自主申请或代人<br />
                      申请菜单角色、数据角色等权限，管理员审批通过即可完<br />
                      成相关权限申请。<a
                        href="http://lcp.jdl.com/#/docSoftwareSystem/24/52741"
                        style="color: #2e8ff4"
                        >查看操作说明</a
                      >
                    </div>
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </div>
                <el-switch v-model="dto.startFlow" @change="handleStartFlow" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24" v-bind:style="styleObject">
            <el-col :span="20">
              <el-form-item prop="bpmVersion">
                <div slot="label">审批系统</div>
                <el-radio-group v-model="dto.bpmVersion">
                  <el-radio :label="1">bpm1.0</el-radio>
                  <el-radio :label="2">bpm2.0</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24" v-bind:style="styleObject">
            <el-col :span="20">
              <el-form-item prop="flowId">
                <div slot="label">
                  流程ID
                  <el-tooltip class="item" effect="dark" placement="top">
                    <div slot="content">
                      在审批平台配置审批流后即可获取审批流ID。<a
                        href="http://lcp.jdl.com/#/docSoftwareSystem/19/521"
                        style="color: #2e8ff4"
                        >查看操作说明</a
                      >
                    </div>
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </div>
                <el-input v-model="dto.flowId" />
              </el-form-item>
            </el-col>
          </el-row>
          <!-- <el-row :gutter="24" v-bind:style="styleObject">
            <el-col :span="20">
              <el-form-item>
                <div slot="label">
                  机构默认选择方式
                  <el-tooltip class="item" effect="dark" placement="top">
                    <div slot="content">
                      用于控制机构的默认选择方式，若为模糊搜索，则界面展<br />示搜索框供用户搜索机构名称，若为级联选择，则界面默<br />认展示级联选择供用户通过机构层级关系选择机构。
                    </div>
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </div>
                <el-radio-group v-model="dto.orgSelectStyle">
                  <el-radio :label="1">级联选择</el-radio>
                  <el-radio :label="2">模糊搜索</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24" v-bind:style="styleObject">
            <el-col :span="20">
              <el-form-item>
                <div slot="label">
                  显示模糊搜索开关
                  <el-tooltip class="item" effect="dark" placement="top">
                    <div slot="content">
                      开启后，用户可在界面上随意切换机构选择方式，若关闭<br />切换，则用户仅能使用机构的默认选择方式来选择机构。
                    </div>
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </div>
                <el-switch v-model="dto.enableOrgSelect" />
              </el-form-item>
            </el-col>
          </el-row> -->
        </div>
      </div>
    </el-form>
  </basic-dialog>
</template>

<script>
import EntityDialog from "@/mixins/entityDialog";
export default {
  mixins: [EntityDialog],
  props: {
    queryObj: Object,
    tenementInfoObj: Object,
  },
  data() {
    const validateBpmVersion = (rule, value, callback) => {
      if (this.dto.startFlow) {
        value ? callback() : callback(new Error("请选择版本"));
      } else {
        callback();
      }
    };
    const validateFlowId = (rule, value, callback) => {
      if (this.dto.startFlow) {
        value ? callback() : callback(new Error("请输入流程ID"));
      } else {
        callback();
      }
    };
    return {
      styleObject: {
        visibility: "hidden",
      },
      rules: {
        bpmVersion: [{ validator: validateBpmVersion }],
        flowId: [
          { validator: validateFlowId },
          { pattern: CNST.REG_EXP.NUMBER, message: "流程ID必须为数字" },
        ],
      },
    };
  },
  beforeCreate() {
    this.allFields = [
      "appCode",
      "startFlow",
      "flowId",
      "bpmVersion",
      "orgSelectStyle",
      "enableOrgSelect ",
    ];
    this.disFieldKeys = ["appCode"];
  },
  methods: {
    handleStartFlow(value) {
      if (value) {
        this.styleObject.visibility = "visible";
      } else if (this.dto.flowId) {
        this.$confirm(
          "关闭后，用户将无法继续在【ERP-流程中心】中自主申请或代人申请权限，涉及线上流程，谨慎操作！",
          "是否关闭审批流",
          {
            confirmButtonText: "仍要关闭",
            cancelButtonText: "不关闭",
            type: "warning",
          }
        )
          .then(() => {
            //确认
            this.styleObject.visibility = "hidden";
            this.dto.bpmVersion = 0;
            this.dto.flowId = undefined;
          })
          .catch(() => {
            //取消
            this.dto.startFlow = true;
          });
      } else {
        this.styleObject.visibility = "hidden";
        this.dto.bpmVersion = 0;
        this.dto.flowId = undefined;
      }
    },
    handleClose() {
      this.updateVis(false);
      this.$refs["form"].resetFields();
      this.updateState("entity");
      this.dto.startFlow = undefined;
      this.dto.flowId = undefined;
      this.dto.bpmVersion = undefined;
    },
    toEnd() {
      //重新整理 修改入参  10.17
      if (this.action == "add") {
        this.dto = Object.assign(
          {},
          this.dto,
          { tenementId: this.tenementInfoObj.id },
          { tenementCode: this.tenementInfoObj.tenementCode }
        );
      }
      return this.dto;
    },
    handleOpen() {
      if (this.dto.flowId) {
        this.$set(this.dto, "startFlow", true);
        this.styleObject.visibility = "visible";
      } else {
        this.$set(this.dto, "startFlow", false);
        this.styleObject.visibility = "hidden";
      }
    },
  },
};
</script>

<style></style>
