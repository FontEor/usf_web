
import BasicDialog from '@/components/basicDialog'
import {mapState} from 'vuex';

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
        ...mapState('app', ['showButtonList', 'showAllButton', 'tenementCode','importMsg']),
        title () {
            return (ACTIONS[this.action] || this.action) + this.moduleName
        },
        showFt () {
            return this.action !== 'view'
        }
    },
    data () {
        this.allFieldKeys = this.getFieldKeys(this.allFields)
        return {
            dto: this.toFront(),
            extendFields: []
        }
    },
    watch: {
        entity () {
            this.dto = this.toFront()
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
                if (this.disFieldKeys && this.disFieldKeys.indexOf(field) !== -1) {
                    return true
                }
                return false
            }
        },
        getDefaultDto () {
            const fields = this.allFields || []
            const dto = {}
            for (let i = 0, len = fields.length; i < len; i++) {
                if (_.isObject(fields[i])) {
                    dto[fields[i].key] = fields[i].default
                } else {
                    dto[fields[i]] = undefined
                }
            }
            return dto
        },
        toFront () {
            return {
                ...this.getDefaultDto(),
                ..._.cloneDeep(this.entity)
            }
        },
        toEnd () {
            return _.pick(this.dto, this.allFieldKeys)
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
        handleOk () {
            if (!this.$refs.form) {
                return
            }
            this.$refs.form.validate(valid => {
                if (!valid) {
                    return
                }
                let params = this.toEnd()
                this.handleSave({ params, type: this.action})
            })
        },
        buttonData(_str = '') {
            const btnItem = _.find(this.showButtonList, { code: _str }, null)
            let _btn = {}
            // 设置按钮全部显示
            this.showAllButton && (_btn = {
                item: {},
                name: 'button',
                has: false,
            })
            // 返回真实按钮
            btnItem && (_btn = {
                item: btnItem,
                name: btnItem.name || '',
                has: true,
            })

            return _btn
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
                        { required: elem.required, trigger: ['blur', 'chamge'], message: `请输入${elem.name}` }
                    ]
                }
                return elem
            })
            this.extendFields = fields
            this.extendFieldKeys = fields.map(item => item.key)
        }
    }
}
