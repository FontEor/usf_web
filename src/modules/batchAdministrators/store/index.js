import { pageListMerge, generateActions } from '@/store/helper'

// 默认状态
const DEFAULTS = {
    entity: {},
    //选中的 后台返回的id
    ids:[],
    //遍历生成的树
    listTree:[],
    treeList2:[],
}

export default pageListMerge({
    namespaced: true,
    actions: {
        ...generateActions({
            caller: api.administrators,
            items: [
                { key: 'queryList', callee: 'queryBrands' },
            ]
        }),

    }
},DEFAULTS)
