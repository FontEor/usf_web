<script>
import ExactSearch from '@/mixins/exactSearch'
export default {
    mixins: [ExactSearch],
    beforeCreate () {
        this.fields = [{ key: 'viewModel', default: '全部显示'}, { key: 'orgName', default: ''}, { key: 'orgCode', default: ''},{ key: 'orgType', default: 0, exclude: true }]
    },
    props: {
        onViewChange: Function
    },
    data () {
        return {
            formLabelWidth: 100
        }
    },
    methods: {
        getFieldTpls (model) {
            model.orgName = _.trim(model.orgName)
            model.orgCode = _.trim(model.orgCode)
            const tpls = {
                'orgName': <el-form-item label="机构名称"><el-input v-model={model.orgName} placeholder="请输入机构名称" maxlength={30} clearable/></el-form-item>,
                'orgCode': <el-form-item label="机构编码"><el-input v-model={model.orgCode} placeholder="请输入机构编码" maxlength={30} clearable/></el-form-item>,
                // 'viewModel': <div class="org-radio-group"><el-radio-group size="small" onChange={this.onViewChange} v-model={model.viewModel}><el-radio-button label="全部显示" checked></el-radio-button><el-radio-button label="仅显示企业"></el-radio-button><el-radio-button label="仅显示部门 "></el-radio-button></el-radio-group></div>
            }
            this.$store.state.organizations.extList.forEach(item => {
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
            let extFields = this.$store.state.organizations.extList.map(m => m.key)
            this.fields = ['orgName', 'orgCode',...extFields]
            return tpls
        },
        queryParam(){
            //获取查询参数
            return this.toEnd()
        }
    }
}
</script>

