<template>
  <basic-dialog
    :visible="visible"
    :title="title"
    :width="520"
    :update-vis="updateVis"
    :handle-close="handleClose"
    :handle-closed="handleClosed"
    :handle-ok="handleOk"
    @update:noWord="noWord = $event"
  >
    <el-form
      ref="form"
      size="small"
      label-position="right"
      label-width="108px"
      :model="dto"
      :rules="rules"
      @submit.native.prevent
    >
      <div class="entity-dlg__block">
        <div class="entity-dlg__block-bd">
          <el-row :gutter="24">
            <el-col :span="20" v-for="(item, index) in dto.fields" :key="index">
              <template v-if="item.type === 'input'">
                <el-form-item
                  :label="item.name"
                  :prop="'fields.' + index + '.value'"
                  :rules="item.rules"
                >
                  <el-input
                    :placeholder="'请输入' + item.name"
                    v-model.trim="item.value"
                  />
                </el-form-item>
              </template>
              <template v-else-if="item.type === 'select'">
                <el-form-item id="hh">
                  <div slot="label">
                    <span class="logo">*</span> {{ item.name }}
                  </div>

                  <el-cascader
                    placeholder="请输入机构名称"
                    v-if="!radio"
                    :options="item.options"
                    v-model="cascaderValue"
                    :show-all-levels="true"
                    :props="defaultParams"
                    @change="changeNoWord"
                  >
                    <template slot-scope="{ data }">
                      <span>{{ data.label }}（{{ data.orgCode }}）</span>
                    </template>
                  </el-cascader>

                  <el-select
                    v-else
                    v-model="selectValue"
                    filterable
                    remote
                    clearable
                    placeholder="请输入机构名称"
                    :remote-method="remoteMethod"
                    :loading="loading"
                    @change="changeOrgCodeList1"
                  >
                    <!-- 需要显示全路径,因此是orgFullName -->
                    <el-option
                      v-for="item in options"
                      :key="item.orgFullName"
                      :label="item.orgFullName.replace(/ > /g, ' / ')"
                      :value="item.value"
                      style="height: 50px; line-height: normal !important"
                    >
                      <div
                        style="
                          margin-top: 8px;
                          font-size: 14px;
                          text-overflow: ellipsis;
                          overflow: hidden;
                        "
                        :title="item.orgName"
                      >
                        {{ item.orgName }} ( {{ item.orgCode }} )
                      </div>
                      <span
                        style="
                          font-size: 12px;
                          color: #b4b4b4;
                          text-overflow: ellipsis;
                          overflow: hidden;
                        "
                        :title="item.orgFullName"
                        >{{ item.orgFullName }}</span
                      >
                    </el-option>
                  </el-select>
                  <div v-if="noWord" class="alert">请输入机构名称</div>
                </el-form-item>
                <el-form-item>
                  <el-switch v-show="showSwitch" v-model="radio"></el-switch>
                </el-form-item>
              </template>
              <template v-else-if="item.type === 'enums'">
                <el-form-item
                  :label="item.name"
                  :prop="'fields.' + index + '.value'"
                  :rules="item.rules"
                >
                  <el-select
                    v-model="item.value"
                    placeholder="请选择"
                    clearable
                    filterable
                  >
                    <el-option
                      v-for="subItem in item.enums"
                      :key="subItem.code"
                      :label="subItem.label"
                      :value="subItem.value"
                    />
                  </el-select>
                </el-form-item>
              </template>
              <template v-else>
                <input type="hidden" :value="item.value" disabled />
              </template>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-form>
  </basic-dialog>
</template>

