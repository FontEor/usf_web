<template>
  <basic-dialog :visible="visible"
                :title="title"
                :width="1200"
                :update-vis="updateVis"
                :handle-close="handleClose"
                :showFt='showSelect'
                :handle-closed="handleClosed"
                :handle-ok="handleOk">
    <el-form ref="form"
             size="small"
             label-position="right"
             label-width="100px"
             :model="dto"
             :rules="rules"
             @submit.native.prevent>
      <div class="entity-dlg__block">
        <div class="entity-dlg__block-bd formFix">
          <el-row :gutter="24">
            <el-col :span="20">
              <el-form-item label="软件系统"
                            prop="appCode"
                            style="display:inline-block;">
                <el-select v-model="appCode"
                           @change="onAppChange">
                  <el-option v-for="item in appList"
                             :key="item.appCode"
                             :value="item.appCode"
                             :label="item.appName">
                    <span style="float: left">{{ `${item.appName}(${item.appCode})` }}</span>
                    <!-- <span style="float: right; color: #8492a6; font-size: 13px">{{ item.appCode }}</span> -->
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="角色名称"
                            style="display:inline-block;">
                <el-input v-model="roleNameLike"
                          placeholder="角色名称"
                          :maxlength="30"
                          clearable />
              </el-form-item>
              <el-form-item label="角色编码"
                            style="display:inline-block;">
                <el-input v-model="roleCodeLike"
                          placeholder="角色编码"
                          :maxlength="30"
                          clearable />
              </el-form-item>
            </el-col>
            <el-button type="primary"
                       size="small"
                       @click="query">查询</el-button>
            <el-button v-if="action === '分配菜单角色'"
                       size="small"
                       @click="reset">重置</el-button>
          </el-row>
        </div>
      </div>
    </el-form>
    <template>
      <basic-list ref="userTB"
                  :show-select-col="showSelect"
                  :show-action-col="false"
                  :loading="false"
                  :fields="fields"
                  :key="keys"
                  :total="menuList ? menuList.total : 0"
                  :list="menuList ? menuList.list : []"
                  :selection-change="selectionChange"
                  :page-index-change="pageIndexChange"
                  :page-size-change="pageSizeChange"
                  :page-size="pageSize">
      </basic-list>
    </template>
  </basic-dialog>
</template>

