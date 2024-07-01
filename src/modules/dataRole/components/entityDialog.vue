<template>
  <basic-dialog
    class="goods-sel-dlg"
    :title="title"
    width="80%"
    :visible="visible"
    :handle-close="handleClose"
    :handle-closed="handleClosed"
    :handle-ok="handleOk"
    :isShowFooterAll="true"
    :showFt="action !== 'view'"
    :okText="okText"
    :closeText="closeText"
  >
    <el-form
      ref="form1"
      class="search-form"
      size="small"
      label-width="100px"
      :model="dto"
      :rules="rules"
    >
      <div class="entity-dlg__block-bd">
        <el-row>
          <el-col :span="8">
            <el-form-item label="角色名称" prop="roleName">
              <el-input
                v-model.trim="dto.roleName"
                clearable
                :disabled="action === 'view'"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="角色编码" prop="roleCode">
              <el-input
                v-model.trim="dto.roleCode"
                placeholder="支持字符如下：中文英文数字-_.=+#()（）&amp;"
                clearable
                :disabled="action !== 'add'"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
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
          <el-col :span="8">
            <el-form-item v-if="this.showFlowID">
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
          <el-col :span="8">
            <el-form-item label="备注" prop="remark">
              <el-input
                v-model="dto.remark"
                clearable
                :disabled="action === 'view'"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="数据类型">
              <el-select
                v-model="query.type"
                clearable
                value-key="id"
                @change="onChangeDataType"
              >
                <el-option
                  v-for="item in types"
                  :key="item.id"
                  :value="item"
                  :label="item.typeName"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div class="col-r"></div>
    </el-form>
    <el-form
      class="search-form"
      size="small"
      label-width="100px"
      :model="query"
    >
      <div class="col-l">
        <el-row>
          <el-col :span="8" v-for="item in activeFields" :key="item.id">
            <el-form-item :label="item.name">
              <el-autocomplete
                v-if="item.type === 'input'"
                v-model.trim="query[item.key]"
                :debounce="500"
                :fetch-suggestions="
                  (value, cb) => querySearchThink(value, cb, item.key)
                "
                :placeholder="'请输入' + item.name"
                :maxlength="30"
                clearable
              >
              </el-autocomplete>
              <el-select
                v-else-if="item.type === 'enums'"
                v-model.trim="query[item.key]"
                :placeholder="`请选择${item.name}`"
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
          </el-col>
          <el-col :span="8">
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
              <el-input v-model.trim="dto.businessFlowId" />
            </el-form-item>
            <el-form-item v-else>
              <div slot="label">流程编码</div>
              <el-input v-model.trim="dto.flowCode" />
              <div slot="label" style="margin-top: 1rem">版本ID(非必填)</div>
              <el-input
                style="margin-top: 1rem"
                v-model.trim="dto.flowVersion"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div class="col-r search-class">
        <el-button type="primary" size="small" @click="handleSearch"
          >查询</el-button
        >
        <el-button size="small" @click="handleReset">重置</el-button>
      </div>
    </el-form>
    <basic-list
      ref="basicList"
      select-type="multiple"
      :tableH="500"
      :show-select-col="list.length !== 0"
      :show-action-col="false"
      :show-index-col="false"
      :fields="fields"
      :setClmnsFlg="false"
      :list="list"
      :loading="loading"
      :total="total"
      :page-index="pageIndex"
      :page-size="pageSize"
      :page-index-change="pageIndexChange"
      :page-size-change="pageSizeChange"
      :selection-change="selectionChange"
      :useRowClick="action !== 'view'"
      :is-tab-disabel="action === 'view'"
    />
  </basic-dialog>
</template>

<script>
import BasicDialog from "@/components/basicDialog";
import BasicList from "@/components/basicList";

const DEFAULTS = {
  loading: false,
  total: 0,
  query: { type: undefined },
  pageIndex: 0,
  pageSize: 10,
  list: [],
  selRows: [],
  types: [],
  activeFields: [],
  rules: {
    roleName: [
      { required: true, message: "请输入角色名称", trigger: "blur" },
      { max: 80, message: "角色名称长度不能超过80个字符" },
    ],
    roleCode: [
      { required: true, message: "请输入角色编码", trigger: "blur" },
      {
        pattern: CNST.REG_EXP.NORMAL_ROLE,
        message: "支持字符如下：中文英文数字-_.=+#()（）&",
        trigger: ["change", "blur"],
      },
      { max: 80, message: "角色编码长度不能超过80个字符" },
    ],
    remark: [{ max: 120, message: "备注长度不能超过120个字符" }],
  },
};

