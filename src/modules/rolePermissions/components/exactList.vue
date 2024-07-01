<template>
  <basic-list
    :show-index-col="false"
    :fields="fields"
    select-type="multiple"
    :loading="state.loading"
    :total="state.total"
    :list="state.list"
    :table-h="tableH"
    :showActionCol="false"
    :showSelectCol="true"
    :page-index="state.pageIndex"
    :page-size="state.pageSize"
    :page-index-change="pageIndexChange"
    :selection-change="selectionChange"
    :page-size-change="pageSizeChange"
    :show-ext-set="buttonData('cdjskz').has"
    :ext-dlg-vis="updateExtDlgVis"
  >
    <template slot="hd-col--l">
      <el-button
        type="primary"
        :size="btnSize"
        :disabled="selRows.length > 1"
        @click="proxyActions({ action: 'onAdd', rows: selRows })"
        v-if="buttonData('tjcdjs').has"
        >{{ buttonData("tjcdjs").name }}</el-button
      >
      <el-button
        type="primary"
        :size="btnSize"
        :disabled="selRows.length > 1"
        @click="proxyActions({ action: 'distribute', rows: selRows })"
        v-if="buttonData('cdjefpcdjs').has"
        >{{ buttonData("cdjefpcdjs").name }}</el-button
      >
      <!-- <el-button type="primary" :size="btnSize" @click="proxyActions({ action: 'copyUser', rows: selRows })">{{'复制菜单角色'}}</el-button> -->
      <el-button
        :size="btnSize"
        :disabled="selRows.length > 1"
        @click="proxyActions({ action: 'edit', rows: selRows })"
        v-if="buttonData('bjcdjs').has"
        >{{ buttonData("bjcdjs").name }}</el-button
      >
      <el-button
        :size="btnSize"
        :disabled="selRows.length > 1"
        @click="proxyActions({ action: 'view', rows: selRows })"
        v-if="buttonData('cdjsxq').has"
        >{{ buttonData("cdjsxq").name }}</el-button
      >
      <el-button
        type="danger"
        :size="btnSize"
        :disabled="selRows.length > 1"
        @click="proxyActions({ action: 'delet', rows: selRows })"
        v-if="buttonData('sccdjs').has"
        >{{ buttonData("sccdjs").name }}</el-button
      >
      <!-- 启用 -->
      <el-button
        v-if="buttonData('qycdjs').has && isDisable"
        :size="btnSize"
        :disabled="selRows.length > 1"
        @click="handleEnableOrDisable"
        >{{ buttonData("qycdjs").name }}</el-button
      >
      <!-- 停用 -->
      <el-button
        v-if="buttonData('tycdjs').has && isEnable"
        :size="btnSize"
        :disabled="selRows.length > 1"
        @click="handleEnableOrDisable"
        >{{ buttonData("tycdjs").name }}</el-button
      >
      <!-- 导入菜单角色 -->
      <el-button
        v-if="buttonData('CDJSDR').has"
        :size="btnSize"
        @click="importRole(buttonData('CDJSDR').name)"
        >{{ buttonData("CDJSDR").name }}</el-button
      >
      <!-- 导入角色资源 -->
      <el-button
        v-if="buttonData('DRCDJSZY').has"
        :size="btnSize"
        @click="importRoleResource(buttonData('DRCDJSZY').name)"
        >{{ buttonData("DRCDJSZY").name }}</el-button
      >
      <!-- 导出 -->
      <el-dropdown
        split-button
        type="primary"
        :size="btnSize"
        @command="onExport"
        trigger="click"
      >
        导出
        <el-dropdown-menu slot="dropdown">
          <!-- 导入用户 -->
          <el-dropdown-item
            v-if="buttonData('DCCDJS').has"
            divided
            :command="[0, '导出菜单角色']"
            >{{ buttonData("DCCDJS").name }}</el-dropdown-item
          >
          <el-dropdown-item
            v-if="buttonData('DCCDJSGLYH').has"
            divided
            :command="[2, '导出菜单角色关联用户', ]"
            >{{ buttonData("DCCDJSGLYH").name }}</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>
    </template>
  </basic-list>
