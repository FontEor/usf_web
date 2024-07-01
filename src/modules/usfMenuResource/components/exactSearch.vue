<script>
    import ExactSearch from '@/mixins/exactSearch'
    export default {
        mixins: [ExactSearch],
        beforeCreate () {
            this.fields = ['appCode','resourceNameLike']
        },
        created() {
            this.query.appCode='usf'
        },
        methods: {
            getFieldTpls (model) {
                model.resourceNameLike = _.trim(model.resourceNameLike)
                const tpls = {
                    'resourceNameLike': <el-form-item label="菜单名称"><el-input v-model={model.resourceNameLike} maxlength={30} clearable/></el-form-item>,
                   // 'appCode': <el-form-item label="软件系统"><el-select h v-model={model.appCode}><el-option value="usf" label="usf"></el-option></el-select></el-form-item>
                }
                return tpls
            },
           handleReset () {
                this.query.resourceNameLike = ''
                this.handleSearch()
            },
        }
    }
</script>
