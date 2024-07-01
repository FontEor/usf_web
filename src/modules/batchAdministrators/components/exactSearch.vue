<script>
import ExactSearch from "@/mixins/exactSearch"
import { mapState } from "vuex"
export default {
    mixins: [ExactSearch],
    beforeCreate() {
        this.fields = ["userName", "userCode", "userAlias", "tenementCode"]
    },
    computed: {
        ...mapState("app", ["tenementInfoObj"])
    },
    watch: {
        tenementInfoObj: {
            deep: true,
            immediate: false,
            handler: function(newVal) {}
        }
    },
    created() {
        this.query.tenementCode = this.tenementInfoObj.tenementCode
    },
    methods: {
        getFieldTpls(model) {
            model.userName = _.trim(model.userName)
            model.userCode = _.trim(model.userCode)
            model.userAlias = _.trim(model.userAlias)
            const tpls = {
                userName: (
                    <el-form-item label="姓名">
                    <el-input v-model={this.query.userName} maxlength={30} clearable />
                    </el-form-item>
                ),
                userCode: (
                    <el-form-item label="用户账号">
                    <el-input v-model={this.query.userCode} maxlength={30} clearable />
                    </el-form-item>
                ),
                userAlias: (
                    <el-form-item label="账号别名">
                    <el-input v-model={this.query.userAlias} maxlength={30} clearable />
                    </el-form-item>
                )
            }
            return tpls
        },
        handleReset() {
            this.query.tenementCode = this.tenementInfoObj.tenementCode
            this.query = this.getDefaultQuery()
            this.handleSearch()
        },
        handleSearch() {
            this.query.tenementCode = this.tenementInfoObj.tenementCode
            const query = this.toEnd()
            this.updateState({ query, pageIndex: 0 })
            this.queryList()
        }
    }
}
</script>
