<template>
  <basic-dialog
    class="dataTypeDlg"
    :visible="visible"
    :show-ft="action !== 'view'"
    :title="addOrEdit"
    :width="760"
    :update-vis="updateVis"
    :handle-close="handleClose"
    :handle-closed="handleClosed"
    :handle-ok="handleOk"
    :isDisabled="isDisabled"
    :okText="this.action == 'add' ? '确认' : '保存'"
    :close-text="this.action != 'view' ? '取消' : '关闭'"
  >
    <el-form
      ref="form"
      size="small"
      label-position="left"
      label-width="100px"
      :model="dto"
      :rules="rules"
      @submit.native.prevent
    >
      <div class="entity-dlg__block">
        <div class="entity-dlg__block-bd">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="所属系统" prop="appCode">
                <el-select
                  :disabled="isDisabled('appCode')"
                  filterable
                  v-model="dto.appCode"
                  @change="chooseEditParam"
                >
                  <el-option
                    v-for="(item, key) of options"
                    :key="key"
                    :label="item.appName"
                    :value="item.appCode"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="类型名称" prop="typeName">
                <el-input
                  v-model.trim="dto.typeName"
                  :disabled="isDisabled('typeName')"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="类型编码" prop="typeCode">
                <el-input
                  v-model.trim="dto.typeCode"
                  :disabled="isDisabled('typeCode')"
                  placeholder="请输入英文、数字、_、-"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
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
                <el-select
                  v-model="dto.isApply"
                  :disabled="isDisabled('isEffective')"
                >
                  <el-option label="是" :value="0" />
                  <el-option label="否" :value="1" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="12">
              <div
                style="
                  display: flex;
                  justify-content: center;
                  margin-bottom: 1rem;
                  margin-top: 0.6rem;
                "
              >
                <el-radio-group
                  v-model="flowIdOrFlowCode"
                  :disabled="isDisabled('isEffective')"
                >
                  <el-radio label="flowId">新审批流ID</el-radio>
                  <el-radio label="flowCode">流程编码</el-radio>
                </el-radio-group>
              </div>
              <el-form-item v-if="flowIdOrFlowCode === 'flowId'">
                <div slot="label">新审批流ID</div>
                <el-input
                  v-model.trim="dto.businessFlowId"
                  :disabled="isDisabled('isEffective')"
                />
              </el-form-item>
              <el-form-item v-else>
                <div slot="label">流程编码</div>
                <el-input
                  v-model.trim="dto.flowCode"
                  :disabled="isDisabled('isEffective')"
                />
                <div slot="label" style="margin-top: 1rem">版本ID(非必填)</div>
                <el-input
                  style="margin-top: 1rem"
                  v-model.trim="dto.flowVersion"
                  :disabled="isDisabled('isEffective')"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="备注" prop="remark">
                <el-input
                  clearable
                  v-model="dto.remark"
                  type="input"
                  :rows="3"
                  maxlength="121"
                  :disabled="isDisabled('remark')"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <div class="entity-dlg__block">
            <el-table
              max-height="500"
              :data="dto.dataExtInfoList"
              style="width: 100%"
            >
              <el-table-column type="extNo" label="字段序号" width="100">
                <template slot-scope="scope">
                  {{ scope.row.extNo }}
                </template>
              </el-table-column>
              <el-table-column prop="isEffective" label="是否启用">
                <template slot-scope="scope">
                  <el-checkbox
                    v-model="scope.row.isEffective"
                    :disabled="isDisabled('isEffective')"
                    :true-label="1"
                    :false-label="0"
                  ></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column prop="isRequired" label="是否必填字段">
                <template slot-scope="scope">
                  <el-checkbox
                    v-model="scope.row.isRequired"
                    :disabled="isDisabled('isRequired')"
                    :true-label="1"
                    :false-label="0"
                  >
                  </el-checkbox>
                </template>
              </el-table-column>
              <el-table-column property="extName" label="字段名称">
                <template slot-scope="scope">
                  <el-input
                    size="mini"
                    v-model="scope.row.extName"
                    :disabled="isDisabled('extName')"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="isEnum" label="是否枚举类型">
                <template slot-scope="scope">
                  <el-checkbox
                    v-model="scope.row.isEnum"
                    :disabled="isDisabled('isEnum')"
                    :true-label="1"
                    :false-label="0"
                  >
                  </el-checkbox>
                </template>
              </el-table-column>
              <el-table-column width="140" prop="enumValue" label="输入枚举值">
                <template slot-scope="scope">
                  <el-input
                    size="mini"
                    v-model="scope.row.enumValue"
                    :disabled="isDisabled('enumValue')"
                    placeholder="请用英文逗号隔开"
                  />
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </el-form>
  </basic-dialog>
