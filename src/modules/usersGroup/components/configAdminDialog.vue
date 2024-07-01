<template>
  <basic-dialog :visible="visible"
                :title="title"
                :width="1200"
                :update-vis="updateVis"
                :showFt='showSelect'
                :handle-close="handleClose"
                :handle-closed="handleClosed"
                :isShowFooterAll='true'
                :handle-ok="handleOk">
    <el-form ref="form"
             size="small"
             label-position="right"
             label-width="100px"
             :model="dto"
             :rules="rules"
             @submit.native.prevent>
      <div class="entity-dlg__block">
        <div class="entity-dlg__block-bd">
          <el-row :gutter="24">
            <el-col :span="21">
              <el-form-item label="用户账号"
                            style="display:inline-block;">
                <el-input v-model="userCodeLike"
                          placeholder="用户账号"
                          clearable />
              </el-form-item>
              <el-form-item label="姓名"
                            style="display:inline-block;">
                <el-input v-model="userNameLike"
                          placeholder="姓名"
                          clearable />
              </el-form-item>
               <el-form-item label="账号别名"
                            style="display:inline-block;">
                <el-input v-model="userAliasLike"
                          placeholder="账号别名"
                          clearable />
              </el-form-item>
            </el-col>
            <el-button type="primary"
                       size="small"
                       @click="query">查询</el-button>
            <el-button v-if="action === '设置组成员'"
                       size="small"
                       @click="reset">重置</el-button>
            <!-- <el-button v-if="action === '查看组成员'"
                       size="small"
                       @click="reset">导出</el-button> -->
          </el-row>
        </div>
      </div>
    </el-form>
    <template>
      <basic-list ref="userTB"
                  :show-select-col="showSelect"
                  :show-action-col="false"
                  :loading="false"
                  :key="keys"
                  :fields="fields"
                  :total="adminList ? adminList.total : 0"
                  :list="adminList ? adminList.list : []"
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
export default {
  mixins: [EntityDialog, ExactList],
  data() {
    return {
      rules: {},
      pageSize: 10,
      userCodeLike: "",
      userNameLike: "",
      userAliasLike: "",
      adminList: null,
      apiName: "DataTypeList",
      cascaderVal: "",
      apiIdList: [],
      pickIdList: [],
      fields: [
        { key: "userCode", name: "用户账号" },
        { key: "userName", name: "姓名" },
        { key: "userAlias", name: "账号别名" }
      ],
      showSelect: false,
      keys: 0
    };
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
    },
    action: {
      type: String,
      default() {
        return ''
      }
    }
  },
  watch: {
    "state.adminList": {
      deep: true,
      immediate: true,
      handler: function (newVal) {
        this.adminList = newVal;
        this.giveCheck();
      }
    },
    "action": {
      deep: true,
      immediate: true,
      handler: function (newVal) {
        this.showSelect = newVal === '查看组成员' ? false : true
      }
    }
  },
  methods: {
    // 查询
    query(ev) {
      this.$parent.updateState({ userCodeLike: this.userCodeLike, userNameLike: this.userNameLike, userAliasLike: this.userAliasLike, dataPageIndex: 0 });
      // 查询
      if (this.action === '查看组成员') {
        this.$parent.dispatch("viewUserListByGroup");
      } else {
        this.$parent.dispatch("DataTypeList");
      }

    },
    // 重置
    reset() {
      this.userCodeLike = "";
      this.userNameLike = "";
      this.userAliasLike = "";
      this.$parent.updateState({ userCodeLike: this.userCodeLike, userNameLike: this.userNameLike, userAliasLike: this.userAliasLike });
      // 查询
      this.$parent.dispatch("DataTypeList");
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
      this.userCodeLike = "";
      this.userNameLike = "";
      this.userAliasLike = "";
      this.pageSize = 10
      this.$parent.updateState({ userCodeLike: this.userCodeLike, userNameLike: this.userNameLike, userAliasLike: this.userAliasLike, dataPageIndex: 0, dataPageSize: 10 });
      this.keys++
      // 查询
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
        this.adminList &&
          this.adminList.list &&
          this.adminList.list.forEach((item, ind) => {
            const _table = this.$refs.userTB.$refs.table;
            // 设置状态
            item &&
              _table.toggleRowSelection(item, item.isOwn !== 0);
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
      this.$parent.updateState({ dataPageIndex: _ind });
      if (this.action === '查看组成员') {
        this.apiName = "viewUserListByGroup";
      } else {
        this.apiName = "DataTypeList";
      }
      // 查询列表
      this.$parent.dispatch(this.apiName || "DataTypeList");
    },
    // 切换每页显示条数
    pageSizeChange(_size) {
      // 查询列表
      this.pageSize = _size;
      this.$parent.updateState({ dataPageSize: _size });
      if (this.action === '查看组成员') {
        this.apiName = "viewUserListByGroup";
      } else {
        this.apiName = "DataTypeList";
      }
      // 查询列表
      this.$parent.dispatch(this.apiName || "DataTypeList");
    }
  }
};
</script>
