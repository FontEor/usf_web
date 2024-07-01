import { pageListMerge, generateActions } from '@/store/helper'

// 默认状态
const DEFAULTS = {
    dataListUser:[],
    ids:[],
    listTree:[]
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

    },
},DEFAULTS)
