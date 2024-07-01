<template>
  <basic-dialog
    :visible="visible"
    :title="'查看用户菜单角色'"
    :width="900"
    :showFt="false"
    :update-vis="updateVis"
    :handle-close="handleClose"
  >
    <el-form class="search-form" size="small" label-width="80px" :model="query">
      <div class="col-l">
        <el-row>
          <el-col :span="6">
            <el-form-item label="软件系统">
              <el-select v-model="query.appCode" @change="pickCode">
                <el-option
                  :key="item.appCode"
                  :label="item.appName + '(' + item.appCode + ')'"
                  v-for="item in appList"
                  :value="item.appCode"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="角色名称">
              <el-input v-model.trim="query.roleNameLike" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="角色编码">
              <el-input v-model.trim="query.roleCode" clearable />
            </el-form-item>
          </el-col>
          <div class="col-r" style="float: right">
            <el-button type="primary" size="small" @click="handleSearch"
              >查询</el-button
            >
            <el-button size="small" @click="handleReset">重置</el-button>
          </div>
        </el-row>
      </div>
    </el-form>
    <basic-list
      :show-select-col="false"
      :show-action-col="false"
      :loading="false"
      ref="adminTB"
      :showActionCol="true"
      :actionColLabel="'操作'"
      :isActionRender="false"
      :fields="fields"
      :total="viewMenuRoleTotal"
      :list="viewMenuRoleListData"
      :selection-change="selectionChange"
      :page-index-change="pageIndexChange"
      :page-size-change="pageSizeChange"
      :page-size="pageSize"
      :page-index="pageIndex"
    >
      <template v-slot:action="row">
        <el-popover placement="top" trigger="click">
          <div>
            <el-alert
              title="用户从以下渠道获得了该菜单角色的权限,如果想要去除用户对于该菜单角色的权限,需要将用户从以下渠道中全部移除"
              type="info"
              :closable="false"
              style="margin-bottom: 10px"
            >
            </el-alert>
            <el-table :data="dataCodeArray" border style="width: 100%">
              <el-table-column prop="source" label="权限来源类型" width="200px">
              </el-table-column>
              <el-table-column prop="detail" label="详情"> </el-table-column>
            </el-table>
          </div>

          <!-- <el-button slot="reference">click 激活</el-button> -->
          <el-button slot="reference" type="primary" @click="watchData(row)" size="mini"
            >查看</el-button
          >
        </el-popover>
      </template>
    </basic-list>
  </basic-dialog>
</template>

<script>
import store from "../store";
import { mapState, mapActions } from "vuex";
import EntityDialog from "@/mixins/entityDialog";
import ExactList from "@/mixins/exactList";

export default {
  mixins: [EntityDialog, ExactList],
  props: {
    winClose: {
      type: Function,
      default() {
        return () => {};
      },
    },
  },
  data() {
    return {
      query: {
        appCode: "",
        roleNameLike: "",
        roleCode: "",
      },

      pageIndex: 0,
      pageSize: 10,

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
      ],
      dataCodeArray: [],
      immediateQuery: false,
    };
  },
  computed: {
    appList() {
      return this.$store.state.users.appList;
    },
    ...mapState('users', ['viewMenuRoleTotal', 'viewMenuRoleListData'])
  },
  watch: {
    visible(val) {
      if (val) {
        this.$parent
          .dispatch("queryAppList")
          .then((res) => {
            this.query.appCode = res.appList[0].appCode;
          })
          .then((res) => {
            this.pickCode();
          });
      }
    },
  },
  methods: {
    watchData({ row }) {
      let params = {
        id: row.id,
        tenementCode: this.tenementCode,
        appCode: row.appCode,
        userId: this.$store.state.users.userId,
      };
      api.users.queryUserMenuRoleSource({ data: params }).then((res) => {
        if (res.code == 200) {
          this.dataCodeArray = res.data;
        } else {
          this.$message({ message: res.msg || "请求异常", type: "error" });
        }
      });
    },

    // 关闭和取消按钮
    handleClose(ev) {
      this.winClose(ev);
    },
    queryList() {
      this.$parent.dispatch("viewMenuRoleList");
    },
    pickCode() {
      this.$parent.updateState({ viewAppCode: this.query.appCode });
      this.pageIndex = 0;
      this.$parent.updateState({ viewMenuRolePageIndex: 0 });
      this.$parent.dispatch("viewMenuRoleList");
    },
    handleSearch() {
      this.$parent.updateState({ query: this.query });
      this.$parent.dispatch("viewMenuRoleList");
    },
    handleReset() {
      const appCode = this.appList[0].appCode;
      this.query = { roleNameLike: "", roleCode: "", appCode };
      this.pageIndex = 0;
      this.pageSize = 10;
      this.$parent.updateState({ viewAppCode: appCode, viewMenuRolePageIndex: 0, viewMenuRolePageSize: 10 });
      this.$parent.updateState({ query: this.query });
      this.$parent.dispatch("viewMenuRoleList");
    },

    // 切换页数
    pageIndexChange(_index) {
      let _ind = _index - 1;
      this.pageIndex = _ind;
      this.pageSize = 10;
      // 更新页面数据
      this.$parent.updateState({ viewMenuRolePageIndex: _ind, viewMenuRolePageSize: 10 });
      // 查询列表
      this.$parent.dispatch("viewMenuRoleList");
    },
    // 切换每页显示条数
    pageSizeChange(_size) {
      // 查询列表
      this.pageIndex = 0;
      this.pageSize = _size;
      this.$parent.updateState({ viewMenuRolePageIndex: 0, viewMenuRolePageSize: _size });
      // 查询列表
      this.$parent.dispatch("viewMenuRoleList");
    },
  },
};
</script>

<style lang="scss" scoped>
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