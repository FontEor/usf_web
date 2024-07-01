<script>
import ExactSearch from "@/mixins/exactSearch";
export default {
  mixins: [ExactSearch],
  props: ["AllWorkType", "AllOperateType"],
  beforeCreate() {
    this.fields = [
      "granteeCode",
      "purviewCode",
      "createUser",
      "workType",
      "operateType",
      "createTime",
    ];
  },
  methods: {
    getFieldTpls(model) {
      model.granteeCode = _.trim(model.granteeCode);
      model.purviewCode = _.trim(model.purviewCode);
      const tpls = {
        granteeCode: (
          <el-form-item label-width="100px" label="被操作对象编码">
            <el-input
              v-model_trim={model.granteeCode}
              placeholder="请输入编码"
              clearable
            />
            <el-tooltip
              class="operation-log-tooltip"
              effect="dark"
              content="如果张三把苹果分配给李四，那么操作人是张三，操作对象是苹果，被操作对象是李四"
              placement="top"
            >
              <i class="el-icon-warning-outline"></i>
            </el-tooltip>
          </el-form-item>
        ),
        purviewCode: (
          <el-form-item label-width="100px" label="操作对象编码">
            <el-input
              v-model_trim={model.purviewCode}
              placeholder="请输入编码"
              clearable
            />
          </el-form-item>
        ),
        createUser: (
          <el-form-item label-width="100px" label="操作人">
            <el-input
              v-model_trim={model.createUser}
              placeholder="请输入操作人"
              clearable
            />
          </el-form-item>
        ),
        workType: (
          <el-form-item label-width="100px" label="业务类型">
            <el-select
              v-model={model.workType}
              placeholder="请选择业务类型"
              filterable
              clearable
            >
              {this.AllWorkType.map((item) => {
                return (
                  <el-option
                    value={item.workType}
                    label={item.workName}
                  ></el-option>
                );
              })}
            </el-select>
          </el-form-item>
        ),
        operateType: (
          <el-form-item label-width="100px" label="操作类型">
            <el-select
              v-model={model.operateType}
              placeholder="请选择操作类型"
              filterable
              clearable
            >
              {this.AllOperateType.map((item) => {
                return (
                  <el-option
                    value={item.operateType}
                    label={item.operateName}
                  ></el-option>
                );
              })}
            </el-select>
          </el-form-item>
        ),
        createTime: (
          <el-form-item label-width="100px" label="查询时间">
            <el-date-picker
              style="width:21rem"
              v-model={model.createTime}
              type="datetimerange"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
        ),
      };
      return tpls;
    },
  },
};
</script>
<style lang="scss">
.operation-log-tooltip {
  color: #666666;
  position: absolute;
  right: -22px;
  top: 50%;
  margin-top: -7px;
}
</style>
