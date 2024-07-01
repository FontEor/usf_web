<script>
    import ExactSearch from '@/mixins/exactSearch'
    export default {
        mixins: [ExactSearch],
        props: {
            state: Object
        },
        beforeCreate () {
            this.fields = ['tenementName','tenementCode', {
                key: 'did',
                default: "1"
            }]
        },
        data() {
            return {
                // dbs: CNST.ENUMS.didList
            }
        },
        methods: {
            getFieldTpls (model) {
                model.tenementName = _.trim(model.tenementName)
                model.tenementCode = _.trim(model.tenementCode)
                const tpls = {
                    'tenementName': <el-form-item label="租户名称"><el-input v-model={model.tenementName} maxlength={30} clearable/></el-form-item>,
                    'tenementCode': <el-form-item label="租户编码"><el-input v-model={model.tenementCode} maxlength={30} clearable/></el-form-item>,
                    'did': <el-form-item label="所属数据库">
                        <el-select
                            v-model={model.did}
                            onchange={this.didChange}
                            clearable
                            >
                            {this.state.didList.map((item) => (
                                <el-option
                                    key={item.value}
                                    label={item.label}
                                    value={item.value}
                                />
                            ))}
                        </el-select>
                    </el-form-item>,
                }
                return tpls
            },
            didChange() {
                this.handleSearch();
            }
        }
    }
</script>
