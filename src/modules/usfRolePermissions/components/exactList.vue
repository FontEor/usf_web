<template>
  <basic-list
    :show-index-col="false"
    :fields="fields"
    select-type="singleMult"
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
    :show-ext-set="buttonData('cdjskz2').has"
    :ext-dlg-vis="updateExtDlgVis"
  >
    <template slot="hd-col--l">
      <el-button
        type="primary"
        :size="btnSize"
        @click="proxyActions({ action: 'onAdd', rows: selRows })"
        v-if="buttonData('tjcdjs2').has"
        >{{ buttonData("tjcdjs2").name }}</el-button
      >
      <el-button
        type="primary"
        :size="btnSize"
        @click="proxyActions({ action: 'distribute', rows: selRows })"
        v-if="buttonData('cdjefpcdjs2').has"
        >{{ buttonData("cdjefpcdjs2").name }}</el-button
      >
      <!-- <el-button type="primary" :size="btnSize" @click="proxyActions({ action: 'copyUser', rows: selRows })">{{'复制菜单角色'}}</el-button> -->
      <el-button
        :size="btnSize"
        @click="proxyActions({ action: 'edit', rows: selRows })"
        v-if="buttonData('bjcdjs2').has"
        >{{ buttonData("bjcdjs2").name }}</el-button
      >
      <el-button
        :size="btnSize"
        @click="proxyActions({ action: 'view', rows: selRows })"
        v-if="buttonData('cdjsxq2').has"
        >{{ buttonData("cdjsxq2").name }}</el-button
      >
      <el-button
        type="danger"
        :size="btnSize"
        @click="proxyActions({ action: 'delet', rows: selRows })"
        v-if="buttonData('sccdjs2').has"
        >{{ buttonData("sccdjs2").name }}</el-button
      >
      <!-- 启用 -->
      <el-button
        v-if="buttonData('qycdjs2').has && isDisable"
        :size="btnSize"
        @click="handleEnableOrDisable"
        >{{ buttonData("qycdjs2").name }}</el-button
      >
      <!-- 停用 -->
      <el-button
        v-if="buttonData('tycdjs2').has && isEnable"
        :size="btnSize"
        @click="handleEnableOrDisable"
        >{{ buttonData("tycdjs2").name }}</el-button
      >
      <!-- 导入菜单角色 -->
      <el-button
        v-if="buttonData('CDJSDR2').has"
        :size="btnSize"
        @click="importRole(buttonData('CDJSDR2').name)"
        >{{ buttonData("CDJSDR2").name }}</el-button
      >
      <!-- 导入角色资源 -->
      <el-button
        v-if="buttonData('DRCDJSZY2').has"
        :size="btnSize"
        @click="importRoleResource(buttonData('DRCDJSZY2').name)"
        >{{ buttonData("DRCDJSZY2").name }}</el-button
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
            v-if="buttonData('DCCDJS2').has"
            divided
            :command="[0, '导出菜单角色']"
            >{{ buttonData("DCCDJS2").name }}</el-dropdown-item
          >
          <el-dropdown-item
            v-if="buttonData('DCYHCDJS2').has"
            divided
            :command="[2, '导出用户菜单角色']"
            >{{ buttonData("DCYHCDJS2").name }}</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>
    </template>
  </basic-list>
</template>

<script>
import ExactList from "@/mixins/exactList";
export default {
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
