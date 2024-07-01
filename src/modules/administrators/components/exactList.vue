<template>
  <basic-list
    :fields="fields"
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
    select-type="singleMult"
    :page-size-change="pageSizeChange"
  >
    <template slot="hd-col--l">
      <el-button
        type="primary"
        size="mini"
        @click="proxyActions({ action: 'amenManPri', rows: selRows })"
        v-if="buttonData('glysqfpcdjsglqx').has"
        >{{ buttonData("glysqfpcdjsglqx").name }}</el-button
      >
      <el-button
        type="primary"
        size="mini"
        @click="proxyActions({ action: 'EntiDiaDisData', rows: selRows })"
        v-if="buttonData('glysqfpsjjsglqx').has"
        >{{ buttonData("glysqfpsjjsglqx").name }}</el-button
      >
      <!-- 菜单资源管理 -->
      <el-button
        type="primary"
        size="mini"
        @click="proxyActions({ action: 'disMeun', rows: selRows })"
        v-if="buttonData('glqsqfpcdglqx').has"
        >{{ buttonData("glqsqfpcdglqx").name }}</el-button
      >
      <el-button
        type="primary"
        size="mini"
        @click="proxyActions({ action: 'distribute', rows: selRows })"
        v-if="buttonData('glysqfpsjglqx').has"
        >{{ buttonData("glysqfpsjglqx").name }}</el-button
      >
      <!-- 机构管理tree版本 -->
      <el-button
        type="primary"
        size="mini"
        @click="proxyActions({ action: 'edit', rows: selRows })"
        v-if="buttonData('glysqfpjgglqx').has"
        >{{ buttonData("glysqfpjgglqx").name }}</el-button
      >
      <!-- 机构管理列表版本  需要增加编号-->
      <el-button
        type="primary"
        size="mini"
        @click="proxyActions({ action: 'edit2', rows: selRows })"
        v-if="buttonData('FPJGGLQX').has"
        >{{ buttonData("FPJGGLQX").name }}</el-button
      >
      <!-- 分配用户组管理权限 -->
      <el-button
        type="primary"
        size="mini"
        @click="proxyActions({ action: 'handleUserGroupAllot', rows: selRows })"
        v-if="buttonData('fpyhzglqx').has"
        >{{ buttonData("fpyhzglqx").name }}</el-button
      >
      <!-- 导入 -->
      <el-dropdown
        split-button
        type="primary"
        :size="btnSize"
        @command="importUser"
        trigger="click"
      >
        导入
        <el-dropdown-menu slot="dropdown">
          <!-- 用户菜单角色管理权限 -->
          <el-dropdown-item
            v-if="buttonData('YHCDJSGLQX').has"
            :clstag="clstag('adminnistrators_1619350946581|1')"
            divided
            :command="[0, '用户菜单角色管理权限']"
            >{{ buttonData("YHCDJSGLQX").name }}</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>
    </template>
  </basic-list>
</template>

<script>
import ExactList from "@/mixins/exactList";
import { clstagData } from "@/utils/req";
export default {
  mixins: [ExactList],
  props: {
    proxyActions: Function,
    importUser: Function,
  },
  data() {
    return {
      btnSize: "mini",
      fields: [
        { key: "userName", name: "姓名" },
        { key: "userCode", name: "用户账号" },
        { key: "userAlias", name: "账号别名" },
        { key: "orgCode", name: "所属机构" },
        {
          key: "createTime",
          name: "创建时间",
          width: 180,
          formatter: function (row, column, cellValue, index) {
            return jt.date.format(new Date(cellValue).getTime());
          },
        },
        { key: "userSource", name: "来源" },
        {
          key: "userStatus",
          name: "状态",
          formatter: function (row, column, cellValue, index) {
            return _params.users.userStatus[cellValue];
          },
        },
        { key: "remark", name: "备注" },
      ],
    };
  },
  methods: {
    //选中
    selectionChange(rows) {
      this.selRows = rows;
      this.handleSelectionChange && this.handleSelectionChange(rows);
    },
    //没看明白干嘛用的
    clstag(data) {
      clstagData(data);
    },
  },
};
</script>
