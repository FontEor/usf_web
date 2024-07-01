<template>
  <basic-dialog
    :visible="visible"
    :title="applyType === 'applyAdmin' ? '添加数据资源管理权限' : '添加数据资源'"
    :width="1100"
    :okText="choosed.length ? '添加' : '保存'"
    :update-vis="updateVis"
    :handle-close="handleClose"
    :handle-closed="handleClosed"
    :loading="loading"
    :handle-ok="handleOkBefore"
  >
    <el-form
      ref="form"
      size="small"
      label-position="right"
      label-width="80px"
      :model="query"
      :inline="true"
    >
      <div class="entity-dlg__block">
        <div class="entity-dlg__block-bd formFix">
          <el-row :gutter="0">
            <el-form-item label="数据类型">
              <el-select
                v-model="query.typeId"
                filterable
                collapse-tags
                placeholder="请选择数据类型"
                @change="onDataTypeChange"
              >
                <el-option
                  v-for="item in dataTypes"
                  :label="item.typeName"
                  :value="item.id"
                  :key="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-for="field in fields"
              :key="field.id"
              :label="field.extName"
            >
              <el-select
                v-if="field.isEnum"
                v-model="query[field.field]"
                filterable
                collapse-tags
                placeholder="请选择数据类型"
                @change="onDataTypeChange"
              >
                <el-option
                  v-for="item in field.options"
                  :label="item.label"
                  :value="item.value"
                  :key="item.value"
                ></el-option>
              </el-select>
              <el-input
                v-else
                v-model="query[field.field]"
                clearable
              />
            </el-form-item>
            <div class="col-r" style="width: 205px; margin-bottom: 20px">
              <el-button type="primary" size="small" @click="handleSearch"
                >查询</el-button
              >
              <el-button size="small" @click="handleReset">重置</el-button>
            </div>
          </el-row>
        </div>
      </div>
    </el-form>
    <template>
      <vxe-toolbar class-name="vxe-table-toolbar-pagination">
        <template #buttons>
          <el-pagination
            :current-page="page.pageIndex"
            :page-size="page.pageSize"
            :page-sizes="[10, 20, 50, 100, 200, 300, 500]"
            :total="page.rowTotal"
            layout="total, sizes, prev, jumper, slot, next "
            @current-change="pageIndexChange"
            @size-change="pageSizeChange"
          >
            <span class="page-count"> / {{ page.pageTotal }}</span>
          </el-pagination>
        </template>
      </vxe-toolbar>
      <vxe-table
        border
        stripe
        class="disabled-checked-table"
        show-overflow
        ref="table"
        height="500"
        align="center"
        :data="list"
        :column-config="{resizable: true}"
        :row-config="{ isHover: true, keyField: 'id' }"
        :sort-config="{ trigger: 'cell' }"
        :checkbox-config="{
          labelField: '',
          checkMethod: onCheckMethod,
          reserve: true,
          trigger: 'row',
        }"
        :edit-config="{ enabled: false }"
      >
        <!--
          visibleMethod: onVisibleMethod,
          -->
        <vxe-column type="checkbox" width="50"></vxe-column>
        <vxe-column field="typeName" title="数据类型"></vxe-column>
        <vxe-column v-if="formData.assignType==='1'" field="isOwnData" title="是否已分配" show-overflow>
          <template #default="{ row }">
            <span :style="{
              color: row.isOwnData ? '#12B35D' : '#FC3737'
            }">
              {{ row.isOwnData | booleanToYN }}
            </span>
          </template>
        </vxe-column>
        <vxe-column field="dataCode" title="数据资源"></vxe-column>
        <vxe-column
          v-for="field in fields"
          :key="field.id"
          :field="field.field"
          :title="field.extName"
        >
          <template #default="{ row }">
            {{ row[field.field] | dataTypeFilter(field.options) }}
          </template>
        </vxe-column>
      </vxe-table>
    </template>
  </basic-dialog>
</template>

<script>
// 添加或编辑用户
import EntityDialog from "@/mixins/entityDialog";

import tableMixins from "../../mixins/table";
import filterMixins from "../../mixins/filters";
import changeMixin from "../../mixins/change";
import requestMixins from "./request";
import store from "../../store";

import axios from "axios";

const initExtField = () => {
  return {
    ext1: "",
    ext2: "",
    ext3: "",
    ext4: "",
    ext5: "",
    ext6: "",
    ext7: "",
    ext8: "",
    ext9: "",
    ext10: "",
    ext11: "",
    ext12: "",
    ext13: "",
    ext14: "",
    ext15: "",
    ext16: "",
    ext17: "",
    ext18: "",
  };
};

const initQuery = () => {
  return {
    ...initExtField(),
    typeId: "",
  };
};

