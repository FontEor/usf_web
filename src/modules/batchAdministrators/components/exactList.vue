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
    select-type="multiple"
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

      <!-- <el-button type="primary" size="mini" @click="proxyActions({ action: 'EntiDiaDisData', rows: selRows })" v-if="buttonData('glysqfpsjjsglqx').has">{{buttonData('glysqfpsjjsglqx').name}}</el-button> -->
      <el-button
        type="primary"
        size="mini"
        @click="proxyActions({ action: 'disMeun', rows: selRows })"
        v-if="buttonData('glqsqfpcdglqx').has"
        >{{ buttonData("glqsqfpcdglqx").name }}</el-button
      >
      <!-- <el-button type="primary" size="mini" @click="proxyActions({ action: 'distribute', rows: selRows })" v-if="buttonData('glysqfpsjglqx').has">{{buttonData('glysqfpsjglqx').name}}</el-button> -->
      <!-- <el-button type="primary" size="mini" @click="proxyActions({ action: 'edit', rows: selRows })" v-if="buttonData('glysqfpjgglqx').has">{{buttonData('glysqfpjgglqx').name}}</el-button> -->
      <!-- 分配用户组管理权限 -->
      <!-- <el-button type="primary" size="mini" @click="proxyActions({ action: 'handleUserGroupAllot', rows: selRows })" v-if="buttonData('fpyhzglqx').has">{{buttonData('fpyhzglqx').name}}</el-button> -->
    </template>
  </basic-list>
</template>

<script>
import ExactList from "@/mixins/exactList";
export default {
  mixins: [ExactList],
  props: {
    proxyActions: Function,
  },
  data() {
    return {
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
        // 用户类型 0:普通用户 1：超级管理员
        //  {
        //  key: "userType",
        //   name: "类型",
        //  formatter: function (row, column, cellValue, index) {
        //    return _params.users.userType[cellValue];
        //  },
        //  },
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
      this.$parent.updateState({ listRows: rows });
      this.handleSelectionChange && this.handleSelectionChange(rows);
    },
  },
};
</script>
