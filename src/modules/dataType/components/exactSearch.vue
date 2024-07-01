<script>
import ExactSearch from '@/mixins/exactSearch'
export default {
    mixins: [ExactSearch],
    beforeCreate () {
        this.fields = ['typeNameLike']
    },

    methods: {
        getFieldTpls (model) {
            model.typeNameLike = _.trim(model.typeNameLike)
            const tpls = {
                'typeNameLike': <el-form-item label="类型名称"><el-input v-model={model.typeNameLike} maxlength={30} clearable/></el-form-item>,
            }
            return tpls
        }
    }
}
</script>
