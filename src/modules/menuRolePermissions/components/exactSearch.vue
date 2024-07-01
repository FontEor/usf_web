<script>
import { mapState, mapActions } from 'vuex'
import ExactSearch from '@/mixins/exactSearch'
export default {
    mixins: [ExactSearch],
    beforeCreate () {
        this.fields = ['appCode', 'roleNameLike', 'roleCodeLike' ]
    },
    data () {
        return {}
    },
    activated () {
        this.checkUpdate(this.$store.state.app)
    },
    computed: {
        // ...mapState('app', ['appList', 'tenementCode']),
        ...mapState('app', {
            tenementCode: 'tenementCode',
            appList (state) {
                this.checkUpdate(state)
                return state.appList
            }
        })
    },
    methods: {
        ...mapActions('app', ['getAppList']),
        // 每次进行对比appList与tenementCode 解决方案 activated 与computed都用，只有appList更新时才刷新页面，因为tenementCode更新时早已刷新了appList
        checkUpdate (state) {
            if (!state) return
            let isUpdate = false
            if (this.query.tenementCode !== state.tenementCode) {
                this.query.tenementCode = state.tenementCode
            }
            if (state.appList && state.appList.length && this.appListOptions !== state.appList) {
                isUpdate = true
                this.appListOptions = state.appList
                if (!this.query.appCode) {
                    this.query.appCode = state.appList[0].appCode
                }
            } else if (!state.appList || (state.appList && !state.appList.length)) {
                return this.getAppList()
            }
            if (isUpdate) {
                this.handleSearch()
            }
        },
        getFieldTpls (model) {
            model.roleNameLike = _.trim(model.roleNameLike)
            model.roleCodeLike = _.trim(model.roleCodeLike)
            const tpls = {
                appCode: <el-form-item label="软件系统">
                    <el-select v-model={model.appCode} onChange={this.onChangeApp}>
                        {
                            this.appList.map( item => <el-option key={item.appCode} label={item.appName+'('+item.appCode+')'} value={item.appCode} /> )
                        }
                    </el-select>
                </el-form-item>,
                roleNameLike: <el-form-item label="角色名称"><el-input v-model={model.roleNameLike} maxlength={30} clearable/></el-form-item>,
                roleCodeLike: <el-form-item label="角色编码"><el-input v-model={model.roleCodeLike} maxlength={30} clearable/></el-form-item>,
            }
            return tpls
        },
        handleReset () {
            let appCode = this.query.appCode
            this.query = this.getDefaultQuery()
            this.query.appCode = appCode
            this.handleSearch()
        },
        toEnd () {
            const query = _.cloneDeep(this.query)
            query.tenementCode = this.tenementCode
            jt.object.removeEmptyAttr(query)
            return query
        },
        onChangeApp (appCode) {
            // this.query.appCode = appCode
            this.handleSearch()
        }
    }
}
</script>
