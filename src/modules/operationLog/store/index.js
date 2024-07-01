import { pageListMerge, generateActions } from '@/store/helper'
// 默认状态
const DEFAULTS = {
    entity: {},
    userList: {},
    adminList: {},
    dataType: [],
    menuList: {},
}
// 这里指向 /services 下的 index.js 中引用的 operationLog.js
const _api = api.operationLog
let _apiList = []
for (var _k in _api) {
    _apiList.push({
        key: _k,
        callee: _k
    })
}

export default pageListMerge({
    namespaced: true,
    actions: {
        ...generateActions({
            caller: _api,
            // dispatch调用指向这里的key, callee 对应 operationLog.js 里面的key
            items: [
                ..._apiList,
                {key: 'updateEntity', callee: 'update'}
            ],

        }),
        // 用户管理 列表查询
        async 'queryList' ({ commit, state }) {
            commit('update', { loading: true })
            const { code, msg, data } = await _api.querySmartLog({
                data: {
                    ...state.query,
                    tenementCode: this.state.app.tenementInfoObj.tenementCode,
                },
                page: {
                    pageIndex: state.pageIndex + 1,
                    pageSize: state.pageSize,
                    pageTotal: 1,
                }
            })

            const payload = { loading: false }

            if (code === 200) {
                const rows = _.get(data, 'rows') || []
                rows.forEach(row => {
                    row.children = []
                    row.hasChildren = true
                })

                payload.list = rows
                payload.total = _.get(data, 'rowTotal') || 0
            } else {
                this._vm.$message.error(msg)
            }
            commit('update', payload)
        },

        // 所属部门
        async 'queryTreeOrgList' ({ commit, state }) {
            commit('update', { loading: true })
            const { code, msg, data } = await _api.queryTreeOrgList({
                  "data": {
                      "tenementCode": this.state.app.tenementInfoObj.tenementCode,
                        // "orgType": 1 //不传值：查询所有机构(机构/部门)；传值：查类型为机构的传1   查类型为部门的传2
                    }
            })
            const payload = { loading: false }
            if (code === 200) {
                payload['treeOrgList'] = data
            } else {
                this._vm.$message.error(msg)
            }
            commit('update', payload)
        },
        // 查询业务类型
        async 'queryAllWorkType' ({ commit, state }) {
            commit('update', { loading: true })
            const { code, msg, data } = await _api.queryAllWorkType({
                  "data": {
                      "tenementCode": this.state.app.tenementInfoObj.tenementCode,
                    }
            })
            const payload = { loading: false }
            if (code === 200) {
                payload['AllWorkType'] = data
                commit('update', payload)
                return data
            } else {
                this._vm.$message.error(msg)
                commit('update', payload)
                return []
            }
        },
        // 查询操作类型
        async 'queryAllOperateType' ({ commit, state }) {
            commit('update', { loading: true })
            const { code, msg, data } = await _api.queryAllOperateType({
                  "data": {
                      "tenementCode": this.state.app.tenementInfoObj.tenementCode,
                    }
            })
            const payload = { loading: false }
            if (code === 200) {
                payload['AllOperateType'] = data
                commit('update', payload)
                return data
            } else {
                this._vm.$message.error(msg)
                commit('update', payload)
                return []
            }
        },

    }
}, DEFAULTS)
