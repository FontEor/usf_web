<template>
  <div class="basic-search basic-search--small">
    <div class="basic-search__bd">
      <div class="col-l">
        <el-form
          size="small"
          :inline="true"
          ref="searchForm"
          label-width="auto"
        >
          <!-- <el-row :gutter="20"> -->
            <!-- <el-col :span="24"> -->
              <el-form-item label="数据类型">
                <el-select
                  v-model="state.typeId"
                  @change="onDataTypeChange"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in state.dataTypeOptions"
                    :key="item.id"
                    :label="`${item.typeName} (${item.typeCode})`"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            <!-- </el-col> -->
            <!-- <el-col :span="7"> -->
              <el-form-item label="数据资源编码">
                <el-input
                  v-model="state.dataCode"
                  placeholder="请输入以data开头的数据资源编码"
                  style="width:205.4px"
                >
                </el-input>
              </el-form-item>
            <!-- </el-col> -->
          <!-- </el-row> -->
          <!-- <el-row :gutter="20" class="fields"> -->
            <!-- <el-col :span="24"> -->
              <el-form-item
                v-for="(item, index) in state.currentFiles"
                :key="index"
                :label="item.name"
              >
                <!-- <el-input v-if="item.type === 'input'" v-model.trim="query[item.key]" :placeholder="'请输入' + item.name" :maxlength="30" clearable/> -->
                <template v-if="item.type === 'input'">
                  <!-- 如果是 商家端 那么使用input -->
                  <el-input
                    v-if="tenementInfoObj && tenementInfoObj.tenementCode === 'business-seller'"
                    v-model.trim="query[item.key]"
                    :placeholder="'请输入' + item.name"
                    :maxlength="50"
                    clearable/>
                  <el-autocomplete
                    v-else
                    popper-class="autocomplete-norwap"
                    v-model.trim="query[item.key]"
                    :debounce="500"
                    :fetch-suggestions="
                      (value, cb) => querySearchThink(value, cb, item.key)
                    "
                    :placeholder="'请输入' + item.name"
                    :maxlength="50"
                    clearable
                  >
                  </el-autocomplete>
                </template>
                <el-select
                  v-if="item.type === 'enums'"
                  v-model.trim="query[item.key]"
                  placeholder="请选择"
                  clearable
                  filterable
                >
                  <el-option
                    v-for="subItem of item.enums"
                    :key="subItem.code"
                    :label="subItem.label"
                    :value="subItem.value"
                    style="max-width: 300px;white-space: normal;word-break: break-all;height: auto;"
                  />
                  <!--
                    style="max-width: 300px;white-space: normal;word-break: break-all;height: auto;"
                  -->
                </el-select>
              </el-form-item>
            <!-- </el-col> -->
          <!-- </el-row> -->
        </el-form>
      </div>
      <div class="col-r">
        <el-button type="primary" :disabled="state.loading" size="small" @click="handleSearch"
          >查询</el-button
        >
        <el-button size="small" :disabled="state.loading" @click="handleReset">重置</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

const DEFAULTFIELDS = {
  typeId: null,
  tenementCode: null,
  orgId: null,
  orgCode: null,
  dataCode:null
};
export default {
  props: {
    state: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  computed: {
    ...mapGetters([
      "tenementInfoObj",
    ]),
  },
  activated() {
    this.$parent.queryListDataType({ update: true });
  },
  data() {
    return {
      // 查询数据模型
      query: DEFAULTFIELDS,
      //表单标签长度
      formLabelWidth: "80px",
    };
  },
  watch: {
    "state.visible": {
      handler(newVal) {
        if (newVal) {
          this.handleSearch();
        }
      },
      immediate: true,
    },
  },
  methods: {
    getDefaultQuery(exclude) {
      const fields = this.state.currentFiles.filter((field) => !field.hidden);
      const query = {
        ...DEFAULTFIELDS,
      };
      this.state.dataCode = undefined
      for (let i = 0; i < fields.length; i++) {
        if (_.isObject(fields[i])) {
          if (exclude && fields[i].exclude) {
            continue;
          }
          query[fields[i].key] = fields[i].default;
        } else {
          query[fields[i]] = undefined;
        }
      }
      return query;
    },
    onDataTypeChange(val) {
      this.query = {};
      this.$parent.queryListDataType({
        done: this.handleSearch,
      });
    },
    toEnd() {
      this.query.typeId = this.state.typeId;
      this.query.dataCode = this.state.dataCode
      this.query.tenementCode = this.$store.getters.tenementCode;
      const query = _.cloneDeep(this.query);
      jt.object.removeEmptyAttr(query);
      return query;
    },
    handleReset() {
      this.query = this.getDefaultQuery(true);
      this.handleSearch();
    },
    handleSearch() {
      const query = this.toEnd();
      this.$parent.updateState({ query, pageIndex: 0 });
      if (query.typeId && query.tenementCode) {
        this.$parent.queryList();
      }
    },
    async querySearchThink(value, cb, key) {
      const query = this.toEnd();
      const params = { data: query, page: { pageIndex: 1, pageSize: 10 } };
      const { data, msg, code } = await api.dataResource.queryPage(params);
      if (code === 200) {
        data.rows = data.rows || [];
        const array = Array.from(new Set(data.rows.map((item) => item[key])));
        const result = array.map((item) => ({ value: item }));
        cb(result);
      } else {
        cb();
      }
    },
    queryParam() {
      //获取查询参数
      return this.toEnd();
    },
  },
};
</script>
<style lang="scss" scoped>
.basic-search {
  padding: 20px 0 0;
  .basic-search__bd {
    display: flex;
    justify-content: space-between;
    .col-l {
      /deep/ .el-form-item {
        padding-right: 15px;
        box-sizing: border-box;
      }
    }
    .col-r {
      width: 162px;
      display: flex;
      justify-content: space-between;
      text-align: center;
      padding-bottom: 20px;
      .el-button {
        width: 75px;
        height: 32px;
      }
    }
  }
}
.basic-search--small {
  /deep/ .el-form-item__label {
    font-weight: 500;
  }
}
</style>
