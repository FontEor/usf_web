<template>
    <basic-dialog
        :visible="visible"
        :title="title"
        :width="dlgWidth"
        :update-vis="updateVis"
        :handle-close="handleClose"
        :handle-closed="handleClosed"
        :ok-text="okText"
        :handle-ok="handleOk">
        <el-form
            ref="form"
            size="small"
            label-position="right"
            label-width="108px"
            :model="dto"
            :rules="rules"
            @submit.native.prevent>
            <div class="entity-dlg__block">
                <div class="entity-dlg__block-bd">
                    <el-row :gutter="24">
                        <el-col :span="20">
                            <el-form-item label="类型" prop="orgType">
                                <el-select :disabled="disabledEdit" clearable filterable v-model="dto.orgType" placeholder="请选择机构类型">
                                    <el-option v-for="(item, key) of orgTypes" :key="key" :label="item.value" :value="+item.key"/>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="24">
                        <el-col :span="20">
                            <el-form-item label="机构名称" prop="orgName">
                                <el-input :disabled="disabledEdit" v-model.trim="dto.orgName" placeholder="必填"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="24" >
                        <el-col :span="20">
                            <el-form-item label="机构编码" prop="orgCode">
                                <el-input placeholder="如果不输入则自动生成" :disabled="action === actionTypes.EDIT" v-model.trim="dto.orgCode"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="24">
                        <el-col :span="20">
                            <el-form-item label="机构负责人" prop="principal">
                                <el-input :disabled="disabledEdit" v-model.trim="dto.principal" placeholder="请填写"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="24" v-for="(item, index) of extendFields" :key="index">
                        <el-col :span="20">
                            <el-form-item :label="item.name" :prop="item.key" :rules="item.rules">
                                <el-input v-if="item.type === 'input'" :disabled="disabledEdit" v-model.trim="dto[item.key]" :placeholder="item.placeholder" clearable />
                                <el-select v-else-if="item.type === 'select'" :disabled="disabledEdit" v-model.trim="dto[item.key]" :placeholder="item.placeholder" clearable filterable>
                                    <el-option v-for="subItem of item.options" :key="subItem.code" :label="subItem.label" :value="subItem.value" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="24">
                        <el-col :span="20">
                            <el-form-item label="备注" prop="remark">
                                <el-input type="input" :disabled="disabledEdit" v-model="dto.remark" placeholder="请填写"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </el-form>
    </basic-dialog>
</template>

<script>
import EntityDialog from './mixins/entityDialog'
import { mapState } from 'vuex'
export default {
    mixins: [EntityDialog],
    props: {
        orgTypes: {
            type: Array,
             default () {
                return []
            }
        }
    },
    computed: {
        ...mapState('app', ['tenementCode']),
        disabledEdit () {
            return false;
            // return this.action === this.actionTypes.EDIT
        }
    },
    data () {
        return {
            rules: {
                orgType: [
                    { required: true, trigger: 'change', validator: tools.genValidator({ validateFn: tools.isNotEmptyStr, message: '请选择机构类型' }).bind(this)},
                ],
                orgName: [
                    { required: true, trigger: 'blur', validator: tools.genValidator({ validateFn: tools.isNotEmptyStr, message: '机构名称不能为空' }).bind(this)},
                    { max: 100, message: "机构名称长度不能超过100个字符" },
                ],
                orgCode: [
                    { pattern: CNST.REG_EXP.NORMAL_ORGANIZATIONS, message: "仅支持中文、英文、数字、-、_、+、-、.、="},
                    { max: 30, message: "机构编码不超过30个字符" },
                ],
                principal: [
                    { pattern: CNST.REG_EXP.NORMAL, message: '机构负责人不可输入特殊字符' },
                    { max: 30, message: "机构负责人长度不能超过30个字符" },
                ],
                remark: [
                    { max: 120, message: "备注长度不能超过120个字符" },
                ]
            },
            extendFields: [],
            extendFieldKeys: []
        }
    },
    beforeCreate () {
        this.allFields = [
            'id', 'orgName', 'orgCode', 'orgType', 'parentId', 'parentCode', 'principal', 'remark', 'createTime', 'updateTime', { key: 'dataType', default: 1 },
            { key: 'tenementCode', default: 'clps' }, 'ext1', 'ext2', 'ext3', 'ext4', 'ext5', 'ext6', 'ext7', 'ext8', 'ext9', 'ext10', 'ext11', 'ext12', 'ext13',
            'ext14', 'ext15', 'ext16', 'ext17', 'ext18'
        ]
        this.disFields = []
    },
    watch: {
        visible(nb) {
            if (nb) {
                this.queryExtendField()
            }
        }
    },
    methods: {
        async queryExtendField() {
            this.extendFields = []
            this.extendFieldKeys = []
            const params = { data: { tenementCode: this.tenementCode } }
            const { code, data } = await api.organizations.queryExtendField(params)
            if (code === 200) {
                this.handleSetExtendFields(data || [])
            }
        },
        handleSetExtendFields(data=[]) {
            const showFields = data.filter(item => item.isEffective === 1)
            const fields = showFields.map(item => {
                const elem = { key: `ext${item.extNo}`, name: item.extName, required: false, type: 'input', placeholder: '请填写' }
                if (item.isRequired === 1) {
                    elem.required = true
                    elem.placeholder = '必填'
                }
                if (item.isEnum === 1) {
                    elem.type = 'select'
                    elem.options = jt.fn.generateEnums(item.enumValue, ',')
                }
                if (elem.type === 'select') {
                    elem.rules =  [
                        { required: elem.required, trigger: 'change', message: `请选择${elem.name}` }
                    ]
                } else if (elem.type === 'input') {
                    elem.rules =  [
                        { required: elem.required, trigger: ['blur', 'chamge'], message: `请输入${elem.name}` },
                        // { pattern: CNST.REG_EXP.NORMAL, message: elem.name + '不可输入特殊字符', trigger: 'change' },
                    ]
                }
                return elem
            })
            this.extendFields = fields
            this.extendFieldKeys = fields.map(item => item.key)
        },
        handleClose() {
            this.updateVis(false)
            this.dto = this.getDefaultDto()
        }
    },
}
</script>

