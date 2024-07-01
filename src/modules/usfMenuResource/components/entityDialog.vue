<template>
    <basic-dialog
        :visible="visible"
        :title="action=='add'?'添加子菜单':'编辑'"
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
                            <el-form-item label="菜单编码" prop="resourceCode">
                                <el-input :disabled="action=='edit'" v-model="dto.resourceCode"
                                          placeholder="请输入英文或数字或下划线"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="20">
                            <!--:disabled="!dto.resourceCode"-->
                            <el-form-item label="菜单名称" prop="resourceName">
                                <el-input v-model="dto.resourceName"/>
                            </el-form-item>
                        </el-col>

                        <el-col :span="20">
                            <el-form-item label="菜单序号" prop="resourceSeq">
                                <el-input-number v-model="dto.resourceSeq" :min="1" :max="1000" :step-strictly="true"
                                                 :precision="0"></el-input-number>
                            </el-form-item>
                        </el-col>
                        <el-col :span="20">
                            <el-form-item label="类型" prop="resourceType">
                                <el-select clearable filterable v-model="dto.resourceType" placeholder="">
                                    <el-option v-for="(item, key) of resourceTypeList" :key="key" :label="item"
                                               :value="+key"/>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="20">
                            <el-form-item label="URL" prop="resourceUrl">
                                <el-input v-model="dto.resourceUrl"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="20">
                            <el-form-item label="备注" prop="remark">
                                <el-input clearable v-model="dto.remark" type="textarea"
                                          :rows="3" maxlength="121"/>
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
            tenementInfoObj: Object,
            level:Number,
            parentId: Number
        },
        data() {
            return {
                num: null,
                rules: {
                    resourceName: [
                        { required: true, message: '请输入菜单名称' },
                        { pattern: CNST.REG_EXP.NORMAL, message: '菜单名称不可输入特殊字符' },
                        { max: 30, message: "菜单名称长度不能超过30个字符" },
                    ],
                    resourceCode: [
                        { required: true, message: '请输入菜单编码' },
                        { pattern: CNST.REG_EXP.NORMAL, message: '菜单编码不可输入特殊字符'},
                        { max: 50, message: "50个字符(字母、数字、下划线)" },
                        {
                            validator: (rule, value, callback) => {
                                if (this.action == 'add') {
                                    api.menuResource.exist({
                                        data: {
                                            appCode: "usf",
                                            resourceCode: this.dto.resourceCode,
                                            tenementCode: this.tenementInfoObj.tenementCode
                                           // resourceName: this.dto.resourceName
                                        }
                                    }).then(res => {
                                        if (res && res.code == '200') {
                                            if (res.data) {
                                                return callback(new Error('菜单编码已存在，请重新命名'))
                                            } else {
                                                return callback()
                                            }
                                        } else if (res.code == '300') {
                                            return
                                        } else if (res) {
                                            return callback(new Error(res.msg || res.errorCode || '请联系管理员'))
                                        }
                                    })
                                }else{
                                    callback()
                                }
                            }, trigger: 'blur'
                        }
                    ],
                    resourceType: [
                        { required: true, message: '请选择类型' }
                    ],
                    resourceSeq: [
                        { required: true, message: '请输入菜单序号' },
                        {
                            validator: (rule, value, callback) => {
                                let data={}
                                if(this.action=='add'){
                                    data= {
                                        appCode: "usf",
                                        resourceSeq: this.dto.resourceSeq,
                                        tenementCode: this.tenementInfoObj.tenementCode,
                                        level:this.level,
                                        resourceCode: this.dto.resourceCode,
                                        parentId: this.$store.state.usfMenuResource.parentId
                                    }
                                }
                                else{
                                    data= {
                                        appCode: "usf",
                                        resourceSeq: this.dto.resourceSeq,
                                        id: this.dto.id,
                                        tenementCode: this.tenementInfoObj.tenementCode,
                                        level:this.dto.level,
                                        resourceCode: this.dto.resourceCode,
                                        parentId: this.$store.state.usfMenuResource.parentId
                                    }
                                }
                                api.menuResource.seqExist({
                                    data
                                }).then(res => {
                                    if (res && res.code == '200') {
                                        if (res.data) {
                                            return callback(new Error('菜单序号已存在，请重新输入'))
                                        } else {
                                            return callback()
                                        }
                                    } else if (res) {
                                        this.$message.error(res.msg || res.errorCode || '请联系管理员')
                                        return false
                                    }
                                })
                            }, trigger: 'blur'
                        }
                    ],
                    resourceUrl: [
                        { max:30,message:'域名长度不能超过30个字符' },
                        { pattern:CNST.REG_EXP.URL, message: '域名不可包含中文、特殊字符' }
                    ],
                    remark: [
                        { max: 120, message: "备注长度不能超过120个字符" },
                    ]
                },
                resourceTypeList: CNST.ENUMS.resourceType
            }
        },
        beforeCreate() {
            this.allFields = ['resourceName', 'resourceCode', 'resourceType', 'resourceUrl', 'resourceSeq',
                { key: 'appCode', default: 'usf' }, { key: 'appId', default: '' }, { key: 'level', default: 1},
                { key: 'tenementId', default: 1}, {
                    key: 'tenementCode',
                    default: "xinzhou"
                }, 'parentId', { key: 'resourceSource', default: 'in' }, 'remark', 'id'
            ]
            this.disFieldKeys = []
        },
        methods: {
            handleClose() {
                this.updateVis(false)
                this.$refs['form'].resetFields()
                this.dto={
                    resourceName: undefined,
                    resourceCode: undefined,
                    resourceType: undefined,
                    resourceSeq: undefined,
                    resourceUrl: undefined,
                    remark: undefined
                }
            },
            toEnd() {
                if (this.action === 'add') {
                    this.dto = Object.assign({}, this.dto,
                        {'tenementId':  this.tenementInfoObj.id },
                        { 'tenementCode':  this.tenementInfoObj.tenementCode },
                        { 'level':  1 },
                        {'parentId': undefined }
                    )
                }
                return this.dto
            },
        }
    }
</script>

