<template>
  <basic-list
    :show-select-col="true"
    :show-index-col="false"
    select-type="multiple"
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
    ref="basicList"
  >
    <template slot="hd-col--l">
      <!-- 单选按钮 -->
      <template v-if="isVisibleSingleMultButtons">
        <!--添加用户-->
        <el-button
          type="primary"
          :size="btnSize"
          :clstag="clstag('users_1619350946581|1')"
          @click="handleAddUser('0', selRows[0] || {})"
          v-if="buttonData('tjyh').has"
          >{{ buttonData("tjyh").name }}</el-button
        >
        <!--分配菜单角色-->
        <el-button
          type="primary"
          :size="btnSize"
          :clstag="clstag('users_1619350946581|2')"
          @click="handleConfigUser('0', selRows[0] || {})"
          v-if="buttonData('fpcdjs').has"
          >{{ buttonData("fpcdjs").name }}</el-button
        >
        <!--分配数据角色-->
        <el-button
          type="primary"
          :size="btnSize"
          :clstag="clstag('users_1619350946581|3')"
          @click="handleConfigUser('1', selRows[0] || {})"
          v-if="buttonData('fpsjjs').has"
          >{{ buttonData("fpsjjs").name }}</el-button
        >
        <!--分配数据权限-->
        <el-button
          type="primary"
          :size="btnSize"
          :clstag="clstag('users_1619350946581|4')"
          @click="handleConfigAdmin(selRows[0] || {})"
          v-if="buttonData('fpsjqx').has"
          >{{ buttonData("fpsjqx").name }}</el-button
        >
        <!--查看菜单权限-->
        <!-- <el-button type="primary"
                 :size="btnSize"
                 @click="viewMenuAuthority(selRows[0] || {})">查看菜单权限</el-button> -->
        <!--查看数据权限-->
        <!-- <el-button type="primary"
                 :size="btnSize"
                 @click="viewDataAuthority(selRows[0] || {})">查看数据权限</el-button> -->
        <!--编辑-->
        <el-button
          :size="btnSize"
          :clstag="clstag('users_1619350946581|5')"
          @click="handleAddUser('1', selRows[0] || {})"
          v-if="buttonData('bjyh').has"
          >{{ buttonData("bjyh").name }}</el-button
        >
        <!-- 删除 -->
        <!-- <el-button v-if="buttonData('scyh').has && selRows.length"
                  type="danger" :size="btnSize" @click="handleDeleteUser(selRows[0])"
                  >{{buttonData('scyh').name}}</el-button> -->
        <!--停用-->
        <!-- <el-button :size="btnSize"
                 v-if="buttonData('tyyh').has && selRows[0] && selRows[0].userStatus==1"
                 @click="handleStopLine('0', selRows[0] || {})">{{buttonData('tyyh').name}}</el-button> -->
        <!--启用-->
        <!-- <el-button :size="btnSize"
                 v-if="buttonData('qyyh').has && selRows[0] && selRows[0].userStatus==0"
                 @click="handleStopLine('1', selRows[0] || {})">{{buttonData('qyyh').name}}</el-button> -->

        <el-dropdown
          split-button
          type="primary"
          :size="btnSize"
          @command="importUser"
          trigger="click"
        >
          导入
          <el-dropdown-menu slot="dropdown">
            <!-- 导入用户 -->
            <el-dropdown-item
              v-if="buttonData('dryh').has"
              :clstag="clstag('users_1619350946581|6')"
              divided
              :command="[0, '导入用户']"
              >{{ buttonData("dryh").name }}</el-dropdown-item
            >
            <el-dropdown-item
              v-if="buttonData('YHCDJS').has"
              :clstag="clstag('users_1619350946581|7')"
              divided
              :command="[1, '导入用户菜单角色']"
              >{{ buttonData("YHCDJS").name }}</el-dropdown-item
            >
            <el-dropdown-item
              v-if="buttonData('YHSJJS').has"
              :clstag="clstag('users_1619350946581|8')"
              divided
              :command="[2, '导入用户数据角色']"
              >{{ buttonData("YHSJJS").name }}</el-dropdown-item
            >
            <el-dropdown-item
              v-if="buttonData('YHSJQX').has"
              :clstag="clstag('users_1619350946581|9')"
              divided
              :command="[3, '导入用户数据权限']"
              class="last"
              >{{ buttonData("YHSJQX").name }}</el-dropdown-item
            >
            <el-dropdown-item
              v-if="buttonData('YHYHZ').has"
              :clstag="clstag('users_1619350946581|10')"
              divided
              :command="[4, '导入用户用户组']"
              class="last"
              >{{ buttonData("YHYHZ").name }}</el-dropdown-item
            >
            <el-dropdown-item
              v-if="buttonData('BTCRU').has"
              :clstag="clstag('users_1619350946581|11')"
              divided
              :command="[5, '批量创建用户']"
              class="last"
              >{{ buttonData("BTCRU").name }}</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>

        <!-- 导出开始 -->
        <el-dropdown
          split-button
          type="primary"
          :size="btnSize"
          @command="handleExport"
          trigger="click"
        >
          导出
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-if="buttonData('DCYH').has"
              :clstag="clstag('users_1619350946581|20')"
              divided
              :command="[1, '导出用户', selRows]"
              >{{ buttonData("DCYH").name }}</el-dropdown-item
            >
            <el-dropdown-item
              v-if="buttonData('EYHCDZY').has"
              :clstag="clstag('users_1619350946581|21')"
              divided
              :command="[2, '用户菜单资源', selRows]"
              >{{ buttonData("EYHCDZY").name }}</el-dropdown-item
            >
            <el-dropdown-item
              v-if="buttonData('EYHSJZY').has"
              :clstag="clstag('users_1619350946581|22')"
              divided
              :command="[3, '用户数据资源', selRows]"
              >{{ buttonData("EYHSJZY").name }}</el-dropdown-item
            >
            <el-dropdown-item
              v-if="buttonData('EYHCDJS').has"
              :clstag="clstag('users_1619350946581|23')"
              divided
              :command="[4, '用户菜单角色', selRows]"
              >{{ buttonData("EYHCDJS").name }}</el-dropdown-item
            >
            <el-dropdown-item
              v-if="buttonData('DCYHSJJE').has"
              :clstag="clstag('users_1619350946581|24')"
              divided
              :command="[5, '用户数据角色', selRows]"
              >{{ buttonData("DCYHSJJE").name }}</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
        <!-- 导出结束 -->
        <el-dropdown
          split-button
          type="primary"
          :size="btnSize"
          @command="moreViewData"
          trigger="click"
        >
          更多
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-if="buttonData('CKYHSJQX').has"
              :clstag="clstag('users_1619350946581|12')"
              divided
              :command="[0, '查看用户数据权限', selRows[0] || {}]"
              >{{ buttonData("CKYHSJQX").name }}</el-dropdown-item
            >
            <el-dropdown-item
              v-if="buttonData('CKYHCDQX').has"
              :clstag="clstag('users_1619350946581|13')"
              divided
              :command="[1, '查看菜单资源权限', selRows[0] || {}]"
              >{{ buttonData("CKYHCDQX").name }}</el-dropdown-item
            >
            <el-dropdown-item
              v-if="buttonData('CKSSYHZ').has"
              divided
              :command="[6, '查看所属用户组', selRows[0] || {}]"
              >{{ buttonData("CKSSYHZ").name }}</el-dropdown-item
            >
            <el-dropdown-item
              v-if="buttonData('CKYHCDJS').has"
              divided
              :command="[7, '查看菜单角色', selRows[0] || {}]"
              >{{ buttonData("CKYHCDJS").name }}</el-dropdown-item
            >
            <el-dropdown-item
              v-if="buttonData('scyh').has"
              :clstag="clstag('users_1619350946581|14')"
              divided
              :command="[2, '删除', selRows[0] || {}]"
              >{{ buttonData("scyh").name }}</el-dropdown-item
            >
            <el-dropdown-item
              v-if="
                buttonData('tyyh').has &&
                selRows[0] &&
                selRows[0].userStatus == 1
              "
              :clstag="clstag('users_1619350946581|15')"
              divided
              :command="[3, '停用用户', selRows[0] || {}]"
              >{{ buttonData("tyyh").name }}</el-dropdown-item
            >
            <el-dropdown-item
              v-if="
                buttonData('qyyh').has &&
                selRows[0] &&
                selRows[0].userStatus == 0
              "
              :clstag="clstag('users_1619350946581|16')"
              divided
              :command="[4, '启用用户', selRows[0] || {}]"
              >{{ buttonData("qyyh").name }}</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
        <!--重置密码按钮-->
        <el-button
          style="margin-left: 10px"
          :size="btnSize"
          :clstag="clstag('users_1619350946581|18')"
          @click="handleResetUser(selRows[0] || {})"
          v-if="buttonData('resetpwd').has"
          >{{ buttonData("resetpwd").name }}</el-button
        >

        <el-button
          v-if="isShowIDASS"
          :size="btnSize"
          @click="handleUnfreezeAccount(selRows[0] || {})"
          >账号解冻</el-button
        >

        <el-button
          v-if="isShowIDASS && this.showExportButton"
          style="margin-left: 10px"
          type="primary"
          :clstag="clstag('users_1619350946581|19')"
          @click="importUser([5, '批量创建用户'])"
          class="last"
          :size="btnSize"
          >批量创建用户</el-button
        >
      </template>
      <!-- 多选按钮 -->
      <template v-else>
        <!-- 删除 -->
        <el-button
          v-if="buttonData('scyh').has"
          type="danger"
          :size="btnSize"
          @click="handleDeleteUser(selRows)"
          >{{ buttonData("scyh").name }}</el-button
        >
        <!--停用-->
        <el-button
          v-if="buttonData('tyyh').has"
          :size="btnSize"
          @click="handleStopLine('0', selRows)"
          >{{ buttonData("tyyh").name }}</el-button
        >
        <!--启用-->
        <el-button
          v-if="buttonData('qyyh').has"
          :size="btnSize"
          @click="handleStopLine('1', selRows)"
          >{{ buttonData("qyyh").name }}</el-button
        >
        <!-- 导出开始 -->
        <el-dropdown
          split-button
          type="primary"
          :size="btnSize"
          @command="handleExport"
          trigger="click"
        >
          导出
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-if="buttonData('DCYH').has"
              :clstag="clstag('users_1619350946581|20')"
              divided
              :command="[1, '导出用户', selRows]"
              >{{ buttonData("DCYH").name }}</el-dropdown-item
            >
            <el-dropdown-item
              v-if="buttonData('EYHCDZY').has"
              :clstag="clstag('users_1619350946581|21')"
              divided
              :command="[2, '用户菜单资源', selRows]"
              >{{ buttonData("EYHCDZY").name }}</el-dropdown-item
            >
            <el-dropdown-item
              v-if="buttonData('EYHSJZY').has"
              :clstag="clstag('users_1619350946581|22')"
              divided
              :command="[3, '用户数据资源', selRows]"
              >{{ buttonData("EYHSJZY").name }}</el-dropdown-item
            >
            <el-dropdown-item
              v-if="buttonData('EYHCDJS').has"
              :clstag="clstag('users_1619350946581|23')"
              divided
              :command="[4, '用户菜单角色', selRows]"
              >{{ buttonData("EYHCDJS").name }}</el-dropdown-item
            >
            <el-dropdown-item
              v-if="buttonData('DCYHSJJE').has"
              :clstag="clstag('users_1619350946581|24')"
              divided
              :command="[5, '用户数据角色', selRows]"
              >{{ buttonData("DCYHSJJE").name }}</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
        <!-- 导出结束 -->
        <!--退出批量操作-->
        <el-button
          :size="btnSize"
          style="margin-left: 10px"
          @click="handleExitBatchOperation"
          >退出批量操作</el-button
        >
      </template>
    </template>
  </basic-list>
