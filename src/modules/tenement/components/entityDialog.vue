<template>
  <basic-dialog
    :visible="visible"
    :title="action == 'add' ? '添加租户' : '编辑租户'"
    :width="720"
    :update-vis="updateVis"
    :handle-close="handleClose"
    :handle-closed="handleClosed"
    :handle-ok="handleOk"
    :handle-open="handleOpen"
    :okText="this.action == 'add' ? '确认' : '保存'"
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
              <el-form-item label="租户编码" prop="tenementCode">
                <el-input
                  v-model.trim="dto.tenementCode"
                  :disabled="isDisabled('tenementCode')"
                  placeholder="请输入英文、数字、_、-"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="租户名称" prop="tenementName">
                <el-input v-model.trim="dto.tenementName" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="安全合规" prop="safetySwitch">
                <el-select v-model="dto.safetySwitch" :maxlength="30" clearable>
                  <el-option :value="1" label="开启"></el-option>
                  <el-option :value="0" label="关闭"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="备注" prop="remark">
                <el-input
                  clearable
                  v-model="dto.remark"
                  type="textarea"
                  :disabled="this.action == 'view'"
                  :rows="3"
                  :maxlength="120"
                />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="租户负责人" prop="principal">
                <el-input v-model="dto.principal" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="租户负责人erp" prop="principalErpCode">
                <el-input v-model="dto.principalErpCode" />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="所属数据库" prop="did">
                <el-select v-model="dto.did" :disabled="action != 'add'">
                    <el-option
                      v-for="item in state.didList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
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
          <el-row :gutter="24">
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
          </el-row>
        </div>
      </div>
    </el-form>
  </basic-dialog>
</template>

<script>
import EntityDialog from "@/mixins/entityDialog";

export default {
  props: {
    state: Object
  },
  mixins: [EntityDialog],
  data() {
    return {
      rules: {
        tenementName: [
          { required: true, message: "请输入租户名称" },
          // { pattern: CNST.REG_EXP.NORMAL, message: "租户名称不包含特殊字符" },
          { max: 40, message: "租户名称长度不能超过40个字符" },
        ],
        tenementCode: [
          { required: true, message: "请输入租户编码" },
          { pattern: CNST.REG_EXP.ENGNUMLINE, message: "租户编码支持英文、数字、-、_" },
          { max: 40, message: "应用编码长度不能超过40个字符" },
        ],
        remark: [
          { max: 120, message: "备注长度不能超过120个字符" },
        ],
        did: [
          { required: true, message: "请选择所属数据库" },
        ],
        safetySwitch: [
          { required: true, message: "请选择安全合规状态" },
          { pattern: CNST.REG_EXP.NUMBER, message: "安全合规状态有误" },
        ],
        principal: [{ required: true, message: "请输入租户负责人", trigger: "blur" }],
        principalErpCode: [
          { required: true, message: "请输入租户负责人erp", trigger: "blur" },
        ],
      },
      // dbs: CNST.ENUMS.didList
    };
  },
  beforeCreate() {
    this.allFields = [
      "tenementName",
      "tenementCode",
      "remark",
      "id",
      "safetySwitch",
      "principal",
      "principalErpCode",
      "orgSelectStyle",
      "enableOrgSelect",
      "did"
    ];
    this.disFieldKeys = ["tenementCode"];
  },
  methods: {
    handleClose() {
      this.updateVis(false);
      this.$refs["form"].resetFields();
      this.updateState("entity");
      this.dto.tenementName = undefined;
      this.dto.tenementCode = undefined;
      this.dto.remark = undefined;
      this.dto.safetySwitch = undefined;
      this.dto.principal = undefined;
      this.dto.principalErpCode = undefined;
      this.dto.orgSelectStyle = undefined;
      this.dto.enableOrgSelect = undefined;
      this.dto.did = undefined;
    },
    handleOpen() {
      if (this.action == "add") {
        this.$set(this.dto, "safetySwitch", 1);
        this.$set(this.dto, "orgSelectStyle", 1);
        this.$set(this.dto, "enableOrgSelect", true);
      }
    },
  },
};
</script>
