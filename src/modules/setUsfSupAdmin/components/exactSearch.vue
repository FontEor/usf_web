<script>
import ExactSearch from "@/mixins/exactSearch";
export default {
  mixins: [ExactSearch],
  props: {
    tenementInfoObj: Object,
  },
  beforeCreate() {
    this.fields = ["userName", "userCode", "tenementCode"];
  },
  methods: {
    getFieldTpls(model) {
      model.userName = _.trim(model.userName);
      model.userCode = _.trim(model.userCode);
      const tpls = {
        userName: (
          <el-form-item label="用户名称">
            <el-input v-model={model.userName} maxlength={30} clearable />
          </el-form-item>
        ),
        userCode: (
          <el-form-item label="用户账号">
            <el-input v-model={model.userCode} maxlength={30} clearable />
          </el-form-item>
        ),
      };
      return tpls;
    },
  },
};
</script>
