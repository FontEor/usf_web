<template>
    <basic-dialog
        :visible="visible"
        :title="title"
        :width="520"
        :update-vis="updateVis"
        :handle-close="handleClose"
        :handle-closed="handleClosed"
        :handle-ok="handleOk">
        <el-form
            ref="form"
            size="small"
            label-position="right"
            label-width="108px"
            :model="dto"
            @submit.native.prevent>
            <div class="entity-dlg__block">
                <div class="entity-dlg__block-bd">
                    <el-row :gutter="24">
                        <el-col :span="20" v-for="(item, index) in dto.fields" :key="index">
                            <template v-if="item.type === 'input'">
                                <el-form-item :label="item.name" :prop="'fields.' + index + '.value'" :rules="item.rules">
                                    <el-input :placeholder="'请输入'+item.name" v-model.trim="item.value"/>
                                </el-form-item>
                            </template>
                            <template v-else-if="item.type === 'select'">
                                <el-form-item :label="item.name" :prop="'fields.' + index + '.value'" :rules="item.rules">
                                    <el-cascader
                                        :options="item.options"
                                        v-model="item.value"
                                        :show-all-levels="true"
                                        :props="defaultParams">
                                    </el-cascader>
                                </el-form-item>
                            </template>
                            <template v-else>
                                <input type="hidden" :value="item.value" disabled>
                            </template>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </el-form>
    </basic-dialog>
</template>

<script>
import BasicDialog from '@/components/basicDialog'
const ACTIONS = {
    add: '新增',
    view: '查看',
    edit: '编辑'
}
export default {
    components: {
        BasicDialog
    },
    props: {
        moduleName: String,
        state: {
            type: Object,
             default () {
                return {}
            }
        },
        visible: {
            type: Boolean,
            default: false
        },
        // add | view | edit
        action: {
            type: String,
            default: 'add'
        },
        entity: {
            type: Object,
            default () {
                return {}
            }
        },
        updateVis: {
            type: Function,
            default: () => {}
        },
        updateState: {
            type: Function,
            default: () => {}
        },
        handleSave: {
            type: Function,
            default: () => {}
        }
    },
    computed: {
        title () {
            return (ACTIONS[this.action] || this.action) + this.moduleName
        },
        showFt () {
            return this.action !== 'view'
        }
    },
    data () {
        return {
            dto: {},
            allFields: [],
            defaultParams: {
                label: 'label',
                value: 'value',
                children: 'children',
                checkStrictly: true
            }
        }
    },
    created () {
        this.$parent.queryOrgTreeList().then((rows) => {
            // 获取部门options
            tools.setKeys(this.state.DEFAULTFIELDS, 'belongOrgCode', rows, 'options')
        })
    },
    watch: {
        visible: {
            handler (newVal) {
                if (newVal) {
                    this.allFields = this.state.currentFiles
                    this.dto = this.toFront()
                }
            },
            immediate: true
        }
    },
    methods: {
        getFieldKeys (fields = []) {
            const keys = []
            for (let i = 0, len = fields.length; i < len; i++) {
                if (_.isObject(fields[i])) {
                    keys[i] = fields[i].key
                } else {
                    keys[i] = fields[i]
                }
            }
            return keys
        },
        isDisabled (field) {
            if (this.action === 'add') {
                return false
            } else if (this.action === 'view') {
                return true
            } else {
                if (this.disFieldKeys.indexOf(field) !== -1) {
                    return true
                }
                return false
            }
        },
        getDefaultDto () {
            const fields = [..._.cloneDeep(this.allFields), ..._.cloneDeep(this.state.DEFAULTFIELDS)]
            const dto = {
                fields
            }
            for (let i = 0, len = fields.length; i < len; i++) {
                if (_.isObject(fields[i])) {
                    tools.setKeys(fields, fields[i].key, fields[i].default)
                }
            }
            return dto
        },
        toFront () {
            const defaultDto = this.getDefaultDto()
            const fields = defaultDto.fields
            const entity = _.cloneDeep(this.entity)
            //  'belongOrgCode'：entity和item都要有这个属性，否则会出异常
            if (entity.id !== undefined) {
                fields.forEach((item) => {
                    if (_.isObject(item)) {
                        tools.setKeys(fields, item.key, entity[item.key])
                    }
                })
            }
            // add rules
            fields.forEach((item) => {
                if (!_.isObject(item)) return
                    if (item.type === 'select') {
                        item.rules =  [
                            { required: true, trigger: 'change', validator: tools.genValidator({ validateFn: tools.isNotEmptyStr, message: '请选择' + item.name }).bind(this) }
                        ]
                    } else if (item.type === 'input') {
                        item.rules =  [
                            { required: true, trigger: 'blur', validator: tools.genValidator({ validateFn: tools.isNotEmptyStr, message: '请选择' + item.name }).bind(this) }
                        ]
                    } else {
                        item.rules = []
                    }
                })
            return {
                fields
            }
        },
        toEnd () {
            const params = {}
            const state = this.state
            const fields = this.dto.fields
            if (fields && fields.length) {
                fields.forEach(item => {
                    params[item['key']] = item['value']
                })
            }
            // type 为hidden的 如果state定义 ，以state为准
            const defaultFields = state.DEFAULTFIELDS
            if (defaultFields && defaultFields.length) {
                defaultFields.forEach(item => {
                    const key = item['key']
                    const value = item['value']
                    // belongOrgCode字段由数组转为字符串
                    if (item.type === 'select') {
                        params[key] = params[key][params[key].length - 1]
                    } else if (tools.isEmpty(value) && !tools.isEmpty(state[key])) {
                        // state中有值得选state中值
                        params[key] = state[key]
                    }
                })
            }
            return params
        },
        handleClose () {
            this.updateVis(false)
        },
        handleClosed () {
            this.updateState('entity')
            if (this.$refs.form) {
                this.$nextTick(() => {
                    this.$refs.form.clearValidate()
                })
            }
        },
        handleOk() {
            this.$refs.form.validate(valid => {
                if (!valid) {
                    return false
                } else {
                    const params = this.toEnd()
                    this.handleSave({ params, type: this.action })
                }
            });
        }
    },
}
</script>

