<template>
    <basic-dialog
        :visible="visible"
        :title="action=='add'?'添加接口授权':'编辑接口授权'"
        :width="720"
        :update-vis="updateVis"
        :handle-close="handleClose"
        :handle-ok="handleOk"
        :handle-closed="handleClosed"
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
                            <el-form-item label="账号类别">
                                <el-select v-model="dto.userSystemType" placeholder="请选择" clearable>
                                    <el-option
                                        v-for="item in systemType"
                                        :key="item.loginType"
                                        :label="item.loginName"
                                        :value="item.loginType">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>

                        <el-col :span="20">
                            <el-form-item label="租户编号" prop="tenementCode">
                                <el-input v-model="dto.tenementCode" placeholder="请输入租户编号"/>
                                <span class="allText" @click="setDtoMethod('tenementCode')">所有</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="20">
                            <el-form-item label="应用编号" prop="appCode">
                                <el-input v-model="dto.appCode" placeholder="请输入应用编号"/>
                                <span class="allText" @click="setDtoMethod('appCode')">所有</span>
                            </el-form-item>
                        </el-col>

                        <el-col :span="20">
                            <el-form-item label="用户编号" prop="userCode">
                                <el-input v-model="dto.userCode" placeholder="请输入用户编号"/>
                                <span class="allText" @click="setDtoMethod('userCode')">所有</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="20">
                            <el-form-item label="接口名" prop="interfaceName">
                                <el-input v-model="dto.interfaceName" placeholder="请输入接口名"/>
                                <span class="allText" @click="setDtoMethod('interfaceName')">所有</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="20">
                            <el-form-item label="方法名" prop="methodName">
                                <el-input v-model="dto.methodName" placeholder="请输入方法名"/>
                                <span class="allText" @click="setDtoMethod('methodName')">所有</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="20">
                            <el-form-item label="安全级别" prop="safeGrade">
                                <el-select v-model="dto.safeGrade" placeholder="请选择">
                                    <el-option
                                        v-for="item in levelData"
                                        :key="item.safety"
                                        :label="item.safetyName"
                                        :value="item.safety">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </el-form>
    </basic-dialog>
</template>

<script>
    import { mapState, mapActions } from 'vuex'
    import EntityDialog from '@/mixins/entityDialog'
    export default {
        mixins: [EntityDialog],
        props: {
            queryObj: Object,
            levelData: Array,
            systemType: Array
        },
        data () {
            return {
                rules: {
                    // appName: [
                    //     {required: true, message: '请输入应用名称', trigger: 'blur'},
                    //     // { pattern: CNST.REG_EXP.NORMAL, message: '应用名称不可输入特殊字符' },
                    //     { max: 30, message: "应用名称长度不能超过30个字符" },
                    // ],
                    // appCode: [
                    //     {required: true, message: '请输入应用编码', trigger: 'blur'},
                    //     {required: true, pattern: CNST.REG_EXP.ENGNUMLINE, message: '应用编码不可输入特殊字符' },
                    //     { max: 50, message: "应用编码长度不能超过50个字符" },
                    // ],
                    // remark:[
                    //     {max:120,message:'备注长度不能超过120个字符'},
                    // ],
                    // domainName:[
                    //     {max: 50, message:'域名长度不能超过50个字符'},
                    //     {pattern: CNST.REG_EXP.URL, message: '域名不可包含中文、特殊字符', },
                    // ]
                }
            }
        },
        beforeCreate () {
            this.allFields = ['tenementCode', 'appCode', 'userSystemType', 'userCode', 'interfaceName', 'methodName', 'safeGrade']
            this.disFieldKeys = ['userCode']
        },
        methods: {
            setDtoMethod (_name) {
                this.dto[_name] = '*'
            },
            handleClose() {
                this.updateVis(false)
                this.$refs['form'].resetFields()
                this.updateState('entity')
            },
            toEnd() {
                return this.dto
            },
        }
    }
</script>

<style>
    .allText {
        color:#1a1aa6;
        cursor:pointer;
        position: absolute;
        right: -40px;
        top: 0;
    }
</style>
