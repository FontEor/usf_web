<template>
    <basic-dialog
        :visible="visible"
        :title="'复制菜单角色'"
        :width="500"
        :update-vis="updateVis"
        :handle-close="handleClose"
        :handle-closed="handleClosed"
        :handle-ok="handleOk"
        :handle-open="handleOpen"
        :okText="'确认'"
    >
        <el-form
        ref="form"
        size="small"
        label-width="128px"
        :rules="rules"
        :model="model"
        >
            <p style="margin-left: 40px;margin-bottom: 20px;">您将复制菜单角色XXX到新的菜单角色！</p>
            <el-form-item label="菜单角色编码" prop="codes">
                <el-input clearable size="small" v-model="model.codes"></el-input>
            </el-form-item>
            <el-form-item label="菜单角色名称" prop="names">
                <el-input clearable size="small" v-model="model.names"></el-input>
            </el-form-item>
            <el-form-item label="备注">
                <el-input
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4}"
                    clearable
                    size="small"
                    v-model="model.remark">
                </el-input>
            </el-form-item>
        </el-form>
    </basic-dialog>
</template>

<script>
    import EntityDialog from '@/mixins/entityDialog';
    export default {
        mixins: [EntityDialog],
        props: {
            row: {
                type: Array
            }
        },
        data () {
            const rulesId = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('请输入流程ID'));
                } else if (!/^[0-9]*$/.test(value)) {
                    callback(new Error('请输入数字'));
                } else {
                    callback();
                }
            }
            return {
                model: {
                    names: '',
                    codes: '',
                    remark: ''
                },
                rules: {
                    names: [
                        { required: true, message: '请输入菜单角色编码', trigger: 'blur' },
                    ],
                    codes: [
                        { required: true, message: '请输入菜单角色名称', trigger: 'blur' },
                    ],
                },
            }
        },
        methods: {
            handleOpen() {
            },
            handleClose() {
                this.updateVis(false);
            },
            handleOk () {
                if (!this.$refs.form) {
                    return
                }
                this.$refs.form.validate(valid => {
                    if (!valid) {
                        return
                    } else {
                        console.log('提交')
                    }
                })
            },
        }
    }
</script>