</template>

<script>
import ExactList from "@/mixins/exactList";
import axios from "axios";
import { mapState } from "vuex";
import { clstagData } from "@/utils/req";
export default {
  mixins: [ExactList],
  props: {
    handleAddUser: Function,
    handleStopLine: Function,
    handleConfigUser: Function,
    handleConfigAdmin: Function,
    viewMenuAuthority: Function,
    viewDataAuthority: Function,
    importUser: Function,
    exportUserData: Function,
    handleDeleteUser: Function,
    moreViewData: Function,
    handleExport: Function,
    handleResetUser: Function,
    handleUnfreezeAccount: Function,
  },
  // computed: {
  //   ...mapState("app", ["tenementInfoObj", "tenementCode", "showExportButton"]),
  // },
  created() {
    axios({
      method: "post",
      url: `/tenementMemphisCfg/queryGlobalSwitchAboutUserCfg?tenementCode=${this.tenementCode}`,
      data: {},
    })
      .then((resolve) => {
        this.isShowIDASS = resolve.data.data;
      })
      .catch((reject) => {
        console.log("getExtByTenementCodeData 请求失败", reject);
      });
  },
  data() {
    return {
      isShowIDASS: false,
      btnSize: "mini",
      pageIndexChangeFlag: false,
      fields: [
        { key: "userName", name: "姓名" },
        { key: "userCode", name: "用户账号" },
        { key: "userAlias", name: "账号别名" },
        {
          key: "userSystemType",
          name: "账号类型",
          formatter: function (row, column, cellValue, index) {
            return _params.users.userSystemType[cellValue];
          },
        },
        { key: "parentFullName", name: "所属机构", width: 220 },
        // 用户类型 0:普通用户 1：超级管理员
        {
          key: "userType",
          name: "类型",
          formatter: function (row, column, cellValue, index) {
            return _params.users.userType[cellValue];
          },
        },
        {
          key: "userStatus",
          name: "状态",
          formatter: function (row, column, cellValue, index) {
            return _params.users.userStatus[cellValue];
          },
        },
        { key: "createUser", name: "创建人" },
        { key: "userSource", name: "来源" },
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
        { key: "ext11", name: "", hidden: true },
        { key: "ext12", name: "", hidden: true },
        { key: "ext13", name: "", hidden: true },
        { key: "ext14", name: "", hidden: true },
        { key: "ext15", name: "", hidden: true },
        { key: "ext16", name: "", hidden: true },
        { key: "ext17", name: "", hidden: true },
        { key: "ext18", name: "", hidden: true },
        { key: "ext19", name: "", hidden: true },
        { key: "ext20", name: "", hidden: true },
        {
          key: "createTime",
          name: "创建时间",
          width: 180,
          formatter: function (row, column, cellValue, index) {
            return jt.date.format(new Date(cellValue).getTime());
          },
        },
        { key: "remark", name: "备注" },
      ],
      isVisibleSingleMultButtons: true,
    };
  },
  watch: {
    selRows: {
      handler(newValue) {
        if (newValue && newValue.length > 1) {
          this.isVisibleSingleMultButtons = false;
        }
      },
    },
  },
  methods: {
    clstag(data) {
      clstagData(data);
    },
    updateExtDlgVis() {
      this.$parent.showDialog("个性化字段", "extWinShow");
    },
    handleExitBatchOperation() {
      this.$refs.basicList.$refs.table.clearSelection();
      this.isVisibleSingleMultButtons = true;
    },
  },
};
</script>
