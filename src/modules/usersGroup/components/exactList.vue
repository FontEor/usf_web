<template>
  <basic-list
    :show-select-col="true"
    :show-index-col="false"
    select-type="singleMult"
    :fields="fields"
    :loading="state.loading"
    :total="state.total"
    :list="state.list"
    :table-h="tableH"
    :page-index="state.pageIndex"
    :page-size="state.pageSize"
    :page-index-change="pageIndexChange"
    :show-action-col="false"
    row-key="id"
    :selection-change="selectionChange"
    :page-size-change="pageSizeChange"
    :show-ext-set="buttonData('yhkz').has"
    :ext-dlg-vis="updateExtDlgVis"
  >
    <template slot="hd-col--l">
      <!--添加用户-->
      <el-button
        type="primary"
        :size="btnSize"
        @click="handleAddUser('0', selRows[0] || {})"
        v-if="buttonData('tjyhz').has"
        >{{ buttonData("tjyhz").name }}</el-button
      >
      <!--设置组成员-->
      <el-button
        type="primary"
        :size="btnSize"
        @click="handleConfigAdmin(selRows[0] || {})"
        v-if="buttonData('szzcy').has"
        >{{ buttonData("szzcy").name }}</el-button
      >
      <!--分配菜单角色-->
      <el-button
        type="primary"
        :size="btnSize"
        @click="handleConfigUser('0', selRows[0] || {})"
        v-if="buttonData('yhzfecdjs').has"
        >{{ buttonData("yhzfecdjs").name }}</el-button
      >
      <!--分配数据角色-->
      <el-button
        type="primary"
        :size="btnSize"
        @click="handleConfigUser('1', selRows[0] || {})"
        v-if="buttonData('yhzfpsjjs').has"
        >{{ buttonData("yhzfpsjjs").name }}</el-button
      >
      <el-dropdown
        v-if="
          buttonData('ckzcy').has ||
          buttonData('ckcdjs').has ||
          buttonData('cksjjs').has
        "
        :size="btnSize"
        trigger="click"
        style="margin-right: 10px"
        @command="handleCommandMore($event, selRows[0] || {})"
      >
        <el-button :size="btnSize">
          更多<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <!-- 查看组成员 -->
          <el-dropdown-item v-if="buttonData('ckzcy').has" command="ckzcy">{{
            buttonData("ckzcy").name
          }}</el-dropdown-item>
          <!-- 查看菜单角色 -->
          <el-dropdown-item v-if="buttonData('ckcdjs').has" command="ckcdjs">{{
            buttonData("ckcdjs").name
          }}</el-dropdown-item>
          <el-dropdown-item v-if="buttonData('cksjjs').has" command="cksjjs">{{
            buttonData("cksjjs").name
          }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!--编辑-->
      <el-button
        :size="btnSize"
        @click="handleAddUser('1', selRows[0] || {})"
        v-if="buttonData('yhzbj').has"
        >{{ buttonData("yhzbj").name }}</el-button
      >
      <!--删除 -->
      <el-button
        v-if="buttonData('yhzsc').has && selRows.length"
        type="danger"
        :size="btnSize"
        @click="handleDeleteUser(selRows[0])"
        >{{ buttonData("yhzsc").name }}</el-button
      >
      <el-dropdown
        split-button
        :size="btnSize"
        type="primary"
        trigger="click"
        style="margin-right: 10px"
        @command="importUser"
      >
        导入
        <el-dropdown-menu slot="dropdown">
          <!-- 导入用户 -->
          <el-dropdown-item
            v-if="buttonData('DRYHZ').has"
            divided
            :command="[0, '导入用户组']"
            >{{ buttonData("DRYHZ").name }}</el-dropdown-item
          >
          <el-dropdown-item
            v-if="buttonData('DRYHZCDJS').has"
            divided
            :command="[1, '导入用户组菜单角色']"
            >{{ buttonData("DRYHZCDJS").name }}</el-dropdown-item
          >
          <el-dropdown-item
            v-if="buttonData('DRYHZSJJS').has"
            divided
            :command="[2, '导入用户组数据角色']"
            >{{ buttonData("DRYHZSJJS").name }}</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>
      <el-button
        size="mini"
        @click="handleRelatedJobs(selRows[0] || {})"
        v-if="relatedJobsButtonVisible"
        >用户组关联岗位</el-button
      >
    </template>
  </basic-list>
</template>

<script>
import ExactList from "@/mixins/exactList";
import { mapState } from "vuex";
export default {
  mixins: [ExactList],
  props: {
    handleAddUser: Function,
    handleConfigUser: Function,
    handleConfigAdmin: Function,
    handleDeleteUser: Function,
    handleRelatedJobs: Function,
    importUser: Function,
  },
  data() {
    return {
      btnSize: "mini",
      pageIndexChangeFlag: false,
      fields: [
        { key: "groupCode", name: "用户组编码" },
        { key: "groupName", name: "用户组名称" },
        { key: "createUser", name: "创建人" },
        {
          key: "createTime",
          name: "创建时间",
          width: 180,
          formatter: function (row, column, cellValue, index) {
            return jt.date.format(new Date(cellValue).getTime());
          },
        },
        { key: "source", name: "来源" },
        { key: "remark", name: "备注" },
      ],
      relatedJobsButtonVisible: false,
    };
  },
  computed: {
    ...mapState("app", ["tenementCode"]),
  },
  methods: {
    // 根据租户获取自动分配及审批流信息接口
    async getPositionAutoAssignInfo() {
      const tenementCode = this.tenementCode;
      const { code, data, msg } = await api.tenement.getPositionAutoAssignInfo({
        data: { tenementCode },
      });
      if (code === 200) {
        const { positionAutoSwitch } = data;
        this.relatedJobsButtonVisible = positionAutoSwitch;
      } else {
        msg && this.$message.error(msg);
        throw new Error(msg);
      }
    },
    handleCommandMore(command, row) {
      if (command === "ckzcy") {
        this.handleConfigAdmin(row, "view");
      } else if (command === "ckcdjs") {
        this.handleConfigUser("0", row, "view");
      } else if (command === "cksjjs") {
        this.handleConfigUser("1", row, "view");
      } else {
        console.log("command", command);
      }
    },
    updateExtDlgVis() {
      this.$parent.showDialog("个性化字段", "extWinShow");
    },
  },
  created() {
    this.getPositionAutoAssignInfo();
  },
};
</script>
