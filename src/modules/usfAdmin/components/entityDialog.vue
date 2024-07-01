<template>
    <basic-dialog
        :visible="visible"
        :title="title"
        :width="720"
        :update-vis="updateVis"
        :handle-close="handleClose"
        :handle-closed="handleClosed"
        :handle-ok="handleOk"
        :okText="this.action=='add'?'确认':'保存'"
    >
        <el-form
            ref="form"
            size="small"
            label-position="right"
            label-width="128px"
            :model="dto"
            :rules="rules"
            @submit.native.prevent>
            <div class="entity-dlg__block">
                <div class="entity-dlg__block-bd">
                    <el-row :gutter="24">
                        <el-col :span="20">
                            <el-form-item label="用户账号" prop="adminCode">
                                <el-input v-model="dto.adminCode"/>
                            </el-form-item>
                        </el-col>
                         <el-col :span="20">
                             <el-form-item label="账号别名" prop="name2">
                                 <el-input v-model="dto.name2"/>
                             </el-form-item>
                         </el-col>
                        <el-col :span="20">
                            <el-form-item label="姓名" prop="adminName">
                                <el-input v-model="dto.adminName" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="20">
                            <el-form-item label="备注" prop="remark">
                                <el-input clearable v-model="dto.remark" type="textarea"
                                          :rows="3" maxlength="121" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </el-form>
    </basic-dialog>
</template>

<script>
    import EntityDialog from '@/mixins/entityDialog'
    import {mapActions,mapState} from 'vuex'
    export default {
        mixins: [EntityDialog],
        data() {
            return {
                rules: {
                    adminCode: [
                        { required: true, message: '请输入用户账号', trigger: 'blur' },
                        { pattern: CNST.REG_EXP.NORMAL, message: '用户账号不可输入特殊字符',},
                        { max: 30, message: "用户账号长度不能超过30个字符" },
                    ],
                    adminName: [
                        { required: true, message: '请输入姓名', trigger: 'blur' },
                        { pattern: CNST.REG_EXP.NORMAL, message: '姓名不可输入特殊字符',},
                        { max: 30, message: "姓名长度不能超过30个字符" },
                    ],
                    remark: [
                        { max: 120, message: "备注长度不能超过120个字符" },
                    ]
                },

            }
        },

        beforeCreate() {
            this.allFields = ['adminName', 'adminCode', 'remark']
            this.disFields = []
        },
        methods: {
            ...mapActions('usfAdmin', [
                'createEntity', 'delete', 'queryList'
            ]),

            handleOk() {
                if (!this.$refs.form) {
                    return
                }
                this.$refs.form.validate(valid => {
                    if (!valid) {
                        return
                    }
                    let data = this.toEnd()
                    //  {'tenementCode': this.$store.state.app.tenementInfoObj.tenementCode},

                    data=Object.assign({},data,
                        {'tenementCode': this.$store.state.app.tenementInfoObj.tenementCode},
                    )
                    // 新建
                    this.createEntity({
                         params: data,
                         done:()=>{
                             this.queryList()
                         }
                     })
                    this.$refs['form'].resetFields()
                    this.handleClose()
                })
            },
            handleClose() {
                this.updateVis(false)
                this.$refs['form'].resetFields()
                this.updateState('entity')
                this.dto.adminName=undefined
                this.dto.adminCode=undefined
                this.dto.remark=undefined
            }
        }
    }
</script>

