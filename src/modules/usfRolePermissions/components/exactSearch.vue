<script>
import { mapState, mapActions } from "vuex";
import ExactSearch from "@/mixins/exactSearch";
export default {
  data() {
    return {
      act: null,
      appListOptions: [],
      appName: "",
    };
  },
  mixins: [ExactSearch],
  beforeCreate() {
    this.fields = [
      "appCode",
      "roleNameLike",
      "roleCodeLike",
      "tenementCode",
      "sensitiveMark",
    ];
  },
  activated() {
    this.checkUpdate(this.$store.state.app);
  },
  computed: {
    ...mapState("app", {
      tenementCode: "tenementCode",
      appList(state) {
        this.checkUpdate(state);
        return state.appList;
      },
    }),
  },
  methods: {
    ...mapActions("app", ["getAppList"]),
    // 每次进行对比appList与tenementCode 解决方案 activated 与computed都用，只有appList更新时才刷新页面，因为tenementCode更新时早已刷新了appList
    checkUpdate(state) {
      if (!state) return;
      let isUpdate = false;
      if (this.query.tenementCode !== state.tenementCode) {
        this.query.tenementCode = state.tenementCode;
      }
      if (
        state.appList &&
        state.appList.length &&
        this.appListOptions !== state.appList
      ) {
        isUpdate = true;
        this.query.appCode = "usf";
        this.appName = "统一权限系统(USF)";
        this.handleSearch();
      } else if (!state.appList || (state.appList && !state.appList.length)) {
        return this.getAppList();
      }
      if (isUpdate) {
        this.handleSearch();
      }
    },
    getFieldTpls(model) {
      model.roleNameLike = _.trim(model.roleNameLike);
      model.roleCodeLike = _.trim(model.roleCodeLike);
      model.sensitiveMark = _.trim(model.sensitiveMark);
      const tpls = {
        appCode: (
          <el-form-item label="软件系统">
            <el-input v-model={this.appName} maxlength={20} disabled={true} />
          </el-form-item>
        ),
        roleNameLike: (
          <el-form-item label="角色名称">
            <el-input v-model={model.roleNameLike} maxlength={20} clearable />
          </el-form-item>
        ),
        roleCodeLike: (
          <el-form-item label="角色编码">
            <el-input v-model={model.roleCodeLike} maxlength={50} clearable />
          </el-form-item>
        ),
        sensitiveMark: (
          <el-form-item label="是否敏感">
            <el-select v-model={model.sensitiveMark} maxlength={20}>
              <el-option label="请选择" value="" />
              <el-option label="否" value="0" />
              <el-option label="是" value="1" />
            </el-select>
          </el-form-item>
        ),
      };
      return tpls;
    },
    handleSelectorChange(item) {
      this.handleSearch();
    },
    handleReset() {
      this.query.roleNameLike = "";
      this.query.roleCodeLike = "";
      this.handleSearch();
    },
  },
};
</script>
