<script>
    import ExactSearch from '@/mixins/exactSearch'
    export default {
        mixins: [ExactSearch],
        props:{
            tenementInfoObj: Object,
        },
        beforeCreate () {
            this.fields = ['appName','appCode','tenementCode']
        },
        methods: {
            getFieldTpls (model) {
                model.appName = _.trim(model.appName)
                model.appCode = _.trim(model.appCode)
                const tpls = {
                    'appName': <el-form-item label="应用名称"><el-input v-model={model.appName} maxlength={30} clearable/></el-form-item>,
                    'appCode': <el-form-item label="应用编码"><el-input v-model={model.appCode} maxlength={30} clearable/></el-form-item>,
            }
                return tpls
            },
        },

    }
</script>
