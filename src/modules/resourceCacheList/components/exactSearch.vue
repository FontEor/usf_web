<script>
    import ExactSearch from '@/mixins/exactSearch'
    export default {
        mixins: [ExactSearch],
      //  props: ['tenementSelectArr'],
        beforeCreate () {
            this.fields = [ 'tenementCode','appCode','resourceCodes']
        },
        data () {
            return{
                loadQuery:{},
                appSelectArr: [],
                tenementSelectArr:[]
            }
        },

        methods: {
            getFieldTpls (model) {
                model.resourceCodes = _.trim(model.resourceCodes)
                const tpls = {
                    'tenementCode': (<el-form-item label="租户编号" label-width="90px">
                        <el-select v-model={model.tenementCode} onChange={this.onTenementCode}>
                        {
                            this.tenementSelectArr.map((item,index) => {
                                return (
                                    <el-option  key={index} value={item.tenementCode} label={item.tenementName}></el-option>
                            )
                            })
                        }
                        </el-select></el-form-item>),
                    'appCode': (<el-form-item label="应用编号" label-width="90px">
                    <el-select v-model={model.appCode}>
                    {
                        this.appSelectArr.map((item,index) => {
                            return (
                                <el-option  key={index} value={item.appCode} label={item.appName}></el-option>
                        )
                        })
                    }
                    </el-select></el-form-item>),
                    'resourceCodes': <el-form-item label-width="90px" label="资源编码">
                        <el-input v-model={model.resourceCodes} placeholder="请输入" clearable /></el-form-item>,
                }
                return tpls
            },

            //查询app 下拉数据
            onTenementCode(){
                this.getAllAppInfoListByTenement(this.query.tenementCode)
            },
            //获取app枚举值
            getAllAppInfoListByTenement(tenementCode){
                api.cache.getAllAppInfoListByTenement({tenementCode}).then( ({code, data,msg,errorCode}) => {
                    if (code === 200) {
                        this.appSelectArr=data||[]
                        this.query.appCode=data[0].appCode||''
                        this.handleSearch()
                    }
                })
            },
            //租户枚举和默认值
            getTenementSelectEnum(){
                api.cache.getAllTenementList().then( ({code, data,msg,errorCode}) => {
                    if (code === 200) {
                        this.tenementSelectArr=data||[]
                        this.query.tenementCode = this.tenementSelectArr[0].tenementCode
                        this.onTenementCode()
                    }
                } )
            },
            toEnd () {
                //去重和整理中文逗号
                const query = _.cloneDeep(this.query)
                if(query.resourceCodes){
                    let inputStr=query.resourceCodes.split(',')
                    let set = new Set(inputStr);
                    set=[...set]
                    query.resourceCodes=set.join(',')
                }
                let reg=/，/g
                if(query.resourceCodes&&query.resourceCodes.match(/，/g)){
                    query.resourceCodes=query.resourceCodes.replace(/，/ig,',')
                }
                jt.object.removeEmptyAttr(query)
                return query
            },
        },
        mounted () {
            this.getTenementSelectEnum()
            //this.handleSearch()
        },
    }
</script>
