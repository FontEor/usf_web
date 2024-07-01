<script>
    import ExactSearch from '@/mixins/exactSearch'
    export default {
        mixins: [ExactSearch],
        beforeCreate () {
            this.fields = [ 'serviceName',{key:'params',default:''},]
        },
        data () {
            return{
                serviceNameArr:[],
            }
        },

        methods: {
            getFieldTpls (model) {
                model.params = _.trim(model.params)
                const tpls = {
                'serviceName': (<el-form-item label="服务名称" label-width="90px">
                    <el-select v-model={model.serviceName}>
                    {
                        this.serviceNameArr.map((item,index) => {
                            return (
                                <el-option  key={index} value={item}></el-option>
                        )
                        })
                    }
                    </el-select></el-form-item>),
                'params': (<el-form-item label-width="90px" label="服务参数">
                <el-input v-model={model.params} placeholder="请输入" clearable maxlength={255}/></el-form-item>),
                }
                    return tpls
            },
            // 默认选中第一个
            pickFirst () {
                api.cache.getAllServiceList().then(({code, data,msg,errorCode}) => {
                    if (code === 200) {
                        this.serviceNameArr=data||[]
                        this.query.serviceName=data[0]||''
                        this.handleSearch()
                    }
                })
                //   this.handleSearch()
            },
            toEnd () {
                const query = _.cloneDeep(this.query)
                // jt.object.removeEmptyAttr(query)
                return query
            },
        },
        mounted () {
            this.pickFirst()
        },
    }
</script>
