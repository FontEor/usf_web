<script>
    import ExactSearch from "./mixins/exactSearch";

    export default {
        mixins: [ExactSearch],
        beforeCreate() {
            this.fields = [
                {key: "viewModel", default: "全部显示"},
                {key: "orgName", default: ""},
                {key: 'orgCode', default: ''},
                { key: 'orgType', default: 0, exclude: true }
            ];
        },
        props: {
            onViewChange: Function
        },
        data() {
            return {
                formLabelWidth: 100
            };
        },
        methods: {
            getFieldTpls(model) {
                model.orgName = _.trim(model.orgName);
                model.orgCode = _.trim(model.orgCode);
                const tpls = {
                    'orgName': <el-form-item label="机构名称">
                        <el-input v-model={model.orgName} placeholder="请输入机构名称" maxlength={30} clearable/>
                    </el-form-item>,
                    'orgCode': <el-form-item label="机构编码">
                        <el-input v-model={model.orgCode} placeholder="请输入机构编码" maxlength={30} clearable/>
                    </el-form-item>,
                    viewModel: (
                        <div class="org-radio-group">
                            <el-radio-group
                                size="small"
                                onChange={this.onViewChange}
                                v-model={model.viewModel}
                            >
                                <el-radio-button label="全部显示" checked></el-radio-button>
                                <el-radio-button label="仅显示企业"></el-radio-button>
                                <el-radio-button label="仅显示部门 "></el-radio-button>
                            </el-radio-group>
                        </div>
                    )
                };
                this.fields = ['orgName', 'orgCode'];

                return tpls;
            },
            queryParam() {
                //获取查询参数
                return this.toEnd()
            }
        }
    };
</script>
<style scoped>
    .org-radio-group {
        margin: 20px 0;
    }
</style>

