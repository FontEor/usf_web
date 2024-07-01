<template>
  <basic-dialog
    :visible="visible"
    :title="title"
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
            <el-form-item label="菜单名称">
              <el-input v-model.trim="query.resourceName" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="菜单编码">
              <el-input v-model.trim="query.resourceCode" clearable />
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
    <exact-list></exact-list>
  </basic-dialog>
</template>

<script>
import store from "../store";
import { mapState, mapActions } from "vuex";
import EntityDialog from "@/mixins/entityDialog";
// import PageList from './mixins/pageList'
import ExactList from "./exactList2";

export default {
  mixins: [EntityDialog],
  components: { ExactList },
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
        resourceName: "",
        resourceCode: "",
      },
      immediateQuery: true,
    };
  },
  computed: {
    appList() {
      return this.$store.state.users.appList;
    },
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
    // 关闭和取消按钮
    handleClose(ev) {
      this.winClose(ev);
    },
    queryList() {
      this.$parent.dispatch("viewMenuList");
    },
    pickCode() {
      this.$parent.updateState({ viewAppCode: this.query.appCode });
      this.$parent.dispatch("viewMenuList");
    },
    handleSearch() {
      this.$parent.updateState({ query: this.query });
      this.$parent.dispatch("viewMenuList");
    },
    handleReset() {
      this.query = { name: "", code: "", appCode: this.appList[0].appCode };
      this.$parent.updateState({ query: this.query });
      this.$parent.dispatch("viewMenuList");
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