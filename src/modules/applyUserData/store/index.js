import { pageListMerge, generateActions } from '@/store/helper'

// 默认状态
const DEFAULTS = {
    dataListUser:[],
    ids:[],
    listTree:[],
    entity: {},
    dataType: [],
    menuList: {},
    adminList:{list:[],total:0}
}

export default pageListMerge({
    namespaced: true,
    actions: {
        ...generateActions({
            caller: api.rolePermissions,
            items: [
                { key: 'createEntity', callee: 'addBrand' },
                { key: 'updateEntity', callee: 'updateBrand' },
                { key: 'queryBrands', callee: 'queryBrands' },
                { key: 'start', callee: 'startBrands' },
                { key: 'deleteEntity', callee: 'deleteEntity' },
                { key: 'queryEntity', callee: 'queryEntity' },
            ]
        }),
        // 设置数据权限 数据类型 下拉列表
        async 'DataTypeList' ({ commit, state }) {
            commit('update', { loading: true })
            const { code, msg, data } = await api.users.DataTypeList({
                data: {
                    "typeNameLike": '',
                    "tenementCode": this.state.app.tenementInfoObj.tenementCode,
                },
                page: {
                    pageIndex: state.dataPageIndex + 1 || 1,
                    pageSize: 1000000
                }
            })
            const payload = { loading: false }
            if (code === 200) {
                const rows = _.get(data, 'rows') || []
                rows.forEach(row => {
                    row.children = []
                    row.hasChildren = true
                })
                payload['dataType'] = rows
            } else {
                this._vm.$message.error(msg)
            }
            commit('update', payload)
        },
        // 查询数据权限列表
        async 'queryDataAuthorityList' ({ commit, state }) {
            commit('update', { loading: true })
            const { code, msg, data } = await api.applyUserData.queryDataAuthorityList({
                data: {
                    // "tenementCode": "xinzhou",
                    "tenementCode": this.state.app.tenementInfoObj.tenementCode,
                    "typeId":state.entity.typeId,
		            ... state.entity.searchList
                },
                page: {
                    pageIndex: state.dataPageIndex + 1 || 1,
                    pageSize: state.dataPageSize || 10
                }
            })
            const payload = { loading: false }
            if (code === 200) {
                const rows = _.get(data, 'rows') || []
                rows.forEach(row => {
                    row.children = []
                    row.hasChildren = true
                })
                let _adminList = {}
                _adminList.list = rows
                _adminList.total = _.get(data, 'rowTotal') || 0
                payload['adminList'] = _adminList
            } else {
                payload['adminList'] = {list:[],total:0}
                this._vm.$message.error(msg)
            }
            commit('update', payload)
            return payload.adminList.list
        },
    },
},DEFAULTS)
