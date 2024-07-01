<template>
  <div class="apply2022">
    <HeaderT></HeaderT>
    <div class="p-basic renewal-container">
      <h1>员工权限快速续期</h1>
      <p>请您先勾选需要续期的权限项，然后点击一键续期。</p>
      <div>
        <vxe-table
          stripe
          border="inner"
          ref="uTable"
          :row-config="{ isHover: true }"
          :column-config="{ resizable: true }"
          :data="list"
          max-height="550"
          :checkbox-config="{ visibleMethod: showCheckbox }"
        >
          <vxe-column type="checkbox" width="60"></vxe-column>
          <vxe-column type="seq" title="序号"></vxe-column>
          <vxe-column field="tenementCode" title="租户"></vxe-column>
          <vxe-column field="appCode" title="应用"></vxe-column>
          <vxe-column field="roleName" title="菜单角色名称"></vxe-column>
          <vxe-column field="roleCode" title="菜单角色编码"></vxe-column>
          <vxe-column field="renewalType" title="审批状态" :formatter="formatterStatus"></vxe-column>
          <vxe-column field="expireTime" title="到期时间"></vxe-column>
        </vxe-table>
        <vxe-pager
          border
          size="medium"
          :current-page="page.pageIndex"
          :page-size="page.pageSize"
          :total="page.rowTotal"
          :layouts="['Total', 'PrevPage', 'JumpNumber', 'NextPage', 'Sizes', 'FullJump']"
          @page-change="pageChange"
        >
        </vxe-pager>
      </div>
      <div class="renewal-button-container">
        <el-button type="primary" @click="onRenewal" size="small">一键续期</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import VXETable from "vxe-table";
import "vxe-table/lib/style.css";
import "xe-utils";
Vue.use(VXETable);
import moment from 'moment';

import store from "./store";
import HeaderT from "../apply2022/components/Header.vue";
import "../apply2022/scss/index.scss";
import listMixins from "../apply2022/mixins/list";

export default {
  name: "RenewalAuthoriztion",
  mixins: [ listMixins ],
  components: {
    HeaderT,
  },
  data() {
    return {
      tableData: [],
    };
  },
  mounted() {
    this.getUserErpInfo();
  },
  methods: {
    getUserErpInfo() {
      api.users
        .getUserErpInfo({})
        .then((resolve) => {
          if (resolve.code === 200) {
            const { userCode } = resolve.data;
            this.userCode = userCode;
            this.getList();
          }
        });
    },
    onRenewal() {
      const selects = this.$refs.uTable.getCheckboxRecords();
      if(selects && selects.length) {
        const targets = selects.filter(item => item.renewalType === 0);
        if(targets && targets.length) {
          this.$confirm("系统即将发起续期操作，审批通过后立刻完成续期，请确认是否继续", "", {
            confirmButtonText: "提交",
            cancelButtonText: "取消",
            type: "warning",
          })
          .then(() => {
            api.expiration.renewalApply({
              userCode: this.userCode,
              renewalInfo: selects,
            }).then((response) => {
              if(response.code === 200) {
                this.resetPage();
                this.$refs.uTable.clearCheckboxRow();
                this.$refs.uTable.clearCheckboxReserve();
                this.getList();
              } else {
                this.$message.error(response.msg);
              }
            })
          })
        } else {
        this.$message.error('请勾选要续期的权限后重试');
      }
      } else {
        this.$message.error('请勾选要续期的权限后重试');
      }
    },
    getList() {
      api.expiration.soonExpireList({
        page: this.page,
        data: {
          userCode: this.userCode,
        }
      }).then((response) => {
        if(response.code === 200) {
          const data = response.data;
          Object.assign(this.page, {
            pageIndex: data.pageIndex,
            pageSize: data.pageSize,
            pageTotal: data.pageTotal,
            rowTotal: data.rowTotal,
          })
          data.rows.forEach(row => {
            row.expireTime = moment(row.expireTime).format('YYYY-MM-DD HH:mm:ss')
          })
          this.list = data.rows;
        } else {
          this.$message.error(response.msg);
        }
      })
    },
    pageChange({ currentPage, pageSize }) {
      if (this.page.pageIndex !== currentPage) {
        this.pageIndexChange(currentPage)
      }
      if (this.page.pageSize !== pageSize) {
        this.pageSizeChange(pageSize)
      }
    },
    formatterStatus({ cellValue }) {
      return cellValue === 1 ? '不可申请（审批中）' : '可申请';
    },
    showCheckbox({ row }) {
      return row.renewalType === 0;
    }
  },
};
</script>

<style lang="scss">
.renewal-container {
  padding: 0 24px 80px 24px;
  .basic-list__hd {
    display: none;
  }
  h1 {
    margin: 32px;
    font-size: 22px;
    text-align: center;
  }
  p {
    color: #f56c6c;
    font-size: 14px;
    margin-bottom: 8px;
  }
  .renewal-button-container {
    background-color: white;
    position: absolute;
    left: 0;
    bottom: 0;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
    height: 60px;
    box-shadow: 0 -1px 3px #e5e5e5;
    .el-button {
      margin-right: 24px;
      border-radius: 4px;
      font-size: 14px;
      min-width: 120px;
    }
  }
}
</style>
