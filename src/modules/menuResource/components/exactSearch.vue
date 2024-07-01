<script>
import { mapState, mapActions } from "vuex";
import ExactSearch from "@/mixins/exactSearch";

export default {
  mixins: [ExactSearch],
  beforeCreate() {
    this.fields = ["appCode", "resourceNameLike", "resourceCode"];
  },
  data() {
    return {
      loadQuery: {},
      appListOptions: [],
      appList: [],
    };
  },
  mounted() {
    this.$parent.dispatch("queryAppListForMenuResource").then((ev) => {
      this.appList = ev.appList;
      this.appList.length > 0 && this.pickFirst();
    });
  },
  methods: {
    getFieldTpls(model) {
      model.resourceNameLike = _.trim(model.resourceNameLike);
      model.resourceCode = _.trim(model.resourceCode);
      let tpls = {
        resourceNameLike: (
          <el-form-item label="菜单名称">
            <el-input
              v-model={model.resourceNameLike}
              maxlength={30}
              clearable
            />
          </el-form-item>
        ),
        resourceCode: (
          <el-form-item label="菜单编码">
            <el-input v-model={model.resourceCode} clearable />
          </el-form-item>
        ),
        appCode: (
          <el-form-item label="软件系统">
            <el-select
              v-model={model.appCode}
              onChange={(item) => {
                this.handleSelectorChange(item);
              }}
            >
              {this.appList.map((item) => {
                return (
                  <el-option
                    key={item.appCode}
                    value={item.appCode}
                    label={`${item.appName}(${item.appCode})`}
                  ></el-option>
                );
              })}
            </el-select>
          </el-form-item>
        ),
      };
      return tpls;
    },
    // 软件系统切换
    handleSelectorChange(item) {
      this.$parent.updateState({ appCode: item });
      this.appList.some((appItem) => {
        const { appCode, appSource } = appItem;
        if (item === appCode) {
          this.$parent.updateState({ appSource: appSource });
          return true;
        }
      });
      this.query.appCode = item;
      this.handleSearch();
      this.$parent.$refs.exactList.queryExtendList(true);
    },
    handleReset() {
      this.query.resourceNameLike = "";
      this.query.resourceCode = "";
      this.handleSearch();
    },
    // 默认选中第一个
    pickFirst() {
      this.query.appCode = this.appList[0].appCode;
      this.handleSearch();
      this.$parent.updateState({ appCode: this.query.appCode });
      this.$parent.updateState({ appSource: this.appList[0].appSource });
    },
  },
};
</script>
