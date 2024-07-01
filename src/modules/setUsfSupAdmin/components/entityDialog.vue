<template>
  <basic-dialog
    :visible="visible"
    title="添加用户"
    :width="1000"
    :update-vis="updateVis"
    :handle-close="handleClose"
    :handle-closed="handleClosed"
    class="heightSet"
    :handle-ok="handleOk"
  >
    <el-form
      ref="form"
      size="small"
      label-position="center"
      label-width="128px"
      :model="dto"
      :rules="rules"
      class="parent"
      @submit.native.prevent
    >
      <div class="entity-dlg__block">
        <div class="entity-dlg__block-bd setParENTY">
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="账号类型" prop="userSystemType">
                <el-select
                  v-model="query.userSystemType"
                  clearable
                  class="widthSet"
                >
                  <el-option
                    v-for="item in systype"
                    :key="item.systemType"
                    :value="item.systemType"
                    :label="item.systemName"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="用户账号" prop="userCode">
                <el-input
                  v-model.trim="query.userCode"
                  class="widthSet"
                  maxlength="30"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="6" class="setPosition">
              <el-button type="primary" size="small" @click="handleSearch"
                >查询</el-button
              >
              <el-button size="small" @click="handleReset">重置</el-button>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-form>
    <div class="pHset">
      <basic-list
        ref="basicList"
        :showIndexCol="false"
        :show-select-col="false"
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
        tab-empty-text="录入需要添加的账号信息"
      />
    </div>
  </basic-dialog>
</template>

<script>
import EntityDialog from "@/mixins/entityDialog";
import ExactList from "@/mixins/exactList";
import { mapState } from "vuex";

const DEFAULTS = {
  query: {
    userSystemType: undefined,
    userCode: undefined,
  },
  loading: false,
  total: 0,
  pageIndex: 1,
  pageSize: 10,
  list: [],
  selRows: [],
};
export default {
  mixins: [EntityDialog, ExactList],
  data() {
    return {
      rules: {},
      fields: [
        { key: "userName", name: "用户名称" },
        { key: "userCode", name: "用户账号" },
      ],
      list: [],
      query: {
        userSystemType: undefined,
        userCode: undefined,
      },
      pageIndex: 0,
      pageSize: 10,
      total: 0,
      //用于存储多行的那个列
      pageDate: {},
      systype: [], //存储账号类型数据
    };
  },
  computed: {
    ...mapState("app", ["tenementInfoObj"]),
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    appendToBody: {
      type: Boolean,
      default: true,
    },
    params: {
      type: Object,
      default() {
        return {};
      },
    },
    updateVis: {
      type: Function,
      default: () => {},
    },
    handleSave: {
      type: Function,
      default: () => {},
    },
    state: {
      type: Object,
      default: {},
    },
    roleListId: {
      type: Number,
      default: 0,
    },
    roleCode: {
      type: String,
      default: undefined,
    },
  },
  beforeCreate() {
    this.allFields = ["userName", "userCode", "userAlias", "id"];
    this.disFields = [];
  },
  mounted() {},
  watch: {
    visible(newVal) {
      if (newVal) {
        this.query = { ...DEFAULTS.query, ..._.cloneDeep(this.params) };
        this.pageIndex = DEFAULTS.pageIndex - 1;
      }
      api.users.systype({}).then(({ data = "", code = "", msg = "" }) => {
        if (code === 200) {
          this.systype = data;
        }
      });
    },
  },
  methods: {
    handleClose() {
      this.updateVis(false);
      this.handleReset();
    },
    handleClosed() {
      const defaults = _.cloneDeep(_.get(DEFAULTS, ["selRows", "query"]));
      for (let key in defaults) {
        this[key] = defaults[key];
      }
      this.$refs.basicList.resetData();
    },
    //保存数据
    handleOk() {
      if (!this.list.length) {
        return;
      }
      api.usfsupadmin
        .add({
          tenementCode: this.tenementInfoObj.tenementCode,
          userCode: this.list[0]["userCode"],
          userSystemType: this.list[0]["userSystemType"],
        })
        .then(({ code, data, msg }) => {
          if (code == "200") {
            this.handleSave();
            this.handleClose();
            return this.$message.success(msg);
          } else {
            return this.$message.error(msg);
          }
        });
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
      this.pageIndex = DEFAULTS.pageIndex - 1;
      this.pageSize = size;
      this.queryList();
    },
    handleSearch() {
      this.pageIndex = DEFAULTS.pageIndex - 1;
      this.queryList();
    },
    handleReset() {
      this.query = _.cloneDeep(DEFAULTS.query);
      this.pageIndex = DEFAULTS.pageIndex - 1;
      //   this.queryList();
      this.list = [];
    },
    queryList() {
      const query = _.cloneDeep(this.query);
      if (
        typeof query.userSystemType == "undefined" ||
        typeof query.userCode == "undefined"
      ) {
        this.$message.error("请录入完整查询条件");
        return;
      }
      api.usfsupadmin
        .querySafetySwitch({
          ...this.query,
          tenementCode: this.tenementInfoObj.tenementCode,
        })
        .then(({ code, data,msg }) => {
          if (code == "200") {
            this.list = [];
            this.list.push(data);
            this.total = this.list.length;
            if (!this.total) {
              this.$message.error(
                "该用户在租户内不存在，请先在用户管理模块中添加用户"
              );
            }
          }else{
            return this.$message.error(msg);
          }
        });
    },
  },
};
</script>

<style scoped>
.pHset {
  overflow: scroll;
}

.heightSet {
  overflow: hidden;
}

.setParENTY {
  display: flex;
}

.setPosition {
  text-align: right;
}

.parent {
  overflow: hidden !important;
}

.el-dialog__body {
  overflow: hidden !important;
  height: 10000px !important;
}

.widthSet {
  width: 150px;
}
</style>
