<template>
  <div class="apply-2022-auth-choose-c">
    <div class="apply-2022-auth-choose-list-c">
      <h3>
        选择数据资源{{ applyType === 'applyAdmin' ? '管理权限' : '' }}
        <span v-if="dataResourceHint">
          <a :href="dataResourceHint" target="_blank">如何选择权限?</a>
        </span>
        <span v-else>
          <a href="javascript:void(0);">如何选择权限?</a>
        </span>
      </h3>
      <DataResourceList 
        :formData="formData"
        v-for="(value, key) in tableDataGroup"
        :typesMap="typesMap"
        :key="key" :datas="value" @deleteData="onDelete"/>
    </div>
    <el-button
        class="apply-2022-auth-choose-add"
        type="text"
        icon="el-icon-circle-plus-outline"
        @click="dialogVisible = true"
      >
        添加权限
      </el-button>
    <DataResourceDialog
      :formData="formData"
      :visible="dialogVisible"
      :updateVis="(visible) => (dialogVisible = visible)"
      :choosed="tableData"
      @confirm="onUsfMenu"
    />
  </div>
</template>

<script>
import { uniqBy, groupBy, forIn, get, cloneDeep } from "lodash";
import DataResourceDialog from "../../dialog/DataResourceDialog.vue";
import DataResourceList from "./List.vue";
import filterMixins from "../../../mixins/filters";
import webPageMixins from "../../../mixins/webPage";
import store from "../../../store";

export default {
  name: "DataResource",
  mixins: [filterMixins, webPageMixins],
  components: {
    DataResourceDialog,
    DataResourceList
  },
  data() {
    return {
      dialogVisible: false,
      tableDataGroup: {},
      typesMap: {}
    };
  },
  computed: {
    applyType() {
      return store.state.applyType;
    },
    dataResourceHint() {
      return store.state.configInfo && store.state.configInfo.dataResourceHint
    },
  },
  mounted() {},
  methods: {
    onUsfMenu(rows) {
      // 二次打开弹框 不知道为何 扩展字段会丢失 额外处理一下
      const typeCode = get(rows, '[0].typeCode');
      if(!this.typesMap[typeCode]) {
        const fields = cloneDeep(get(rows, '[0].web_fields', []));
        this.typesMap[typeCode] = fields;
      }
      // 改写选中状态
      rows.forEach(row => {
        row.choosed = true
      });
      const list = uniqBy(this.tableData.concat(rows), 'id');
      const objects = groupBy(list, 'typeId')
      forIn(objects, (value, key) => {
        this.$set(this.tableDataGroup, key, value)
      })
      this.tableData = list
    },
    onDelete(row) {
      this.tableData = this.tableData.filter((item) => {
        if (item.id !== row.id) {
          return true;
        } else {
          item.choosed = false;
          return false;
        }
      });
      const objects = groupBy(this.tableData, 'typeId')
      this.tableDataGroup = {}
      forIn(objects, (value, key) => {
        this.$set(this.tableDataGroup, key, value)
      })
    }
  },
};
</script>

<style>
</style>