<script>
import ExactSearch from '@/mixins/exactSearch'
export default {
    mixins: [ExactSearch],
    props: {
        tenementCode: {
            type: [ Number, String ],
            default: undefined
        },
        immediate: Boolean
    },
    beforeCreate () {
        this.fields = ['roleNameLike', 'roleCodeLike' ]
    },
    activated () {
        this.handleSearch()
    },
    methods: {
        getFieldTpls (model) {
            model.roleNameLike = _.trim(model.roleNameLike)
            model.roleCodeLike = _.trim(model.roleCodeLike)
            const tpls = {
                'roleNameLike': <el-form-item label="角色名称"><el-input v-model={model.roleNameLike} maxlength={30} clearable/></el-form-item>,
                'roleCodeLike': <el-form-item label="角色编码"><el-input v-model={model.roleCodeLike} maxlength={30} clearable/></el-form-item>,
            }
            return tpls
        },
        toEnd () {
            const query = { ...this.query, tenementCode: this.tenementCode }
            jt.object.removeEmptyAttr(query)
            return query
        },
    }
}
</script>
