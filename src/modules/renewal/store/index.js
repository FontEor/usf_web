import { pageListMerge, generateActions } from '@/store/helper'

// 默认状态
const DEFAULTS = {
    entity: {},
    list: []
}

export default pageListMerge({
    namespaced: true,
    actions: {
        ...generateActions({
            caller: api.expiration,
            items: [
                // 数据角色列表
                { key: 'queryList', callee: 'soonExpireList', wrapByData:false }
            ]
        })
    },
},DEFAULTS)
