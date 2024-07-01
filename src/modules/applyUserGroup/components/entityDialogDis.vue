<template>
  <basic-dialog
    :visible="visible"
    :title="'用户组列表'"
    :update-vis="updateVis"
    :handle-close="handleClose"
    :handle-closed="handleClosed"
    :handle-ok="handleOk"
    okText='确认'
    closeText='关闭'
  >
    <el-form
      ref="form"
      size="small"
      label-position="center"
      label-width="90px"
      :model="dto"
      :rules="rules"
      @submit.native.prevent
    >
      <div class="entity-dlg__block">
        <div class="entity-dlg__block-bd">
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="用户组编码" prop="website" class="setLeft">
                <el-input v-model="query.groupCode" :maxlength="30" clearable/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="用户组名称" prop="website" class="setLeft">
                <el-input v-model="query.groupName" :maxlength="30" clearable/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <div class="marginSet">
                <el-button type="primary" size="small" @click="handleSearch">查询</el-button>
                <el-button size="small" @click="handleReset">重置</el-button>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-form>
    <basic-list
      ref="basicList"
      select-type="single"
      :show-select-col="true"
      :show-action-col="false"
      :fields="fields"
      :setClmnsFlg="false"
      :list="list"
      class="heightSet"
      :total="total"
      :page-index-change="pageIndexChange"
      :page-size-change="pageSizeChange"
      :selection-change="selectionChange"
      :page-index="pageIndex"
      :page-size="pageSize"
      selectType="multiple"
    />
  </basic-dialog>
</template>

<script>
import EntityDialog from "@/mixins/entityDialog";
import ExactList from "@/mixins/exactList";
import { mapState } from "vuex";

const DEFAULTS = {
  query: {
    groupCode: undefined,
    groupName: undefined
  },
  loading: false,
  total: 0,
  pageIndex: 1,
  pageSize: 10,
  list: [],
  selRows: []
};
export default {
  mixins: [EntityDialog, ExactList],
  data() {
    return {
      rules: {},
      fields: [
        { key: "groupCode", name: "用户组编码" },
        { key: "groupName", name: "用户组名称" },
        { key: "createUser", name: "创建人" },
        { key: "createTime", name: "创建时间" },
        { key: "source", name: "来源" },
        { key: "remark", name: "备注" },
      ],
      list: [],
      //软件系统下拉
      softSelect: [],
      query: {
        groupCode: undefined,
        groupName: undefined
      },
      pageIndex: 0,
      pageSize: 10,
      total: 0,

      //用于存储多行的那个列
      pageDate: {},
      index: 0,
      indexApp: 0
    };
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    appendToBody: {
      type: Boolean,
      default: true
    },
    params: {
      type: Object,
      default() {
        return {};
      }
    },
    userCode: {
      type: String,
      default() {
        return undefined;
      }
    },
    updateVis: {
      type: Function,
      default: () => {}
    },
    handleSave: {
      type: Function,
      default: () => {}
    },
    state: {
      type: Object,
      default: {}
    },
    roleListId: {
      type: Number,
      default: 0
    },
    roleCode: {
      type: String,
      default: undefined
    },
    userId: {
      type: Number,
      default: 0
    }
  },
  beforeCreate() {
    this.allFields = ["userName", "userCode", "userAlias", "id"];
    this.disFields = [];
  },
  mounted() {},
  computed: {
    ...mapState("app", ["tenementInfoObj"])
  },

  watch: {
    visible(newVal) {
      if (newVal) {
        this.query = { ...DEFAULTS.query};
        this.pageIndex = DEFAULTS.pageIndex - 1;
        this.queryList();
      }
    },
  },
  methods: {
    handleClick() {
      // var obj = {};
      // this.softSelect.forEach((item, index) => {
      //   obj[item.appCode] = item.id;
      // });
      // this.query.appId = obj[this.query.appCode];
      // var arr = Object.keys(obj);
      // this.indexApp = arr.indexOf(this.query.appCode) - 1;
      // this.handleSearch();
    },
    handleClose() {
      this.updateVis(false);
    },
    handleClosed() {
      const defaults = _.cloneDeep(_.get(DEFAULTS, ["selRows", "query"]));
      for (let key in defaults) {
        this[key] = defaults[key];
      }
      this.$refs.basicList.resetData();
    },
    handleOk() {
      this.$emit('func',this.selRows,this.query.appCode)
      if(this.selRows.length){
        
      }else{
        return this.$message.error('请至少选择一项')
      }
    },
    pageIndexChange(index) {
      //这里很关键  是点击翻页的地方，我需要在这存储当前页 以及选中的那一行
      if (this.selRows.length) {
        this.pageDate[this.pageIndex] = this.selRows;
      }
      this.pageIndex = index - 1;
      this.queryList();
    },
    pageSizeChange(size) {
      // this.pageIndex = 1
      this.pageIndex = DEFAULTS.pageIndex - 1;
      this.pageSize = size;
      this.queryList();
    },
    selectionChange(rows) {
      this.selRows = rows;
    },
    handleSearch() {
      this.pageIndex = DEFAULTS.pageIndex - 1;
      this.queryList();
    },
    handleReset() {
      this.query = _.cloneDeep(DEFAULTS.query);
      // this.query.appCode = this.softSelect[this.indexApp].appCode;
      this.pageIndex = DEFAULTS.pageIndex - 1;
      this.queryList();
    },
    queryList() {
      const query = _.cloneDeep(this.query);
      jt.object.removeEmptyAttr(query);
      //根据角色查弹窗用户的列表
      this.query.tenementCode = this.tenementInfoObj.tenementCode;
      api.applyUserGroup.userGroupList({
          data: this.query,
          page: {
            pageIndex: this.pageIndex + 1,
            pageSize: this.pageSize
          }
        })
        .then(({ code, data }) => {
          if (code == "200") {
            this.list = _.get(data, "rows") || [];
            this.total = _.get(data, "rowTotal") || 0;
            //处理默认选中
            this.$nextTick(() => {
              let arr = [];
              this.list.forEach((item, index) => {
                if (item.isOwnRole == 1) {
                  arr.push(item);
                }
              });
              arr.forEach(item => {
                this.$refs.basicList.$refs.table.toggleRowSelection(item, true);
              });
            });
          }
        });
    },
    //选中
    selectionChange(rows) {
      this.selRows = rows;
      this.handleSelectionChange && this.handleSelectionChange(rows);
    }
  }
};
</script>
<style  scoped>
.el-form-item__label {
  text-align: center !important;
}
.basic-list {
    width: 100% !important;
    display: inline-block;
    }
</style>
