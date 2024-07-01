<script>
import ExactSearch from '@/mixins/exactSearch'
export default {
  mixins: [ExactSearch],
  beforeCreate() {
    this.fields = ['groupCode', 'groupName']
  },
  methods: {
    getFieldTpls(model) {
      model.groupName = _.trim(model.groupName)
      model.groupCode = _.trim(model.groupCode)
      const tpls = {
        'groupName': <el-form-item label="用户组名称"><el-input v-model={model.groupName} placeholder="请输入关键词" maxlength={30} clearable /></el-form-item>,
        'groupCode': <el-form-item label="用户组编码"><el-input v-model={model.groupCode} placeholder="请输入关键词" maxlength={30} clearable /></el-form-item>,
      }
        this.$store.state.usersGroup.extList.forEach(item => {
                if(item.type === 'input'){
                    tpls[item.key] = <el-form-item label={item.name}><el-input v-model={model[item.key]} placeholder="请输入关键词" maxlength={30} clearable/></el-form-item>;
                }else if(item.type === 'select'){
                    tpls[item.key] = <el-form-item label={item.name}><el-select v-model={model[item.key]} placeholder="请输入关键词"  clearable >
                        {item.options.map(m => {
                            return <el-option key={m.code} label={m.label} value={m.value} />
                        })}
                    </el-select></el-form-item>
                }
            });
            let extFields = this.$store.state.usersGroup.extList.map(m => m.key)
            this.fields = ['groupName', 'groupCode',...extFields]
      return tpls
    },
    queryParam(){
            //获取查询参数
            return this.toEnd()
        }

  }
}
</script>
