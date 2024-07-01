<script>
    import ExactSearch from '@/mixins/exactSearch'
    export default {
        mixins: [ExactSearch],
        beforeCreate () {
            this.fields = ['adminName','adminCode']
        },
        methods: {
            getFieldTpls (model) {
                model.adminCode = _.trim(model.adminCode)
                const tpls = {
                /*    'adminName': <el-form-item label="类型名称"><el-input v-model={model.adminName}/></el-form-item>,*/
                    'adminCode': <el-form-item label="用户账号"><el-input v-model={model.adminCode} maxlength={30} clearable/></el-form-item>,
            }
                return tpls
            },


            handleReset () {
                this.query = this.getDefaultQuery()
                this.handleSearch()
            },
            //搜索两个参数 必传
            handleSearch () {
                const query = this.toEnd()
                var emptyObj = (JSON.stringify(query) == '{}');
                if (emptyObj) {
                    let query = {
                        adminCode: '',
                        adminName: ''
                    }
                    this.updateState({
                        query,
                        pageIndex: 0})
                } else {
                    if (!query.adminCode) {
                        let query = _.cloneDeep(this.toEnd())
                        query = Object.assign({}, _.cloneDeep(query), {'adminCode': ''})
                        this.updateState({ query, pageIndex: 0 })
                    } else if (!query.adminName) {
                        let query = _.cloneDeep(this.toEnd()) //声明等于常量
                        query = Object.assign({}, _.cloneDeep(query), {'adminName': ''})
                        this.updateState({ query, pageIndex: 0 })
                    }else{
                        this.updateState({ query, pageIndex: 0 })
                    }
                }
                this.queryList()
            },
        }
    }
</script>