</template>

<script>
import { mapState } from "vuex";
import EntityDialog from "@/mixins/entityDialog";
export default {
  mixins: [EntityDialog],
  props: {
    okText: String,
  },
  data() {
    return {
      rules: {
        typeCode: [
          { required: true, message: "请输入类型编码", trigger: "blur" },
          {
            max: 30,
            message: "类型编码长度不能超过30个字符",
            trigger: ["change", "blur"],
          },
          {
            pattern: CNST.REG_EXP.ENGNUMLINE,
            message: "类型编码支持英文、数字、-、_",
          },
          {
            validator: (rule, value, callback) => {
              if (this.action == "add") {
                api.dataType
                  .codeExist({
                    data: {
                      typeCode: this.dto.typeCode,
                      tenementCode:
                        this.$store.state.app.tenementInfoObj.tenementCode,
                    },
                  })
                  .then((res) => {
                    if (res.code == "200") {
                      if (res.data) {
                        return callback(new Error("已存在该类型编码"));
                      } else {
                        return callback();
                      }
                    } else {
                      this.$message.error(
                        res.msg || res.errorCode || "请联系管理员"
                      );
                      return false;
                    }
                  });
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
        typeName: [
          { required: true, message: "请输入类型名称" },
          { max: 40, message: "类型名称长度不能超过40个字符" },
          {
            validator: (rule, value, callback) => {
              let data = {};
              if (this.action === "add") {
                data = {
                  typeName: this.dto.typeName,
                  tenementCode:
                    this.$store.state.app.tenementInfoObj.tenementCode,
                };
              } else {
                data = {
                  typeName: this.dto.typeName,
                  id: this.dto.id,
                  tenementCode:
                    this.$store.state.app.tenementInfoObj.tenementCode,
                };
              }
              api.dataType
                .nameExist({
                  data,
                })
                .then((res) => {
                  if (res && res.code == "200") {
                    if (res.data) {
                      return callback(new Error("已存在该类型名称"));
                    } else {
                      return callback();
                    }
                  } else if (res) {
                    this.$message.error(
                      res.msg || res.errorCode || "请联系管理员"
                    );
                  }
                });
            },
            trigger: "blur",
          },
        ],
        appName: [{ required: true, message: "请选择所属系统" }],
        appCode: [{ required: true, message: "请选择所属系统" }],
        remark: [{ max: 120, message: "备注长度不能超过120个字符" }],
      },
      appCodeData: "",
      appIdData: "",
      appIdDataEdit: "", //修改时候的必传参数 appId
      addOrEdit: null,
      flowIdOrFlowCode: "flowCode",
    };
  },

  beforeCreate() {
    this.allFields = [
      "typeName",
      "typeCode",
      "remark",
      "appCode",
      "businessFlowId",
      "flowCode",
      "flowVersion",
      "appId",
      "isApply",
      { key: "tenementCode", default: "xinzhou" },
      { key: "tenementId", default: 1 },
      { key: "id", default: "" },
      { key: "source", default: "" },
      {
        key: "dataExtInfoList",
        default: (function () {
          const list = [];
          for (let i = 1; i <= 18; i++) {
            const row = {
              extNo: i,
              extName: "",
              isEffective: 0,
              isShowName: 0,
              isUnique: 0,
              isRequired: 0,
              isEnum: 0,
              enumValue: "",
            };
            if (i === 1) {
              row.typeId = 1;
            }
            list.push(row);
          }
          return list;
        })(),
      },
    ];
    this.disFieldKeys = ["typeCode", "appCode"];
  },
  created() {
    this.addOrEdit = this.buttonData("tjsjlx").name;
  },
  computed: {
    ...mapState("app", ["appList", "tenementCode"]),
    options(newVal) {
      if (this.action === "add" && this.appList.length) {
        this.dto.appCode = this.appList[0].appCode;
        this.dto.appName = this.appList[0].appName;
        this.dto.appId = this.appList[0].id;
      }
      return this.appList;
    },
  },
  methods: {
    //变更所属系统对象
    changeSelectObj(obj) {
      this.dto.appCode = obj.appCode;
      this.dto.appName = obj.appName;
      this.dto.appId = obj.id;
    },
    //修改时数据类型参数
    chooseEditParam() {
      for (let i = 0; i < this.options.length; i++) {
        if (this.options[i].appCode == this.dto.appCode) {
          this.appId = this.options[i].id;
        }
      }
    },
    //重新整理租户参数
    toEnd() {
      //重新整理 修改入参  10.18 this.$store.getters.tenementCode
      if (this.action == "add") {
        this.dto = Object.assign(
          {},
          this.dto,
          { tenementId: this.$store.state.app.tenementInfoObj.id },
          { tenementCode: this.$store.state.app.tenementInfoObj.tenementCode }
        );
      }
      return this.dto;
    },

    handleClose() {
      this.updateVis(false);
      this.$refs["form"].resetFields();
      this.updateState("entity");
      this.dto.typeName = undefined;
      this.dto.typeCode = undefined;
      this.dto.remark = undefined;
      this.dto.businessFlowId = undefined;
      this.dto.appCode = undefined;
      this.dto.appName = undefined;
      this.dto.dataExtInfoList.forEach((item, index) => {
        item.extNo = index + 1;
        item.extName = "";
        item.isEffective = 0;
        item.isShowName = 0;
        item.isUnique = 0;
        item.isRequired = 0;
        item.isEnum = 0;
        item.enumValue = "";
      });
    },
    handleOk() {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return false;
        }
        const extFileds = this.checkParams();
        if (extFileds) {
          let topField = this.toEnd();
          if (this.dto.appName) {
            topField = _.omit(topField, "appName");
          }
          let params = Object.assign({}, topField, {
            dataExtInfoList: extFileds,
          });
          if (this.action == "edit") {
            params.appId = this.appId;
          }
          if (this.flowIdOrFlowCode === "flowCode") {
            params.businessFlowId = null;
          } else {
            params.flowCode = null;
            params.flowVersion = null;
          }
          this.handleSave({ params, type: this.action });
        }
      });
    },
    checkParams() {
      const extFileds = _.cloneDeep(this.dto.dataExtInfoList);
      if (!extFileds.some((item) => item.isRequired === 1)) {
        this.$message.error("必须有一个必填字段");
        return;
      }
      for (let i = 0, len = extFileds.length; i < len; i++) {
        const row = extFileds[i];
        const nextRow = i !== len - 1 ? extFileds[i + 1] : {};
        if (
          row.isEffective === 0 &&
          nextRow.isEffective === 1 &&
          i !== len - 1
        ) {
          this.$message.error("请依次启用扩展字段");
          return;
        }
        // 將null&undefined轉為字符串
        row.enumValue =
          typeof row.enumValue === "string" ? row.enumValue.trim() : "";
        row.extName =
          typeof row.extName === "string" ? row.extName.trim() : row.extName;
        if (row.isEffective === 1 && _.isEmpty(row.extName)) {
          this.$message.error("请填写启用字段的字段名称");
          return;
        }
        if (typeof row.extName === "string" && row.extName.length > 20) {
          this.$message.error(
            `字段序号${row.extNo}的字段名称最多可输入20个字符`
          );
          return;
        }
        if (
          row.isEffective === 1 &&
          !CNST.REG_EXP.ENGNUMLINEZH.test(row.extName)
        ) {
          this.$message.error(
            `字段序号${row.extNo}的字段名称只允许输入数字，字母，下划线，中文`
          );
          return;
        }
        if (typeof row.enumValue === "string" && row.enumValue.length > 500) {
          this.$message.error(
            `字段序号${row.extNo}的枚举值最多可输入500个字符`
          );
          return;
        }
        if (row.isEnum === 1 && _.isEmpty(row.enumValue.trim())) {
          this.$message.error("枚举类型的枚举值不允许为空");
          return;
        }
        // 不允许最后一个字符为逗号
        if (
          row.isEnum === 1 &&
          row.enumValue.length &&
          row.enumValue[row.enumValue.length - 1] === ","
        ) {
          this.$message.error(
            `字段序号${row.extNo}枚举值尾部不允许有多余的逗号`
          );
          return;
        }
        if (row.isEnum === 1 && !_.isEmpty(row.enumValue)) {
          const enumStr = row.enumValue;
          if (enumStr.includes(",")) {
            const keys = [];
            const values = [];
            const array = enumStr.split(",");
            for (let j = 0; j < array.length; j++) {
              if (!CNST.REG_EXP.ENUM_VALUE_STR.test(array[j])) {
                this.$message.error(
                  `字段序号${row.extNo}的枚举值需要以: 展示值:Value值这种格式出现，英文冒号和逗号为分隔符，除分隔符外可以输入数字、字母、下划线、中文`
                );
                return;
              }
              const itemInfo = array[j].split(":");
              const itemKey = itemInfo[0].trim();
              const itemValue = itemInfo[1].trim();
              if (!itemKey || !itemValue) {
                this.$message.error(`字段序号${row.extNo}的key或value不能为空`);
                return;
              }
              if (keys.includes(itemKey)) {
                this.$message.error(
                  `字段序号${row.extNo}枚举值的key值${itemKey}不允许重复`
                );
                return;
              } else {
                keys.push(itemKey);
              }
              if (values.includes(itemValue)) {
                this.$message.error(
                  `字段序号${row.extNo}枚举值的value值${itemValue}不允许重复`
                );
                return;
              } else {
                values.push(itemValue);
              }
            }
          } else if (!CNST.REG_EXP.ENUM_VALUE_STR.test(enumStr)) {
            this.$message.error(
              `字段序号${row.extNo}的枚举值需要以: 展示值:Value值这种格式出现，英文冒号和逗号为分隔符，除分隔符外可以输入数字、字母、下划线、中文`
            );
            return;
          }
        }
      }
      return extFileds;
    },
  },
  watch: {
    dto(newVal) {
      if (this.action != "add") {
        const dtoArrLength = this.dto.dataExtInfoList.length;
        for (let i = 0; i < 18 - dtoArrLength; i++) {
          this.dto.dataExtInfoList.push({
            extNo: dtoArrLength + i + 1,
            extName: "",
            isEffective: 0,
            isShowName: 0,
            isUnique: 0,
            typeId: "",
            isRequired: 0,
            isEnum: 0,
            enumValue: "",
          });
        }
      }
    },
    visible(newVal) {
      if (newVal) {
        this.flowIdOrFlowCode = "flowCode";
        if (this.action === "add" && this.appList.length) {
          this.dto.appCode = this.appList[0].appCode;
          this.dto.appName = this.appList[0].appName;
          this.dto.appId = this.appList[0].id;
        } else {
          if (!this.dto.flowCode && this.dto.businessFlowId) {
            this.flowIdOrFlowCode = "flowId";
          }
        }
      }
    },
    action(newVal) {
      if (newVal == "add") {
        this.addOrEdit = this.buttonData("tjsjlx").name;
      } else if (newVal == "edit") {
        this.addOrEdit = this.buttonData("bjsjlx").name;
      } else {
        this.addOrEdit = this.buttonData("sjlxxq").name;
      }
    },
  },
};
</script>

<style lang="scss" scope>
.dataTypeDlg {
  .el-table .cell {
    text-align: center;
  }
}
</style>