</template>

<script>
import ExactList from "@/mixins/exactList";
// import { mapState } from "vuex";
export default {
  // computed: {
  //   ...mapState("app", ["showExportButton", "tenementCode", "userName"]),
  // },

  mixins: [ExactList],
  props: {
    proxyActions: Function,
    exportMenuRole: Function,
    importRole: Function,
    importRoleResource: Function,
  },

  mounted() {
  },
  data() {
    return {
      fields: [
        { key: "roleName", name: "菜单角色名称" },
        { key: "roleCode", name: "菜单角色编码" },
        {
          key: "isDisable",
          name: "状态",
          render: (h, { row }) => {
            const status = { 0: "启用", 1: "停用" };
            const value = status[row.isDisable];
            return <span>{value}</span>;
          },
        },
        {
          key: "sensitiveMark",
          name: "是否敏感",
          render: (h, { row }) => {
            const status = { 0: "否", 1: "是" };
            const value = status[row.sensitiveMark];
            return <span>{value}</span>;
          },
        },
        { key: "ext1", name: "", hidden: true },
        { key: "ext2", name: "", hidden: true },
        { key: "ext3", name: "", hidden: true },
        { key: "ext4", name: "", hidden: true },
        { key: "ext5", name: "", hidden: true },
        { key: "ext6", name: "", hidden: true },
        { key: "ext7", name: "", hidden: true },
        { key: "ext8", name: "", hidden: true },
        { key: "ext9", name: "", hidden: true },
        { key: "ext10", name: "", hidden: true },
        { key: "createUser", name: "创建人" },
        { key: "createTime", name: "创建时间", width: 200 },
        { key: "rootOrgName", name: "所属机构名称" },
        { key: "roleSource", name: "来源" },
        { key: "remark", name: "备注" },
      ],
      btnSize: "mini",
    };
  },
  computed: {
    isEnable() {
      return this.selRows.length !== 0 && this.selRows[0].isDisable === 0 ? true : false;
    },
    isDisable() {
      return this.selRows.length !== 0 && this.selRows[0].isDisable === 1 ? true : false;
    },
  },
  methods: {
    // 禁用/启用菜单角色
    handleEnableOrDisable() {
      if (this.selRows.length === 0) return;
      // 0表示启用状态 1表示禁用状态
      const { isDisable, tenementCode, id } = this.selRows[0];
      const params = { data: { tenementCode, id } };
      if (isDisable === 0) {
        this.handleDisableResourceRole(params);
      } else if (isDisable === 1) {
        this.handleEnableResourceRole(params);
      }
    },
    // 禁用
    async handleDisableResourceRole(params) {
      const { code, msg } = await api.rolePermissions.disableResourceRole(params);
      if (code === 200) {
        this.$message.success(msg);
        this.$emit("UPDATE_LIST");
      } else {
        this.$message.error(msg);
      }
    },
    // 启用
    async handleEnableResourceRole(params) {
      const { code, msg } = await api.rolePermissions.enableResourceRole(params);
      if (code === 200) {
        this.$message.success(msg);
        this.$emit("UPDATE_LIST");
      } else {
        this.$message.error(msg);
      }
    },
    updateExtDlgVis() {
      this.$parent.showDialog("个性化字段", "extRoleWinShow");
    },
    onExport(ev) {
      if(this.selRows.length) {
        const roleIds = this.selRows.map(item => item.id);
        const appCode = this.selRows[0].appCode;
        return this.exportMenuRole(ev, {
          roleIds: roleIds.join(','),
          appCode: appCode
        });
      } else {
        return this.$message.error('请选择一个菜单角色');
      }
    }
  },
};
</script>
