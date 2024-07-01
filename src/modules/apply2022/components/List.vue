<template>
  <el-container ref="listContainer" class="lyk-list-container">
    <div ref="search" class="list-search-container">
      <el-form
        class="list-search"
        ref="form"
        :inline="true"
        :model="query"
        :rules="rules"
        size="small"
      >
        <div class="list-query-form-item">
          <slot name="search"></slot>
        </div>
        <el-form-item class="search-active-container">
          <el-button type="primary" @click="onSearch" size="small">查询</el-button>
          <el-button type="default" @click="onReset" size="small">重置</el-button>
          <slot name="active"></slot>
        </el-form-item>
      </el-form>
    </div>
    <div class="list-table-container">
      <vxe-table
        stripe
        border="inner"
        ref="table"
        :data="tableData"
        :loading="loading"
        :height="tableHeight"
        :row-config="{ isHover: true }"
        @checkbox-change="onSelectionChange"
      >
        <vxe-column type="seq" title="序号" align="center" width="80"></vxe-column>
        <slot name="table"></slot>
      </vxe-table>
      <vxe-pager
        class="list-pagination"
        border
        size="medium"
        :current-page="page.pageIndex"
        :page-size="page.pageSize"
        :total="page.total"
        :layouts="['Total', 'PrevPage', 'JumpNumber', 'NextPage', 'Sizes', 'FullJump']"
        @page-change="pageChange"
      >
      </vxe-pager>
    </div>
  </el-container>
</template>

<script>
import { debounce, get } from "lodash";
import webPageMixin from "../mixins/webPage";
import "../scss/list.scss";

export default {
  mixins: [webPageMixin],
  props: {
    // 请求方法
    requestFn: {
      type: Function,
      default: () => {},
    },
    // 查询条件
    query: {
      type: Object,
      default: {},
    },
    // 分页数据参数位置
    queryPosition: {
      type: String,
      default: "params",
    },
    // 规则数据
    rules: {
      type: Object,
      default: {},
    },
    // 初始化数据时是否调用接口请求
    init: {
      type: Boolean,
      default: true,
    },
    // 高度偏移量
    offsetHeight: {
      type: Number,
      default: 0,
    },
    // 重置query数据
    resetQuery: {
      type: Function,
    }
  },
  data() {
    return {
      page: {
        pageIndex: 1,
        total: 1000,
        pageSize: 10,
      },
      loading: false,
      tableHeight: 500,
      tableData: [],
    };
  },
  created() {
    this.debounceHeight = debounce(this.calcHeight, 500);
  },
  mounted() {
    this.calcHeight();
    window.addEventListener('resize', this.debounceHeight)
    this.init && this.getList();
  },
  destroyed() {
    window.removeEventListener('resize', this.debounceHeight)
  },
  methods: {
    // 计算高度
    calcHeight() {
      const $search = this.$refs.search;
      if (!$search) {
        return;
      }
      const containerH = document.body.offsetHeight;
      const searchH = $search.offsetHeight;
      this.tableHeight = containerH - searchH - 240 - this.offsetHeight;
    },
    getList() {
      this.loading = true;
      this.tableData = [];
      const data = Object.assign({}, this.query);
      if (this.queryPosition === "params") {
        Object.assign(data.params, {
          ...this.page,
        });
      }
      // 不是所有情况数据都放在 params 里面 暂时处理
      else {
        Object.assign(data.data, {
          page: this.page,
        });
      }
      // 因为 request[变量]的类型推断问题没有搞定 暂时先拿到外部处理请求函数
      this.requestFn(data)
        .then((response) => {
          this.loading = false;
          this.page.total = get(response, 'data.data.rowTotal')
          this.tableData = get(response, 'data.data.rows')
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    resetPage() {
      this.page = {
        pageIndex: 1,
        total: 0,
        pageSize: 20,
      }
    },
    onSearch() {
      this.resetPage();
      this.getList();
    },
    onReset() {
      this.resetQuery()
      this.resetPage();
      this.$nextTick(() => {
        this.getList()
      })
    },
    onSelectionChange() {},
  },
};
</script>
