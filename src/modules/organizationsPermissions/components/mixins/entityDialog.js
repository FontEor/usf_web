
import BasicDialog from '@/components/basicDialog'

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
        action: {
            type: String,
            default: 'add'
        },
        dlgWidth: {
            type: Number,
            default: 520
        },
        entity: {
            type: Object,
            default () {
                return {}
            }
        },
        actionNames: {
            type: Object,
            default () {
                return {}
            }
        },
        actionTypes: {
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
            return this.actionNames[this.action]
        },
        showFt () {
            return this.action !== this.actionTypes.VIEW
        },
        okText () {
            return this.action === this.actionTypes.EDIT ? '保存' : '确定'
        }
    },
    data () {
        this.allFieldKeys = this.getFieldKeys(this.allFields)
        return {
            dto: this.toFront()
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
            if (this.$refs.form) {
                this.$refs.form.validate(valid => {
                    if (!valid) {
                        return
                    }
                    let params = this.toEnd()
                    this.handleSave({ params, type: this.action})
                })
            }
            if (this.$refs.tree) {
                this.handleSave({ type: this.action})
            }
        }
    }
}
