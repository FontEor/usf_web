<template>
  <div class="apply-2022-auth-choose-c">
    <div>
      <h3>
        选择用户组{{ applyType === 'applyAdmin' ? '管理权限' : '' }}
        <span v-if="userGroupHint">
          <a :href="userGroupHint" target="_blank">如何选择权限?</a>
        </span>
        <span v-else>
          <a href="javascript:void(0);">如何选择权限?</a>
        </span>
      </h3>
      <vxe-table stripe border="inner" ref="table" :row-config="{ isHover: true }" :column-config="{resizable: true}" :data="list" max-height="550">
        <vxe-column field="groupName" title="用户组名称"></vxe-column>
        <vxe-column field="groupCode" title="用户组编码"></vxe-column>
        <vxe-column v-if="formData.applyType === 'self'" field="isOwnGroup" title="是否已分配" show-overflow>
          <template #default="{ row }">
            <span :style="{
              color: row.isOwnGroup ? '#12B35D' : '#FC3737'
            }">
              {{ row.isOwnGroup | booleanToYN }}
            </span>
          </template>
        </vxe-column>
        <vxe-column field="id" title="操作" width="80">
          <template #default="{ row }">
            <el-button type="text" @click="onDelete(row)">删除</el-button>
          </template>
        </vxe-column>
      </vxe-table>
      <el-button class="apply-2022-auth-choose-add" type="text" icon="el-icon-circle-plus-outline"
        @click="dialogVisible = true">
        添加权限
      </el-button>
      <vxe-pager v-show="showPager" border size="medium" :current-page="page.pageIndex" :page-size="page.pageSize"
        :total="page.rowTotal" :layouts="[
          'Total',
          'PrevPage',
          'JumpNumber',
          'NextPage',
          'Sizes',
          'FullJump',
        ]" @page-change="pageChange">
      </vxe-pager>
      <div v-show="!showPager" style="width: 100%; height: 44px;"></div>
    </div>
    <UserGroupDialog 
      :formData="formData"
      :visible="dialogVisible"
      :updateVis="(visible) => (dialogVisible = visible)"
      :choosed="tableData"
      @confirm="onUsfMenu" />
  </div>
</template>

<script>
import { uniqBy } from "lodash";
import UserGroupDialog from "../dialog/UserGroupDialog.vue";
import filterMixins from "../../mixins/filters";
import webPageMixins from "../../mixins/webPage";
import store from "../../store";

export default {
  name: "UserGroup",
  mixins: [filterMixins, webPageMixins],
  components: {
    UserGroupDialog,
  },
  computed: {
    applyType() {
      return store.state.applyType;
    },
    userGroupHint() {
      return store.state.configInfo && store.state.configInfo.userGroupHint
    },
  },
  data() {
    return {
      dialogVisible: false,
    };
  },
  mounted() {},
  methods: {
    onUsfMenu(rows) {
      rows.forEach(row => {
        row.choosed = true
      });
      this.tableData = uniqBy(this.tableData.concat(rows), 'id')
      this.getList();
    },
    onDelete(row) {
      this.$confirm(
        "<div class='apply-2022-confirm-content'><p><i class='el-icon-warning'></i><span>确认要删除这些信息么？</span></p></div>",
        "",
        {
          dangerouslyUseHTMLString: true,
        }
      ).then(() => {
        const table = this.$refs.table;
        this.tableData = this.tableData.filter((item) => {
          if (item.id !== row.id) {
            return true
          } else {
            item.choosed = false;
            return false
          }
        });
        this.getList();
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