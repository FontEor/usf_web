<template>
    <basic-dialog
        :width="1000"
        :visible="visible"
        :ok-text="okText"
        :close-text="closeText"
        :title="title"
        :handle-close="handleClose"
        :handle-ok="handleOk"
        >
        <basic-list
            :tableH="500"
            :fields="fields"
            :list="list"
            :index-col-label="indexColLabel"
            :show-action-col="showActionCol"
            :show-index-col="showIndexCol"
            :show-head="showHead"
            />
    </basic-dialog>
</template>

<script>
import EntityDialog from '@/mixins/entityDialog'
import BasicList from '@/components/basicList'
import { mapState } from 'vuex'
export default {
    components: {
        BasicList
    },
    mixins: [EntityDialog],
    props: {
        visible: Boolean
    },
    data() {
        return {
            okText: '保存',
            closeText: '取消',
            indexColLabel: '字段序号',
            showActionCol: false,
            showIndexCol: false,
            showHead: false,
            fields: [
                { key: 'extNo', name: '字段序号', width: 80 },
                {
                    key: 'isEffective',
                    name: '是否启用',
                    width: 80,
                    render: (h, { row }) => <el-checkbox v-model={row.isEffective} true-label={1} false-label={0} />
                },
                {
                    key: 'isRequired',
                    name: '是否必填',
                    width: 80,
                    render: (h, { row }) => <el-checkbox v-model={row.isRequired} true-label={1} false-label={0} />
                },
                {
                    key: 'extName',
                    name: '字段名称',
                    render: (h, { row }) => <el-input v-model={row.extName} size='small' />
                },
                {
                    key: 'isEnum',
                    name: '是否枚举类型',
                    width: 120,
                    render: (h, { row }) => <el-checkbox v-model={row.isEnum} true-label={1} false-label={0} />
                },
                {
                    key: 'enumValue',
                    name: '输入枚举值',
                    render: (h, { row }) => <el-input v-model={row.enumValue} placeholder='请用英文逗号隔开' size='small' />
                }
            ],
            list: this.getDefaultList()
        }
    },
    computed: {
        ...mapState('app', ['tenementCode']),
        title() {
            return '扩展字段'
        }
    },
    methods: {
        getDefaultList() {
            const listLen = Array(18).fill(0)
            const list = listLen.map((item, index) => {
                const extNo = index + 1
                const row = { id: null, extNo, extCode: `ext_${extNo}`, isEffective: 0, isRequired: 0, extName: '', isEnum: 0, enumValue: '', tenementCode: this.tenementCode }
                return row
            })
            return list
        },
        handleOk() {
            const pass = this.checkParams()
            if (!pass) return
            this.saveHandler()
        },
        async saveHandler() {
            let ajaxMethod = () => {}
            const list = _.cloneDeep(this.list)
            const { code, msg } = await api.organizations.addExtendField({ data: list })
            if (code === 200) {
                this.$message.success(msg)
                this.handleClose()
                this.$emit('SETLISTEXTENDFIELDS', list)
            } else {
                this.$message.error(msg)
            }
        },
        // 入参校验
        checkParams() {
            for (let i = 0, list = this.list, len = list.length; i < len; i++) {
                const row = list[i]
                const nextRow = i !== (len-1) ? list[i+1] : {}
                if (row.isEffective === 0 && nextRow.isEffective === 1 && i !== (len-1)) {
                    this.$message.error('请依次启用扩展字段')
                    return
                }
                // 將null&undefined轉為字符串
                row.enumValue = typeof row.enumValue === 'string' ? row.enumValue.trim() : ''
                row.extName = typeof row.extName === 'string' ? row.extName.trim() : row.extName
                if (row.isEffective === 1 && _.isEmpty(row.extName)) {
                    this.$message.error('请填写启用字段的字段名称')
                    return
                }
                if (typeof row.extName === 'string' && row.extName.length > 20) {
                    this.$message.error(`字段序号${row.extNo}的字段名称最多可输入20个字符`)
                    return
                }
                if (row.isEffective === 1 && !CNST.REG_EXP.ENGNUMLINEZH.test(row.extName)) {
                    this.$message.error(`字段序号${row.extNo}的字段名称只允许输入数字，字母，下划线，中文`)
                    return
                }
                if (typeof row.enumValue === 'string' && row.enumValue.length > 200) {
                    this.$message.error(`字段序号${row.extNo}的枚举值最多可输入200个字符`)
                    return
                }
                if (row.isEnum === 1 && _.isEmpty(row.enumValue.trim())) {
                    this.$message.error('枚举类型的枚举值不允许为空')
                    return
                }
                // 不允许最后一个字符为逗号
                if (row.isEnum === 1 && row.enumValue.length && row.enumValue[row.enumValue.length-1] === ',') {
                    this.$message.error(`字段序号${row.extNo}枚举值尾部不允许有多余的逗号`)
                    return
                }
                if (row.isEnum === 1 && !_.isEmpty(row.enumValue)) {
                    const enumStr = row.enumValue
                    if (enumStr.includes(',')) {
                        const keys = []
                        const values = []
                        const array = enumStr.split(',')
                        for (let j = 0; j < array.length; j++) {
                            if (!CNST.REG_EXP.ENUM_VALUE_STR.test(array[j])) {
                                this.$message.error(`字段序号${row.extNo}的枚举值需要以: 展示值:Value值这种格式出现，英文冒号和逗号为分隔符，除分隔符外可以输入数字、字母、下划线、中文`)
                                return
                            }
                            const itemInfo = array[j].split(':')
                            const itemKey = itemInfo[0].trim()
                            const itemValue = itemInfo[1].trim()
                            if (!itemKey || !itemValue) {
                                this.$message.error(`字段序号${row.extNo}的key或value不能为空`)
                                return
                            }
                            if (keys.includes(itemKey)) {
                                this.$message.error(`字段序号${row.extNo}枚举值的key值${itemKey}不允许重复`)
                                return
                            } else {
                                keys.push(itemKey)
                            }
                            if (values.includes(itemValue)) {
                                this.$message.error(`字段序号${row.extNo}枚举值的value值${itemValue}不允许重复`)
                                return
                            } else {
                                values.push(itemValue)
                            }

                        }
                    } else if (!CNST.REG_EXP.ENUM_VALUE_STR.test(enumStr)) {
                        this.$message.error(`字段序号${row.extNo}的枚举值需要以: 展示值:Value值这种格式出现，英文冒号和逗号为分隔符，除分隔符外可以输入数字、字母、下划线、中文`)
                        return
                    }
                }
            }
            return true
        },
        async queryExtendList() {
            this.list = this.getDefaultList()
            const params ={ data: { tenementCode: this.tenementCode } }
            const { code, msg, data } = await api.organizations.queryExtendField(params)
            if (code === 200) {
                if (data.length === 0) return
                this.toFont(data || [])
            } else {
                this.$message.error(msg)
            }
        },
        toFont(data) {
            data = data.map(item => _.omit(item, ['extNo']))
            data.forEach((item, index) => { Object.assign(this.list[index], item) })
        }
    }
}
</script>
