<template>
  <basic-dialog
    class="apply2022-FHCA"
    :visible="visible"
    title="账号信息提示"
    :width="1000"
    :okText="'选择并继续'"
    :closeText="'我再想想'"
    :update-vis="updateVis"
    :handle-close="handleClose"
    :handle-closed="handleClosed"
    :handle-ok="handleOk"
  >
    <template>
      <el-alert
        title="所录入被代理人账号分属多个机构，仅能选择其中一个机构进行后续申请"
        type="warning"
        show-icon
        :closable="false">
      </el-alert>
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
        ref="table"
        class="outer-table"
        auto-resize
        :height="500"
        :data="tableData"
        :expand-config="{ expandAll: false }"
        :radio-config="{ highlight: true }"
        :row-config="{ keyField: 'id' }"
        @radio-change="onRadioChange"
        >
        <vxe-column type="radio" width="50" align="center"></vxe-column>
        <vxe-column type="expand" width="50">
            <template #content="{ row, rowIndex }">
              <el-table
                class="expand-table"
                ref="expandTable"
                :show-header="false"
                :data="row.children">
                <el-table-column prop="unkown0" width="50" label=""></el-table-column>
                <el-table-column prop="unkown1" label="" width="50"></el-table-column>
                <el-table-column prop="unkown2" label="机构名称" width="200" align="left"></el-table-column>
                <el-table-column prop="unkown3" label="账号类型" width="200" align="left">
                  <template slot-scope="scope">
                    {{ type | accountType}}
                  </template>
                </el-table-column>
                <el-table-column prop="userCode" label="账号" width="200" align="left"></el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" content="系统将取消该账号本次申请，权限配置页可下载该账号明细" placement="top">
                      <el-button type="text" @click="onDelete(row, scope.$index, scope.row)">移除</el-button>
                    </el-tooltip>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </vxe-column>
        <vxe-column field="orgName" title="机构名称" width="200">
          <template slot-scope="scope">
            {{scope.row.orgName}}&emsp;({{scope.row.children ? scope.row.children.length : 0}})人
          </template>
        </vxe-column>
        <vxe-column field="unkown2" title="账号类型" width="200"></vxe-column>
        <vxe-column field="account" title="账号" width="200"></vxe-column>
        <vxe-column field="unkown3" title="操作"></vxe-column>
      </vxe-table>
      <div class="h12"></div>
    </template>
  </basic-dialog>
</template>

<script>
import { groupBy, forIn, difference } from "lodash";
// 添加或编辑用户
import EntityDialog from "@/mixins/entityDialog";
import ExactList from "@/mixins/exactList";

import filterMixins from "../../../mixins/filters";
import webPageMixins from "../../../mixins/webPage";

import axios from "axios";
import store from "../../../store";

export default {
  name: "FastCreateChooseOrg",
  mixins: [EntityDialog, filterMixins, webPageMixins],
  data() {
    return {
      choose: undefined,
      tableData: []
    };
  },
  props: {
    accounts: {
      type: Array,
      default: () => [],
    },
    type: {
      type: Number,
      require: true
    },
  },
  watch: {
    accounts: {
      deep: true,
      immediate: true,
      handler(n) {
        this.initTableData(n);
      },
    }
  },
  mounted() {},
  methods: {
    initTableData(accounts) {
      const map = groupBy(accounts, 'orgId');
      const list = [];
      forIn(map, function (values, key) {
        list.push({
          orgId: key,
          children: values,
          orgName: values[0].orgName
        })
      })
      this.tableData = list || []
      this.resetPage();
      this.getList();
    },
    onRadioChange({ row }) {
      this.choose = row;
    },
    handleOk() {
      if(this.choose) {
        const accounts = this.accounts.map(item => item.userCode);
        const choosed = this.choose.children.map(item => item.userCode);
        const errors = difference(accounts, choosed);
        this.$emit('delete', errors);
        this.$emit('confirm', this.choose);
        const user = this.choose.children[0];
        store.commit('updateForm', {
          key: "orgCodeForOther",
          value: user.orgId
        })
      }
      else {
        this.$message.error('请选择机构');
      }
    },
    getList(reload = true) {
      const start = (this.page.pageIndex - 1) * this.page.pageSize;
      const end = this.page.pageIndex * this.page.pageSize;
      this.list = this.tableData.slice(start, end)
      this.page.rowTotal = this.tableData.length;
      this.page.pageTotal = Math.ceil(this.page.rowTotal / this.page.pageSize)
      const table = this.$refs.table;
      if(reload && table && table.reloadData) {
          table.reloadData(this.list);
      }
    },
    onDelete(parentRow, index, row) {
      parentRow.children.splice(index, 1);
      // 提交的时候一次性处理 所以这里关闭处理
      // this.$emit('delete', [row.account]);
    },
  },
};
</script>
