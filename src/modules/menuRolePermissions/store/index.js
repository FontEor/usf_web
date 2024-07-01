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
            items: [
                // 菜单角色列表
                { key: 'queryList', caller: api.menuRolePermissions, callee: 'queryRoleList' },
            ]
        })
    },
},DEFAULTS)