<script>
// 添加或编辑用户
import EntityDialog from "@/mixins/entityDialog";
import ExactList from "@/mixins/exactList";
import { mapState } from "vuex";
export default {
  mixins: [EntityDialog, ExactList],
  data() {
    return {
      rules: {},
      pageSize: 10,
      appCode: {},
      roleNameLike: "",
      roleCodeLike: "",
      menuList: null,
      type: '',
      cascaderVal: "",
      // 设置翻页触发接口名
      apiName: "listForUser",
      apiIdList: [],
      pickIdList: [],
      fields: [
        { key: 'roleName', name: '角色名称' },
        { key: 'roleCode', name: '角色编码' },
        { key: 'sensitiveMark',name: '是否敏感',render: (h, { row }) => {
                const status = { 0: '否', 1: '是' }
                const value = status[row.sensitiveMark]
                return <span>{value}</span>
            }
        },
        { key: 'appName', name: '所属软件系统' },
        { key: 'roleSource', name: '来源' },
        { key: 'rootOrgName', name: '所属机构名称' },
      ],
      showSelect: true,
      keys: 1
    };
  },
  computed: {
    ...mapState("app", ["appList"])
  },
  props: {
    selectItem: {
      type: Object,
      default() {
        return {};
      }
    },
    winClose: {
      type: Function,
      default() {
        return () => { };
      }
    }
  },
  watch: {
    "state.menuList": {
      deep: true,
      immediate: true,
      handler: function (newVal) {
        this.menuList = newVal;
        this.giveCheck();
      }
    },
    "action": {
      deep: true,
      immediate: true,
      handler: function (newVal) {
        this.showSelect = newVal === '查看菜单角色' ? false : true;
        this.fields = [
          { key: 'roleName', name: '角色名称' },
          { key: 'roleCode', name: '角色编码' },
          { key: 'sensitiveMark',name: '是否敏感',render: (h, { row }) => {
                  const status = { 0: '否', 1: '是' }
                  const value = status[row.sensitiveMark]
                  return <span>{value}</span>
              }
          },
          { key: 'appName', name: '所属软件系统' },
          { key: 'roleSource', name: '来源' },
          { key: 'rootOrgName', name: '所属机构名称' },
          { key: "createUser", name: "添加人" },
          { key: "createTime", name: "添加时间" }
        ]
        this.keys++
      }
    }
  },
  methods: {
    // 弹出触发
    setAppCode(type) {
      this.appCode = this.appList[0].appCode
      this.$parent.updateState({ appCode: this.appCode })
      this.type = type
      this.query()
    },
    // 软件系统选择
    onAppChange(_appCode) {
      this.$parent.updateState({ appCode: _appCode })
      this.query()
    },
    // 查询
    query(ev, type) {
      this.$parent.updateState({ roleNameLike: this.roleNameLike, roleCodeLike: this.roleCodeLike, menuPageIndex: 0 });
      if (this.type === 'view') {
        this.$parent.dispatch('viewResourceRoleByGroup')
      } else {
        this.$parent.dispatch("listForUser");
      }
    },
    // 重置
    reset() {
      this.roleNameLike = "";
      this.roleCodeLike = "";
      this.$parent.updateState({ roleNameLike: this.roleNameLike, roleCodeLike: this.roleCodeLike });
      // 查询 设置菜单角色列表
      if (this.type === 'view') {
        this.$parent.dispatch('viewResourceRoleByGroup')
      } else {
        this.$parent.dispatch("listForUser");
      }
    },
    handleOk() {
      if (!this.$refs.form) {
        return;
      }
      this.$refs.form.validate(valid => {
        if (!valid) {
          return;
        }
        let params = this.toEnd();
        this.handleSave({ params, type: this.action });
        this.keys++
      });
    },
    // 关闭和取消按钮
    handleClose(ev) {
      this.roleNameLike = "";
      this.roleCodeLike = "";
      this.$parent.updateState({ roleNameLike: this.roleNameLike, roleCodeLike: this.roleCodeLike });
      this.keys++
      this.winClose(ev);
    },
    handleChange(ev) { },
    // 选择触发事件 获取当前行数据
    selectionChange(rows, ind) {
      this.pickIdList.length = 0;
      rows.forEach(item => {
        this.pickIdList.push(item.id);
      });
      this.$parent.updateState({ pickIdList: this.pickIdList });
    },
    giveCheck() {
      // 设置数据勾选
      setTimeout(() => {
        this.apiIdList.length = 0;
        this.menuList &&
          this.menuList.list &&
          this.menuList.list.forEach((item, ind) => {
            const _table = this.$refs.userTB.$refs.table;
            // 设置状态
            item &&
              _table.toggleRowSelection(item, item.isOwnRole !== 0);
            // 存储id
            this.apiIdList.push(item.id);
          });
        if (this.apiIdList.length > 0) {
          this.$parent.updateState({ apiIdList: this.apiIdList });
        }
      });
    },
    // 切换页数
    pageIndexChange(_index) {
      let _ind = _index - 1;
      // 更新页面数据
      this.$parent.updateState({ menuPageIndex: _ind });
      // 查询列表
      if (this.type === 'view') {
        this.apiName = 'viewResourceRoleByGroup'
      }
      this.$parent.dispatch(this.apiName || "queryList");
    },
    // 切换每页显示条数
    pageSizeChange(_size) {
      // 查询列表
      this.pageSize = _size;
      this.$parent.updateState({ menuPageSize: _size });
      if (this.type === 'view') {
        this.apiName = 'viewResourceRoleByGroup'
      }
      // 查询列表
      this.$parent.dispatch(this.apiName || "queryList");
    }
  }
};
</script>

<style lang="scss" scope>
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