export default {
  components: {
    BasicDialog,
    BasicList,
  },
  props: {
    showFlowID: {
      type: Boolean,
      default: false,
    },
    visible: {
      type: Boolean,
      default: false,
    },
    updateVis: {
      type: Function,
      default: () => {},
    },
    handleSave: {
      type: Function,
      default: () => {},
    },
    action: {
      type: String,
      default: undefined,
    },
    entity: {
      type: Object,
    },
    tenementCode: {
      type: [Number, String, undefined],
      default: undefined,
    },
    title: {
      type: String,
      default: "",
    },
  },
  beforeCreate() {
    this.dtoFields = [
      "roleName",
      "roleCode",
      "remark",
      "isApply",
      "illustration",
      "businessFlowId",
      "flowCode",
      "flowVersion",
    ];
  },
  created() {
    this.queryTypeList();
  },
  activated() {
    this.queryTypeList();
  },
  mounted() {
  },
  data() {
    return {
      ..._.cloneDeep(DEFAULTS),
      dto: this.getDefaultDto(),
      // 展示字段
      fields: this.handleSetField(),
      flowIdOrFlowCode: "flowCode",
    };
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.query = { ...DEFAULTS.query };
        this.pageIndex = 0;
        const dto = this.getDefaultDto();
        this.dto = Object.assign(
          dto,
          _.pick(this.entity, [
            "roleName",
            "roleCode",
            "id",
            "remark",
            "isApply",
            "illustration",
            "businessFlowId",
            "flowCode",
            "flowVersion",
          ])
        );
        this.queryList();
        this.flowIdOrFlowCode = "flowCode";
        if (!this.dto.flowCode && this.dto.businessFlowId) {
          this.flowIdOrFlowCode = "flowId";
        }
      }
    },
    action(newVal) {
      if (newVal === "add") {
        this.dto = this.getDefaultDto();
      }
    },
    "dto.isApply": {
      handler(val, oldVal) {
        console.log(val, oldVal, "watch");
      },
      deep: true,
    },
  },
  methods: {
    handleClose() {
      this.updateVis(false);
    },
    handleClosed() {
      const defaults = _.cloneDeep(_.get(DEFAULTS, ["selRows", "query"]));
      for (let key in defaults) {
        this[key] = defaults[key];
      }
      this.$refs.basicList.resetData();
      this.activeFields.length = 0;
      this.list = [];
      this.fields = this.handleSetField();
    },
    handleOk() {
      this.$refs.form1.validate((valid) => {
        if (!valid) {
          return false;
        } else {
          const params = this.toEnd();
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
    pageIndexChange(index) {
      this.pageIndex = index - 1;
      this.queryList();
    },
    pageSizeChange(size) {
      this.pageIndex = 0;
      this.pageSize = size;
      this.queryList();
    },
    selectionChange(rows) {
      this.selRows = rows;
    },
    handleSearch() {
      this.pageIndex = DEFAULTS.pageIndex;
      this.queryList();
    },
    handleReset() {
      this.query = _.cloneDeep(DEFAULTS.query);
      this.pageIndex = DEFAULTS.pageIndex;
      this.activeFields.length = 0;
      this.fields = this.handleSetField();
      this.queryList();
    },
    queryList() {
      this.list.length = 0;
      let { id } = this.query.type || {};
      if (!id) return;
      const data = {
        typeId: id,
        tenementCode: this.tenementCode,
        dataRoleId: this.entity.id,
        ..._.omit(this.query, ["type"]),
      };
      jt.object.removeEmptyAttr(data);
      const params = {
        data,
        page: { pageIndex: this.pageIndex + 1, pageSize: this.pageSize },
      };
      api.dataRole.queryDataResourceList(params).then(({ code, data }) => {
        if (code === 200) {
          this.list = data.rows || [];
          this.total = data.rowTotal || 0;
          // 设置默认选中状态
          this.$nextTick(() => {
            let arr = this.list.filter((item) => item.tenementId);
            arr.forEach((item) => {
              this.$refs.basicList.$refs.table.toggleRowSelection(item, true);
            });
          });
        }
      });
    },
    toEnd() {
      // 角色信息 this.dto 所选用户 this.selRows
      const dataResourceIds = [];
      this.selRows.forEach((item) => {
        dataResourceIds.push(item.id);
      });
      const allDataResourceIds = [];
      this.list.forEach((item) => {
        allDataResourceIds.push(item.id);
      });
      const paramsFix = {
        tenementCode: this.$store.state.app.tenementInfoObj.tenementCode,
        allDataResourceIds, // 当前页的数据资源id列表
        // 选中的数据资源id列表
        dataResourceIds,
      };
      jt.object.removeEmptyAttr(paramsFix);
      const params = { ...this.dto, ...paramsFix };
      if (this.action === "add") {
        delete params.id;
      }
      return params;
    },
    getDefaultDto() {
      const dto = {};
      this.dtoFields.forEach((item) => {
        dto[item] = undefined;
      });
      dto.isApply = 1;
      return dto;
    },
    // 数据类型枚举
    queryTypeList() {
      const params = {
        data: { tenementCode: this.tenementCode },
        page: { pageIndex: 1, pageSize: 1000 },
      };
      api.dataRole.queryTypeList(params).then(({ code, data }) => {
        if (code === 200) {
          this.types = data.rows || [];
        }
      });
    },
    //  数据类型联动
    onChangeDataType(dataType) {
      this.list.length = 0;
      this.activeFields = this.handleSetField(dataType.dataExtInfoList);
      this.fields = this.activeFields.map((item) => {
        return _.pick(item, ["key", "name", "render"]);
      });
      let orgName = {
        key: "orgName",
        name: "所属机构",
      };
      let dataCode = {
        key: "dataCode",
        name: "数据编码",
      };
      this.fields.push(orgName);
      this.fields.push(dataCode);
      const queryExtFields = {};
      this.activeFields.forEach((item) => {
        if (item.key) {
          queryExtFields[item.key] = undefined;
        }
      });
      this.query = { ..._.pick(this.query, ["type"]), ...queryExtFields };
      this.queryList();
    },
    handleSetField(array) {
      array = array || [];
      array = array.filter((item) => item.isEffective === 1);
      const fields = [];
      for (let i = 0, len = array.length; i < len; i++) {
        const item = array[i];
        const col = {
          id: item.id,
          key: `ext${item.extNo}`,
          name: item.extName,
          type: "input",
        };
        if (item.isEnum === 1) {
          col.type = "enums";
          col.enums = jt.fn.generateEnums(item.enumValue, ",");
          col.render = (h, { row }) => {
            const enumValue = col.enums.find(
              (elem) => elem.value === row[col.key]
            );
            return <span>{enumValue ? enumValue.label : ""}</span>;
          };
        }
        fields.push(col);
      }
      return fields;
    },
    async querySearchThink(value, cb, key) {
      let { id } = this.query.type || {};
      if (!id) return;
      const query = {
        typeId: id,
        tenementCode: this.tenementCode,
        dataRoleId: this.entity.id,
        ..._.omit(this.query, ["type"]),
      };
      jt.object.removeEmptyAttr(query);
      const params = { data: query, page: { pageIndex: 1, pageSize: 10 } };
      const { data, msg, code } = await api.dataRole.queryDataResourceList(
        params
      );
      if (code === 200) {
        data.rows = data.rows || [];
        const array = Array.from(new Set(data.rows.map((item) => item[key])));
        const result = array.map((item) => ({ value: item }));
        cb(result);
      } else {
        cb();
      }
    },
  },
  computed: {
    closeText() {
      if (this.action === "add") {
        return "取消";
      } else {
        return "关闭";
      }
    },
    okText() {
      if (this.action === "edit") {
        return "保存";
      } else if (this.action === "add") {
        return "确认";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.search-form {
  display: flex;

  .col-l {
    flex: 1;
    display: flex;

    .el-row {
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      margin-right: 20px;
    }

    .el-autocomplete {
      width: 100%;
    }
  }

  .col-r {
    width: 140px;
  }
  .search-class {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    margin-bottom: 1.1rem;
  }
}

.basic-list {
  padding-top: 0;
}
</style>
