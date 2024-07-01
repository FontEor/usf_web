import {generateActions, pageListMerge} from '@/store/helper'
// 默认状态
const DEFAULTS = {
    query: {
        tenementCode:undefined,
        appCode:undefined,
    },
}

export default pageListMerge({
    namespaced: true,
    actions: {
        ...generateActions({
            caller: api.cache,
            items: [
                {key: 'queryList', callee: 'getCacheUserResourceInfo',wrapByData:false },
                {key: 'getAllTenementList', callee: 'getAllTenementList',wrapByData:false },
            ],
        }),
        // 缓存工具用户列表
        async 'queryList'({commit, state}) {
            //commit('update', {loading: true})
            const {code, msg, data} = await api.cache.getCacheUserResourceInfo({
                ...state.query,
            })
            const payload = {loading: false}
            if (code === 200) {
                //  const rows = _.get(data, 'data') || []
                const rows = data||[]
                payload.list = rows
            } else {
                this._vm.$message.error(msg)
            }
            commit('update', payload)
        },
    }
}, DEFAULTS)
