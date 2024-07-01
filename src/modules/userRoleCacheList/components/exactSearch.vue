<script>
    //import { mapState ,mapActions} from 'vuex'
    import ExactSearch from '@/mixins/exactSearch'
    export default {
        mixins: [ExactSearch],
      //  props: ['tenementSelectArr','userSystemSelectArr'],
        beforeCreate () {
            this.fields = [ 'tenementCode','userSystemType','appCode',{key:'userCodes',default:''}]
        },
        data () {
            return{
                loadQuery:{},
                tenementSelectArr:[],
                userSystemSelectArr:[],
            }
        },

        methods: {
            getFieldTpls (model) {
                model.userCodes = _.trim(model.userCodes)
                const tpls = {
                    'tenementCode': (<el-form-item label="租户编号" label-width="90px">
                        <el-select v-model={model.tenementCode}>
                        {
                            this.tenementSelectArr.map((item) => {
                                return (
                                    <el-option  key={item.tenementCode} value={item.tenementCode} label={item.tenementName}></el-option>
                            )
                            })
                        }
                        </el-select></el-form-item>),
                'userCodes': <el-form-item label-width="90px" label="用户编号">
                    <el-input v-model={model.userCodes} placeholder="请输入" clearable maxlength={30}/></el-form-item>,
                'userSystemType': (<el-form-item label="账户体系类型" label-width="90px">
                    <el-select v-model={model.userSystemType}>
                    {
                        this.userSystemSelectArr.map((item) => {
                            return (
                                <el-option  key={item.key} value={item.key} label={item.value}></el-option>
                        )
                        })
                    }
                    </el-select></el-form-item>),
                'appCode': <el-form-item label-width="90px" label="应用编号">
                <el-input v-model={model.appCode} placeholder="请输入" clearable maxlength={255}/></el-form-item>,
            }
                return tpls
            },
            /*handleSelectorChange (item) {
                this.handleSearch()
            },*/
            // 默认选中第一个
            pickFirst () {
                // this.query.appCode = this.appList[0].appCode
                 this.getTenementSelectEnum()
               //  this.getAccountEnum()
              //   this.handleSearch()
             },
            getTenementSelectEnum(){
                api.cache.getAllTenementList().then( ({code, data,msg,errorCode}) => {
                    if (code === 200) {
                        this.tenementSelectArr=data||[]
                        this.query.tenementCode = this.tenementSelectArr[0].tenementCode
                        this.getAccountEnum()
                    }
                } )
            },
            //账户体系类型枚举
            getAccountEnum(){
                api.cache.getAccountSysTypeInfo().then( ({code, data,msg,errorCode}) => {
                    if (code === 200) {
                        this.userSystemSelectArr=data||[]
                        this.query.userSystemType = this.userSystemSelectArr[0].key
                        this.handleSearch()
                    }
                } )
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
