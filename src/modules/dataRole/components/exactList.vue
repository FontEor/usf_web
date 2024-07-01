<template>
  <basic-list
    :fields="fields"
    :loading="state.loading"
    :total="state.total"
    :list="state.list"
    :show-select-col="true"
    :show-index-col="false"
    :show-action-col="false"
    :table-h="tableH"
    :page-index="state.pageIndex"
    :page-size="state.pageSize"
    :page-index-change="pageIndexChange"
    :page-size-change="pageSizeChange"
    :selection-change="selectionChange"
  >
    <template slot="hd-col--l">
      <!-- 添加数据角色 -->
      <el-button
        type="primary"
        v-if="buttonData('tjsjjs').has"
        size="mini"
        :disabled="selRows.length > 1"
        @click="handleAdd(buttonData('tjsjjs').name)"
        >{{ buttonData("tjsjjs").name }}</el-button
      >
      <!-- 分配数据角色 -->
      <el-button
        type="primary"
        v-if="buttonData('sjjsglfpsjjs').has"
        size="mini"
        :disabled="selRows.length > 1"
        @click="handleAllocate(selRows[0], buttonData('sjjsglfpsjjs').name)"
        >{{ buttonData("sjjsglfpsjjs").name }}</el-button
      >
      <!-- 编辑 -->
      <el-button
        v-if="buttonData('bjsjje').has"
        size="mini"
        :disabled="selRows.length > 1"
        @click="handleEdit(selRows[0], buttonData('bjsjje').name)"
        >{{ buttonData("bjsjje").name }}</el-button
      >
      <!-- 详情 -->
      <el-button
        v-if="buttonData('sjjsxq').has"
        size="mini"
        :disabled="selRows.length > 1"
        @click="handleView(selRows[0], buttonData('sjjsxq').name)"
        >{{ buttonData("sjjsxq").name }}</el-button
      >
      <!-- 删除 -->
      <el-button
        type="danger"
        v-if="buttonData('scsjjs').has"
        size="mini"
        :disabled="selRows.length > 1"
        @click="handleDelete(selRows[0])"
        >{{ buttonData("scsjjs").name }}</el-button
      >
      <!-- 导入 -->
      <el-dropdown
          split-button
          size="mini"
          @command="handleImport"
          trigger="click"
        >
          导入
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-if="buttonData('SJJSDR').has"
              :command="[1, '导入数据角色']"
              >{{ buttonData("SJJSDR").name }}</el-dropdown-item
            >
            <el-dropdown-item
              v-if="buttonData('DRSJJSGLSJZY').has"
              divided
              :command="[2, '导入数据角色关联数据资源']"
              >{{ buttonData("DRSJJSGLSJZY").name }}</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      <!-- 导出 -->
      <el-dropdown
          split-button
          type="primary"
          size="mini"
          @command="handleExport"
          trigger="click"
        >
          导出
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-if="buttonData('DCSJJEGLYH').has"
              divided
              :command="[1, '导出数据角色关联用户', selRows]"
              >{{ buttonData("DCSJJEGLYH").name }}</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
    </template>
  </basic-list>
</template>

<script>
import { mapState } from "vuex";
import ExactList from "@/mixins/exactList";
export default {
  // computed: {
  //   ...mapState("app", ["showExportButton"]),
  // },
  mixins: [ExactList],
  props: {
    handleAdd: Function,
    handleAllocate: Function,
    handleEdit: Function,
    handleView: Function,
    handleDelete: Function,
    handleExport: Function,
    importDataRole: Function,
    handleImport: Function,
  },
  data() {
    return {
      selRows: [],
      fields: [
        { key: "roleName", name: "数据角色名称" },
        { key: "roleCode", name: "数据角色编码" },
        { key: "createUser", name: "创建人" },
        {
          key: "createTime",
          name: "创建时间",
          render: (h, { row, col }) => (
            <span>{this.format(new Date(row.createTime))}</span>
          ),
        },
        { key: "source", name: "来源" },
        { key: "remark", name: "备注" },
        { key: "rootOrgName", name: "所属机构名称" },
      ],
    };
  },
  methods: {
    selectionChange(rows) {
      this.selRows = rows;
    },
    format(date) {
      const map = {
        M: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        m: date.getMinutes(),
        s: date.getSeconds(),
      };
      let Y = date.getFullYear();
      for (let key in map) {
        if (map[key] < 10) map[key] = "0" + map[key];
      }
      return `${Y}-${map.M}-${map.d} ${map.h}:${map.m}:${map.s}`;
    },
  },
};
</script>
