<script>
import ExactSearch from "@/mixins/exactSearch";
export default {
  mixins: [ExactSearch],
  props: {
    tenementCode: [String, Number],
  },
  beforeCreate() {
    this.fields = ["roleName", "roleCode", "createUser"];
  },
  mounted() {
    if (this.$store.state.app.tenementInfoObj) {
      this.handleSearch();
    }
  },
  methods: {
    getFieldTpls(model) {
      model.roleName = _.trim(model.roleName);
      model.roleCode = _.trim(model.roleCode);
      model.createUser = _.trim(model.createUser);
      const tpls = {
        roleName: (
          <el-form-item label="角色名称">
            <el-input v-model={model.roleName} maxlength={30} clearable />
          </el-form-item>
        ),
        roleCode: (
          <el-form-item label="角色编码">
            <el-input v-model={model.roleCode} maxlength={30} clearable />
          </el-form-item>
        ),
        createUser: (
          <el-form-item label="创建人">
            <el-input v-model={model.createUser} clearable />
          </el-form-item>
        ),
      };
      return tpls;
    },
    toEnd() {
      const query = { ...this.query, tenementCode: this.tenementCode };
      jt.object.removeEmptyAttr(query);
      return query;
    },
  },
};
</script>
