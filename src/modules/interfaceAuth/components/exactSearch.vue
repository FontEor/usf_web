<script>
import { mapState, mapActions } from "vuex";
import ExactSearch from "@/mixins/exactSearch";
export default {
  mixins: [ExactSearch],
  props: {
    systemType: Array,
  },
  beforeCreate() {
    this.fields = [
      "tenementCode",
      "appCode",
      "userSystemType",
      "userCode",
      "interfaceName",
      "methodName",
      "createUser",
      "createTime",
    ];
  },
  methods: {
    getFieldTpls(model) {
      model.tenementCode = _.trim(model.tenementCode);
      model.appCode = _.trim(model.appCode);
      model.userCode = _.trim(model.userCode);
      model.interfaceName = _.trim(model.interfaceName);
      model.methodName = _.trim(model.methodName);
      model.createUser = _.trim(model.createUser);
      const tpls = {
        userSystemType: (
          <el-form-item label="账号类别">
            <el-select
              v-model={model.userSystemType}
              onchange={this.pickCode}
              clearable
            >
              {this.systemType.map((item) => (
                <el-option
                  key={item.loginType}
                  label={item.loginName}
                  value={item.loginType}
                />
              ))}
            </el-select>
          </el-form-item>
        ),
        tenementCode: (
          <el-form-item label="租户编号">
            <el-input v-model={model.tenementCode} maxlength={30} clearable />
          </el-form-item>
        ),
        appCode: (
          <el-form-item label="应用编号">
            <el-input v-model={model.appCode} maxlength={30} clearable />
          </el-form-item>
        ),

        userCode: (
          <el-form-item label="用户编号">
            <el-input v-model={model.userCode} maxlength={30} clearable />
          </el-form-item>
        ),
        interfaceName: (
          <el-form-item label="接口名">
            <el-input v-model={model.interfaceName} maxlength={30} clearable />
          </el-form-item>
        ),
        methodName: (
          <el-form-item label="方法名">
            <el-input v-model={model.methodName} maxlength={30} clearable />
          </el-form-item>
        ),
        createUser: (
          <el-form-item label="创建人">
            <el-input v-model={model.createUser} maxlength={30} clearable />
          </el-form-item>
        ),
        createTime: (
          <el-form-item label="创建时间">
            <el-date-picker
              v-model={model.createTime}
              placeholder="选择日期时间"
              type="datetime"
              clearable
            ></el-date-picker>
          </el-form-item>
        ),
      };
      return tpls;
    },
    pickCode(ev) {
      // 查询列表
      this.handleSearch();
    },
  },
};
</script>