export default {
  name: "DataResourceDialog",
  mixins: [EntityDialog, tableMixins, filterMixins, changeMixin, requestMixins],
  data() {
    return {
      query: initQuery(),
      dataTypes: [],
      // 字段数据
      fields: [],
      loading: false
    };
  },
  computed: {
    choosedMap() {
      const map = {};
      this.choosed.forEach((choose) => {
        map[choose.id] = true;
      });
      return map;
    },
    applyType() {
      return store.state.applyType;
    },
    // applyType
    storeForm() {
      return store.state.form;
    },
  },
  props: {
    choosed: {
      type: Array,
      default: () => [],
    },
    formData: {
      type: Object,
      default: () => ({})
    }
  },
  watch: {
    visible: {
      handler(n) {
        if (n) {
          this.list = []
          this.setChecked();
        }
      },
      immediate: true,
    },
  },
  mounted() {},
  methods: {
    tenantIdChange() {
      this.getDataTypes();
      this.getList();
    },
    getDataTypes() {
      if(this.tenantId) {
        let url = "/data/type/list"
        if(this.applyType === 'applyUser') {
          url = '/businessApply/queryDataTypeList'
        }
        axios({
          method: "post",
          url,
          data: {
            data: {
              tenementCode: this.tenantId,
            },
            page: {
              pageIndex: 0,
              pageSize: 1000000000,
            },
          },
          params: {
            tenementCode: this.tenantId,
          },
        })
        .then((response) => {
          this.dataTypes = response.data.data.rows;
          this.$refs.table &&
            this.$refs.table.setCheckboxRow(this.choosed, true);
        })
        .catch((reject) => {
          console.log("/data/type/list 请求失败", reject);
        });
      }
    },
    getList(fields) {
      if(!this.query.typeId) {
        return
      }
      this.getDataResourceRequest().then((response) => {
        const data = response.data.data;
        const list = data.rows;
        const chooses = [];
        list.forEach((item) => {
          item.disabled = Boolean(item.isOwnData);
          if (item.disabled) {
            chooses.push(item);
          }
          item.choosed = item.disabled || this.choosedMap[item.id] || false;
          item.web_fields = fields;
        });
        this.assignListData({
          ...data,
          rows: list,
        });
      })
      .catch((reject) => {
        console.log("queryDataResourceAuthList 请求失败", reject);
      });
    },
    onDataTypeChange(val) {
      if (!val) {
        return;
      }
      const instance = this.dataTypes.find((dataType) => {
        return dataType.id === val;
      });
      // 获取启用的字段
      if (!instance || !instance.dataExtInfoList) {
        return;
      }
      const activeField = instance.dataExtInfoList.filter((item) =>
        Boolean(item.isEffective)
      );
      // 如果是枚举字段 那么创建选项值
      activeField.forEach((field) => {
        if (field.isEnum === 1) {
          const enumValue = field.enumValue || "";
          field.options = this.getEnumsOptions(enumValue, field.mapOptions);
        }
        field.field = `ext${field.extNo}`;
      });
      this.fields = activeField;
      // 清空之前的查询条件扩展字段
      Object.assign(this.query, initExtField());
      this.getList(activeField || []);
    },
    getEnumsOptions(enumString, mapOtions = {}) {
      enumString = enumString || "";
      const options = [];
      const enums = enumString.split(",").map((enumS) => enumS.split(":"));
      enums.forEach(([key, value]) => {
        options.push({
          label: key,
          value: value,
        });
        mapOtions[key] = value;
      });
      return options;
    },
    setChecked() {
      const table = this.$refs.table;
      if (table) {
        table.setCheckboxRow(this.choosed, true);
        table.$forceUpdate();
      }
    },
    handleReset() {
      this.query = initQuery();
      this.resetPage();
      this.fields.length = 0;
      this.getDataTypes();
      this.getList();
    },
    handleOkBefore() {
      const reserveRows = this.$refs.table.getCheckboxReserveRecords(true);
      const rows = this.$refs.table.getCheckboxRecords(true);
      const chooses = [...reserveRows, ...rows];
      // 所有新增行数据
      const addRows = chooses.filter(item => item.choosed !== true);
      if(
        // 如果是添加了数据
        addRows.length &&
        // 并且是 业务申请
        this.applyType === 'applyUser' &&
        // 并且是 代人申请
        this.storeForm.applyType === 'other'
      ) {
        this.loading = true;
        // 进行额外验证
        this.validDataResourceRequest(addRows).then(() => {
        this.loading = false;
          this.handleOk();
        }).catch(error => {
          console.log('validDataResourceRequest 错误', error);
          this.loading = false;
        })
      }
      // 否则 无需验证
      else {
        this.handleOk();
      }
    }
  },
  filters: {

  }
};
</script>

<style lang="scss" scope>
/deep/ .el-form {
  width: 100%;
}
.entity-dlg__block-bd.formFix {
  input {
    width: 200px;
  }
  .col-r {
    float: right;
    position: relative;
    padding: 0 12px 0 25px;
    width: 162px;
    .el-button {
      width: 75px;
    }
  }
}
</style>
