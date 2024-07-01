<template>
  <!-- :title="action=='add'?'添加子菜单':'编辑子菜单'"-->
  <basic-dialog
    :visible="visible"
    :title="addOrEdit"
    :width="720"
    :update-vis="updateVis"
    :handle-close="handleClose"
    :handle-closed="handleClosed"
    :handle-ok="handleOk"
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
              <el-form-item label="菜单编码" prop="resourceCode">
                <el-input
                  :disabled="action == 'edit'"
                  v-model.trim="dto.resourceCode"
                  placeholder="请输入中文、英文、数字、-、_、{、:、/、#、$、}、.、\"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="20">
              <el-form-item label="菜单名称" prop="resourceName">
                <el-input v-model.trim="dto.resourceName" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="action == 'edit'" :gutter="24">
            <el-col :span="20">
              <el-form-item label="菜单序号" prop="resourceSeq">
                <el-input-number
                  v-model="dto.resourceSeq"
                  :min="1"
                  :max="10000"
                  :step-strictly="true"
                  :precision="0"
                ></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="20">
              <el-form-item label="类型" prop="resourceType">
                <el-select
                  clearable
                  filterable
                  v-model="dto.resourceType"
                  placeholder=""
                >
                  <el-option
                    v-for="(item, key) of resourceTypeList"
                    :key="key"
                    :label="item"
                    :value="+key"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="20">
              <el-form-item label="URL" prop="resourceUrl">
                <el-input v-model="dto.resourceUrl" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="20">
              <el-form-item label="Icon" prop="icon">
                <el-input v-model="dto.icon" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24" v-if="safetySwitch">
            <el-col :span="20">
              <el-form-item label="是否敏感资源" prop="sensitiveMark">
                <el-select
                  clearable
                  filterable
                  v-model="dto.sensitiveMark"
                  placeholder=""
                >
                  <el-option
                    v-for="(item, key) of sensitiveMarkList"
                    :key="key"
                    :label="item"
                    :value="+key"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row
            :gutter="24"
            v-if="safetySwitch && this.dto.sensitiveMark === 1"
          >
            <el-col :span="20">
              <el-form-item label="敏感数据类型" prop="sensitiveType">
                <el-select
                  clearable
                  filterable
                  v-model="dto.sensitiveType"
                  placeholder=""
                >
                  <el-option
                    v-for="(item, key) of sensitiveTypeList"
                    :key="key"
                    :label="item"
                    :value="+key"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="24" v-if="safetySwitch">
            <el-col :span="20">
              <el-form-item label="高危类别" prop="highRiskType">
                <el-select
                  clearable
                  filterable
                  v-model="dto.highRiskType"
                  placeholder=""
                >
                  <el-option
                    v-for="(item, key) of highRiskTypeList"
                    :key="key"
                    :label="item"
                    :value="+key"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row
            :gutter="24"
            v-if="this.$store.state.menuResource.appSource === 'LCP'"
          >
            <el-col :span="20">
              <el-form-item label="软件资源自定义字段" prop="extendedField">
                <el-input
                  clearable
                  v-model="dto.extendedField"
                  type="textarea"
                  :rows="3"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row
            :gutter="24"
            v-for="(item, index) of extendFields"
            :key="index"
          >
            <el-col :span="20">
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
          </el-row>
          <el-row :gutter="24">
            <el-col :span="20">
              <el-form-item label="备注" prop="remark">
                <el-input
                  clearable
                  v-model="dto.remark"
                  type="input"
                  :rows="3"
                  maxlength="121"
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
import EntityDialog from "@/mixins/entityDialog";

