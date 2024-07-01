<template>
    <basic-dialog
        :visible="visible"
        :title="action=='add'?'添加应用':'编辑应用'"
        :width="720"
        :update-vis="updateVis"
        :handle-close="handleClose"
        :handle-ok="handleOk"
        :handle-closed="handleClosed"
        :handle-open="handleOpen"
        :okText="this.action=='add'?'确认':'保存'"
    >
        <el-form
            ref="form"
            size="small"
            label-position="right"
            label-width="138px"
            :model="dto"
            :rules="rules"
            @submit.native.prevent>
            <div class="entity-dlg__block">
                <div class="entity-dlg__block-bd">
                    <el-row :gutter="24">
                        <el-col :span="20">
                            <el-form-item label="应用编码" prop="appCode">
                                <el-input v-model.trim="dto.appCode" :disabled="isDisabled('appCode')" placeholder="请输入英文、数字、_、-"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="20">
                            <el-form-item label="应用名称" prop="appName">
                                <el-input v-model.trim="dto.appName"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="20">
                            <el-form-item label="应用域名" prop="domainName">
                                <el-input v-model="dto.domainName"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="20">
                            <el-form-item label="安全合规" prop="safetySwitch">
                                <el-select v-model="dto.safetySwitch"
                                           :maxlength="30"
                                           clearable>
                                    <el-option :value="1"
                                               label="开启"></el-option>
                                    <el-option :value="0"
                                               label="关闭"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="20">
                            <el-form-item label="应用负责人" prop="principal">
                                <el-input v-model="dto.principal"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="20">
                            <el-form-item label="应用负责人erp" prop="principalErpCode">
                                <el-input v-model="dto.principalErpCode"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="20">
                            <el-form-item label="申请页应用是否展示" prop="isApply" :rules="[
                                {
                                required: true,
                                message: '是否可申请不能为空',
                                trigger: 'blur',
                                },
                            ]">
                                <el-select v-model="dto.isApply">
                                    <el-option label="是" :value="0" />
                                    <el-option label="否" :value="1" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="20">
                            <el-form-item label="备注" prop="remark">
                                <el-input clearable v-model="dto.remark" type="textarea"
                                    :disabled="this.action == 'view'"
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
    export default {
        mixins: [EntityDialog],
        props: {
            queryObj: Object,
            tenementInfoObj: Object,
        },
        data () {
            return {
                rules: {
                    appName: [
                        {required: true, message: '请输入应用名称', trigger: 'blur'},
                        // { pattern: CNST.REG_EXP.NORMAL, message: '应用名称不可输入特殊字符' },
                        { max: 40, message: "应用名称长度不能超过40个字符" },
                    ],
                    appCode: [
                        {required: true, message: '请输入应用编码', trigger: 'blur'},
                        {required: true, pattern: CNST.REG_EXP.ENGNUMLINE, message: '应用编码支持英文、数字、_、-' },
                        { max: 40, message: "应用编码长度不能超过40个字符" },
                    ],
                    remark:[
                        {max: 120,message:'备注长度不能超过120个字符'},
                    ],
                    domainName:[
                        {required: true, message: '请输入应用域名', trigger: 'blur'},
                        {max: 50, message:'域名长度不能超过50个字符'},
                        {pattern: CNST.REG_EXP.URL, message: '域名不可包含中文、特殊字符', },
                    ],
                    safetySwitch: [
                        {required: true, message: '请选择安全合规状态'},
                        {pattern: CNST.REG_EXP.NUMBER, message: '安全合规状态有误'}
                    ],
                    principal:[
                        {required: true, message: '请输入应用负责人', trigger: 'blur'},
                    ],
                    principalErpCode:[
                        {required: true, message: '请输入应用负责人erp', trigger: 'blur'},
                    ]
                }
            }
        },
        beforeCreate () {
            this.allFields = ['appName', 'appCode','domainName','remark', 'tenementCode', {key: 'tenementId', default: '1'}, 'id','safetySwitch', 'principal', 'principalErpCode',
                {
                    key: 'isApply',
                    default: 0
                }
            ]
            this.disFieldKeys = ['appCode']
        },
        methods: {
            handleClose() {
                this.updateVis(false)
                this.$refs['form'].resetFields()
                this.updateState('entity')
                this.dto.appCode=undefined
                this.dto.domainName=undefined
                this.dto.remark=undefined
                this.dto.appName=undefined
                this.dto.safetySwitch = undefined
                this.dto.principal = undefined
                this.dto.principalErpCode = undefined
                this.dto.isApply = 0;
            },
            toEnd() {
                //重新整理 修改入参  10.17
                if(this.action=='add') {
                    this.dto=Object.assign({}, this.dto,
                        { 'tenementId': this.tenementInfoObj.id },
                        { 'tenementCode': this.tenementInfoObj.tenementCode },
                    )
                }
                return this.dto
                //  return _.pick(this.dto, this.allFieldKeys)
            },
            handleOpen(){
                if(this.action == 'add'){
                    this.$set(this.dto,"safetySwitch",1);
                }
            }
        },


    }
</script>