<script>
import { mapState } from "vuex";
import BasicDialog from "@/components/basicDialog";
import axios from "axios";
const ACTIONS = {
  add: "新增",
  view: "查看",
  edit: "编辑",
};
export default {
  components: {
    BasicDialog,
  },
  props: {
    moduleName: String,
    state: {
      type: Object,
      default() {
        return {};
      },
    },
    visible: {
      type: Boolean,
      default: false,
    },
    // add | view | edit
    action: {
      type: String,
      default: "add",
    },
    entity: {
      type: Object,
      default() {
        return {};
      },
    },
    cascaderValue1: {
      default() {
        return {};
      },
    },
    selectValue1: {
      default() {
        return {};
      },
    },

    updateVis: {
      type: Function,
      default: () => {},
    },
    updateState: {
      type: Function,
      default: () => {},
    },
    handleSave: {
      type: Function,
      default: () => {},
    },
  },
  computed: {
    ...mapState("app", ["tenementCode"]),
    title() {
      return (ACTIONS[this.action] || this.action) + this.moduleName;
    },
    showFt() {
      return this.action !== "view";
    },
  },
  mounted() {
  },
  data() {
    return {
      dto: {},
      noWord: false,
      // cascaderValue: "",
      // selectValue: "",
      cascaderValue: "",
      selectValue: "",
      rules: {
        cascaderValue: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
        ],
        selectValue: [
          { required: true, message: "请选择活动区域", trigger: "change" },
        ],
      },
      allFields: [],
      showSwitch: true,
      defaultParams: {
        label: "label",
        value: "value",
        children: "children",
        checkStrictly: true,
      },
      options: [],
      radio: false,
      loading: false,
    };
  },
  created() {
    axios({
      method: "post",
      url: "/tenement/getTenementById.do",
      data: {
        tenementCode: this.tenementCode,
      },
      params:{
        tenementCode: this.tenementCode,
      }
    })
      .then((resolve) => {
        this.showSwitch = resolve.data.data.enableOrgSelect;
        if (resolve.data.data.orgSelectStyle === 1) {
          this.radio = false;
        } else {
          this.radio = true;
        }
        showSearchSwitch = resolve.data.data.enableOrgSelect;
      })
      .catch((reject) => {
        console.log("getExtByTenementCodeData 请求失败", reject);
      });
  },
  watch: {
    noWord(newVal) {
      const borderSelect = document.querySelector(
        "#hh .el-select input.el-input__inner"
      );
      const borderCascader = document.querySelector(
        "#hh .el-cascader input.el-input__inner"
      );
      if (newVal) {
        borderSelect && borderSelect.classList.add("error");
        borderCascader && borderCascader.classList.add("error");
      } else {
        borderCascader && borderCascader.classList.remove("error");
        borderSelect && borderSelect.classList.remove("error");
      }
    },
    visible: {
      handler(newVal) {
        if (newVal) {
          this.noWord = false;
          this.options = [];
          // currentFiles: 数据类型的扩展字段fields
          this.allFields = this.state.currentFiles;
          this.dto = this.toFront();
          if (this.action === "add") {
            (this.cascaderValue = ""), (this.selectValue = "");
          } else {
            this.selectValue = _.cloneDeep(this.selectValue1);
            this.cascaderValue = _.cloneDeep(this.cascaderValue1);
          }
        }
      },
      immediate: true,
    },
    // selectValue1: {
    //   handler(newVal) {
    //     if (newVal) {
    //       // currentFiles: 数据类型的扩展字段fields
    //       this.selectValue = _.cloneDeep(newVal);
    //     }
    //   },
    //   immediate: true,
    // },
    // cascaderValue1: {
    //   handler(newVal) {
    //     if (newVal) {
    //       // currentFiles: 数据类型的扩展字段fields
    //       this.cascaderValue = _.cloneDeep(newVal);
    //     }
    //   },
    //   immediate: true,
    // },
  },
  methods: {
    formatOptionValue(item) {
      // item.parentIds.split()
      return item.value;
    },

    getFieldKeys(fields = []) {
      const keys = [];
      for (let i = 0, len = fields.length; i < len; i++) {
        if (_.isObject(fields[i])) {
          keys[i] = fields[i].key;
        } else {
          keys[i] = fields[i];
        }
      }
      return keys;
    },
    isDisabled(field) {
      if (this.action === "add") {
        return false;
      } else if (this.action === "view") {
        return true;
      } else {
        if (this.disFieldKeys.indexOf(field) !== -1) {
          return true;
        }
        return false;
      }
    },
    getDefaultDto() {
      const fields = [
        ..._.cloneDeep(this.allFields),
        ..._.cloneDeep(this.state.DEFAULTFIELDS),
      ];
      const dto = {
        fields,
      };
      for (let i = 0, len = fields.length; i < len; i++) {
        if (_.isObject(fields[i])) {
          tools.setKeys(
            fields,
            fields[i].key,
            fields[i].default,
            "value",
            this.state.orgTreeList
          );
        }
      }
      return dto;
    },
    toFront() {
      const defaultDto = this.getDefaultDto();
      const fields = defaultDto.fields;
      const entity = _.cloneDeep(this.entity);
      // 'belongOrgId'：entity和item都要有这个属性，否则会出异常
      if (entity.id !== undefined) {
        fields.forEach((item) => {
          if (_.isObject(item)) {
            tools.setKeys(
              fields,
              item.key,
              entity[item.key],
              "value",
              this.state.orgTreeList
            );
          }
        });
      }
      // add rules
      fields.forEach((item) => {
        if (!_.isObject(item)) return;

        if (item.type === "select") {
          item.rules = [
            {
              required: item.required,
              trigger: "change",
              message: `请选择${item.name}`,
            },
          ];
        } else if (item.type === "input") {
          item.rules = [
            {
              required: item.required,
              trigger: ["blur", "chamge"],
              message: `请输入${item.name}`,
            },
            { max: 100, message: item.name + "长度不能超过100个字符" },
          ];
        } else {
          item.rules = [
            {
              required: item.required,
              trigger: "change",
              message: `请选择${item.name}`,
            },
          ];
        }
      });
      return {
        fields,
      };
    },
    toEnd() {
      const params = {};
      const state = this.state;
      const fields = this.dto.fields;
      if (fields && fields.length) {
        fields.forEach((item) => {
          params[item["key"]] = item["value"];
        });
      }
      // type 为hidden的 如果state定义 ，以state为准
      const defaultFields = state.DEFAULTFIELDS;
      if (defaultFields && defaultFields.length) {
        defaultFields.forEach((item) => {
          const key = item["key"];
          const value = item["value"];
          // belongOrgId字段由数组转为字符串
          if (item.type === "select" && params[key]) {
            params[key] = params[key][params[key].length - 1];
          } else if (tools.isEmpty(value) && !tools.isEmpty(state[key])) {
            // state中有值得选state中值
            params[key] = state[key];
          }
        });
      }
      return params;
    },
    handleClose() {
      this.updateVis(false);
      this.noWord = false;
    },
    handleClosed() {
      this.updateState("entity");
      if (this.$refs.form) {
        this.$nextTick(() => {
          this.$refs.form.clearValidate();
        });
      }
    },
    handleOk() {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return false;
        } else {
          const params = this.toEnd();

          if (this.radio === false && this.cascaderValue.length > 0) {
            params.belongOrgId =
              this.cascaderValue[this.cascaderValue.length - 1];
            console.log(this.cascaderValue, "cascaderValue");
            this.noWord = false;
          } else if (this.radio === false && this.cascaderValue.length === 0) {
            this.noWord = true;
          } else if (this.radio === true) {
            if (
              typeof this.selectValue !== "string" &&
              this.selectValue.length > 0
            ) {
              params.belongOrgId =
                this.selectValue[this.selectValue.length - 1];
              this.noWord = false;
            } else if (
              typeof this.selectValue === "string" &&
              this.selectValue !== ""
            ) {
              this.noWord = false;
            } else {
              this.noWord = true;
            }
          }
          if (this.noWord === false) {
            this.handleSave({ params, type: this.action });
          } else {
          }
        }
      });
    },
    handleChange(value) {
    },
    // // 部门搜索
    remoteMethod(queryString, cb) {
      this.loading = true;
      api.users
        .blurryQueryOrg({
          data: {
            orgNameKeyWord: queryString, //机构模糊搜索关键字，可为空，空字符串查所有
            queryChannelNum: 2, //2本地搜索 3远程获取
          },
          page: {
            pageIndex: 1,
            pageSize: 1000000000,
          },
        })
        .then((res) => {
          this.loading = false;
          this.options =
            res.data.rows.filter(
              (item) => item.isHide == null || item.isHide === 0
            ) || [];
          if (this.options.length) {
            this.options.forEach((item) => {
              item.value = JSON.parse(
                `[${item.id}, ${item.parentIds}]`
              ).reverse();
            });
          }
        });
    },
    changeOrgCodeList1(val) {
      if (val) {
        this.noWord = false;
        val;
      }
    },
    changeNoWord() {
      this.noWord = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.alert {
  color: #f56c6c;
  font-size: 12px;
  line-height: 1;
  padding-top: 4px;
  position: absolute;
  top: 100%;
  left: 0;
}
.logo {
  color: #f56c6c;
  // margin-right: -104px;
}
#hh .el-select ::v-deep input.el-input__inner {
  &.error {
    border-color: #f56c6c;
  }
}
#hh .el-cascader ::v-deep input.el-input__inner {
  &.error {
    border-color: #f56c6c;
  }
}
</style>
