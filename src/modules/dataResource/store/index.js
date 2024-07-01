import { pageListMerge, generateActions } from '@/store/helper'
import store from '@/store'
import axios from "axios";
const _ = require('lodash')
// idToValue转换
function idToValue (rows = []) {
    if (!rows || !rows.length) return []
    rows.map((row = {}) => {
        row.orgCode = row.value
        row.value = row.id
        if (row.children && row.children.length) {
            idToValue(row.children)
        }
    })
    return rows
}
// 格式化files
function createFormatFiles (rows = []) {
    if (!rows || !rows.length) return []
    const res = []
    rows.map((row = {}) => {
        if (row.isEffective !== 1) return
        const everyCol = {
            id: row.extNo,
            key: 'ext' + String(row.extNo),
            name: row.extName,
            type: 'input',
            value: null,
            required: false
        }
        if (row.isEnum === 1) {
            everyCol.type = 'enums'
            everyCol.enums = jt.fn.generateEnums(row.enumValue, ',')
            everyCol.render = (h, { row }) => {
                const enumValue = everyCol.enums.find(item => item.value === row[everyCol.key])
                return <span>{ enumValue ? enumValue.label : '' }</span>
            }
        }
        if (row.isRequired == 1) {
            everyCol.required = true
        }
        res.push(everyCol)
    })
    return res
}

// 默认状态
// state tenementId等状态可以统一管理
const DEFAULTS = {
    entity: {},
    dataTypeList: [],
    dataTypeOptions: [],
    currentFiles: [],
    typeId: null,
    tenementCode: null,
    tenementId: null,
    orgTreeList: [],
    appCode: null,
    appId: null,
    DEFAULTFIELDS: [
        {
            key: 'id',
            name: '数据ID',
            type: 'hidden',
            value: null
        },
        {
            key: 'typeId',
            name: '数据类型',
            type: 'hidden',
            value: null
        },
        {
            key: 'appId',
            name: '应用ID',
            type: 'hidden',
            value: null,
            default: 1
        },
        {
            key: 'appCode',
            name: '应用Code',
            type: 'hidden',
            value: null,
            default: 'msp'
        },
        {
            key: 'tenementCode',
            name: '租户Code',
            type: 'hidden',
            value: null
        },
        {
            key: 'belongOrgId',
            name: '所属机构',
            type: 'select',
            value: [],
            showValue:[],
            options: [],
            required: true
        }
    ],
    visible: false
}

export default pageListMerge({
    namespaced: true,
    actions: {
        ...generateActions({
            caller: api.dataResource,
            items: [
                { key: 'createEntity', callee: 'add' },
                { key: 'updateEntity', callee: 'update' },
                { key: 'deleteEntity', callee: 'delete' },
                { key: 'queryList', callee: 'queryPage' },
                { key: 'queryEntity', callee: 'get' }
            ]
        }),
        // 获取数据类型列表
        async 'queryListDataType' ({ commit, state = {} }, args = {}) {
            commit('update', { visible: false })
            const payload = { visible: true }
            const { dataTypeList = [], typeId } = state
            if (dataTypeList.length && typeId !== null && !args.update) {
                await setTimeout(() => {
                    const currentRow = _.find(dataTypeList, { id: typeId }, {})
                    const currentFiles = createFormatFiles(_.result(currentRow, 'dataExtInfoList', []))
                    payload.currentFiles = _.sortBy(currentFiles, ['id'])
                    payload.appCode = currentRow.appCode
                    payload.appId = currentRow.appId
                    commit('update', payload)
                    return state
                })
            } else {
                if (!state.tenementCode) {
                    state.tenementCode = store.getters.tenementCode
                }
                const tenementCode = state.tenementCode
                const { code, msg, data = {} } = await api.dataType.queryPage({
                    data: {
                        tenementCode
                    },
                    page: {
                        pageIndex: 0,
                        pageSize: 1000000000
                    }
                })
                if (code === 200) {
                    const rows = _.get(data, 'rows', [])
                    if (!rows.length) return []
                    let typeId = state.typeId
                    payload.dataTypeList = rows.filter((row) => !row.isDelete)
                    payload.dataTypeOptions = rows.map((row) => {
                        return _.pick(row, ['id', 'typeName', 'typeCode'])
                    })
                    if (typeId === null || typeId === undefined) {
                        typeId = _.result(rows[0], 'id', null)
                    }
                    payload.typeId = typeId
                    const currentRow = _.find(rows, { id: typeId }, {})
                    const currentFiles = createFormatFiles(_.result(currentRow, 'dataExtInfoList', []))
                    payload.currentFiles = _.sortBy(currentFiles, ['id'])
                    payload.appCode = currentRow.appCode
                    payload.appId = currentRow.appId

                } else {
                    this._vm.$message.error(msg)
                }
                commit('update', payload)
                return data
            }
        },
        // 添加、修改弹框的所属部门
        async 'queryOrgTreeList' ({ commit, state }) {
            commit('update', { loading: true })
            const { code, msg, data = [] } = await api.org.queryTreeOrgList({
                data: {
                    tenementCode: store.getters.tenementCode,
                }
            })
            const payload = { loading: false }
            const res = idToValue(_.cloneDeep(data))
            if (code === 200) {
                payload.orgTreeList = res
            } else {
                this._vm.$message.error(msg)
            }
            commit('update', payload)
            return res
        },
        async 'queryOrgIdTreeList' ({ commit, state },id) {

            const { dataTypeList = [], typeId } = state
            commit('update', { loading: true })
            const { code, msg, data = [] } = await api.data.queryTreeOrgListById({
                data: {
                    id:id,
                    tenementCode: store.getters.tenementCode,
                }
            })
            const payload = { loading: false }
            const res = idToValue(_.cloneDeep(data))
            if (code === 200) {
                payload.orgTreeList = res;

            } else {
                this._vm.$message.error(msg)
            }
            commit('update', payload)
            return res
        }

    }
}, DEFAULTS)
