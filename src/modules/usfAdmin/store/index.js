import { pageListMerge, generateActions } from '@/store/helper'

// 默认状态
const DEFAULTS = {
    entity: {},
    query:{
        adminCode:'',
        adminName:''
    }
}

export default pageListMerge({
    namespaced: true,
    actions: {
        ...generateActions({
            caller: api.usfAdmin,
            items: [
                { key: 'createEntity', callee: 'add'},
                { key: 'delete', callee: 'delete' }
            ]
        }),
        async 'queryList' ({ commit, state }) {
            commit('update', { loading: true })
            const { code, msg, data } = await api.usfAdmin.queryPage({
                data: {
                    ...state.query,
                    tenementCode:  this.state.app.tenementInfoObj.tenementCode
                },
                page: {
                    pageIndex: state.pageIndex+1,
                    pageSize: state.pageSize
                }
            })
            const payload = { loading: false }
            if (code === 200) {
                payload.list = _.get(data, 'rows') || []
                payload.total = _.get(data, 'rowTotal') || 0
            } else {
                this._vm.$message.error(msg)
            }
            commit('update', payload)
        },
    }
})
