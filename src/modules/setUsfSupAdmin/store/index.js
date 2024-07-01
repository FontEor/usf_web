import { pageListMerge, generateActions } from '@/store/helper'
import store from '@/store'

// 默认状态
const DEFAULTS = {
    entity: {},
    query:{
        userName: "",
        userCode: ""
    }
}

const done = ({ dispatch, commit }) => {
    store.dispatch('app/getAppList')
}

export default pageListMerge({
    namespaced: true,
    actions: {
        ...generateActions({
            caller: api.usfsupadmin,
            items: [
                { key: 'createEntity', callee: 'add', },
                { key: 'deleteEntity', callee: 'delete', done },
            ],
        }),
       async 'queryList' ({ commit, state }) {
            commit('update', { loading: true })
            const { code, msg, data } = await api.usfsupadmin.queryPage({
                data: {
                    ...state.query,
                    tenementCode:  this.state.app.tenementInfoObj.tenementCode
                },
                page: {
                    pageIndex: state.pageIndex + 1,
                    pageSize: state.pageSize,
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
