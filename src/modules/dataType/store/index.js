import {generateActions, pageListMerge} from '@/store/helper'

// 默认状态
const DEFAULTS = {
    entity: {}
}

export default pageListMerge({
    namespaced: true,
    actions: {
        ...generateActions({
            caller: api.dataType,
            items: [
                {key: 'createEntity', callee: 'add'},
                {key: 'updateEntity', callee: 'update'},
                {key: 'deleteEntity', callee: 'delete'},
                {key: 'queryEntity', callee: 'view'},
            ]
        }),

        async 'queryList' ({ commit, state }) {
            commit('update', { loading: true })
            const { code, msg, data } = await api.dataType.queryPage({
                data: {
                    ...state.query,
                    tenementCode:  this.state.app.tenementInfoObj.tenementCode
                },
                page: {
                    pageIndex: state.pageIndex+1,
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
})