export default {
  mixins: [EntityDialog],
  props: {
    queryObj: Object,
    tenementInfoObj: Object,
    level: Number,
    parentId: Number,
  },
  data() {
    return {
      rules: {
        resourceName: [
          { required: true, message: "请输入菜单名称", trigger: "blur" },
          // { pattern: CNST.REG_EXP.NORMAL, message: "菜单名称不可输入特殊字符" },
          { max: 50, message: "菜单名称长度不能超过50个字符" },
        ],
        resourceCode: [
          { required: true, message: "请输入菜单编码", trigger: "blur" },
          {
            pattern: CNST.REG_EXP.NORMAL_RESOURCE,
            message: "菜单编码支持中文、英文、数字、-、_、{、:、/、#、$、}",
          },
          { max: 50, message: "菜单编码不超过50个字符" },
          // {
          //   pattern: /^[a-zA-Z0-9_.\/-]{1,50}$/,
          //   // maxLength: 50, // 这个没有生效
          //   message: "50个字符(字母、数字、下划线、中划线、“.”、“/”)",
          // },
          {
            validator: (rule, value, callback) => {
              if (this.action == "add") {
                api.menuResource
                  .exist({
                    data: {
                      appCode: this.queryObj.appCode,
                      resourceCode: this.dto.resourceCode,
                      tenementCode: this.tenementInfoObj.tenementCode,
                      //  resourceName: this.dto.resourceName
                    },
                  })
                  .then((res) => {
                    if (res && res.code == "200") {
                      if (res.data) {
                        return callback(
                          new Error("菜单编码已存在，请重新命名")
                        );
                      } else {
                        return callback();
                      }
                    } else if (res.code == "300") {
                      return;
                    } else if (res) {
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
        resourceType: [
          { required: true, message: "请选择类型", trigger: "change" },
        ],
        sensitiveMark: [
          { required: true, message: "请选择是否敏感资源", trigger: "change" },
        ],
        highRiskType: [{ required: false }],
        resourceUrl: [
          { max: 400, message: "域名长度不能超过400个字符", trigger: "change" },
          { pattern: CNST.REG_EXP.URLPLUS, message: "域名格式不正确" },
        ],
        icon: [
          { max: 400, message: "Icon长度不能超过50个字符", trigger: "change" },
        ],
        resourceSeq: [
          { required: true, message: "请输入菜单序号", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              let data = {};
              if (this.action == "add") {
                data = {
                  appCode: this.queryObj.appCode,
                  resourceSeq: this.dto.resourceSeq,
                  tenementCode: this.tenementInfoObj.tenementCode,
                  level: this.level,
                  resourceCode: this.dto.resourceCode,
                  parentId: this.$store.state.menuResource.parentId,
                };
              } else {
                data = {
                  appCode: this.queryObj.appCode,
                  resourceSeq: this.dto.resourceSeq,
                  id: this.dto.id,
                  tenementCode: this.tenementInfoObj.tenementCode,
                  level: this.dto.level,
                  resourceCode: this.dto.resourceCode,
                  parentId: this.$store.state.menuResource.parentId,
                };
              }
              api.menuResource
                .seqExist({
                  data,
                })
                .then((res) => {
                  if (res && res.code == "200") {
                    if (res.data) {
                      return callback(new Error("菜单序号已存在，请重新输入"));
                    } else {
                      return callback();
                    }
                  } else {
                    this.$message.error(
                      (res && res.msg) || res.errorCode || "请联系管理员"
                    );
                  }
                });
            },
            trigger: "blur",
          },
        ],
        remark: [
          { max: 120, message: "备注长度不能超过120个字符" },
        ],
      },
      resourceTypeList: CNST.ENUMS.resourceType,
      addOrEdit: null,
      safetySwitch: null,
      sensitiveMarkList: CNST.ENUMS.yesOrNo,
      highRiskTypeList: CNST.ENUMS.highRiskType,
      sensitiveTypeList: CNST.ENUMS.sensitiveType,
    };
  },
  created() {
    //上两行必传 level字段后非必传
    this.allFields = [
      "resourceName",
      "resourceCode",
      "resourceType",
      "resourceUrl",
      "icon",
      "resourceSeq",
      { key: "appCode", default: 1 },
      { key: "appId", default: 1 },
      { key: "level", default: 1 },
      { key: "tenementId", default: this.tenementInfoObj.id },
      { key: "tenementCode", default: this.tenementInfoObj.tenementCode },
      "parentId",
      { key: "resourceSource", default: "in" },
      "remark",
      "id",
    ];
    (this.disFieldKeys = []), (this.addOrEdit = this.buttonData("tjzcd").name);
  },
  methods: {
    handleClose() {
      this.updateVis(false);
      this.$refs["form"].resetFields();
      this.dto = {
        extendedField: undefined,
        resourceName: undefined,
        resourceCode: undefined,
        resourceType: undefined,
        resourceSeq: undefined,
        resourceUrl: undefined,
        icon: undefined,
        remark: undefined,
      };
    },
    toEnd() {
      //重新整理 修改入参  10.17
      if (this.action === "add") {
        this.dto = Object.assign(
          {},
          this.dto,
          { appCode: this.queryObj.appCode },
          { appId: this.queryObj.appId },
          { tenementId: this.tenementInfoObj.id },
          { tenementCode: this.tenementInfoObj.tenementCode },
          { level: 1 },
          { parentId: undefined },
        );
      }
      return this.dto;
    },
    async queryExtendField() {
      this.extendFields = [];
      this.extendFieldKeys = [];
      const params = { data: { tenementCode: this.tenementCode ,appCode:this.queryObj.appCode} };
      const { code, data } = await api.menuResource.queryExtendField(params);
      if (code === 200) {
        this.handleSetExtendFields(data || []);
      }
    },
    querySafetySwitch() {
      api.apps
        .querySafetySwitch({
          tenementCode: this.tenementCode,
          appCode: this.queryObj.appCode,
        })
        .then((res) => {
          if (res && res.code === 200 && res.data != null) {
            this.safetySwitch = res.data;
          }
        });
    },
  },
  watch: {
    visible(vis) {
      if (vis) {
        this.queryExtendField();
        this.querySafetySwitch();
      }
      if (this.action == "add") {
        this.addOrEdit = this.buttonData("tjzcd").name;
      } else {
        this.addOrEdit = this.buttonData("bjcdzy").name;
      }
    },
  },
};
</script>
