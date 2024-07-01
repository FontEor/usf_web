import { pageListMerge, generateActions } from '@/store/helper'
import store from '@/store'

// 默认状态
const DEFAULTS = {
    entity: {},
    query:{
        tenementCode: '',
        appCode: '',
        appId: '',
        levelData: '',
        userSystemType: ''
    },
    userSystemTypeData: [],
    levelData: []
}

const done = ({ dispatch, commit }) => {
    store.dispatch('app/getAppList')
}
const _api = api.interfaceAuth
export default pageListMerge({
    namespaced: true,
    actions: {
        ...generateActions({
            caller: _api,
            items: [
                { key: 'createEntity', callee: 'add', wrapByData: false, done },
                { key: 'updateEntity', callee: 'update', wrapByData: false, done },
                { key: 'queryEntity', callee: 'view', wrapByData: false },
                { key: 'deleteEntity', callee: 'delete', done },
            ],
        }),
        async 'queryUserSystemTypeData' ({ commit, state }) {
            const { code, msg, data = [] } = await _api.queryUserSystemTypeData()
            const payload = {}
            if (code === 200) {
                payload.userSystemTypeData = data
                commit('update', payload)
                return data
            } else {
                this._vm.$message.error(msg)
            }
            commit('update', payload)
        },
        async 'querySafetyLevelData' ({ commit, state }) {
            const { code, msg, data = [] } = await _api.querySafetyLevelData()
            const payload = {}
            if (code === 200) {
                payload.levelData = data
                commit('update', payload)
                return data
            } else {
                this._vm.$message.error(msg)
            }
            commit('update', payload)
        },
        async 'queryList' ({ commit, state }) {
            commit('update', { loading: true })
            const { code, msg, data } = await _api.queryPage({
                data: {
                    ...state.query,
                    // tenementCode:  this.state.app.tenementCode 接口字段修改重名了
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
                payload.list = rows
                payload.total = data.rowTotal
            } else {
                this._vm.$message.error(msg)
            }
            commit('update', payload)
        },
    }
}, DEFAULTS)
