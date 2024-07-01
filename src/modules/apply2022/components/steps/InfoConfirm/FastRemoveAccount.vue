<template>
  <basic-dialog
    class="apply2022-FHCA"
    :visible="visible"
    :title="status === 2 ? '快速移除异常账号' : '快速移除无管理权限账号'"
    :width="1000"
    :update-vis="updateVis"
    :handle-close="handleClose"
    :handle-closed="handleClosed"
    :handle-ok="handleOk"
    :isShowFooterAll="false"
  >
    <template>
      <el-alert
        :title="status === 2 ? '以下账号在所选租户中尚不存在，无法继续关闭其权限。' : '您未拥有以下账号的管理权限，无法继续代其关闭权限。'"
        type="warning"
        show-icon
        :closable="false">
      </el-alert>
      <vxe-toolbar class-name="vxe-table-toolbar-pagination">
        <template #buttons>
          <el-pagination
            v-show="showPager"
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
        show-overflow
        ref="table"
        height="500"
        align="center"
        :data="list"
        :row-config="{ isHover: true, keyField: 'id' }"
        :sort-config="{ trigger: 'cell' }"
        :edit-config="{ enabled: false }"
      >
        <!-- 
          visibleMethod: onVisibleMethod,
          -->
        <vxe-column field="roleName" title="账号类型">
          <template>
            {{ type | accountType}}
          </template>
        </vxe-column>
        <vxe-column field="userCode" title="账号"></vxe-column>
      </vxe-table>
      <div class="apply2022-FHCA-form-container">
        <div class="entity-dlg__block">
          <div class="entity-dlg__block-bd">
            <el-row :gutter="0">
              <div class="fr">
                <el-button v-show="status == 3" size="small" @click="handleOk">我再想想</el-button>
                <el-button size="small" type="primary" @click="onDeleteAll">移除并继续</el-button>
              </div>
            </el-row>
          </div>
        </div>
      </div>
    </template>
  </basic-dialog>
</template>

<script>
// 添加或编辑用户
import EntityDialog from "@/mixins/entityDialog";

import tableMixins from "../../../mixins/table";
import filterMixins from "../../../mixins/filters";
import changeMixin from "../../../mixins/change";
import webPageMixin from "../../../mixins/webPage";

export default {
  name: "FastRemoveAccountDialog",
  mixins: [EntityDialog, tableMixins, filterMixins, changeMixin, webPageMixin],
  props: {
    choosed: {
      type: Array,
      default: () => [],
    },
    type: {
      type: Number,
      require: true
    },
    accounts: {
      type: Array,
      default: () => []
    },
    status: {
      type: Number,
      default: 2
    }
  },
  watch: {
    visible: {
      handler(n) {
        if (n) {
          this.handleReset()
        }
      },
      immediate: true,
    },
    accounts: {
      handler(n) {
        this.tableData = n.map(item => {
          return {
            userCode: item,
            type: this.type
          }
        });
        this.getList();
      },
      immediate: true
    }
  },
  mounted() {},
  methods: {
    handleReset() {
      this.getList();
    },
    handleOk() {
      this.handleClose()
    },
    onDeleteAll() {
      this.handleClose()
      this.$emit("confirm", this.tableData);
    }
  },
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
