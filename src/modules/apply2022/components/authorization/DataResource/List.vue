<template>
  <div>
    <vxe-table
      stripe
      border="inner"
      ref="table"
      :column-config="{resizable: true}"
      :row-config="{ isHover: true }"
      :data="list"
      max-height="550"
    >
      <vxe-column field="typeName" title="数据类型"></vxe-column>
      <vxe-column v-if="formData.applyType === 'self'" field="isOwnData" title="是否已分配" show-overflow>
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
      <vxe-column field="id" title="操作" width="80">
        <template #default="{ row }">
          <el-button type="text" @click="onDelete(row)">删除</el-button>
        </template>
      </vxe-column>
    </vxe-table>
    <vxe-pager
      v-show="showPager"
      border
      size="medium"
      :current-page="page.pageIndex"
      :page-size="page.pageSize"
      :total="page.rowTotal"
      :layouts="[
        'Total',
        'PrevPage',
        'JumpNumber',
        'NextPage',
        'Sizes',
        'FullJump',
      ]"
      @page-change="pageChange"
    >
    </vxe-pager>
    <div class="show-pager-placeholder" v-show="!showPager" style="width: 100%; height: 44px"></div>
  </div>
</template>

<script>
import { get } from "lodash";
import filterMixins from "../../../mixins/filters";
import webPageMixins from "../../../mixins/webPage";

export default {
  name: "DataResourceList",
  mixins: [filterMixins, webPageMixins],
  components: {},
  data() {
    return {
      dialogVisible: false,
    };
  },
  props: {
    datas: {
      type: Array,
      default: () => [],
    },
    typesMap: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    fields () {
      const code = get(this.datas, '[0].typeCode');
      return get(this.typesMap, code, []);
    },
  },
  watch: {
    datas: {
      handler(n) {
        this.tableData = n;
        // this.fields = get(n, '[0].web_fields', [])
        this.getList();
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    onDelete(row) {
      this.$confirm(
        "<div class='apply-2022-confirm-content'><p><i class='el-icon-warning'></i><span>确认要删除这些信息么？</span></p></div>",
        "",
        {
          dangerouslyUseHTMLString: true,
        }
      ).then(() => {
        this.$emit('deleteData', row);
        this.$message({
          type: "success",
          message: "删除成功!",
        });
      });
    },
  },
};
</script>

<style>
</style>
